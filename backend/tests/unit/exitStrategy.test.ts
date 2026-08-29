import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VentureCapitalRepository } from '../../src/repositories/VentureCapitalRepository';
import { ExitStrategyService } from '../../src/modules/venture-capital';
import { ExitType } from '@codeforge/shared';

describe('Phase 21: Exit Strategy & Liquidity Unit Tests', () => {
  it('should simulate strategic acquisition exit with returns and waterfall distribution', async () => {
    const repo = new VentureCapitalRepository();
    const exitService = new ExitStrategyService(repo);

    const simulation = await exitService.simulateExit('fund-seed-1', 'startup-seed-1', {
      exitType: ExitType.STRATEGIC_ACQUISITION,
      simulatedExitValuationUsd: 150000000,
      targetAcquirerOrExchange: 'BigTech Global Cloud',
      timelineMonths: 18,
    });

    assert.ok(simulation);
    assert.strictEqual(simulation.fundId, 'fund-seed-1');
    assert.strictEqual(simulation.startupId, 'startup-seed-1');
    assert.strictEqual(simulation.exitType, ExitType.STRATEGIC_ACQUISITION);
    assert.strictEqual(simulation.simulatedExitValuationUsd, 150000000);
    assert.strictEqual(simulation.expectedProceedsUsd, 27750000); // 18.5% of $150M
    assert.strictEqual(simulation.fundReturnMultiple, 11.1); // 27.75M / 2.5M
    assert.strictEqual(simulation.netProfitUsd, 25250000);
    assert.strictEqual(simulation.carryGeneratedUsd, 5050000); // 20% of 25.25M
    assert.ok(simulation.waterfallSummary.length >= 4);

    const capitalReturnTier = simulation.waterfallSummary.find((t) => t.tier.includes('Return of Invested Capital'));
    assert.ok(capitalReturnTier);
    assert.strictEqual(capitalReturnTier.amountUsd, 2500000);

    const carryTier = simulation.waterfallSummary.find((t) => t.tier.includes('Carried Interest'));
    assert.ok(carryTier);
    assert.strictEqual(carryTier.amountUsd, 5050000);
  });

  it('should forecast multi-horizon liquidity scenarios for 12, 24, and 36 months', async () => {
    const repo = new VentureCapitalRepository();
    const exitService = new ExitStrategyService(repo);

    const forecasts = await exitService.forecastLiquidity('fund-seed-1');

    assert.ok(Array.isArray(forecasts));
    assert.strictEqual(forecasts.length, 3);

    const m12 = forecasts.find((f) => f.timeframeMonths === 12);
    const m24 = forecasts.find((f) => f.timeframeMonths === 24);
    const m36 = forecasts.find((f) => f.timeframeMonths === 36);

    assert.ok(m12 && m24 && m36);
    assert.ok(m12.projectedLiquidityUsd > 0);
    assert.ok(m24.projectedLiquidityUsd > m12.projectedLiquidityUsd);
    assert.ok(m36.projectedLiquidityUsd > m24.projectedLiquidityUsd);
  });
});
