import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StartupBuilderRepository } from '../../src/repositories/StartupBuilderRepository';
import { GrowthEngineService, StartupGenerationService } from '../../src/modules/startup-builder';
import { GrowthChannel, StartupCategory } from '@codeforge/shared';

describe('Phase 20: Autonomous Growth Engine Unit Tests', () => {
  it('should generate 12-month MAU and MRR growth trajectory models', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const growthService = new GrowthEngineService(repo);

    const startup = await genService.createStartup({
      name: 'ViralForge AI',
      tagline: 'Autonomous viral developer growth loop engine',
      category: StartupCategory.AI_DEVTOOLS,
    });

    const forecast = await growthService.generateGrowthForecast(startup.id, GrowthChannel.PRODUCT_LED);
    assert.ok(forecast);
    assert.strictEqual(forecast.startupId, startup.id);
    assert.strictEqual(forecast.primaryChannel, GrowthChannel.PRODUCT_LED);
    assert.strictEqual(forecast.monthlyActiveUsersForecast.length, 12);
    assert.strictEqual(forecast.monthlyRevenueForecastUsd.length, 12);
    assert.ok(forecast.monthlyActiveUsersForecast[11].mau > forecast.monthlyActiveUsersForecast[0].mau);
    assert.ok(forecast.monthlyRevenueForecastUsd[11].mrr > forecast.monthlyRevenueForecastUsd[0].mrr);
  });

  it('should compute CAC, LTV, payback period, and viral coefficient metrics', async () => {
    const repo = new StartupBuilderRepository();
    const genService = new StartupGenerationService(repo);
    const growthService = new GrowthEngineService(repo);

    const startup = await genService.createStartup({
      name: 'QuantumScale',
      tagline: 'High-throughput enterprise AI pipelines',
      category: StartupCategory.ENTERPRISE_INFRA,
    });

    const unitEcon = await growthService.getUnitEconomicsModel(startup.id);
    assert.ok(unitEcon);
    assert.strictEqual(unitEcon.startupId, startup.id);
    assert.ok(unitEcon.cacUsd > 0);
    assert.ok(unitEcon.ltvUsd > unitEcon.cacUsd);
    assert.ok(unitEcon.ltvCacRatio >= 3.0);
    assert.ok(unitEcon.viralCoefficient > 1.0);
    assert.ok(unitEcon.paybackPeriodMonths <= 3);
    assert.ok(unitEcon.optimizationTactics.length > 0);
  });
});
