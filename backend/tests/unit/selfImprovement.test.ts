import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { SelfImprovementService } from '../../src/modules/cognitive-core/selfImprovementService';
import { LearningEvolutionService } from '../../src/modules/cognitive-core/learningEvolutionService';
import { CognitiveExecutionFabricService } from '../../src/modules/cognitive-core/cognitiveExecutionFabricService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';
import { SelfImprovementDomain } from '@codeforge/shared';

describe('Phase 18: Self-Improvement & Execution Fabric Unit Tests', () => {
  it('should trigger autonomous self-improvement optimization and record accuracy/latency gains', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new SelfImprovementService(repo);

    const improvement = await service.triggerOptimization({
      domain: SelfImprovementDomain.PROMPT_TOPOLOGY,
      componentName: 'Reasoning Prompt Kernel v4',
      optimizationType: 'Few-Shot Dialectic Embedding Injection',
    });

    assert.ok(improvement);
    assert.strictEqual(improvement.domain, SelfImprovementDomain.PROMPT_TOPOLOGY);
    assert.ok(improvement.accuracyDelta > 0);
    assert.ok(improvement.latencyReductionPercent > 0);
    assert.strictEqual(improvement.status, 'applied');
  });

  it('should execute closed-loop execution fabric (Execute -> Observe -> Reflect -> Improve -> Complete)', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new CognitiveExecutionFabricService(repo);

    const result = await service.runExecutionLoop('goal-loop-test-1', 3);
    assert.ok(result);
    assert.strictEqual(result.goalId, 'goal-loop-test-1');
    assert.strictEqual(result.hasSucceeded, true);
    assert.ok(result.observations.length >= 3);
    assert.ok(result.appliedImprovements!.length > 0);
  });

  it('should record reinforcement learning adaptations and mine failure patterns', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new LearningEvolutionService(repo);

    const adaptation = await service.recordAdaptation({
      domain: SelfImprovementDomain.AGENT_WEIGHTS,
      targetEntityId: 'agent-compiler-lead',
      prePerformance: 82.5,
      postPerformance: 96.0,
      adaptationSummary: 'Reinforced dialectic invariant verification weights.',
    });

    assert.ok(adaptation);
    assert.strictEqual(adaptation.performanceDelta, 13.5);

    const patterns = await service.mineFailurePatterns('agent-compiler-lead');
    assert.ok(patterns.patternsIdentified.length > 0);
    assert.ok(patterns.projectedGainPercent > 10.0);
  });
});
