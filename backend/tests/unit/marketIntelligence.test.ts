import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import { MarketIntelligenceService } from '../../src/modules/startup-builder/marketIntelligenceService';
import { StartupCategory } from '@codeforge/shared';

describe('Phase 20: Market Intelligence Engine Unit Tests', () => {
  it('should compute TAM, SAM, and SOM sizing metrics for target sector', async () => {
    const repo = new StartupBuilderRepository();
    const service = new MarketIntelligenceService(repo);

    const report = await service.generateMarketReport({
      sector: StartupCategory.AI_DEVTOOLS,
    });

    assert.ok(report);
    assert.strictEqual(report.sector, StartupCategory.AI_DEVTOOLS);
    assert.ok(report.tamUsd > report.samUsd);
    assert.ok(report.samUsd > report.somUsd);
    assert.strictEqual(report.tamUsd, 45000000000);
    assert.strictEqual(report.samUsd, 12500000000);
    assert.strictEqual(report.somUsd, 1800000000);
    assert.strictEqual(report.cagrPercent, 34.8);
    assert.ok(report.marketTrends.length > 0);
    assert.ok(report.opportunityGaps.length > 0);
    assert.ok(report.competitiveLandscape.length > 0);
  });

  it('should analyze competitive landscape and benchmark market shares', async () => {
    const repo = new StartupBuilderRepository();
    const service = new MarketIntelligenceService(repo);

    const landscape = await service.getCompetitiveLandscape(StartupCategory.AUTONOMOUS_AGENTS);
    assert.ok(landscape);
    assert.strictEqual(landscape.sector, StartupCategory.AUTONOMOUS_AGENTS);
    assert.ok(landscape.competitors.length >= 3);
    assert.ok(landscape.marketConcentrationIndex.length > 0);
    assert.ok(landscape.barrierToEntryLevel.length > 0);
  });

  it('should detect top opportunity white-space sectors and rank by CAGR', async () => {
    const repo = new StartupBuilderRepository();
    const service = new MarketIntelligenceService(repo);

    const opportunities = await service.getTopOpportunitySectors();
    assert.ok(opportunities.length >= 3);
    assert.ok(opportunities[0].opportunityScore >= opportunities[1].opportunityScore);
    assert.ok(opportunities[0].tamUsd > 0);
  });
});
