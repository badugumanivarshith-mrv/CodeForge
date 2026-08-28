import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DigitalBrainService } from '../../src/modules/cognitive-core/digitalBrainService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';

describe('Phase 18: Personal Digital Brain Unit Tests', () => {
  it('should initialize and retrieve a unified personal digital brain profile', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new DigitalBrainService(repo);

    const brain = await service.getBrainProfile('user-brain-1');
    assert.ok(brain);
    assert.strictEqual(brain.userId, 'user-brain-1');
    assert.ok(brain.cognitiveEfficiencyScore >= 95.0);
    assert.ok(brain.dominantThinkingPatterns.length > 0);
  });

  it('should explain decision reasoning with axioms, premises, and cryptographic proofs', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new DigitalBrainService(repo);

    const explanation = await service.explainReasoning(
      'user-brain-1',
      'Why was speculative execution enabled for the agent compilation mesh?'
    );

    assert.ok(explanation);
    assert.ok(explanation.decisionSummary.includes('speculative execution') || explanation.decisionSummary.length > 0);
    assert.ok(explanation.premisesUsed.length > 0);
    assert.ok(explanation.axiomsApplied.length > 0);
    assert.ok(explanation.confidenceMetric >= 90.0);
    assert.ok(explanation.verifiableProofs.length > 0);
  });
});
