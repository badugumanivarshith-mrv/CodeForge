import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { VentureCapitalRepository } from '../../src/repositories/VentureCapitalRepository';
import { InvestmentCommitteeService } from '../../src/modules/venture-capital';
import { CommitteeType, InvestmentRecommendation } from '@codeforge/shared';

describe('Phase 21: Investment Committee AI Unit Tests', () => {
  it('should simulate multi-agent debate across Partner, Technical, Market, and Financial committees', async () => {
    const repo = new VentureCapitalRepository();
    const icService = new InvestmentCommitteeService(repo);

    const debates = await icService.simulateCommitteeDebate('deal-test-1', 'startup-test-1');

    assert.ok(Array.isArray(debates));
    assert.strictEqual(debates.length, 4);

    const partnerDebate = debates.find((d) => d.committeeType === CommitteeType.PARTNER_COMMITTEE);
    assert.ok(partnerDebate);
    assert.ok(partnerDebate.argumentsPro.length > 0);
    assert.ok(partnerDebate.agentPerspectives.length > 0);
    assert.ok(partnerDebate.synthesis.length > 0);
  });

  it('should cast committee votes, verify affirmative quorum, and formulate investment decision', async () => {
    const repo = new VentureCapitalRepository();
    const icService = new InvestmentCommitteeService(repo);

    const decision = await icService.castCommitteeVotes('deal-test-1', 'startup-test-1', 'fund-1');

    assert.ok(decision);
    assert.strictEqual(decision.dealId, 'deal-test-1');
    assert.strictEqual(decision.recommendation, InvestmentRecommendation.STRONG_INVEST);
    assert.strictEqual(decision.quorumMet, true);
    assert.ok(decision.totalVotes >= 4);
    assert.ok(decision.yesVotes >= 3);
    assert.ok(decision.convictionScore >= 90.0);
    assert.strictEqual(decision.proposedInvestmentUsd, 2500000);
    assert.strictEqual(decision.proposedValuationUsd, 12000000);
    assert.ok(decision.keyDebatePoints.length > 0);
    assert.ok(decision.consensusRationale.length > 0);
  });
});
