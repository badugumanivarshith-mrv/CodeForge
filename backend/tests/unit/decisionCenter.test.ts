import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DecisionCenterService } from '../../src/modules/agent-cloud/decisionCenterService';
import { DecisionCenterStatus } from '@codeforge/shared';

describe('AI Decision Center Unit Tests', () => {
  const createMockRepo = () => {
    const decisions = new Map<string, any>();
    return {
      decisions,
      async createDecisionRecord(userId: string, data: any, analysis?: any) {
        const item = {
          id: `dec_${Date.now()}_${Math.random()}`,
          userId,
          title: data.title,
          context: data.context,
          options: analysis?.options || [],
          recommendedOptionId: analysis?.recommendedOptionId || null,
          executedOptionId: null,
          confidenceScore: analysis?.confidenceScore || 0.85,
          status: DecisionCenterStatus.DRAFT,
          roadmap: analysis?.roadmap || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        decisions.set(item.id, item);
        return item;
      },
      async getDecisionRecordById(id: string, userId: string) {
        return decisions.get(id) || null;
      },
      async listDecisionRecords(userId: string) {
        return Array.from(decisions.values()).filter(d => d.userId === userId);
      },
      async updateDecisionStatus(id: string, userId: string, status: DecisionCenterStatus, executedOptionId?: string | null) {
        const d = decisions.get(id);
        if (!d) return null;
        d.executedOptionId = executedOptionId || null;
        d.status = status;
        d.updatedAt = new Date().toISOString();
        return d;
      },
    };
  };

  test('should create decision, rank options, run scenario simulation, and execute decision pathway', async () => {
    const mockRepo = createMockRepo();
    const service = new DecisionCenterService(mockRepo as any);

    const decision = await service.createDecision('user-1', {
      title: 'Infrastructure Scaling Architecture',
      context: 'Evaluate scaling pathways for multi-agent workloads',
      options: [
        {
          title: 'Option A: Serverless Ephemeral Containers',
          description: 'Spin up on-demand worker instances per agent execution',
          pros: ['Zero idle cost', 'Infinite elasticity'],
          cons: ['Cold start latency'],
        },
        {
          title: 'Option B: Dedicated Node Pools with Pre-warmed Agents',
          description: 'Keep persistent agents warm in memory for instant reaction',
          pros: ['Sub-10ms response latency', 'Stable throughput'],
          cons: ['Higher baseline compute cost'],
        },
      ],
    });

    assert.ok(decision.id);
    assert.strictEqual(decision.status, DecisionCenterStatus.DRAFT);
    assert.ok(decision.recommendedOptionId);
    assert.ok(decision.confidenceScore > 0.8);

    const sim = await service.simulateScenarios(decision.id, 'High Load Surge');
    assert.strictEqual(sim.decisionId, decision.id);
    assert.ok(sim.simulatedOutcomes.length > 0);

    const executed = await service.executeDecision(decision.id, 'user-1', decision.options[0].optionId);
    assert.strictEqual(executed.status, DecisionCenterStatus.EXECUTED);
    assert.strictEqual(executed.executedOptionId, decision.options[0].optionId);
  });
});
