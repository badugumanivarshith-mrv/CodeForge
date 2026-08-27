import { eq, desc, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  xpTransactions,
  levels,
  streaks,
  userProfiles,
  users,
} from '../database/schema';
import { IGamificationRepository } from './interfaces/IGamificationRepository';
import {
  GamificationSummaryDto,
  StreakDto,
  XPTransactionType,
  LeaderboardEntryDto,
} from '@codeforge/shared';

export class GamificationRepository implements IGamificationRepository {
  public async addXp(
    userId: string,
    amount: number,
    type: XPTransactionType,
    description?: string,
    referenceId?: string,
  ): Promise<{ newTotalXp: number; newLevel: number; leveledUp: boolean }> {
    return await db.transaction(async tx => {
      // 1. Insert XP ledger row
      await tx.insert(xpTransactions).values({
        userId,
        amount,
        transactionType: type,
        description: description || `Earned ${amount} XP`,
        referenceId: referenceId ? referenceId : undefined,
      });

      // 2. Fetch current profile
      const [profile] = await tx
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      const oldXp = profile?.totalXp || 0;
      const oldLevel = profile?.currentLevel || 1;
      const newTotalXp = oldXp + amount;

      // 3. Determine new level based on levels table
      const levelRows = await tx
        .select()
        .from(levels)
        .where(sql`${levels.minXpRequired} <= ${newTotalXp}`)
        .orderBy(desc(levels.levelNumber))
        .limit(1);

      const newLevel = levelRows.length > 0 ? levelRows[0].levelNumber : 1;
      const leveledUp = newLevel > oldLevel;

      // 4. Update profile with new XP and Level
      await tx
        .update(userProfiles)
        .set({
          totalXp: newTotalXp,
          currentLevel: newLevel,
          updatedAt: new Date(),
        })
        .where(eq(userProfiles.userId, userId));

      return {
        newTotalXp,
        newLevel,
        leveledUp,
      };
    });
  }

  public async getStreak(userId: string): Promise<StreakDto | null> {
    const [row] = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, userId))
      .limit(1);

    if (!row) return null;
    return {
      userId: row.userId,
      currentStreak: row.currentStreak,
      longestStreak: row.longestStreak,
      lastActivityDate: row.lastActivityDate,
      freezeTokensAvailable: row.freezeTokensAvailable,
    };
  }

  public async recordDailyActivity(userId: string): Promise<StreakDto> {
    const todayStr = new Date().toISOString().split('T')[0];

    const [existing] = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, userId))
      .limit(1);

    if (!existing) {
      const [inserted] = await db
        .insert(streaks)
        .values({
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: todayStr,
          freezeTokensAvailable: 1,
        })
        .returning();

      return {
        userId: inserted.userId,
        currentStreak: inserted.currentStreak,
        longestStreak: inserted.longestStreak,
        lastActivityDate: inserted.lastActivityDate,
        freezeTokensAvailable: inserted.freezeTokensAvailable,
      };
    }

    if (existing.lastActivityDate === todayStr) {
      return {
        userId: existing.userId,
        currentStreak: existing.currentStreak,
        longestStreak: existing.longestStreak,
        lastActivityDate: existing.lastActivityDate,
        freezeTokensAvailable: existing.freezeTokensAvailable,
      };
    }

    const lastDate = existing.lastActivityDate ? new Date(existing.lastActivityDate) : null;
    const today = new Date(todayStr);

    let currentStreak = existing.currentStreak;
    let freezeTokens = existing.freezeTokensAvailable;

    if (lastDate) {
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays === 2 && freezeTokens > 0) {
        freezeTokens -= 1; // used freeze token
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    const longestStreak = Math.max(existing.longestStreak, currentStreak);

    const [updated] = await db
      .update(streaks)
      .set({
        currentStreak,
        longestStreak,
        freezeTokensAvailable: freezeTokens,
        lastActivityDate: todayStr,
        updatedAt: new Date(),
      })
      .where(eq(streaks.userId, userId))
      .returning();

    return {
      userId: updated.userId,
      currentStreak: updated.currentStreak,
      longestStreak: updated.longestStreak,
      lastActivityDate: updated.lastActivityDate,
      freezeTokensAvailable: updated.freezeTokensAvailable,
    };
  }

  public async getGamificationSummary(userId: string): Promise<GamificationSummaryDto> {
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, userId))
      .limit(1);

    const totalXp = profile?.totalXp || 0;
    const currentLevel = profile?.currentLevel || 1;

    // Get next level XP threshold
    const [nextLvl] = await db
      .select()
      .from(levels)
      .where(eq(levels.levelNumber, currentLevel + 1))
      .limit(1);

    const [currentLvl] = await db
      .select()
      .from(levels)
      .where(eq(levels.levelNumber, currentLevel))
      .limit(1);

    const currentLevelMinXp = currentLvl?.minXpRequired || 0;
    const nextLevelXp = nextLvl?.minXpRequired || currentLevelMinXp + 1000;
    const xpSpan = Math.max(1, nextLevelXp - currentLevelMinXp);
    const xpEarnedInLevel = Math.max(0, totalXp - currentLevelMinXp);
    const levelProgressPercentage = Math.min(100, Math.round((xpEarnedInLevel / xpSpan) * 100));

    const streak = await this.getStreak(userId);

    return {
      totalXp,
      currentLevel,
      nextLevelXp,
      levelProgressPercentage,
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      freezeTokensAvailable: streak?.freezeTokensAvailable ?? 1,
    };
  }

  public async getLeaderboard(limit = 20): Promise<LeaderboardEntryDto[]> {
    const rows = await db
      .select({
        userId: userProfiles.userId,
        username: users.username,
        avatarUrl: userProfiles.avatarUrl,
        totalXp: userProfiles.totalXp,
      })
      .from(userProfiles)
      .innerJoin(users, eq(userProfiles.userId, users.id))
      .orderBy(desc(userProfiles.totalXp))
      .limit(limit);

    return rows.map((r, idx) => ({
      id: r.userId,
      userId: r.userId,
      username: r.username,
      avatarUrl: r.avatarUrl,
      totalXp: r.totalXp,
      rank: idx + 1,
      leagueTier: idx < 3 ? 'Diamond' : idx < 10 ? 'Platinum' : 'Gold',
      weeklyXp: r.totalXp,
    }));
  }
}
