import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ReasoningEngineService } from '../../src/modules/cognitive-core/reasoningEngineService';
import { MetacognitionService } from '../../src/modules/cognitive-core/metacognitionService';
import { SelfReflectionService } from '../../src/modules/cognitive-core/selfReflectionService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';
import { ReasoningStrategy, MetacognitionConfidence } from '@codeforge/shared';

describe('Phase 18: Reasoning Engine & Metacognition Unit Tests', () => {
  it('should execute first-principles reasoning trace with hypothesis tree and bias audit', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new ReasoningEngineService(repo);

    const result = await service.executeReasoningTrace({
      strategy: ReasoningStrategy.FIRST_PRINCIPLES,
      inputPrompt: 'Optimize distributed lock contention under 100k agent concurrent executions',
    });

    assert.ok(result.trace);
    assert.strictEqual(result.trace.strategy, ReasoningStrategy.FIRST_PRINCIPLES);
    assert.ok(result.trace.hypothesisTree.length >= 3);
    assert.ok(result.trace.confidenceScore >= 90.0);
    assert.ok(result.trace.biasAudits.length > 0);

    assert.ok(result.evaluation);
    assert.strictEqual(result.evaluation.confidenceTier, MetacognitionConfidence.CERTAIN);
  });

  it('should execute dialectic reasoning trace resolving thesis and antithesis', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new ReasoningEngineService(repo);

    const result = await service.executeReasoningTrace({
      strategy: ReasoningStrategy.DIALECTIC,
      inputPrompt: 'Monolithic execution fabric vs Decentralized agent swarm architecture',
    });

    assert.ok(result.trace);
    assert.strictEqual(result.trace.strategy, ReasoningStrategy.DIALECTIC);
    assert.ok(result.trace.synthesis.includes('dialectic synthesis') || result.trace.synthesis.includes('DIALECTIC'));
  });

  it('should perform self-reflection and extract actionable adjustments', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new SelfReflectionService(repo);

    const report = await service.generateReflection({
      entityType: 'agent',
      entityId: 'agent-chief-architect',
      recentActionSummaries: [
        'Validated 500 multi-tenant memory enclaves with 0 cross-leakage',
        'Refactored token compression pipeline for 2.1x speedup',
      ],
    });

    assert.ok(report);
    assert.strictEqual(report.entityId, 'agent-chief-architect');
    assert.ok(report.identifiedStrengths.length > 0);
    assert.ok(report.actionableAdjustments.length > 0);
    assert.ok(report.impactScore >= 90.0);
  });
});
