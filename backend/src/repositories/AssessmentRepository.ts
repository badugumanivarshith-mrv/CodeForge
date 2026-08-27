import { db } from '../database/connection';
import {
  assessmentQuestions,
  assessmentSessions,
  assessmentAttempts,
  assessmentResults,
  assessmentRemediations,
  topics,
} from '../database/schema';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import {
  IAssessmentRepository,
} from './interfaces/IAssessmentRepository';
import {
  AssessmentType,
  AssessmentSessionStatus,
  AssessmentQuestionType,
  ProblemDifficulty,
} from '@codeforge/shared';

export class AssessmentRepository implements IAssessmentRepository {
  async getQuestions(filter?: {
    topicId?: string;
    difficulty?: ProblemDifficulty | string;
    questionType?: AssessmentQuestionType;
    limit?: number;
  }): Promise<any[]> {
    const conditions = [];
    if (filter?.topicId) {
      conditions.push(eq(assessmentQuestions.topicId, filter.topicId));
    }
    if (filter?.difficulty) {
      conditions.push(eq(assessmentQuestions.difficulty, filter.difficulty as ProblemDifficulty));
    }
    if (filter?.questionType) {
      conditions.push(eq(assessmentQuestions.questionType, filter.questionType));
    }

    const query = db
      .select({
        id: assessmentQuestions.id,
        questionType: assessmentQuestions.questionType,
        topicId: assessmentQuestions.topicId,
        topicName: topics.title,
        difficulty: assessmentQuestions.difficulty,
        promptMdx: assessmentQuestions.promptMdx,
        optionsJson: assessmentQuestions.optionsJson,
        codeSnippet: assessmentQuestions.codeSnippet,
        starterCodeJson: assessmentQuestions.starterCodeJson,
        supportedLanguagesJson: assessmentQuestions.supportedLanguagesJson,
        solutionCode: assessmentQuestions.solutionCode,
        points: assessmentQuestions.points,
        estimatedTimeSeconds: assessmentQuestions.estimatedTimeSeconds,
        explanationMdx: assessmentQuestions.explanationMdx,
        scoringRulesJson: assessmentQuestions.scoringRulesJson,
        metadataJson: assessmentQuestions.metadataJson,
        createdAt: assessmentQuestions.createdAt,
      })
      .from(assessmentQuestions)
      .leftJoin(topics, eq(assessmentQuestions.topicId, topics.id));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    if (filter?.limit) {
      query.limit(filter.limit);
    }

    return await query;
  }

  async getQuestionById(id: string): Promise<any | null> {
    const [q] = await db
      .select({
        id: assessmentQuestions.id,
        questionType: assessmentQuestions.questionType,
        topicId: assessmentQuestions.topicId,
        topicName: topics.title,
        difficulty: assessmentQuestions.difficulty,
        promptMdx: assessmentQuestions.promptMdx,
        optionsJson: assessmentQuestions.optionsJson,
        codeSnippet: assessmentQuestions.codeSnippet,
        starterCodeJson: assessmentQuestions.starterCodeJson,
        supportedLanguagesJson: assessmentQuestions.supportedLanguagesJson,
        solutionCode: assessmentQuestions.solutionCode,
        points: assessmentQuestions.points,
        estimatedTimeSeconds: assessmentQuestions.estimatedTimeSeconds,
        explanationMdx: assessmentQuestions.explanationMdx,
        scoringRulesJson: assessmentQuestions.scoringRulesJson,
        metadataJson: assessmentQuestions.metadataJson,
        createdAt: assessmentQuestions.createdAt,
      })
      .from(assessmentQuestions)
      .leftJoin(topics, eq(assessmentQuestions.topicId, topics.id))
      .where(eq(assessmentQuestions.id, id))
      .limit(1);

    return q || null;
  }

  async createSession(data: {
    userId: string;
    assessmentType: AssessmentType;
    timeLimitMinutes: number;
    totalQuestions: number;
    currentDifficulty: ProblemDifficulty | string;
    questionSequence: string[];
    maxScore: number;
  }): Promise<any> {
    const startedAt = new Date();
    const expiresAt = new Date(startedAt.getTime() + data.timeLimitMinutes * 60 * 1000);

    const [session] = await db
      .insert(assessmentSessions)
      .values({
        userId: data.userId,
        assessmentType: data.assessmentType,
        status: AssessmentSessionStatus.IN_PROGRESS,
        startedAt,
        expiresAt,
        timeLimitMinutes: data.timeLimitMinutes,
        totalQuestions: data.totalQuestions,
        currentDifficulty: data.currentDifficulty as ProblemDifficulty,
        questionSequenceJson: data.questionSequence,
        maxScore: data.maxScore,
      })
      .returning();

    return session;
  }

  async getSessionById(id: string): Promise<any | null> {
    const [session] = await db
      .select()
      .from(assessmentSessions)
      .where(eq(assessmentSessions.id, id))
      .limit(1);

    return session || null;
  }

