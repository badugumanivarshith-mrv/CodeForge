import {
  AssessmentType,
  AssessmentSessionStatus,
  AssessmentQuestionType,
  ProblemDifficulty,
} from '@codeforge/shared';

export interface IAssessmentRepository {
  getQuestions(filter?: {
    topicId?: string;
    difficulty?: ProblemDifficulty | string;
    questionType?: AssessmentQuestionType;
    limit?: number;
  }): Promise<any[]>;
  getQuestionById(id: string): Promise<any | null>;
  createSession(data: {
    userId: string;
    assessmentType: AssessmentType;
    timeLimitMinutes: number;
    totalQuestions: number;
    currentDifficulty: ProblemDifficulty | string;
    questionSequence: string[];
    maxScore: number;
  }): Promise<any>;
  getSessionById(id: string): Promise<any | null>;
  updateSession(
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
  ): Promise<any>;
  recordAttempt(data: {
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
  }): Promise<any>;
  getAttemptsBySessionId(sessionId: string): Promise<any[]>;
  recordResult(data: {
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
  }): Promise<any>;
  getResultBySessionId(sessionId: string): Promise<any | null>;
  recordRemediation(data: {
    assessmentId: string;
    userId: string;
    summary: string;
    weakConceptsJson: string[];
    prerequisiteGapsJson: string[];
    actionItemsJson: any[];
    estimatedStudyTimeMinutes: number;
  }): Promise<any>;
  getRemediationByAssessmentId(assessmentId: string): Promise<any | null>;
  getUserAssessmentHistory(userId: string): Promise<any[]>;
}
