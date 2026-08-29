import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VentureCapitalRepository } from '../../src/repositories/VentureCapitalRepository';
import { DueDiligenceService } from '../../src/modules/venture-capital';
import { DiligenceCategory, InvestmentRecommendation } from '@codeforge/shared';

describe('Phase 21: Autonomous Due Diligence Unit Tests', () => {
  it('should execute comprehensive multi-vector due diligence audit', async () => {
    const repo = new VentureCapitalRepository();
    const diligenceService = new DueDiligenceService(repo);

    const report = await diligenceService.performDueDiligence('deal-test-1', 'startup-test-1');

    assert.ok(report);
    assert.strictEqual(report.startupId, 'startup-test-1');
    assert.ok(report.overallScore >= 85.0);
    assert.strictEqual(report.recommendation, InvestmentRecommendation.STRONG_INVEST);
    assert.ok(report.dimensions.length >= 5);
    assert.ok(report.greenLights.length > 0);

    const techDim = report.dimensions.find((d) => d.category === DiligenceCategory.TECH_ARCHITECTURE);
    assert.ok(techDim);
    assert.ok(techDim.score >= 90.0);
  });

  it('should detect and classify risk factors and provide mitigation recommendations', async () => {
    const repo = new VentureCapitalRepository();
    const diligenceService = new DueDiligenceService(repo);

    const risks = await diligenceService.detectRiskFactors('startup-test-1');

    assert.ok(Array.isArray(risks));
    assert.ok(risks.length >= 1);
    assert.ok(risks[0].riskTitle.length > 0);
    assert.ok(risks[0].mitigationRecommendation.length > 0);
  });

  it('should retrieve existing diligence report without recomputation', async () => {
    const repo = new VentureCapitalRepository();
    const diligenceService = new DueDiligenceService(repo);

    const rep1 = await diligenceService.performDueDiligence('deal-test-2', 'startup-test-2');
    const rep2 = await diligenceService.getDiligenceReport('startup-test-2');

    assert.strictEqual(rep1.id, rep2.id);
    assert.strictEqual(rep1.overallScore, rep2.overallScore);
  });
});
