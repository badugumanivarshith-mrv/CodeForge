import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { StrategyEngineService } from '../../src/modules/cognitive-core/strategyEngineService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';
import { StrategicPriority, PredictionHorizon } from '@codeforge/shared';

describe('Phase 18: AI Strategy Engine Unit Tests', () => {
  it('should formulate strategic plan with milestones, resource allocation, and risk modeling', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new StrategyEngineService(repo);

    const plan = await service.createStrategicPlan({
      title: 'Planetary Autonomous Multi-Agent Swarm Orchestration',
      strategicNarrative: 'Scale global agent workforces across 5 regional intelligence clusters with unified cognitive memory.',
      priority: StrategicPriority.CRITICAL,
      horizon: PredictionHorizon.ONE_YEAR,
    });

    assert.ok(plan);
    assert.strictEqual(plan.title, 'Planetary Autonomous Multi-Agent Swarm Orchestration');
    assert.strictEqual(plan.priority, StrategicPriority.CRITICAL);
    assert.ok(plan.milestones.length >= 3);
    assert.ok(plan.riskAssessments.length >= 2);
    assert.ok(plan.expectedRoiScore >= 90.0);
  });

  it('should list and retrieve strategic plans', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new StrategyEngineService(repo);

    await service.createStrategicPlan({
      title: 'Continuous Zero-Trust Memory Fabric Compression',
      strategicNarrative: 'Enable automatic Ebbinghaus consolidation loops on all tenant memory banks.',
    });

    const list = await service.listStrategicPlans();
    assert.ok(list.length >= 1);
  });
});
