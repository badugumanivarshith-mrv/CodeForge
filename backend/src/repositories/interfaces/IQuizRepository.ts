import { QuizDto, QuizAttemptDto, QuizAnswerSubmission } from '@codeforge/shared';

export interface QuizEvaluationResult {
  attemptId: string;
  scorePercentage: number;
  isPassed: boolean;
  correctAnswersCount: number;
  totalQuestions: number;
  questionResults: Array<{
    questionId: string;
    selectedOptionId: string;
    correctOptionId: string;
    isCorrect: boolean;
    explanationMdx: string | null;
  }>;
}

export interface IQuizRepository {
  getQuizByTopicId(topicId: string): Promise<QuizDto | null>;
  getQuizById(quizId: string): Promise<QuizDto | null>;
  submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: QuizAnswerSubmission[],
  ): Promise<QuizEvaluationResult>;
  getUserBestQuizAttempt(userId: string, quizId: string): Promise<QuizAttemptDto | null>;
}
