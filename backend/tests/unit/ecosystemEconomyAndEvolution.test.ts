import { test, describe } from 'node:test';
import assert from 'node:assert';
import { EcosystemEconomyService } from '../../src/modules/global-network/ecosystemEconomyService';
import { SelfImprovingEcosystemService } from '../../src/modules/global-network/selfImprovingEcosystemService';
import { ReputationTier } from '@codeforge/shared';

describe('Phase 16: AI Economy & Self-Improving Ecosystem Unit Tests', () => {
  const createMockRepo = () => {
    const rewards: any[] = [];
    const reputations = new Map<string, any>();

    return {
      rewards,
      reputations,
      async getReputation(userId: string) {
        return reputations.get(userId) || null;
      },
      async updateReputation(userId: string, delta: number, creditsDelta: number) {
        const current = reputations.get(userId) || {
          userId,
          score: 100,
          tier: ReputationTier.PRACTITIONER,
          skillCreditsBalance: 50,
          totalContributions: 0,
          rankPercentile: 50.0,
          badgesEarned: ['Early Adopter'],
          updatedAt: new Date().toISOString(),
        };
        current.score += delta;
        current.skillCreditsBalance += creditsDelta;
        current.totalContributions += 1;
        reputations.set(userId, current);
        return current;
      },
      async createReward(userId: string, rewardType: string, skillCredits: number, reason: string) {
        const reward = {
          id: `rew-${Date.now()}`,
          userId,
          rewardType,
          skillCredits,
          reason,
          grantedAt: new Date().toISOString(),
        };
        rewards.push(reward);
        return reward;
      },
      async recordEvent() {
        return { id: 'evt-1' };
      },
    } as any;
  };

  test('should award tokenized skill credits and upgrade reputation standings', async () => {
    const repo = createMockRepo();
    const service = new EcosystemEconomyService(repo);

    const reward = await service.rewardContribution('user-500', 100, 'Autonomous workflow optimization contribution');
    assert.strictEqual(reward.userId, 'user-500');
    assert.strictEqual(reward.skillCredits, 100);

    const rep = await service.getUserReputation('user-500');
    assert.ok(rep.score > 100);
    assert.ok(rep.skillCreditsBalance >= 150);
  });

  test('should compute dynamic compute exchange rates based on network load', async () => {
    const service = new EcosystemEconomyService(createMockRepo());
    const rate1 = service.getComputeCreditExchangeRate(0.2);
    const rate2 = service.getComputeCreditExchangeRate(0.85);

    assert.ok(rate2 > rate1, 'Compute cost should surge under high network demand');
  });

  test('should execute self-improving prompt evolution cycles and record telemetry', async () => {
    const service = new SelfImprovingEcosystemService(createMockRepo());
    const metricsBefore = await service.getLearningMetrics();
    assert.ok(metricsBefore.length >= 3);

    const improved = await service.triggerEvolutionCycle('Distributed Workflow Engine');
    assert.strictEqual(improved.moduleName, 'Distributed Workflow Engine');
    assert.ok(improved.optimizationGenerations > 0);
    assert.ok(improved.currentPerformance >= improved.baselinePerformance);
  });
});
