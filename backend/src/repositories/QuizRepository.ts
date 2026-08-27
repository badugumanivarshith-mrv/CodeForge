import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  quizzes,
  quizQuestions,
  quizOptions,
  quizAttempts,
  quizAnswers,
} from '../database/schema';
import { IQuizRepository, QuizEvaluationResult } from './interfaces/IQuizRepository';
import {
  QuizDto,
  QuizQuestionDto,
  QuizOptionDto,
  QuizAttemptDto,
  QuizAnswerSubmission,
  QuizDifficulty,
  QuestionType,
} from '@codeforge/shared';
import { NotFoundError } from '../core/errors';

export class QuizRepository implements IQuizRepository {
  public async getQuizByTopicId(topicId: string): Promise<QuizDto | null> {
    const [quizRow] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.topicId, topicId))
      .limit(1);

    if (!quizRow) return null;
    return this.loadFullQuiz(quizRow);
  }

  public async getQuizById(quizId: string): Promise<QuizDto | null> {
    const [quizRow] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quizRow) return null;
    return this.loadFullQuiz(quizRow);
  }

  public async submitQuizAttempt(
    userId: string,
    quizId: string,
    answers: QuizAnswerSubmission[],
  ): Promise<QuizEvaluationResult> {
    const quiz = await this.getQuizById(quizId);
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      throw new NotFoundError('Quiz not found or contains no questions');
    }

    // Load ground truth questions and options with isCorrect flag
    const questionRows = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(asc(quizQuestions.sequence));

    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;

    const questionResults: QuizEvaluationResult['questionResults'] = [];
    const answerRecords: Array<{
      questionId: string;
      selectedOptionId: string;
      isCorrect: boolean;
    }> = [];

    for (const q of questionRows) {
      totalPoints += q.points;
      const optionRows = await db
        .select()
        .from(quizOptions)
        .where(eq(quizOptions.questionId, q.id));

      const correctOption = optionRows.find(o => o.isCorrect);
      const userSubmission = answers.find(a => a.questionId === q.id);
      const selectedOptionId = userSubmission?.selectedOptionId || '';

      const isCorrect = Boolean(correctOption && correctOption.id === selectedOptionId);
      if (isCorrect) {
        earnedPoints += q.points;
        correctCount += 1;
      }

      questionResults.push({
        questionId: q.id,
        selectedOptionId,
        correctOptionId: correctOption?.id || '',
        isCorrect,
        explanationMdx: q.explanationMdx,
      });

      if (selectedOptionId) {
        answerRecords.push({
          questionId: q.id,
          selectedOptionId,
          isCorrect,
        });
      }
    }

    const scorePercentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassed = scorePercentage >= quiz.passingScorePercentage;

    // Record attempt in database transaction
    const attemptId = await db.transaction(async tx => {
      const [attempt] = await tx
        .insert(quizAttempts)
        .values({
          quizId,
          userId,
          scorePercentage,
          isPassed,
          completedAt: new Date(),
        })
        .returning({ id: quizAttempts.id });

      for (const ans of answerRecords) {
        await tx.insert(quizAnswers).values({
          attemptId: attempt.id,
          questionId: ans.questionId,
          selectedOptionId: ans.selectedOptionId,
          isCorrect: ans.isCorrect,
        });
      }

      return attempt.id;
    });

    return {
      attemptId,
      scorePercentage,
      isPassed,
      correctAnswersCount: correctCount,
      totalQuestions: questionRows.length,
      questionResults,
    };
  }

  public async getUserBestQuizAttempt(userId: string, quizId: string): Promise<QuizAttemptDto | null> {
    const [row] = await db
      .select()
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)))
      .orderBy(desc(quizAttempts.scorePercentage))
      .limit(1);

    if (!row) return null;
    return {
      id: row.id,
      quizId: row.quizId,
      userId: row.userId,
      scorePercentage: row.scorePercentage,
      isPassed: row.isPassed,
      startedAt: row.startedAt.toISOString(),
      completedAt: row.completedAt?.toISOString() || null,
    };
  }

  private async loadFullQuiz(quizRow: typeof quizzes.$inferSelect): Promise<QuizDto> {
    const questionRows = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizRow.id))
      .orderBy(asc(quizQuestions.sequence));

    const questions: QuizQuestionDto[] = [];
    for (const q of questionRows) {
      const optionRows = await db
        .select()
        .from(quizOptions)
        .where(eq(quizOptions.questionId, q.id))
        .orderBy(asc(quizOptions.sequence));

      questions.push({
        id: q.id,
        quizId: q.quizId,
        sequence: q.sequence,
        questionType: q.questionType as QuestionType,
        questionMdx: q.questionMdx,
        codeSnippet: q.codeSnippet,
        explanationMdx: q.explanationMdx,
        points: q.points,
        options: optionRows.map(o => ({
          id: o.id,
          sequence: o.sequence,
          optionText: o.optionText,
          // Notice isCorrect is retained here for internal use; service will sanitize before sending to client!
          isCorrect: o.isCorrect,
        })),
      });
    }

    return {
      id: quizRow.id,
      topicId: quizRow.topicId,
      title: quizRow.title,
      description: quizRow.description,
      difficulty: quizRow.difficulty as QuizDifficulty,
      passingScorePercentage: quizRow.passingScorePercentage,
      questions,
    };
  }
}
