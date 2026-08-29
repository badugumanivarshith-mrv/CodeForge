import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VentureCapitalRepository } from '../../src/repositories/VentureCapitalRepository';
import { CapitalAllocationService } from '../../src/modules/venture-capital';
import { AllocationStrategy } from '@codeforge/shared';

describe('Phase 21: Capital Allocation Engine Unit Tests', () => {
  it('should generate balanced capital allocation plan across new deals, reserves, and buffer', async () => {
    const repo = new VentureCapitalRepository();
    const allocService = new CapitalAllocationService(repo);

    const plan = await allocService.generateAllocationPlan('fund-seed-1', {
      strategy: AllocationStrategy.BALANCED,
    });

    assert.ok(plan);
    assert.strictEqual(plan.fundId, 'fund-seed-1');
    assert.strictEqual(plan.strategy, AllocationStrategy.BALANCED);
    assert.strictEqual(plan.targetFundSizeUsd, 100000000);
    assert.strictEqual(plan.newDealsAllocationUsd, 40000000); // 45% of 90M remaining after 10M deployed
    assert.strictEqual(plan.followOnReserveUsd, 41000000); // 45% + deployed
    assert.strictEqual(plan.contingencyBufferUsd, 9000000); // 10%
    assert.ok(Object.keys(plan.allocationsByStage).length >= 4);
    assert.ok(Object.keys(plan.allocationsBySector).length >= 4);
  });

  it('should optimize allocation plan favoring growth investments under GROWTH strategy', async () => {
    const repo = new VentureCapitalRepository();
    const allocService = new CapitalAllocationService(repo);

    const plan = await allocService.generateAllocationPlan('fund-seed-1', {
      strategy: AllocationStrategy.GROWTH_FOCUSED,
    });

    assert.ok(plan);
    assert.strictEqual(plan.strategy, AllocationStrategy.GROWTH_FOCUSED);
    assert.strictEqual(plan.newDealsAllocationUsd, 54000000); // 60% of 90M
    assert.strictEqual(plan.followOnReserveUsd, 37000000); // 30% of 90M + 10M
    assert.strictEqual(plan.contingencyBufferUsd, 9000000); // 10% of 90M
  });

  it('should optimize follow-on reserve modeling for portfolio holdings', async () => {
    const repo = new VentureCapitalRepository();
    const allocService = new CapitalAllocationService(repo);

    const reserves = await allocService.optimizeFollowOnReserves('fund-seed-1');

    assert.ok(Array.isArray(reserves));
    assert.ok(reserves.length > 0);

    const topReserve = reserves[0];
    assert.strictEqual(topReserve.startupId, 'startup-seed-1');
    assert.ok(topReserve.recommendedFollowOnUsd >= 2000000);
    assert.strictEqual(topReserve.convictionScore, 94.5);
    assert.strictEqual(topReserve.allocationTier, 'TOP_PRIORITY_RESERVE');
  });
});
