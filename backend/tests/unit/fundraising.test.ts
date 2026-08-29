import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import { FundraisingService, StartupGenerationService } from '../../src/modules/startup-builder';
import { StartupCategory, StartupFundingStage } from '@codeforge/shared';

describe('Phase 20: Fundraising & Investor Network Unit Tests', () => {
  it('should evaluate fundraising readiness score and institutional pitch highlights', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const fundService = new FundraisingService(repo);

    const startup = await genService.createStartup({
      name: 'NeuroForge AI',
      tagline: 'Autonomous AI engineer networks',
      category: StartupCategory.AUTONOMOUS_AGENTS,
    });

    const readiness = await fundService.evaluateFundraisingReadiness(startup.id);
    assert.ok(readiness);
    assert.strictEqual(readiness.startupId, startup.id);
    assert.ok(readiness.readinessScore >= 75);
    assert.ok(readiness.recommendedRoundSizeUsd > 0);
    assert.ok(readiness.keyStrengths.length > 0);
    assert.ok(readiness.pitchHighlights.length > 0);
  });

  it('should match institutional investors based on thesis and target category', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const fundService = new FundraisingService(repo);

    const startup = await genService.createStartup({
      name: 'CyberDefend AI',
      tagline: 'Autonomous security analysts',
      category: StartupCategory.CYBERSECURITY_AI,
    });

    const match = await fundService.matchInvestors(startup.id);
    assert.ok(match);
    assert.strictEqual(match.startupId, startup.id);
    assert.ok(match.matchedInvestors.length >= 2);
    assert.ok(match.matchedInvestors[0].matchConfidencePercent >= 70);
  });

  it('should simulate funding rounds, post-money valuation, dilution, and cap table allocations', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const fundService = new FundraisingService(repo);

    const startup = await genService.createStartup({
      name: 'Synthetix Cloud',
      tagline: 'Autonomous multi-cloud synthetic orchestrator',
      category: StartupCategory.ENTERPRISE_INFRA,
    });

    const sim = await fundService.simulateFundingRound({
      startupId: startup.id,
      stage: StartupFundingStage.SEED,
      targetRaiseUsd: 2500000,
      preMoneyValuationUsd: 10000000,
    });

    assert.ok(sim);
    assert.strictEqual(sim.startupId, startup.id);
    assert.strictEqual(sim.preMoneyValuationUsd, 10000000);
    assert.strictEqual(sim.targetRaiseUsd, 2500000);
    assert.strictEqual(sim.postMoneyValuationUsd, 12500000);
    assert.strictEqual(sim.investorEquityPercent, 20.0);
    assert.ok(sim.capTableSummary.length === 3);
    assert.strictEqual(sim.capTableSummary[0].stakeholder, 'Founders & Team');
    assert.strictEqual(sim.capTableSummary[1].stakeholder, 'Option Pool (ESOP)');
    assert.strictEqual(sim.capTableSummary[2].stakeholder, 'SEED Investors');
  });
});
