import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { CognitiveEngineService } from '../../src/modules/cognitive-core/cognitiveEngineService';
import { GoalManagementService } from '../../src/modules/cognitive-core/goalManagementService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';
import { StrategicPriority, PredictionHorizon } from '@codeforge/shared';

describe('Phase 18: Cognitive Core Engine Unit Tests', () => {
  it('should generate comprehensive executive command center 2.0 overview metrics', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new CognitiveEngineService(repo);

    const overview = await service.getExecutiveOverview('user-test-1');
    assert.ok(overview);
    assert.ok(overview.cognitiveHealthScore >= 95.0, 'Cognitive health score should be >= 95.0');
    assert.ok(overview.metacognitiveEfficiency >= 90.0);
    assert.ok(overview.topStrategicOpportunities.length > 0);
  });

  it('should evaluate cognitive health and report subsystem scores', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new CognitiveEngineService(repo);

    const health = await service.evaluateCognitiveHealth('user-test-1');
    assert.ok(health);
    assert.strictEqual(health.status, 'OPTIMAL');
    assert.ok(health.subsystemScores.reasoning >= 90);
    assert.ok(health.subsystemScores.memory >= 90);
  });

  it('should manage and decompose goals into subgoals recursively', async () => {
    const repo = new CognitiveCoreRepository();
    const goalService = new GoalManagementService(repo);

    const result = await goalService.createAndDecomposeGoal({
      userId: 'user-test-1',
      title: 'Architect Autonomous Code Synthesis Fabric',
      description: 'Implement dialectic multi-agent compiler pipelines',
      priority: StrategicPriority.CRITICAL,
      targetHorizon: PredictionHorizon.NINETY_DAYS,
      subgoalTitles: [
        'Design AST dialectic schema',
        'Implement speculative execution engine',
        'Integrate zero-knowledge memory validation',
      ],
    });

    assert.ok(result.goal);
    assert.strictEqual(result.goal.title, 'Architect Autonomous Code Synthesis Fabric');
    assert.strictEqual(result.subgoals.length, 3);
    assert.strictEqual(result.subgoals[0].sequenceOrder, 1);
  });
});
