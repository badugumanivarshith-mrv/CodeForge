import { test, describe } from 'node:test';
import assert from 'node:assert';
import { KnowledgeFabricService } from '../../src/modules/agent-cloud/knowledgeFabricService';
import { KnowledgeGraphDomain } from '@codeforge/shared';

describe('Knowledge Fabric Unit Tests', () => {
  const createMockRepo = () => {
    const entities = new Map<string, any>();
    const edges = new Map<string, any>();
    return {
      entities,
      edges,
      async createKnowledgeEntity(data: any) {
        const entity = {
          id: `ent_${Date.now()}_${Math.random()}`,
          domain: data.domain,
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          entityType: data.entityType,
          description: data.description || '',
          properties: data.properties || {},
          centralityScore: 0.92,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        entities.set(entity.id, entity);
        return entity;
      },
      async createKnowledgeEdge(data: any) {
        const edge = {
          id: `edge_${Date.now()}_${Math.random()}`,
          sourceEntityId: data.sourceEntityId,
          targetEntityId: data.targetEntityId,
          relationType: data.relationType,
          weight: data.weight || 1.0,
          metadata: data.metadata || {},
          createdAt: new Date().toISOString(),
        };
        edges.set(edge.id, edge);
        return edge;
      },
      async getKnowledgeGraphByDomain(domain: KnowledgeGraphDomain) {
        return {
          entities: Array.from(entities.values()).filter(e => e.domain === domain),
          edges: Array.from(edges.values()),
        };
      },
    };
  };

  test('should create knowledge entities, link edges, and perform concept discovery and gap detection', async () => {
    const mockRepo = createMockRepo();
    const service = new KnowledgeFabricService(mockRepo as any);

    const ent1 = await service.createEntity({
      domain: KnowledgeGraphDomain.CAREER,
      name: 'Distributed Systems Architect',
      entityType: 'career_role',
      description: 'Senior architectural specialist designing high-throughput multi-agent fabrics',
    });

    const ent2 = await service.createEntity({
      domain: KnowledgeGraphDomain.CAREER,
      name: 'Raft & Paxos Consensus',
      entityType: 'core_skill',
      description: 'State machine replication and fault-tolerant distributed consensus',
    });

    const edge = await service.linkEntities({
      sourceEntityId: ent1.id,
      targetEntityId: ent2.id,
      relationType: 'requires_mastery_of',
      weight: 1.5,
    });

    assert.strictEqual(edge.sourceEntityId, ent1.id);
    assert.strictEqual(edge.targetEntityId, ent2.id);

    const graph = await service.getDomainGraph(KnowledgeGraphDomain.CAREER);
    assert.strictEqual(graph.entities.length, 2);
    assert.strictEqual(graph.edges.length, 1);

    const discovery = await service.discoverConcepts(KnowledgeGraphDomain.CAREER, 'Distributed Systems Architect');
    assert.ok(discovery.discoveredConcepts.length > 0);
    assert.strictEqual(discovery.domain, KnowledgeGraphDomain.CAREER);

    const gap = await service.detectKnowledgeGaps(KnowledgeGraphDomain.CAREER, 'Raft & Paxos Consensus');
    assert.strictEqual(gap.missingSkillOrConcept, 'Raft & Paxos Consensus');
    assert.ok(gap.suggestedAction);
  });
});
