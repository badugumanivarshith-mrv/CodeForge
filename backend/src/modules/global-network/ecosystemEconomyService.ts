import { IGlobalEcosystemRepository, globalEcosystemRepository } from '../../repositories';
import {
  EcosystemReputationDto,
  EcosystemRewardDto,
} from '@codeforge/shared';

export class EcosystemEconomyService {
  constructor(private repo: IGlobalEcosystemRepository = globalEcosystemRepository) {}

  async getUserReputation(userId: string): Promise<EcosystemReputationDto> {
    return this.repo.getReputation(userId);
  }

  async grantContributionReward(userId: string, credits: number, reason: string): Promise<EcosystemRewardDto> {
    const reward = await this.repo.createReward(userId, 'CONTRIBUTION_AWARD', credits, reason);
    await this.repo.updateReputation(userId, Math.round(credits / 2), credits);
    return reward;
  }

  async rewardContribution(userId: string, credits: number, reason: string): Promise<EcosystemRewardDto> {
    return this.grantContributionReward(userId, credits, reason);
  }

  getComputeCreditExchangeRate(networkLoadRatio: number = 0.5): number {
    const baseRate = 1.0;
    if (networkLoadRatio > 0.8) {
      return baseRate * (1 + (networkLoadRatio - 0.8) * 5);
    }
    return baseRate;
  }

  async spendCredits(userId: string, credits: number, reason: string): Promise<{ success: boolean; newBalance: number }> {
    const rep = await this.repo.getReputation(userId);
    if (rep.skillCreditsBalance < credits) {
      throw new Error(`Insufficient skill credits. Available: ${rep.skillCreditsBalance}, requested: ${credits}.`);
    }

    await this.repo.updateReputation(userId, 0, -credits);
    const updated = await this.repo.getReputation(userId);
    return {
      success: true,
      newBalance: updated.skillCreditsBalance,
    };
  }

  async listUserRewards(userId: string): Promise<EcosystemRewardDto[]> {
    return this.repo.listRewards(userId);
  }
}

export const ecosystemEconomyService = new EcosystemEconomyService();
