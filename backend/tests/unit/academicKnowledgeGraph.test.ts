import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ResearchUniversityRepository } from '../../src/repositories/ResearchUniversityRepository';
import { AcademicKnowledgeGraphService } from '../../src/modules/research-university/academicKnowledgeGraphService';
import { AcademicDepartment, KnowledgeNodeType } from '@codeforge/shared';

describe('Phase 22: Academic Knowledge Graph Unit Tests', () => {
  it('should index knowledge node with theorem lineage and outgoing connections', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new AcademicKnowledgeGraphService(repo);

    const node = await service.indexNode({
      nodeType: KnowledgeNodeType.THEOREM,
      canonicalName: 'Hamiltonian Invariance Theorem',
      domain: AcademicDepartment.MATHEMATICS,
      definition: 'States that total energy in a closed neuro-symbolic manifold remains invariant under continuous semantic transforms.',
      confidenceScore: 99.4,
      outgoingConnections: ['kn-transformer-arch'],
      evolutionLineage: ['Noether Theorem', 'Hamiltonian Mechanics', 'Hamiltonian Invariance Theorem'],
    });

    assert.ok(node);
    assert.ok(node.id);
    assert.strictEqual(node.canonicalName, 'Hamiltonian Invariance Theorem');
    assert.strictEqual(node.confidenceScore, 99.4);
    assert.strictEqual(node.evolutionLineage.length, 3);
  });

  it('should discover cross-disciplinary lineages and concept clusters', async () => {
    const repo = new ResearchUniversityRepository();
    const service = new AcademicKnowledgeGraphService(repo);

    const analysis = await service.discoverCrossDisciplinaryLineages();
    assert.ok(analysis);
    assert.ok(analysis.nodesCount >= 1);
    assert.ok(analysis.highestConfidenceTheorems.length >= 1);
    assert.ok(analysis.conceptClusters);
  });
});
