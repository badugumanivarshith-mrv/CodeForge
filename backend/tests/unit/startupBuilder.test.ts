import { test, describe } from 'node:test';
import assert from 'node:assert';
import { StartupBuilderService } from '../../src/modules/global-network/startupBuilderService';
import { VentureStage } from '@codeforge/shared';

describe('Phase 16: AI Entrepreneurship & Startup Builder Unit Tests', () => {
  const createMockRepo = () => {
    const startups = new Map<string, any>();
    const matches = new Map<string, any[]>();

    return {
      startups,
      matches,
      async createStartupProfile(founderUserId: string, data: any) {
        const s = {
          id: `su-${Date.now()}`,
          founderUserId,
          name: data.name || 'AI Startup',
          tagline: data.tagline || '',
          description: data.description || '',
          stage: data.stage || VentureStage.IDEA,
          industry: data.industry || 'AI',
          targetMarket: data.targetMarket || 'Enterprise',
          businessModel: data.businessModel || 'SaaS',
          fundingGoalUsd: data.fundingGoalUsd || 500000,
          raisedAmountUsd: data.raisedAmountUsd || 0,
          marketValidationScore: data.marketValidationScore || 85.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        startups.set(s.id, s);
        return s;
      },
      async getStartupById(id: string) {
        return startups.get(id) || null;
      },
      async getStartupProfileById(id: string) {
        return startups.get(id) || null;
      },
      async listStartups(stage?: VentureStage, industry?: string) {
        let list = Array.from(startups.values());
        if (stage) list = list.filter(s => s.stage === stage);
        if (industry) list = list.filter(s => s.industry === industry);
        return list;
      },
      async createFounderMatch(startupId: string, candidateUserId: string, score: number, skills: string[], fit: string) {
        const m = {
          id: `fm-${Date.now()}`,
          startupId,
          candidateUserId,
          matchScore: score,
          complementarySkills: skills,
          roleFit: fit,
          createdAt: new Date().toISOString(),
        };
        const list = matches.get(startupId) || [];
        list.push(m);
        matches.set(startupId, list);
        return m;
      },
      async recordEvent() {
        return { id: 'evt-1' };
      },
    } as any;
  };

  test('should incubate and launch a new venture profile', async () => {
    const repo = createMockRepo();
    const service = new StartupBuilderService(repo);

    const startup = await service.launchStartup('founder-1', {
      name: 'OmniVector Cloud',
      tagline: 'Autonomous vector pipeline orchestrator for enterprise agents',
      stage: VentureStage.SEED,
      industry: 'AI Infrastructure',
      fundingGoalUsd: 1500000,
    });

    assert.strictEqual(startup.name, 'OmniVector Cloud');
    assert.strictEqual(startup.stage, VentureStage.SEED);
    assert.strictEqual(startup.fundingGoalUsd, 1500000);
  });

  test('should generate comprehensive venture intelligence reports', async () => {
    const repo = createMockRepo();
    const service = new StartupBuilderService(repo);

    const startup = await service.launchStartup('founder-2', {
      name: 'HyperLogic Labs',
      stage: VentureStage.SERIES_A,
    });

    const report = await service.generateVentureIntelligence(startup.id);

    assert.strictEqual(report.startupId, startup.id);
    assert.ok(report.marketViabilityScore >= 70);
    assert.ok(report.unitEconomicsModel.grossMarginPercent > 70);
    assert.ok(report.strategicRoadmapSteps.length >= 3);
  });

  test('should match complementary co-founders for incubated ventures', async () => {
    const repo = createMockRepo();
    const service = new StartupBuilderService(repo);

    const startup = await service.launchStartup('founder-3', {
      name: 'Agentic FinOps',
    });

    const matches = await service.findCoFounders(startup.id);
    assert.ok(matches.length >= 2, 'Should return at least 2 potential co-founder matches');
    assert.ok(matches[0].matchScore >= 80);
    assert.ok(matches[0].complementarySkills.length > 0);
  });
});
