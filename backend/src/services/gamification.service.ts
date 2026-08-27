import { IGamificationRepository } from '../repositories';
import {
  GamificationSummaryDto,
  StreakDto,
  LeaderboardEntryDto,
} from '@codeforge/shared';

export class GamificationService {
  constructor(private gamificationRepo: IGamificationRepository) {}

  public async getSummary(userId: string): Promise<GamificationSummaryDto> {
    return await this.gamificationRepo.getGamificationSummary(userId);
  }

  public async getStreak(userId: string): Promise<StreakDto | null> {
    return await this.gamificationRepo.getStreak(userId);
  }

  public async getLeaderboard(limit = 20): Promise<LeaderboardEntryDto[]> {
    return await this.gamificationRepo.getLeaderboard(limit);
  }
}
