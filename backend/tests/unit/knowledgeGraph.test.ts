import { test, describe } from 'node:test';
import assert from 'node:assert';
import { KnowledgeGraphService } from '../../src/modules/agents/knowledgeGraphService';
import { KnowledgeNodeType, KnowledgeRelationType } from '@codeforge/shared';

describe('Semantic Knowledge Graph Unit Tests', () => {
  const createMockRepo = () => {
    const nodes = new Map<string, any>();
    const edges = new Map<string, any>();

    return {
      nodes,
      edges,
      async createNode(userId: string, data: any) {
        const node = {
          id: `node-${Date.now()}-${Math.random()}`,
          userId,
          name: data.name,
          nodeType: data.nodeType,
          category: data.category || 'General',
          properties: data.properties || {},
          confidenceScore: data.confidenceScore || 90,
          createdAt: new Date().toISOString(),
        };
        nodes.set(node.id, node);
        return node;
      },
      async listNodes(userId: string) {
        return Array.from(nodes.values()).filter(n => n.userId === userId);
      },
      async deleteNode(nodeId: string, userId: string) {
        const n = nodes.get(nodeId);
        if (n && n.userId === userId) {
          nodes.delete(nodeId);
          return true;
        }
        return false;
      },
      async createEdge(userId: string, data: any) {
        const edge = {
          id: `edge-${Date.now()}-${Math.random()}`,
          userId,
          sourceNodeId: data.sourceNodeId,
          targetNodeId: data.targetNodeId,
          relationType: data.relationType,
          weight: data.weight || 1.0,
          metadata: data.metadata || {},
          createdAt: new Date().toISOString(),
        };
        edges.set(edge.id, edge);
        return edge;
      },
      async listEdges(userId: string) {
        return Array.from(edges.values()).filter(e => e.userId === userId);
      },
      async deleteEdge(edgeId: string, userId: string) {
        const e = edges.get(edgeId);
        if (e && e.userId === userId) {
          edges.delete(edgeId);
          return true;
        }
        return false;
      },
      async getKnowledgeGraph(userId: string) {
        const userNodes = Array.from(nodes.values()).filter(n => n.userId === userId);
        const userEdges = Array.from(edges.values()).filter(e => e.userId === userId);
        const totalNodes = userNodes.length;
        const totalEdges = userEdges.length;
        const density = totalNodes > 1 ? Number((totalEdges / (totalNodes * (totalNodes - 1))).toFixed(4)) : 0;
        const topConcepts = userNodes.slice(0, 5).map(n => n.name);
        return {
          nodes: userNodes,
          edges: userEdges,
          stats: { totalNodes, totalEdges, density, topConcepts },
        };
      },
    };
  };

  test('1. initializes starter knowledge graph with concepts, skills, and semantic edges', async () => {
    const mockRepo = createMockRepo();
    const service = new KnowledgeGraphService(mockRepo as any);

    const graph = await service.initializeDefaultKnowledgeGraph('user-kg-1');
    assert.ok(graph.nodes.length >= 6);
    assert.ok(graph.edges.length >= 4);

    const names = graph.nodes.map(n => n.name);
    assert.ok(names.includes('Distributed Consensus'));
    assert.ok(names.includes('Raft Protocol'));
    assert.ok(names.includes('Rust Async Runtime'));
  });

  test('2. calculates correct graph density and top concepts stats', async () => {
    const mockRepo = createMockRepo();
    const service = new KnowledgeGraphService(mockRepo as any);

    const graph = await service.getGraph('user-kg-2');
    assert.ok(graph.stats.totalNodes >= 6);
    assert.ok(graph.stats.totalEdges >= 4);
    assert.ok(graph.stats.density >= 0);
    assert.ok(graph.stats.topConcepts.length > 0);
  });

  test('3. extracts conceptual entities from text and creates complementary edges', async () => {
    const mockRepo = createMockRepo();
    const service = new KnowledgeGraphService(mockRepo as any);
    await service.initializeDefaultKnowledgeGraph('user-kg-3');

    const result = await service.extractAndLinkEntities(
      'user-kg-3',
      'Exploring WebAssembly WASI runtimes and eBPF kernel probes for low-latency tracing'
    );

    assert.ok(result.nodesAdded >= 2);
    assert.ok(result.edgesAdded >= 2);
  });

  test('4. diagnoses missing prerequisite skills for target role', async () => {
    const mockRepo = createMockRepo();
    const service = new KnowledgeGraphService(mockRepo as any);

    const gaps = await service.findSkillGaps('user-kg-4', 'Staff Systems Architect');
    assert.strictEqual(gaps.targetRole, 'Staff Systems Architect');
    assert.ok(Array.isArray(gaps.missingPrerequisites));
    assert.ok(gaps.readinessScore >= 0 && gaps.readinessScore <= 100);
  });

  test('5. creates explicit nodes and edges with weights', async () => {
    const mockRepo = createMockRepo();
    const service = new KnowledgeGraphService(mockRepo as any);

    const nodeA = await service.addNode('user-kg-5', {
      name: 'Memory Mapping (mmap)',
      nodeType: KnowledgeNodeType.SKILL,
      category: 'Storage',
      properties: {},
      confidenceScore: 92,
    });

    const nodeB = await service.addNode('user-kg-5', {
      name: 'Zero-Copy I/O',
      nodeType: KnowledgeNodeType.CONCEPT,
      category: 'Operating Systems',
      properties: {},
      confidenceScore: 95,
    });

    const edge = await service.addEdge('user-kg-5', {
      sourceNodeId: nodeA.id,
      targetNodeId: nodeB.id,
      relationType: KnowledgeRelationType.ENABLES,
      weight: 0.95,
    });

    assert.strictEqual(edge.relationType, KnowledgeRelationType.ENABLES);
    assert.strictEqual(edge.weight, 0.95);
  });

  test('6. deletes knowledge nodes and edges', async () => {
    const mockRepo = createMockRepo();
    const service = new KnowledgeGraphService(mockRepo as any);

    const node = await service.addNode('user-kg-6', {
      name: 'Temporary Node',
      nodeType: KnowledgeNodeType.CONCEPT,
      category: 'Temp',
      properties: {},
      confidenceScore: 50,
    });

    const deleted = await service.deleteNode(node.id, 'user-kg-6');
    assert.strictEqual(deleted, true);
  });

  test('7. isolates knowledge graphs per user', async () => {
    const mockRepo = createMockRepo();
    const service = new KnowledgeGraphService(mockRepo as any);

    await service.addNode('user-A', {
      name: 'Private Architecture',
      nodeType: KnowledgeNodeType.CONCEPT,
      category: 'Private',
      properties: {},
      confidenceScore: 99,
    });

    const userBGraph = await service.getGraph('user-B');
    const hasUserANode = userBGraph.nodes.some(n => n.name === 'Private Architecture');
    assert.strictEqual(hasUserANode, false);
  });
});
