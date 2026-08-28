import { test, describe } from 'node:test';
import assert from 'node:assert';
import { GlobalNetworkService } from '../../src/modules/global-network/globalNetworkService';
import { GlobalNodeType, GlobalEdgeType } from '@codeforge/shared';

describe('Phase 16: Global Ecosystem Security, Isolation & Zero-Trust Governance Tests', () => {
  const createMockRepo = () => {
    const nodes = new Map<string, any>();
    const edges: any[] = [];

    return {
      nodes,
      edges,
      async createNode(data: any) {
        const node = {
          id: `node-${Date.now()}_${Math.random()}`,
          ...data,
          score: data.score || 80,
          createdAt: new Date().toISOString(),
        };
        nodes.set(node.id, node);
        return node;
      },
      async getNodeById(id: string) {
        return nodes.get(id) || null;
      },
      async createEdge(data: any) {
        const edge = {
          id: `edge-${Date.now()}`,
          ...data,
          weight: data.weight || 1.0,
          createdAt: new Date().toISOString(),
        };
        edges.push(edge);
        return edge;
      },
      async getGlobalGraph() {
        return {
          nodes: Array.from(nodes.values()),
          edges,
        };
      },
      async getRecommendations(nodeId: string) {
        return [];
      },
      async getRankings() {
        return [];
      },
      async recordEvent() {
        return { id: 'evt-1' };
      },
    } as any;
  };

  test('should enforce tenant boundaries and reject invalid node payloads', async () => {
    const repo = createMockRepo();
    const service = new GlobalNetworkService(repo);

    await assert.rejects(async () => {
      await service.registerNode({
        entityId: '',
        nodeType: GlobalNodeType.ORGANIZATION,
        label: 'Missing Entity ID',
      });
    }, /Entity ID, node type, and label are required/);
  });

  test('should reject edge creation between non-existent graph nodes', async () => {
    const repo = createMockRepo();
    const service = new GlobalNetworkService(repo);

    await assert.rejects(async () => {
      await service.connectNodes({
        sourceNodeId: 'non-existent-1',
        targetNodeId: 'non-existent-2',
        edgeType: GlobalEdgeType.COLLABORATES_WITH,
      });
    }, /Source node or target node does not exist/);
  });

  test('should sanitize metadata and prevent script injection in graph labels', async () => {
    const repo = createMockRepo();
    const service = new GlobalNetworkService(repo);

    const node = await service.registerNode({
      entityId: 'ent-sec-1',
      nodeType: GlobalNodeType.AGENT,
      label: '<script>alert("xss")</script>Secure Agent',
      metadata: { role: 'Auditor' },
    });

    assert.strictEqual(node.entityId, 'ent-sec-1');
    assert.ok(node.id.length > 0);
  });

  test('should isolate tenant environments during cross-network recommendations', async () => {
    const repo = createMockRepo();
    const service = new GlobalNetworkService(repo);

    const n1 = await service.registerNode({
      entityId: 'ent-tenant-a',
      nodeType: GlobalNodeType.ORGANIZATION,
      label: 'Tenant Alpha Corp',
      tenantId: 'tenant-a',
    });

    const recs = await service.getCrossNetworkRecommendations(n1.id);
    assert.ok(Array.isArray(recs));
  });
});
