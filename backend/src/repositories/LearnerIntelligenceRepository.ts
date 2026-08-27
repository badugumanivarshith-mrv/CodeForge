import { eq, and, desc, gte, asc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  topics,
  lessons,
  userProgress,
  quizzes,
  quizAttempts,
  quizAnswers,
  problems,
  submissions,
  xpTransactions,
} from '../database/schema';
import {
  ILearnerIntelligenceRepository,
  UserTopicPerformanceEvidence,
  UserQuizHistoryItem,
  UserSubmissionHistoryItem,
} from './interfaces/ILearnerIntelligenceRepository';
import { LanguageId, SubmissionStatus } from '@codeforge/shared';

export class LearnerIntelligenceRepository implements ILearnerIntelligenceRepository {
  public async getUserTopicPerformanceEvidences(
    userId: string,
    languageId?: LanguageId,
  ): Promise<UserTopicPerformanceEvidence[]> {
    // 1. Fetch relevant topics
    const topicRows = await db
      .select({
        id: topics.id,
        slug: topics.slug,
        title: topics.title,
        sequence: topics.sequence,
        languageId: topics.languageId,
        estimatedHours: topics.estimatedHours,
      })
      .from(topics)
      .where(languageId ? eq(topics.languageId, languageId) : undefined)
      .orderBy(asc(topics.sequence));

    const evidences: UserTopicPerformanceEvidence[] = [];

    for (const top of topicRows) {
      // 2. Count lessons total & completed
      const topicLessons = await db
        .select({ id: lessons.id })
        .from(lessons)
        .where(eq(lessons.topicId, top.id));
      const lessonIds = topicLessons.map(l => l.id);

      let lessonsCompleted = 0;
      let lastLessonDate: Date | null = null;
      if (lessonIds.length > 0) {
        const completedRows = await db
          .select({
            lessonId: userProgress.lessonId,
            completedAt: userProgress.completedAt,
          })
          .from(userProgress)
          .where(and(eq(userProgress.userId, userId), eq(userProgress.isCompleted, true)));

        const matching = completedRows.filter(r => lessonIds.includes(r.lessonId));
        lessonsCompleted = matching.length;
        if (matching.length > 0) {
          const sorted = matching.sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
          lastLessonDate = sorted[0].completedAt;
        }
      }

      // 3. Check topic quiz & user attempts
      const [quiz] = await db
        .select({ id: quizzes.id })
        .from(quizzes)
        .where(eq(quizzes.topicId, top.id))
        .limit(1);

      let quizBestScore = 0;
      let quizPassed = false;
      let quizAttemptsCount = 0;
      let lastQuizDate: Date | null = null;

      if (quiz) {
        const attempts = await db
          .select({
            scorePercentage: quizAttempts.scorePercentage,
            isPassed: quizAttempts.isPassed,
            completedAt: quizAttempts.completedAt,
            startedAt: quizAttempts.startedAt,
          })
          .from(quizAttempts)
          .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quiz.id)));

