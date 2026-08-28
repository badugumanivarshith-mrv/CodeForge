import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MemoryFabricService } from '../../src/modules/agent-cloud/memoryFabricService';
import { MemoryFabricType } from '@codeforge/shared';

describe('Memory Fabric 2.0 Unit Tests', () => {
  const createMockRepo = () => {
    const memories = new Map<string, any>();
    const shared = new Map<string, any>();
    return {
      memories,
      shared,
      async storeMemory(userId: string, data: any) {
        const item = {
          id: `mem_${Date.now()}_${Math.random()}`,
          userId,
          memoryType: data.memoryType,
          key: data.key,
          content: data.content,
          vectorEmbedding: data.vectorEmbedding || [],
          importance: data.importance || 1.0,
          metadata: data.metadata || {},
          accessCount: 0,
          lastAccessedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };
        memories.set(item.id, item);
        return item;
      },
      async findMemoryByKey(userId: string, key: string, agentId?: string | null) {
        return Array.from(memories.values()).find(m => m.userId === userId && m.key === key) || null;
      },
      async searchMemories(userId: string, query: string, memoryType?: MemoryFabricType, limit?: number) {
        let list = Array.from(memories.values()).filter(m => m.userId === userId);
        if (memoryType) {
          list = list.filter(m => m.memoryType === memoryType);
        }
        if (query) {
          list = list.filter(m => m.content.toLowerCase().includes(query.toLowerCase()) || m.key.toLowerCase().includes(query.toLowerCase()));
        }
        return list.slice(0, limit || 20);
      },
      async storeSharedMemory(scopeType: 'team' | 'organization' | 'global', scopeId: string, key: string, value: string, contributorId: string) {
        const item = {
          id: `sh_${Date.now()}`,
          scopeType,
          scopeId,
          key,
          value,
          contributorId,
          updatedAt: new Date().toISOString(),
        };
        shared.set(`${scopeType}_${scopeId}_${key}`, item);
        return item;
      },
      async getSharedMemory(scopeType: string, scopeId: string, key: string) {
        return shared.get(`${scopeType}_${scopeId}_${key}`) || null;
      },
    };
  };

  test('should store, retrieve, and share memory records with permission controls', async () => {
    const mockRepo = createMockRepo();
    const service = new MemoryFabricService(mockRepo as any);

    const mem = await service.storeMemory('user-1', {
      memoryType: MemoryFabricType.ORGANIZATIONAL,
      key: 'system_architecture_guidelines',
      content: 'Multi-tenant schemas must use strict foreign key isolation and repository abstractions',
      importance: 1.8,
    });

    assert.strictEqual(mem.key, 'system_architecture_guidelines');
    assert.strictEqual(mem.importance, 1.8);

    const recalled = await service.recallMemory('user-1', 'system_architecture_guidelines');
    assert.strictEqual(recalled?.key, 'system_architecture_guidelines');

    const searchResults = await service.semanticSearch('user-1', { query: 'Multi-tenant schemas' });
    assert.strictEqual(searchResults.length, 1);
    assert.strictEqual(searchResults[0].key, 'system_architecture_guidelines');

    const shared = await service.storeSharedMemory('organization', 'tenant-enterprise-hq', 'org_mission', 'Pioneer AI workforce', 'user-1');
    assert.strictEqual(shared.key, 'org_mission');

    const compressed = await service.compressMemories('user-1', MemoryFabricType.ORGANIZATIONAL);
    assert.ok(compressed.summary);
    assert.strictEqual(compressed.compressedCount, 1);
  });
});
