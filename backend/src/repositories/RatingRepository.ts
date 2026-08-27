import { db } from '../database/connection';
import {
  skillRatings,
  skillRatingHistory,
  users,
  userProfiles,
} from '../database/schema';
import { eq, desc, asc, sql } from 'drizzle-orm';
import { IRatingRepository } from './interfaces/IRatingRepository';
import { RatingReferenceType, LeaderboardTimeframe } from '@codeforge/shared';

export class RatingRepository implements IRatingRepository {
  async getUserRating(userId: string): Promise<any> {
    const [existing] = await db
      .select()
      .from(skillRatings)
      .where(eq(skillRatings.userId, userId))
      .limit(1);

    if (existing) {
      return existing;
    }

    // Initialize default rating of 1200 for new user
    const [created] = await db
      .insert(skillRatings)
      .values({
        userId,
        currentRating: 1200,
        peakRating: 1200,
        confidenceInterval: 350,
        matchesCount: 0,
        assessmentsCount: 0,
        percentile: '50.00',
        rankTier: 'Novice',
      })
      .onConflictDoNothing()
      .returning();

    if (created) return created;

    const [afterConflict] = await db
      .select()
      .from(skillRatings)
      .where(eq(skillRatings.userId, userId))
      .limit(1);

    return afterConflict;
  }

  async updateUserRating(
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
  ): Promise<any> {
    const [updated] = await db
      .insert(skillRatings)
      .values({
        userId,
        currentRating: data.currentRating,
        peakRating: data.peakRating,
        confidenceInterval: data.confidenceInterval,
        matchesCount: data.matchesCount,
        assessmentsCount: data.assessmentsCount,
        percentile: data.percentile,
        rankTier: data.rankTier,
        lastUpdated: new Date(),
      })
      .onConflictDoUpdate({
        target: skillRatings.userId,
        set: {
          currentRating: data.currentRating,
          peakRating: data.peakRating,
          confidenceInterval: data.confidenceInterval,
          matchesCount: data.matchesCount,
          assessmentsCount: data.assessmentsCount,
          percentile: data.percentile,
          rankTier: data.rankTier,
          lastUpdated: new Date(),
        },
      })
      .returning();

    return updated;
  }

  async recordRatingHistory(data: {
    userId: string;
    previousRating: number;
    newRating: number;
    ratingChange: number;
    changeReason: string;
    referenceType: RatingReferenceType;
    referenceId?: string;
  }): Promise<any> {
    const [entry] = await db
      .insert(skillRatingHistory)
      .values({
        userId: data.userId,
        previousRating: data.previousRating,
        newRating: data.newRating,
        ratingChange: data.ratingChange,
        changeReason: data.changeReason,
        referenceType: data.referenceType,
        referenceId: data.referenceId ? (data.referenceId as any) : null,
      })
      .returning();

    return entry;
  }

  async getUserRatingHistory(userId: string, limit: number = 20): Promise<any[]> {
    return await db
      .select()
      .from(skillRatingHistory)
      .where(eq(skillRatingHistory.userId, userId))
      .orderBy(desc(skillRatingHistory.timestamp))
      .limit(limit);
  }

  async getGlobalLeaderboard(
    timeframe: LeaderboardTimeframe = LeaderboardTimeframe.GLOBAL,
    limit: number = 50,
    offset: number = 0,
  ): Promise<{ entries: any[]; total: number }> {
    const rows = await db
      .select({
        userId: users.id,
        username: users.username,
        displayName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,

        totalXp: userProfiles.totalXp,
        currentRating: sql<number>`COALESCE(${skillRatings.currentRating}, 1200)`,
        solvedCount: sql<number>`COALESCE(${skillRatings.matchesCount}, 0)`,
        percentile: sql<string>`COALESCE(${skillRatings.percentile}, '50.00')`,
      })
      .from(users)
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .leftJoin(skillRatings, eq(users.id, skillRatings.userId))
      .orderBy(desc(sql`COALESCE(${skillRatings.currentRating}, 1200)`), desc(userProfiles.totalXp))
      .limit(limit)
      .offset(offset);

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const total = Number(totalRow?.count || 0);

    const entries = rows.map((row, idx) => ({
      rank: offset + idx + 1,
      userId: row.userId,
      username: row.username,
      displayName: row.displayName || row.username,
      avatarUrl: row.avatarUrl || null,
      currentRating: Number(row.currentRating),
      totalXp: Number(row.totalXp || 0),
      solvedCount: Number(row.solvedCount || 0),
      percentile: Number(row.percentile || 50),
    }));

    return { entries, total };
  }
}
