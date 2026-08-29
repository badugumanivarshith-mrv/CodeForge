import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InvestmentIntelligenceService } from '../../src/modules/organization-engine/investmentIntelligenceService';
import { EnterpriseCivilizationRepository } from '../../src/repositories/EnterpriseCivilizationRepository';
import { InvestmentReadinessTier } from '@codeforge/shared';

describe('Phase 19: Capital & Investment Intelligence Unit Tests', () => {
  it('should record sovereign investment round and structure cap table', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new InvestmentIntelligenceService(repo);

    const inv = await service.recordInvestmentRound({
      companyBlueprintId: 'bp-test-1',
      fundingRound: 'Series A',
      targetAmountUsd: 15000000,
      committedAmountUsd: 12500000,
      preMoneyValuationUsd: 60000000,
      leadInvestorEntity: 'CodeForge Sovereign Venture Trust',
      investorPitchDeckSummary: 'Autonomous software civilization scaling round.',
      readinessTier: InvestmentReadinessTier.TIER_1_EXEMPLARY,
    });

    assert.ok(inv);
    assert.strictEqual(inv.fundingRound, 'Series A');
    assert.strictEqual(inv.committedAmountUsd, 12500000);
    assert.strictEqual(inv.readinessTier, InvestmentReadinessTier.TIER_1_EXEMPLARY);
  });

  it('should generate simulated funding scenario with cap table distribution', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new InvestmentIntelligenceService(repo);

    const sim = await service.simulateFundingScenario('bp-test-1', 10000000);
    assert.ok(sim);
    assert.strictEqual(sim.targetAmountUsd, 10000000);
    assert.ok(sim.postMoneyValuationUsd > sim.targetAmountUsd);
    assert.ok(sim.projectedDilutionPercent < 25);
    assert.ok(sim.capTableDistribution.founderEquityPercent > 50);
    assert.ok(sim.capTableDistribution.investorEquityPercent > 0);
  });
});
