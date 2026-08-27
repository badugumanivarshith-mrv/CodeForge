import { IRatingRepository } from '../repositories/interfaces/IRatingRepository';
import { RatingReferenceType, SkillRatingDto, SkillRatingHistoryDto } from '@codeforge/shared';
import { logger } from '../core/utils/logger';

export class RatingService {
  constructor(private readonly ratingRepo: IRatingRepository) {}

  private getRankTier(rating: number): string {
    if (rating < 1100) return 'Novice';
    if (rating < 1300) return 'Apprentice';
    if (rating < 1550) return 'Adept';
    if (rating < 1800) return 'Master';
    return 'Grandmaster';
  }

  private calculatePercentile(rating: number): number {
    // Normal distribution approximation around mean 1200, std 200
    const z = (rating - 1200) / 200;
    const percentile = Math.min(99.9, Math.max(1.0, 50 + 50 * Math.tanh(0.797885 * (z + 0.044715 * Math.pow(z, 3)))));
    return Math.round(percentile * 10) / 10;
  }

  async getUserRating(userId: string): Promise<SkillRatingDto> {
    const raw = await this.ratingRepo.getUserRating(userId);
    const rating = Number(raw.currentRating || 1200);
    const peak = Number(raw.peakRating || rating);
    const confidence = Number(raw.confidenceInterval || 350);
    const matchesCount = Number(raw.matchesCount || 0);
    const assessmentsCount = Number(raw.assessmentsCount || 0);
    const percentile = this.calculatePercentile(rating);
    const rankTier = this.getRankTier(rating);

    return {
      userId,
      currentRating: rating,
      peakRating: peak,
      confidenceInterval: confidence,
      matchesCount,
      assessmentsCount,
      percentile,
      rankTier,
      lastUpdated: raw.lastUpdated ? new Date(raw.lastUpdated).toISOString() : new Date().toISOString(),
    };
  }

  async updateRatingOnAssessment(
    userId: string,
    assessmentId: string,
    scorePercentage: number,
    averageDifficulty: string = 'medium',
  ): Promise<{ previousRating: number; newRating: number; ratingChange: number; rankTier: string }> {
    const current = await this.getUserRating(userId);
    const previousRating = current.currentRating;

    // Difficulty benchmark
    let benchmarkRating = 1300;
    if (averageDifficulty === 'easy') benchmarkRating = 1050;
    else if (averageDifficulty === 'difficult') benchmarkRating = 1600;

    // Expected score E = 1 / (1 + 10^((R_bench - R_user)/400))
    const exponent = (benchmarkRating - previousRating) / 400;
    const expected = 1 / (1 + Math.pow(10, exponent));
    const actual = Math.min(1.0, Math.max(0.0, scorePercentage / 100));

    // Dynamic K-factor based on confidence interval
    const kFactor = Math.max(16, Math.min(48, Math.round(current.confidenceInterval / 8)));
    const ratingChange = Math.round(kFactor * (actual - expected));
    const newRating = Math.max(800, previousRating + ratingChange);
    const newPeak = Math.max(current.peakRating, newRating);
    const newConfidence = Math.max(50, current.confidenceInterval - 15);
    const rankTier = this.getRankTier(newRating);
    const percentile = this.calculatePercentile(newRating);

    await this.ratingRepo.updateUserRating(userId, {
      currentRating: newRating,
      peakRating: newPeak,
      confidenceInterval: newConfidence,
      matchesCount: current.matchesCount,
      assessmentsCount: current.assessmentsCount + 1,
      percentile: percentile.toFixed(2),
      rankTier,
    });

    const reason = `Assessment completion (${Math.round(scorePercentage)}% score on ${averageDifficulty} assessment)`;
    await this.ratingRepo.recordRatingHistory({
      userId,
      previousRating,
      newRating,
      ratingChange,
      changeReason: reason,
      referenceType: RatingReferenceType.ASSESSMENT,
      referenceId: assessmentId,
    });

    logger.info({ userId, previousRating, newRating, ratingChange }, 'Skill rating updated on assessment');

    return {
      previousRating,
      newRating,
      ratingChange,
      rankTier,
    };
  }

  async updateRatingOnContest(
    userId: string,
    contestId: string,
    rank: number,
    totalParticipants: number,
    contestTitle: string = 'Contest',
  ): Promise<{ previousRating: number; newRating: number; ratingChange: number; rankTier: string }> {
    const current = await this.getUserRating(userId);
    const previousRating = current.currentRating;

    // Actual performance percentile in contest
    const participantCount = Math.max(1, totalParticipants);
    const actualScore = Math.max(0, 1 - (rank - 1) / participantCount);
    const expectedScore = 0.5; // Neutral field expectation

    const kFactor = Math.max(24, Math.min(60, Math.round(current.confidenceInterval / 6)));
    const ratingChange = Math.round(kFactor * (actualScore - expectedScore));
    const newRating = Math.max(800, previousRating + ratingChange);
    const newPeak = Math.max(current.peakRating, newRating);
    const newConfidence = Math.max(50, current.confidenceInterval - 20);
    const rankTier = this.getRankTier(newRating);
    const percentile = this.calculatePercentile(newRating);

    await this.ratingRepo.updateUserRating(userId, {
      currentRating: newRating,
      peakRating: newPeak,
      confidenceInterval: newConfidence,
      matchesCount: current.matchesCount + 1,
      assessmentsCount: current.assessmentsCount,
      percentile: percentile.toFixed(2),
      rankTier,
    });

    const reason = `Contest Rank #${rank}/${totalParticipants} in ${contestTitle}`;
    await this.ratingRepo.recordRatingHistory({
      userId,
      previousRating,
      newRating,
      ratingChange,
      changeReason: reason,
      referenceType: RatingReferenceType.CONTEST,
      referenceId: contestId,
    });

    return {
      previousRating,
      newRating,
      ratingChange,
      rankTier,
    };
  }

  async getUserRatingHistory(userId: string, limit: number = 20): Promise<SkillRatingHistoryDto[]> {
    const rows = await this.ratingRepo.getUserRatingHistory(userId, limit);
    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      previousRating: r.previousRating,
      newRating: r.newRating,
      ratingChange: r.ratingChange,
      changeReason: r.changeReason,
      referenceType: r.referenceType,
      referenceId: r.referenceId,
      timestamp: r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString(),
    }));
  }
}
