import { RatingReferenceType, LeaderboardTimeframe } from '@codeforge/shared';

export interface IRatingRepository {
  getUserRating(userId: string): Promise<any>;
  updateUserRating(
    userId: string,
    data: {
      currentRating: number;
      peakRating: number;
      confidenceInterval: number;
      matchesCount: number;
      assessmentsCount: number;
      percentile: string;
      rankTier: string;
    },
  ): Promise<any>;
  recordRatingHistory(data: {
    userId: string;
    previousRating: number;
    newRating: number;
    ratingChange: number;
    changeReason: string;
    referenceType: RatingReferenceType;
    referenceId?: string;
  }): Promise<any>;
  getUserRatingHistory(userId: string, limit?: number): Promise<any[]>;
  getGlobalLeaderboard(timeframe?: LeaderboardTimeframe, limit?: number, offset?: number): Promise<{ entries: any[]; total: number }>;
}
