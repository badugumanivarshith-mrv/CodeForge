import { LanguageId, SubmissionStatus } from '@codeforge/shared';

export interface UserQuizHistoryItem {
  quizId: string;
  topicId: string;
  topicTitle: string;
  scorePercentage: number;
  isPassed: boolean;
  attemptedAt: Date;
  wrongAnswersCount: number;
  totalQuestions: number;
}

export interface UserSubmissionHistoryItem {
  submissionId: string;
  problemId: string;
  topicId: string;
  topicTitle: string;
  problemTitle: string;
  problemDifficulty: string;
  languageId: LanguageId;
  status: SubmissionStatus;
  createdAt: Date;
}

export interface UserTopicPerformanceEvidence {
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  topicSequence: number;
  languageId: LanguageId;
  estimatedHours: number;
  lessonsTotal: number;
  lessonsCompleted: number;
  quizId: string | null;
  quizBestScore: number;
  quizPassed: boolean;
  quizAttemptsCount: number;
  problemsTotal: number;
  problemsSolved: number;
  problemFailedAttempts: number;
  lastActivityAt: Date | null;
}

export interface ILearnerIntelligenceRepository {
  getUserTopicPerformanceEvidences(
    userId: string,
    languageId?: LanguageId,
  ): Promise<UserTopicPerformanceEvidence[]>;

  getUserQuizHistory(userId: string, limit?: number): Promise<UserQuizHistoryItem[]>;

  getUserSubmissionHistory(
    userId: string,
    limit?: number,
  ): Promise<UserSubmissionHistoryItem[]>;

  getUserXpEarnedInDays(userId: string, days: number): Promise<number>;

  getUserActivitiesCountInDays(userId: string, days: number): Promise<number>;
}
