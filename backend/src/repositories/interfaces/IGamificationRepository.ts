import { GamificationSummaryDto, StreakDto, XPTransactionType } from '@codeforge/shared';

export interface IGamificationRepository {
  addXp(userId: string, amount: number, type: XPTransactionType, description?: string, referenceId?: string): Promise<number>;
  getStreak(userId: string): Promise<StreakDto | null>;
  recordDailyActivity(userId: string, date: string): Promise<StreakDto>;
  getGamificationSummary(userId: string): Promise<GamificationSummaryDto>;
}
