import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CompanyBuilderService } from '../../src/modules/organization-engine/companyBuilderService';
import { EnterpriseCivilizationRepository } from '../../src/repositories/EnterpriseCivilizationRepository';
import { CompanyStage, InvestmentReadinessTier } from '@codeforge/shared';

describe('Phase 19: Autonomous Company Builder Unit Tests', () => {
  it('should generate startup blueprint with business model canvas and financial metrics', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new CompanyBuilderService(repo);

    const bp = await service.generateStartupBlueprint({
      creatorUserId: 'user-builder-test',
      companyName: 'Hyperion Sovereign AI',
      targetMarket: 'Enterprise Autonomous Workforces',
      domainFocus: 'Multi-Agent Enterprise Civilization Platform',
    });

    assert.ok(bp);
    assert.strictEqual(bp.companyName, 'Hyperion Sovereign AI');
    assert.strictEqual(bp.stage, CompanyStage.IDEATION);
    assert.ok(bp.businessModelCanvas.keyPartners.length > 0);
    assert.ok(bp.businessModelCanvas.revenueStreams.length > 0);
    assert.strictEqual(bp.projectedAnnualRunRateUsd, 2500000);
    assert.strictEqual(bp.readinessTier, InvestmentReadinessTier.TIER_2_INVESTABLE);
  });

  it('should generate structured 5-year ARR business plan', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new CompanyBuilderService(repo);

    const bp = await service.generateStartupBlueprint({
      creatorUserId: 'user-builder-test',
      companyName: 'Aura Data Intelligence',
    });

    const plan = await service.generateBusinessPlan(bp.id);
    assert.ok(plan);
    assert.strictEqual(plan.companyName, 'Aura Data Intelligence');
    assert.strictEqual(plan.projectedFiveYearARR.length, 5);
    assert.strictEqual(plan.projectedFiveYearARR[0].year, 1);
    assert.ok(plan.projectedFiveYearARR[4].arrUsd > plan.projectedFiveYearARR[0].arrUsd);
    assert.ok(plan.go_to_market_strategy.length > 0);
    assert.ok(plan.riskFactorsAndMitigations.length > 0);
  });

  it('should evaluate investment readiness and produce valuation models', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new CompanyBuilderService(repo);

    const bp = await service.generateStartupBlueprint({
      creatorUserId: 'user-builder-test',
      companyName: 'Vortex Quantum AI',
    });

    const readiness = await service.evaluateInvestmentReadiness(bp.id);
    assert.ok(readiness);
    assert.strictEqual(readiness.companyId, bp.id);
    assert.ok(readiness.readinessScore >= 80);
    assert.ok(readiness.valuationEstimateUsd > 0);
    assert.ok(readiness.recommendedPitchHighlights.length > 0);
  });
});
