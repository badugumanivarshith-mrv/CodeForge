import {
  GamificationSummaryDto,
  StreakDto,
  XPTransactionType,
  LeaderboardEntryDto,
} from '@codeforge/shared';

export interface IGamificationRepository {
  addXp(
    userId: string,
    amount: number,
    type: XPTransactionType,
    description?: string,
    referenceId?: string,
  ): Promise<{ newTotalXp: number; newLevel: number; leveledUp: boolean }>;
  getStreak(userId: string): Promise<StreakDto | null>;
  recordDailyActivity(userId: string): Promise<StreakDto>;
  getGamificationSummary(userId: string): Promise<GamificationSummaryDto>;
  getLeaderboard(limit?: number): Promise<LeaderboardEntryDto[]>;
}
