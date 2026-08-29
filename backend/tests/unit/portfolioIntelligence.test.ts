import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VentureCapitalRepository } from '../../src/repositories/VentureCapitalRepository';
import { PortfolioIntelligenceService } from '../../src/modules/venture-capital';
import { StartupCategory } from '@codeforge/shared';

describe('Phase 21: Portfolio Intelligence Unit Tests', () => {
  it('should analyze portfolio health, Sharpe/Sortino ratios, and sector exposure', async () => {
    const repo = new VentureCapitalRepository();
    const intelService = new PortfolioIntelligenceService(repo);

    const intel = await intelService.analyzePortfolioIntelligence('fund-seed-1');

    assert.ok(intel);
    assert.strictEqual(intel.fundId, 'fund-seed-1');
    assert.ok(intel.portfolioHealthScore >= 85.0);
    assert.ok(intel.sharpeRatio >= 2.0);
    assert.ok(intel.sortinoRatio >= 2.5);
    assert.ok(intel.topPerformers.length > 0);
    assert.ok(intel.recommendations.length > 0);
    assert.ok(Object.keys(intel.sectorExposure).length > 0);
  });

  it('should generate sector correlation matrix and evaluate concentration risk', async () => {
    const repo = new VentureCapitalRepository();
    const intelService = new PortfolioIntelligenceService(repo);

    const matrix = await intelService.getSectorCorrelationMatrix('fund-seed-1');

    assert.ok(matrix);
    assert.ok(matrix.sectors.length >= 4);
    assert.strictEqual(matrix.matrix[StartupCategory.AI_DEVTOOLS][StartupCategory.AI_DEVTOOLS], 1.0);
    assert.ok(matrix.maxConcentrationRiskSector.length > 0);
    assert.strictEqual(matrix.diversificationRating, 'HIGHLY_OPTIMAL');
  });

  it('should compute holding health risk radar metrics across dimensions', async () => {
    const repo = new VentureCapitalRepository();
    const intelService = new PortfolioIntelligenceService(repo);

    const radar = await intelService.getHoldingHealthRadar('fund-seed-1');

    assert.ok(Array.isArray(radar));
    assert.ok(radar.length > 0);
    assert.ok(radar[0].overallHealth >= 80.0);
    assert.ok(radar[0].runwayRisk >= 0);
    assert.ok(radar[0].competitionRisk >= 0);
    assert.ok(radar[0].executionRisk >= 0);
  });
});
