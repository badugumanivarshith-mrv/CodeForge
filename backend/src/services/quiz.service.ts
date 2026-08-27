import {
  IQuizRepository,
  IGamificationRepository,
  IProgressRepository,
} from '../repositories';
import {
  QuizDto,
  QuizSubmitResultDto,
  QuizAnswerSubmission,
  XP_VALUES,
  XPTransactionType,
  MasteryLevel,
} from '@codeforge/shared';
import { NotFoundError } from '../core/errors';

export class QuizService {
  constructor(
    private quizRepo: IQuizRepository,
    private gamificationRepo: IGamificationRepository,
    private progressRepo: IProgressRepository,
  ) {}

  public async getQuizByTopicId(topicId: string): Promise<QuizDto> {
    const quiz = await this.quizRepo.getQuizByTopicId(topicId);
    if (!quiz) {
      throw new NotFoundError(`Checkpoint quiz for topic "${topicId}" not found`);
    }

    // SANITIZE: Strictly remove isCorrect flag from all options before sending to client
    const sanitizedQuestions = quiz.questions?.map(q => ({
      ...q,
      options: q.options.map(opt => ({
        id: opt.id,
        sequence: opt.sequence,
        optionText: opt.optionText,
        // isCorrect is intentionally omitted!
      })),
    }));

    return {
      ...quiz,
      questions: sanitizedQuestions,
    };
  }

  public async submitQuiz(
    userId: string,
    quizId: string,
    answers: QuizAnswerSubmission[],
  ): Promise<QuizSubmitResultDto> {
    const quiz = await this.quizRepo.getQuizById(quizId);
    if (!quiz) {
      throw new NotFoundError(`Quiz with id "${quizId}" not found`);
    }

    // Check if user already passed this quiz previously
    const previousBestAttempt = await this.quizRepo.getUserBestQuizAttempt(userId, quizId);
    const wasAlreadyPassed = Boolean(previousBestAttempt?.isPassed);

    // Evaluate answers server-side & record attempt in DB
    const evaluation = await this.quizRepo.submitQuizAttempt(userId, quizId, answers);

    let xpAwarded = 0;
    if (evaluation.isPassed && !wasAlreadyPassed) {
      // Base XP for passing quiz
      let totalPoints = XP_VALUES.QUIZ_PASS;

      // Bonus XP for 100% score
      if (evaluation.scorePercentage === 100) {
        totalPoints += XP_VALUES.QUIZ_PERFECT_BONUS;
      }

      await this.gamificationRepo.addXp(
        userId,
        totalPoints,
        XPTransactionType.QUIZ_PASS,
        `Passed quiz: ${quiz.title} (${evaluation.scorePercentage}%)`,
        quiz.id,
      );
      xpAwarded = totalPoints;

      // Update daily streak
      await this.gamificationRepo.recordDailyActivity(userId);
    }

    // Update topic mastery quiz score & BKT probability
    const currentMastery = await this.progressRepo.getTopicMastery(userId, quiz.topicId);
    const bestScore = Math.max(currentMastery?.quizScoreBest || 0, evaluation.scorePercentage);

    // BKT formula update: higher quiz score increases probability of mastery
    const bktProbability = Math.min(
      0.95,
      Number(currentMastery?.bktProbability || 0.1) + (evaluation.isPassed ? 0.25 : 0.05),
    );

    let masteryLevel: MasteryLevel = MasteryLevel.NOVICE;
    if (bktProbability >= 0.85) masteryLevel = MasteryLevel.MASTERED;
    else if (bktProbability >= 0.5) masteryLevel = MasteryLevel.PROFICIENT;

    await this.progressRepo.updateTopicMastery(userId, quiz.topicId, {
      quizScoreBest: bestScore,
      bktProbability,
      masteryLevel,
      masteryScore: Math.round(bktProbability * 100),
    });

    return {
      quizId,
      scorePercentage: evaluation.scorePercentage,
      isPassed: evaluation.isPassed,
      correctAnswersCount: evaluation.correctAnswersCount,
      totalQuestions: evaluation.totalQuestions,
      xpAwarded,
      questionsReview: evaluation.questionResults,
    };
  }
}
