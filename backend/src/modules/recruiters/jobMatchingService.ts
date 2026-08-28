import { eq } from 'drizzle-orm';
import { db } from '../../database/connection';
import {
  jobPostings,
  skillRatings,
  assessmentResults,
  careerGoals,
  portfolioProjects,
  resumes,
  topicMastery,
  topics,
} from '../../database/schema';
import { JobMatchScoreDto, MatchCategory } from '@codeforge/shared';

export interface CandidateEvaluationProfile {
  skills: string[];
  rating: number;
  assessmentScore: number;
  careerGoals: string[];
  portfolioScore: number;
  resumeKeywords: string[];
}

export interface JobEvaluationCriteria {
  title: string;
  skillsRequired: string[];
  minRating: number;
  minAssessmentScore: number;
  targetRole: string;
  keywords?: string[];
}

export class JobMatchingService {
  /**
   * Pure Multi-Dimensional Match Engine
   * Calculates Match Score 0-100 based on weighted metrics:
   * - Skill Overlap (35%)
   * - Contest Rating (20%)
   * - Assessment Score (15%)
   * - Career Goal Alignment (10%)
   * - Portfolio Quality (10%)
   * - ATS Resume Match (10%)
   */
  public evaluateMatch(
    candidate: CandidateEvaluationProfile,
    job: JobEvaluationCriteria,
  ): JobMatchScoreDto {
    const requiredSkills = (job.skillsRequired || []).map(s => s.toLowerCase().trim());
    const candidateSkills = new Set((candidate.skills || []).map(s => s.toLowerCase().trim()));

    // 1. Skill Overlap (35%)
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    if (requiredSkills.length === 0) {
      // If no skills required, full skill match
    } else {
      for (const req of requiredSkills) {
        const isMatched = Array.from(candidateSkills).some(
          cs => cs.includes(req) || req.includes(cs),
        );
        if (isMatched) {
          matchedSkills.push(req);
        } else {
          missingSkills.push(req);
        }
      }
    }

    const skillScore =
      requiredSkills.length > 0
        ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
        : 100;

    // 2. Contest Elo Rating (20%)
    const minRating = job.minRating || 1200;
    const ratingRatio = candidate.rating / Math.max(minRating, 1000);
    const ratingScore = Math.min(100, Math.round(ratingRatio * 100));

    // 3. Assessment Score (15%)
    const minAssessment = job.minAssessmentScore || 50;
    const assessmentRatio = candidate.assessmentScore / Math.max(minAssessment, 1);
    const assessmentScore = Math.min(100, Math.max(0, Math.round(assessmentRatio * 90)));

    // 4. Career Goal Alignment (10%)
    let careerGoalScore = 70;
    if (candidate.careerGoals && candidate.careerGoals.length > 0) {
      const matchGoal = candidate.careerGoals.some(g => {
        const goalStr = g.toLowerCase().replace(/_/g, ' ');
        const titleStr = (job.title + ' ' + (job.targetRole || '')).toLowerCase();
        return titleStr.includes(goalStr) || goalStr.includes(titleStr);
      });
      careerGoalScore = matchGoal ? 100 : 75;
    }

    // 5. Portfolio Quality (10%)
    const portfolioScore = Math.min(100, Math.max(0, candidate.portfolioScore));

    // 6. ATS Resume Keywords (10%)
    let resumeScore = 70;
    if (candidate.resumeKeywords && candidate.resumeKeywords.length > 0) {
      const resOverlap = requiredSkills.filter(req =>
        candidate.resumeKeywords.some(rk => rk.toLowerCase().includes(req) || req.includes(rk.toLowerCase())),
      );
      resumeScore = requiredSkills.length > 0 ? Math.round((resOverlap.length / requiredSkills.length) * 100) : 80;
    }

    // Composite Weighted Calculation
    const overallScore = Math.round(
      skillScore * 0.35 +
        ratingScore * 0.2 +
        assessmentScore * 0.15 +
        careerGoalScore * 0.1 +
        portfolioScore * 0.1 +
        resumeScore * 0.1,
    );

    const category = this.classifyScore(overallScore);

    // AI Insights
    const insights: string[] = [];
    if (skillScore >= 80) {
      insights.push(`Strong technology stack alignment matching ${matchedSkills.length} required skills.`);
    } else if (missingSkills.length > 0) {
      insights.push(`Bridging ${missingSkills.slice(0, 2).join(', ')} will boost candidate match score significantly.`);
    }

    if (candidate.rating >= minRating) {
      insights.push(`Verified competitive coding Elo (${candidate.rating}) meets company benchmark.`);
    }

    return {
      jobId: '',
      candidateId: '',
      overallScore: Math.max(0, Math.min(100, overallScore)),
      category,
      breakdown: {
        skillScore,
        ratingScore,
        assessmentScore,
        careerGoalScore,
        portfolioScore,
        resumeScore,
      },
      matchedSkills,
      missingSkills,
      insights,
    };
  }