  async updateSession(
    id: string,
    data: {
      status?: AssessmentSessionStatus;
      startedAt?: Date;
      expiresAt?: Date;
      completedAt?: Date;
      currentQuestionIndex?: number;
      currentDifficulty?: ProblemDifficulty | string;
      totalScore?: number;
      accuracyPercentage?: string;
      finalSkillEstimate?: string;
      topicPerformanceJson?: Record<string, unknown>;
      difficultyHistoryJson?: any[];
    },
  ): Promise<any> {
    const updateData: any = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.startedAt !== undefined) updateData.startedAt = data.startedAt;
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt;
    if (data.completedAt !== undefined) updateData.completedAt = data.completedAt;
    if (data.currentQuestionIndex !== undefined) updateData.currentQuestionIndex = data.currentQuestionIndex;
    if (data.currentDifficulty !== undefined) updateData.currentDifficulty = data.currentDifficulty as ProblemDifficulty;
    if (data.totalScore !== undefined) updateData.totalScore = data.totalScore;
    if (data.accuracyPercentage !== undefined) updateData.accuracyPercentage = data.accuracyPercentage;
    if (data.finalSkillEstimate !== undefined) updateData.finalSkillEstimate = data.finalSkillEstimate;
    if (data.topicPerformanceJson !== undefined) updateData.topicPerformanceJson = data.topicPerformanceJson;
    if (data.difficultyHistoryJson !== undefined) updateData.difficultyHistoryJson = data.difficultyHistoryJson;

    const [updated] = await db
      .update(assessmentSessions)
      .set(updateData)
      .where(eq(assessmentSessions.id, id))
      .returning();

    return updated;
  }

  async recordAttempt(data: {
    sessionId: string;
    questionId: string;
    questionType: AssessmentQuestionType;
    selectedOptionIdsJson?: string[];
    userCode?: string;
    languageId?: string;
    isCorrect: boolean;
    scoreEarned: number;
    maxScore: number;
    timeSpentSeconds: number;
    feedbackMdx?: string;
  }): Promise<any> {
    const [attempt] = await db
      .insert(assessmentAttempts)
      .values({
        sessionId: data.sessionId,
        questionId: data.questionId,
        questionType: data.questionType,
        selectedOptionIdsJson: data.selectedOptionIdsJson || [],
        userCode: data.userCode,
        languageId: data.languageId,
        isCorrect: data.isCorrect,
        scoreEarned: data.scoreEarned,
        maxScore: data.maxScore,
        timeSpentSeconds: data.timeSpentSeconds,
        feedbackMdx: data.feedbackMdx,
      })
      .returning();

    return attempt;
  }

  async getAttemptsBySessionId(sessionId: string): Promise<any[]> {
    return await db
      .select()
      .from(assessmentAttempts)
      .where(eq(assessmentAttempts.sessionId, sessionId))
      .orderBy(assessmentAttempts.evaluatedAt);
  }

  async recordResult(data: {
    sessionId: string;
    userId: string;
    assessmentType: AssessmentType;
    score: number;
    maxScore: number;
    percentage: string;
    accuracy: string;
    timeSpentSeconds: number;
    skillRatingBefore: number;
    skillRatingAfter: number;
    skillRatingDelta: number;
    rankPercentile?: string;
    topicBreakdownJson?: Record<string, unknown>;
    errorCategoriesJson?: Record<string, unknown>;
    strengthsJson?: string[];
    weaknessesJson?: string[];
  }): Promise<any> {
    const [result] = await db
      .insert(assessmentResults)
      .values({
        sessionId: data.sessionId,
        userId: data.userId,
        assessmentType: data.assessmentType,
        score: data.score,
        maxScore: data.maxScore,
        percentage: data.percentage,
        accuracy: data.accuracy,
        timeSpentSeconds: data.timeSpentSeconds,
        skillRatingBefore: data.skillRatingBefore,
        skillRatingAfter: data.skillRatingAfter,
        skillRatingDelta: data.skillRatingDelta,
        rankPercentile: data.rankPercentile || '50.00',
        topicBreakdownJson: data.topicBreakdownJson || {},
        errorCategoriesJson: data.errorCategoriesJson || {},
        strengthsJson: data.strengthsJson || [],
        weaknessesJson: data.weaknessesJson || [],
      })
      .returning();

    return result;
  }

  async getResultBySessionId(sessionId: string): Promise<any | null> {
    const [res] = await db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.sessionId, sessionId))
      .limit(1);

    return res || null;
  }

  async recordRemediation(data: {
    assessmentId: string;
    userId: string;
    summary: string;
    weakConceptsJson: string[];
    prerequisiteGapsJson: string[];
    actionItemsJson: any[];
    estimatedStudyTimeMinutes: number;
  }): Promise<any> {
    const [rem] = await db
      .insert(assessmentRemediations)
      .values({
        assessmentId: data.assessmentId,
        userId: data.userId,
        summary: data.summary,
        weakConceptsJson: data.weakConceptsJson,
        prerequisiteGapsJson: data.prerequisiteGapsJson,
        actionItemsJson: data.actionItemsJson,
        estimatedStudyTimeMinutes: data.estimatedStudyTimeMinutes,
      })
      .returning();

    return rem;
  }

  async getRemediationByAssessmentId(assessmentId: string): Promise<any | null> {
    const [rem] = await db
      .select()
      .from(assessmentRemediations)
      .where(eq(assessmentRemediations.assessmentId, assessmentId))
      .limit(1);

    return rem || null;
  }

  async getUserAssessmentHistory(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(assessmentResults)
      .where(eq(assessmentResults.userId, userId))
      .orderBy(desc(assessmentResults.createdAt));
  }
}
