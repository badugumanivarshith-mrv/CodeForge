import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VentureCapitalRepository } from '../../src/repositories/VentureCapitalRepository';
import { InvestorNetworkService } from '../../src/modules/venture-capital';
import { StartupCategory, SyndicateRole } from '@codeforge/shared';

describe('Phase 21: Investor Network & LP Syndicates Unit Tests', () => {
  it('should register LP profile with check limits and preferred sectors', async () => {
    const repo = new VentureCapitalRepository();
    const lpService = new InvestorNetworkService(repo);

    const lp = await lpService.registerLpProfile({
      lpName: 'Nordic Tech Endowment',
      lpType: 'ENDOWMENT',
      committedTotalUsd: 40000000,
      preferredSectors: [StartupCategory.AI_DEVTOOLS, StartupCategory.ENTERPRISE_INFRA],
      targetCheckSizeMinUsd: 1000000,
      targetCheckSizeMaxUsd: 10000000,
      coInvestmentAppetite: true,
      contactEmail: 'allocations@nordictendowment.org',
    });

    assert.ok(lp);
    assert.strictEqual(lp.lpName, 'Nordic Tech Endowment');
    assert.strictEqual(lp.committedTotalUsd, 40000000);
    assert.strictEqual(lp.relationshipHealth, 95.0);
    assert.strictEqual(lp.coInvestmentAppetite, true);
  });

  it('should form syndicate group and aggregate commitments', async () => {
    const repo = new VentureCapitalRepository();
    const lpService = new InvestorNetworkService(repo);

    const syndicate = await lpService.createSyndicateGroup({
      syndicateName: 'Global AI Super-Syndicate I',
      targetRaiseUsd: 5000000,
      dealId: 'deal-test-1',
      leadInvestorId: 'lead-gp-1',
      leadCarryPercent: 5.0,
      members: [
        {
          lpId: 'lp-1',
          lpName: 'Sovereign Innovation Fund',
          allocatedAmountUsd: 3000000,
          role: SyndicateRole.CO_LEAD,
          confirmed: true,
        },
        {
          lpId: 'lp-2',
          lpName: 'Venture Horizons Family Office',
          allocatedAmountUsd: 2000000,
          role: SyndicateRole.PARTICIPANT,
          confirmed: true,
        },
      ],
    });

    assert.ok(syndicate);
    assert.strictEqual(syndicate.syndicateName, 'Global AI Super-Syndicate I');
    assert.strictEqual(syndicate.committedTotalUsd, 5000000);
    assert.strictEqual(syndicate.members.length, 2);
    assert.strictEqual(syndicate.leadCarryPercent, 5.0);
  });

  it('should match prospective LP co-investors by sector and check size criteria', async () => {
    const repo = new VentureCapitalRepository();
    const lpService = new InvestorNetworkService(repo);

    const matches = await lpService.matchLpCoInvestors({
      targetAmountUsd: 4000000,
      category: StartupCategory.AI_DEVTOOLS,
    });

    assert.ok(Array.isArray(matches));
    assert.ok(matches.length > 0);
    assert.ok(matches.every((m) => m.coInvestmentAppetite));
  });
});