  /**
   * Classify overall match score into standard categories
   */
  public classifyScore(score: number): MatchCategory {
    if (score >= 80) return MatchCategory.STRONG_MATCH;
    if (score >= 65) return MatchCategory.GOOD_MATCH;
    if (score >= 45) return MatchCategory.PARTIAL_MATCH;
    return MatchCategory.WEAK_MATCH;
  }

  /**
   * Calculates comprehensive multi-dimensional AI Match Score (0-100) from database
   */
  public async calculateJobMatch(candidateId: string, jobId: string): Promise<JobMatchScoreDto> {
    // 1. Fetch Job Details
    const [job] = await db.select().from(jobPostings).where(eq(jobPostings.id, jobId)).limit(1);
    if (!job) {
      throw new Error(`Job with ID '${jobId}' not found.`);
    }

    // 2. Candidate Verified Skills & Masteries
    const masteries = await db
      .select({
        score: topicMastery.masteryScore,
        topicTitle: topics.title,
        topicSlug: topics.slug,
      })
      .from(topicMastery)
      .leftJoin(topics, eq(topicMastery.topicId, topics.id))
      .where(eq(topicMastery.userId, candidateId));

    const candidateSkillNames: string[] = masteries.map(m => (m.topicTitle || m.topicSlug || '').toLowerCase().trim());

    // 3. Candidate Portfolio Project Technologies
    const projects = await db
      .select()
      .from(portfolioProjects)
      .where(eq(portfolioProjects.userId, candidateId));

    for (const p of projects) {
      const techs = Array.isArray(p.technologiesJson) ? p.technologiesJson : [];
      techs.forEach((t: string) => candidateSkillNames.push(t.toLowerCase().trim()));
    }

    // 4. Candidate Resume Keywords
    const [latestResume] = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, candidateId))
      .limit(1);

    const resumeSkills = latestResume?.skillsJson && Array.isArray(latestResume.skillsJson)
      ? latestResume.skillsJson
      : [];

    // 5. Contest Rating
    const [ratingRow] = await db
      .select()
      .from(skillRatings)
      .where(eq(skillRatings.userId, candidateId))
      .limit(1);

    const candidateRating = ratingRow?.currentRating || 1200;

    // 6. Assessments
    const assessments = await db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.userId, candidateId));

    let avgAssessmentScore = 75;
    if (assessments.length > 0) {
      const sum = assessments.reduce((acc, a) => {
        const pct = a.maxScore > 0 ? (a.score / a.maxScore) * 100 : a.score;
        return acc + pct;
      }, 0);
      avgAssessmentScore = Math.round(sum / assessments.length);
    }

    // 7. Career Goal
    const [careerGoal] = await db
      .select()
      .from(careerGoals)
      .where(eq(careerGoals.userId, candidateId))
      .limit(1);

    const goals = careerGoal?.targetRole ? [careerGoal.targetRole] : [];
    const portfolioScore = Math.min(100, projects.length * 35 || 50);

    const match = this.evaluateMatch(
      {
        skills: candidateSkillNames,
        rating: candidateRating,
        assessmentScore: avgAssessmentScore,
        careerGoals: goals,
        portfolioScore,
        resumeKeywords: resumeSkills,
      },
      {
        title: job.title,
        skillsRequired: job.skillsRequired || [],
        minRating: job.minRatingRequired || 1200,
        minAssessmentScore: job.minAssessmentScore || 0,
        targetRole: (job as any).targetRole || job.title,
      },
    );

    match.jobId = jobId;
    match.candidateId = candidateId;
    return match;
  }
}
