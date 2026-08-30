import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchUniversityRepository } from '../../src/repositories/ResearchUniversityRepository';
import { ScientificDiscoveryService } from '../../src/modules/research-university/scientificDiscoveryService';
import { AcademicDepartment, HypothesisStatus, DiscoverySignificance } from '@codeforge/shared';

describe('Phase 22: Scientific Discovery & Hypothesis Engine Unit Tests', () => {
  it('should formulate hypothesis with computed novelty and feasibility scores', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new ScientificDiscoveryService(repo);

    const hypothesis = await service.formulateHypothesis({
      programId: 'prog-quantum-ai',
      statement: 'Applying geometric deep learning over Riemannian manifolds eliminates catastrophic forgetting in lifelong reasoning agents.',
      rationale: 'Riemannian geodesic constraints preserve topological curvature of past concept embeddings during parameter updates.',
      department: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
    });

    assert.ok(hypothesis);
    assert.ok(hypothesis.id);
    assert.strictEqual(hypothesis.status, HypothesisStatus.FORMULATED);
    assert.ok(hypothesis.noveltyScore >= 80.0);
    assert.ok(hypothesis.feasibilityScore >= 75.0);
    assert.ok(hypothesis.testPlan.length >= 3);
  });

  it('should test and confirm scientific discovery with breakthrough classification', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new ScientificDiscoveryService(repo);

    const hypothesis = await service.formulateHypothesis({
      programId: 'prog-quantum-ai',
      statement: 'Quantum error mitigation algorithms based on continuous tensor renormalization reduce decoherence in high-depth circuits.',
      rationale: 'Tensor tree networks truncate non-entangled subspace noise in real-time.',
      department: AcademicDepartment.ARTIFICIAL_INTELLIGENCE,
      noveltyScore: 97.5,
      feasibilityScore: 94.0,
    });

    const testing = await service.testHypothesis(hypothesis.id);
    assert.strictEqual(testing.status, HypothesisStatus.TESTING);

    const discovery = await service.confirmDiscovery({
      hypothesisId: hypothesis.id,
      programId: 'prog-quantum-ai',
      title: 'Decoherence Suppression via Continuous Tensor Renormalization',
      summary: 'Achieved 100x reduction in logical error rates on 1000-qubit circuit simulator.',
      noveltyScore: 98.0,
      reproducibilityIndex: 99.2,
    });

    assert.ok(discovery);
    assert.strictEqual(discovery.hypothesisId, hypothesis.id);
    assert.strictEqual(discovery.significance, DiscoverySignificance.PARADIGM_SHIFTING);
    assert.ok(discovery.empiricalEvidence.length >= 2);

    const allDiscoveries = await service.listDiscoveries('prog-quantum-ai');
    assert.ok(allDiscoveries.some((d) => d.id === discovery.id));
  });
});
