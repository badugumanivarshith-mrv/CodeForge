import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VentureCapitalRepository } from '../../src/repositories/VentureCapitalRepository';
import { FundManagementService } from '../../src/modules/venture-capital';
import { FundType, FundStatus, StartupCategory, StartupStage } from '@codeforge/shared';

describe('Phase 21: Fund Management System Unit Tests', () => {
  it('should create new fund vehicle and track target size and management fees', async () => {
    const repo = new VentureCapitalRepository();
    const fundService = new FundManagementService(repo);

    const fund = await fundService.createFund({
      fundName: 'Alpha Horizon Early Stage Fund II',
      fundType: FundType.VENTURE_FUND,
      targetSizeUsd: 150000000,
      vintageYear: 2026,
      managementFeePercent: 2.0,
      carriedInterestPercent: 20.0,
    });

    assert.ok(fund);
    assert.strictEqual(fund.fundName, 'Alpha Horizon Early Stage Fund II');
    assert.strictEqual(fund.targetSizeUsd, 150000000);
    assert.strictEqual(fund.status, FundStatus.ACTIVELY_DEPLOYING);
    assert.strictEqual(fund.managementFeePercent, 2.0);
    assert.strictEqual(fund.carriedInterestPercent, 20.0);
  });

  it('should deploy capital into target venture holding and update fund deployed/reserve balances', async () => {
    const repo = new VentureCapitalRepository();
    const fundService = new FundManagementService(repo);

    const fund = await fundService.createFund({
      fundName: 'DeployTest Fund',
      targetSizeUsd: 50000000,
    });

    const { fund: updatedFund, holding } = await fundService.deployCapital({
      fundId: fund.id,
      startupId: 'startup-test-deploy',
      startupName: 'Synthetix Cloud AI',
      amountUsd: 2000000,
      ownershipPercent: 20.0,
      valuationUsd: 10000000,
      category: StartupCategory.ENTERPRISE_INFRA,
      stage: StartupStage.MVP,
      boardSeat: true,
      proRataRights: true,
    });

    assert.ok(holding);
    assert.strictEqual(holding.fundId, fund.id);
    assert.strictEqual(holding.startupName, 'Synthetix Cloud AI');
    assert.strictEqual(holding.initialInvestedUsd, 2000000);
    assert.strictEqual(holding.ownershipPercent, 20.0);
    assert.strictEqual(holding.holdingValueUsd, 2000000);
    assert.strictEqual(holding.boardSeat, true);

    assert.ok(updatedFund);
    assert.strictEqual(updatedFund.deployedCapitalUsd, 2000000);
    assert.strictEqual(updatedFund.activeHoldingsCount, 1);
  });

  it('should compute fund metrics including DPI, RVPI, TVPI, Gross/Net IRR, and MOIC', async () => {
    const repo = new VentureCapitalRepository();
    const fundService = new FundManagementService(repo);

    const fund = await fundService.getFund('fund-seed-1');
    assert.ok(fund);

    const metrics = await fundService.calculateFundPerformance(fund.id);
    assert.ok(metrics);
    assert.strictEqual(metrics.fundId, fund.id);
    assert.ok(metrics.tvpi >= 1.0);
    assert.ok(metrics.moic >= 1.0);
    assert.ok(metrics.grossIrrPercent > 0);
    assert.ok(metrics.netIrrPercent > 0);
    assert.ok(metrics.grossIrrPercent > metrics.netIrrPercent);
  });
});
