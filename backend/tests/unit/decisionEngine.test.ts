import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ExecutiveDecisionEngineService } from '../../src/modules/agents/executiveDecisionEngineService';
import { DecisionType } from '@codeforge/shared';

describe('Executive Decision Engine Unit Tests', () => {
  const createMockRepo = () => {
    const decisions = new Map<string, any>();

    return {
      decisions,
      async createDecision(userId: string, data: any) {
        const dec = {
          id: `dec-${Date.now()}-${Math.random()}`,
          userId,
          decisionType: data.decisionType,
          title: data.title,
          contextData: data.contextData || {},
          optionsEvaluated: data.optionsEvaluated || [],
          recommendedAction: data.recommendedAction,
          riskScore: data.riskScore || 20,
          confidenceScore: data.confidenceScore || 85,
          expectedOutcomes: data.expectedOutcomes || [],
          createdAt: new Date().toISOString(),
        };
        decisions.set(dec.id, dec);
        return dec;
      },
      async getDecisionById(decisionId: string, userId: string) {
        const d = decisions.get(decisionId);
        if (d && d.userId === userId) return d;
        return null;
      },
      async listDecisions(userId: string) {
        return Array.from(decisions.values()).filter(d => d.userId === userId);
      },
      async deleteDecision(decisionId: string, userId: string) {
        const d = decisions.get(decisionId);
        if (d && d.userId === userId) {
          decisions.delete(decisionId);
          return true;
        }
        return false;
      },
    };
  };

  test('1. evaluates career transition dilemma with multi-criteria scoring', async () => {
    const mockRepo = createMockRepo();
    const service = new ExecutiveDecisionEngineService(mockRepo as any);

    const decision = await service.evaluateDecision('user-dec-1', {
      decisionType: DecisionType.CAREER_TRANSITION,
      title: 'Internal Promotion vs External Staff Role Offer',
    });

    assert.ok(decision.id);
    assert.strictEqual(decision.decisionType, DecisionType.CAREER_TRANSITION);
    assert.strictEqual(decision.optionsEvaluated.length, 2);
    assert.ok(decision.confidenceScore >= 80);
    assert.ok(decision.riskScore <= 35);
  });

  test('2. evaluates salary negotiation decision with risk and confidence scores', async () => {
    const mockRepo = createMockRepo();
    const service = new ExecutiveDecisionEngineService(mockRepo as any);

    const decision = await service.evaluateDecision('user-dec-2', {
      decisionType: DecisionType.SALARY_NEGOTIATION,
      title: 'Counter-Offer Strategy: Requesting $240k Base + Equity Refresher',
    });

    assert.strictEqual(decision.decisionType, DecisionType.SALARY_NEGOTIATION);
    assert.strictEqual(decision.confidenceScore, 94);
    assert.strictEqual(decision.riskScore, 18);
  });

  test('3. computes pros, cons, and alignment score for multiple options', async () => {
    const mockRepo = createMockRepo();
    const service = new ExecutiveDecisionEngineService(mockRepo as any);

    const decision = await service.evaluateDecision('user-dec-3', {
      decisionType: DecisionType.JOB_OFFER_EVALUATION,
      title: 'Comparing Series B Lead Offer vs Big Tech L5 Offer',
    });

    for (const opt of decision.optionsEvaluated) {
      assert.ok(opt.pros.length > 0);
      assert.ok(opt.cons.length > 0);
      assert.ok(opt.alignmentScore >= 80 && opt.alignmentScore <= 100);
      assert.ok(opt.projectedOutcome.length > 10);
    }
  });

  test('4. synthesizes clear recommended action with projected outcomes', async () => {
    const mockRepo = createMockRepo();
    const service = new ExecutiveDecisionEngineService(mockRepo as any);

    const decision = await service.evaluateDecision('user-dec-4', {
      decisionType: DecisionType.LEARNING_ROI,
      title: 'Pursue Rust Distributed Systems vs ML Ops Track',
    });

    assert.ok(decision.recommendedAction.includes('Recommend executing'));
    assert.ok(decision.expectedOutcomes.length >= 2);
  });

  test('5. handles custom option titles passed by the user', async () => {
    const mockRepo = createMockRepo();
    const service = new ExecutiveDecisionEngineService(mockRepo as any);

    const decision = await service.evaluateDecision('user-dec-5', {
      decisionType: DecisionType.SKILL_UPGRADE,
      title: 'Choose Next Specialty',
      options: [
        { title: 'Option Alpha: eBPF Kernel Observability' },
        { title: 'Option Beta: GPU CUDA Kernel Programming' },
      ],
    });

    assert.strictEqual(decision.optionsEvaluated[0].title, 'Option Alpha: eBPF Kernel Observability');
    assert.strictEqual(decision.optionsEvaluated[1].title, 'Option Beta: GPU CUDA Kernel Programming');
  });

  test('6. deletes decision evaluation record cleanly', async () => {
    const mockRepo = createMockRepo();
    const service = new ExecutiveDecisionEngineService(mockRepo as any);

    const decision = await service.evaluateDecision('user-dec-6', {
      decisionType: DecisionType.CAREER_TRANSITION,
      title: 'Temporary Decision',
    });

    const deleted = await service.deleteDecision(decision.id, 'user-dec-6');
    assert.strictEqual(deleted, true);

    const fetched = await service.getDecision(decision.id, 'user-dec-6');
    assert.strictEqual(fetched, null);
  });

  test('7. isolates executive decisions strictly per user', async () => {
    const mockRepo = createMockRepo();
    const service = new ExecutiveDecisionEngineService(mockRepo as any);

    await service.evaluateDecision('user-A', {
      decisionType: DecisionType.SALARY_NEGOTIATION,
      title: 'User A Secret Offer',
    });

    const userBDecisions = await service.listDecisions('user-B');
    assert.strictEqual(userBDecisions.length, 0);
  });
});