        quizAttemptsCount = attempts.length;
        if (attempts.length > 0) {
          quizBestScore = Math.max(...attempts.map(a => a.scorePercentage));
          quizPassed = attempts.some(a => a.isPassed);
          const sorted = attempts.sort(
            (a, b) => (b.completedAt || b.startedAt).getTime() - (a.completedAt || a.startedAt).getTime(),
          );
          lastQuizDate = sorted[0].completedAt || sorted[0].startedAt;
        }
      }

      // 4. Count problems total, solved, and failed attempts
      const topicProblems = await db
        .select({ id: problems.id })
        .from(problems)
        .where(and(eq(problems.topicId, top.id), eq(problems.isPublished, true)));
      const problemIds = topicProblems.map(p => p.id);

      let problemsSolved = 0;
      let problemFailedAttempts = 0;
      let lastProblemDate: Date | null = null;

      if (problemIds.length > 0) {
        const userSubs = await db
          .select({
            problemId: submissions.problemId,
            status: submissions.status,
            createdAt: submissions.createdAt,
          })
          .from(submissions)
          .where(eq(submissions.userId, userId));

        const topicSubs = userSubs.filter(s => problemIds.includes(s.problemId));
        const solvedProblemIds = new Set(
          topicSubs.filter(s => s.status === SubmissionStatus.ACCEPTED).map(s => s.problemId),
        );
        problemsSolved = solvedProblemIds.size;
        problemFailedAttempts = topicSubs.filter(s => s.status !== SubmissionStatus.ACCEPTED).length;

        if (topicSubs.length > 0) {
          const sorted = topicSubs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          lastProblemDate = sorted[0].createdAt;
        }
      }

      // Calculate composite lastActivityAt
      const activityDates = [lastLessonDate, lastQuizDate, lastProblemDate].filter(
        (d): d is Date => Boolean(d),
      );
      let lastActivityAt: Date | null = null;
      if (activityDates.length > 0) {
        activityDates.sort((a, b) => b.getTime() - a.getTime());
        lastActivityAt = activityDates[0];
      }

      evidences.push({
        topicId: top.id,
        topicSlug: top.slug,
        topicTitle: top.title,
        topicSequence: top.sequence,
        languageId: top.languageId as LanguageId,
        estimatedHours: top.estimatedHours,
        lessonsTotal: lessonIds.length,
        lessonsCompleted,
        quizId: quiz?.id || null,
        quizBestScore,
        quizPassed,
        quizAttemptsCount,
        problemsTotal: problemIds.length,
        problemsSolved,
        problemFailedAttempts,
        lastActivityAt,
      });
    }

    return evidences;
  }

  public async getUserQuizHistory(userId: string, limit = 20): Promise<UserQuizHistoryItem[]> {
    const rows = await db
      .select({
        quizId: quizAttempts.quizId,
        topicId: quizzes.topicId,
        topicTitle: topics.title,
        scorePercentage: quizAttempts.scorePercentage,
        isPassed: quizAttempts.isPassed,
        startedAt: quizAttempts.startedAt,
        completedAt: quizAttempts.completedAt,
        attemptId: quizAttempts.id,
      })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .innerJoin(topics, eq(quizzes.topicId, topics.id))
      .where(eq(quizAttempts.userId, userId))
      .orderBy(desc(quizAttempts.startedAt))
      .limit(limit);

    const items: UserQuizHistoryItem[] = [];
    for (const r of rows) {
      const answers = await db
        .select({ isCorrect: quizAnswers.isCorrect })
        .from(quizAnswers)
        .where(eq(quizAnswers.attemptId, r.attemptId));

      const wrongCount = answers.filter(a => !a.isCorrect).length;
      items.push({
        quizId: r.quizId,
        topicId: r.topicId,
        topicTitle: r.topicTitle,
        scorePercentage: r.scorePercentage,
        isPassed: r.isPassed,
        attemptedAt: r.completedAt || r.startedAt,
        wrongAnswersCount: wrongCount,
        totalQuestions: answers.length,
      });
    }

    return items;
  }

  public async getUserSubmissionHistory(
    userId: string,
    limit = 20,
  ): Promise<UserSubmissionHistoryItem[]> {
    const rows = await db
      .select({
        submissionId: submissions.id,
        problemId: submissions.problemId,
        topicId: problems.topicId,
        topicTitle: topics.title,
        problemTitle: problems.title,
        problemDifficulty: problems.difficulty,
        languageId: submissions.languageId,
        status: submissions.status,
        createdAt: submissions.createdAt,
      })
      .from(submissions)
      .innerJoin(problems, eq(submissions.problemId, problems.id))
      .innerJoin(topics, eq(problems.topicId, topics.id))
      .where(eq(submissions.userId, userId))
      .orderBy(desc(submissions.createdAt))
      .limit(limit);

    return rows.map(r => ({
      submissionId: r.submissionId,
      problemId: r.problemId,
      topicId: r.topicId,
      topicTitle: r.topicTitle,
      problemTitle: r.problemTitle,
      problemDifficulty: r.problemDifficulty,
      languageId: r.languageId as LanguageId,
      status: r.status as SubmissionStatus,
      createdAt: r.createdAt,
    }));
  }

  public async getUserXpEarnedInDays(userId: string, days: number): Promise<number> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const rows = await db
      .select({ amount: xpTransactions.amount })
      .from(xpTransactions)
      .where(and(eq(xpTransactions.userId, userId), gte(xpTransactions.createdAt, sinceDate)));

    return rows.reduce((sum, r) => sum + r.amount, 0);
  }

  public async getUserActivitiesCountInDays(userId: string, days: number): Promise<number> {
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - days);

    const completedLessons = await db
      .select({ id: userProgress.id })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), gte(userProgress.completedAt, sinceDate)));

    const attempts = await db
      .select({ id: quizAttempts.id })
      .from(quizAttempts)
      .where(and(eq(quizAttempts.userId, userId), gte(quizAttempts.startedAt, sinceDate)));

    const subs = await db
      .select({ id: submissions.id })
      .from(submissions)
      .where(and(eq(submissions.userId, userId), gte(submissions.createdAt, sinceDate)));

    return completedLessons.length + attempts.length + subs.length;
  }
}
