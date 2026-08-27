import { eq, and, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  userProgress,
  topicMastery,
  languageMastery,
  lessons,
  topics,
} from '../database/schema';
import { IProgressRepository } from './interfaces/IProgressRepository';
import {
  TopicMasteryDto,
  LanguageMasteryDto,
  LanguageId,
  LessonDto,
  MasteryLevel,
  ContentStatus,
} from '@codeforge/shared';

export class ProgressRepository implements IProgressRepository {
  public async markLessonCompleted(
    userId: string,
    lessonId: string,
  ): Promise<{ isFirstCompletion: boolean }> {
    const existing = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
      .limit(1);

    if (existing.length > 0) {
      return { isFirstCompletion: false };
    }

    await db.insert(userProgress).values({
      userId,
      lessonId,
      isCompleted: true,
      completedAt: new Date(),
    });

    return { isFirstCompletion: true };
  }

  public async isLessonCompleted(userId: string, lessonId: string): Promise<boolean> {
    const [row] = await db
      .select({ isCompleted: userProgress.isCompleted })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
      .limit(1);

    return Boolean(row?.isCompleted);
  }

  public async getUserCompletedLessons(userId: string): Promise<LessonDto[]> {
    const rows = await db
      .select({
        id: lessons.id,
        topicId: lessons.topicId,
        sequence: lessons.sequence,
        slug: lessons.slug,
        title: lessons.title,
        description: lessons.description,
        readTimeMinutes: lessons.readTimeMinutes,
        status: lessons.status,
      })
      .from(userProgress)
      .innerJoin(lessons, eq(userProgress.lessonId, lessons.id))
      .where(and(eq(userProgress.userId, userId), eq(userProgress.isCompleted, true)))
      .orderBy(desc(userProgress.completedAt))
      .limit(10);

    return rows.map(r => ({
      id: r.id,
      topicId: r.topicId,
      sequence: r.sequence,
      slug: r.slug,
      title: r.title,
      description: r.description,
      readTimeMinutes: r.readTimeMinutes,
      status: r.status as ContentStatus,
      isCompleted: true,
    }));
  }

  public async getTopicMastery(userId: string, topicId: string): Promise<TopicMasteryDto | null> {
    const [row] = await db
      .select({
        id: topicMastery.id,
        userId: topicMastery.userId,
        topicId: topicMastery.topicId,
        topicTitle: topics.title,
        topicSequence: topics.sequence,
        languageId: topics.languageId,
        masteryLevel: topicMastery.masteryLevel,
        masteryScore: topicMastery.masteryScore,
        bktProbability: topicMastery.bktProbability,
        problemsSolvedCount: topicMastery.problemsSolvedCount,
        quizScoreBest: topicMastery.quizScoreBest,
        assignmentsPassedCount: topicMastery.assignmentsPassedCount,
        lastActivityAt: topicMastery.lastActivityAt,
      })
      .from(topicMastery)
      .innerJoin(topics, eq(topicMastery.topicId, topics.id))
      .where(and(eq(topicMastery.userId, userId), eq(topicMastery.topicId, topicId)))
      .limit(1);

    if (!row) return null;
    return {
      id: row.id,
      userId: row.userId,
      topicId: row.topicId,
      topicTitle: row.topicTitle,
      topicSequence: row.topicSequence,
      languageId: row.languageId as LanguageId,
      masteryLevel: row.masteryLevel as MasteryLevel,
      masteryScore: Number(row.masteryScore),
      bktProbability: Number(row.bktProbability),
      problemsSolvedCount: row.problemsSolvedCount,
      quizScoreBest: row.quizScoreBest,
      assignmentsPassedCount: row.assignmentsPassedCount,
      lastActivityAt: row.lastActivityAt.toISOString(),
    };
  }

  public async getAllTopicMasteries(userId: string): Promise<TopicMasteryDto[]> {
    const rows = await db
      .select({
        id: topicMastery.id,
        userId: topicMastery.userId,
        topicId: topicMastery.topicId,
        topicTitle: topics.title,
        topicSequence: topics.sequence,
        languageId: topics.languageId,
        masteryLevel: topicMastery.masteryLevel,
        masteryScore: topicMastery.masteryScore,
        bktProbability: topicMastery.bktProbability,
        problemsSolvedCount: topicMastery.problemsSolvedCount,
        quizScoreBest: topicMastery.quizScoreBest,
        assignmentsPassedCount: topicMastery.assignmentsPassedCount,
        lastActivityAt: topicMastery.lastActivityAt,
      })
      .from(topicMastery)
      .innerJoin(topics, eq(topicMastery.topicId, topics.id))
      .where(eq(topicMastery.userId, userId))
      .orderBy(desc(topicMastery.lastActivityAt));

    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      topicId: r.topicId,
      topicTitle: r.topicTitle,
      topicSequence: r.topicSequence,
      languageId: r.languageId as LanguageId,
      masteryLevel: r.masteryLevel as MasteryLevel,
      masteryScore: Number(r.masteryScore),
      bktProbability: Number(r.bktProbability),
      problemsSolvedCount: r.problemsSolvedCount,
      quizScoreBest: r.quizScoreBest,
      assignmentsPassedCount: r.assignmentsPassedCount,
      lastActivityAt: r.lastActivityAt.toISOString(),
    }));
  }

  public async updateTopicMastery(
    userId: string,
    topicId: string,
    updates: Partial<TopicMasteryDto>,
  ): Promise<void> {
    const existing = await db
      .select()
      .from(topicMastery)
      .where(and(eq(topicMastery.userId, userId), eq(topicMastery.topicId, topicId)))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(topicMastery)
        .set({
          masteryLevel: updates.masteryLevel,
          masteryScore: updates.masteryScore !== undefined ? String(updates.masteryScore) : undefined,
          bktProbability: updates.bktProbability !== undefined ? String(updates.bktProbability) : undefined,
          problemsSolvedCount: updates.problemsSolvedCount,
          quizScoreBest: updates.quizScoreBest,
          assignmentsPassedCount: updates.assignmentsPassedCount,
          lastActivityAt: new Date(),
        })
        .where(eq(topicMastery.id, existing[0].id));
    } else {
      await db.insert(topicMastery).values({
        userId,
        topicId,
        masteryLevel: updates.masteryLevel || MasteryLevel.NOVICE,
        masteryScore: String(updates.masteryScore ?? '0.00'),
        bktProbability: String(updates.bktProbability ?? '0.10'),
        problemsSolvedCount: updates.problemsSolvedCount || 0,
        quizScoreBest: updates.quizScoreBest || 0,
        assignmentsPassedCount: updates.assignmentsPassedCount || 0,
        lastActivityAt: new Date(),
      });
    }
  }

  public async getLanguageMastery(
    userId: string,
    languageId: LanguageId,
  ): Promise<LanguageMasteryDto | null> {
    const [row] = await db
      .select()
      .from(languageMastery)
      .where(and(eq(languageMastery.userId, userId), eq(languageMastery.languageId, languageId)))
      .limit(1);

    if (!row) return null;
    return {
      id: row.id,
      userId: row.userId,
      languageId: row.languageId as LanguageId,
      masteryScore: Number(row.masteryScore),
      topicsCompletedCount: row.topicsCompletedCount,
      totalTopicsCount: row.totalTopicsCount,
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
