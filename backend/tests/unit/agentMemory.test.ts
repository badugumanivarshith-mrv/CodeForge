import { test, describe } from 'node:test';
import assert from 'node:assert';
import { AgentMemoryService } from '../../src/modules/agents/agentMemoryService';
import { MemoryType } from '@codeforge/shared';

describe('Personal Agent Memory System Unit Tests', () => {
  const createMockRepo = () => {
    const memories = new Map<string, any>();

    return {
      memories,
      async createMemory(userId: string, data: any) {
        const mem = {
          id: `mem-${Date.now()}-${Math.random()}`,
          userId,
          agentId: data.agentId,
          memoryType: data.memoryType,
          content: data.content,
          importanceScore: data.importanceScore,
          contextKey: data.contextKey,
          metadata: data.metadata || {},
          createdAt: new Date().toISOString(),
          lastAccessedAt: new Date().toISOString(),
        };
        memories.set(mem.id, mem);
        return mem;
      },
      async listMemories(userId: string, memoryType?: MemoryType, limit = 50) {
        let list = Array.from(memories.values()).filter(m => m.userId === userId);
        if (memoryType) list = list.filter(m => m.memoryType === memoryType);
        return list.sort((a, b) => b.importanceScore - a.importanceScore).slice(0, limit);
      },
      async searchMemories(userId: string, query: string, limit = 10) {
        return Array.from(memories.values())
          .filter(m => m.userId === userId && m.content.toLowerCase().includes(query.toLowerCase()))
          .sort((a, b) => b.importanceScore - a.importanceScore)
          .slice(0, limit);
      },
      async deleteMemory(memoryId: string, userId: string) {
        const m = memories.get(memoryId);
        if (m && m.userId === userId) {
          memories.delete(memoryId);
          return true;
        }
        return false;
      },
    };
  };

  test('1. stores memory with valid importance score and context key', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentMemoryService(mockRepo as any);

    const mem = await service.storeMemory(
      'user-mem-1',
      MemoryType.EPISODIC,
      'Raft Consensus',
      'User mastered split-brain partition recovery in Rust',
      85
    );

    assert.ok(mem.id);
    assert.strictEqual(mem.memoryType, MemoryType.EPISODIC);
    assert.strictEqual(mem.importanceScore, 85);
    assert.strictEqual(mem.contextKey, 'Raft Consensus');
  });

  test('2. clamps importance score between 10 and 100', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentMemoryService(mockRepo as any);

    const lowMem = await service.storeMemory(
      'user-mem-2',
      MemoryType.SEMANTIC,
      'Syntax',
      'Trivial typo',
      -5
    );
    assert.strictEqual(lowMem.importanceScore, 10);

    const highMem = await service.storeMemory(
      'user-mem-2',
      MemoryType.CAREER,
      'Staff Offer',
      'Received $240k offer from Datadog',
      150
    );
    assert.strictEqual(highMem.importanceScore, 100);
  });

  test('3. retrieves memories matching semantic search query', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentMemoryService(mockRepo as any);

    await service.storeMemory('user-mem-3', MemoryType.LONG_TERM, 'eBPF', 'Analyzed eBPF kernel bytecode verification', 90);
    await service.storeMemory('user-mem-3', MemoryType.LEARNING, 'Postgres', 'Indexed B-Tree performance bottlenecks', 80);

    const results = await service.retrieveContext('user-mem-3', 'eBPF');
    assert.strictEqual(results.length, 1);
    assert.ok(results[0].content.includes('eBPF'));
  });

  test('4. falls back to top memories by importance when query is empty', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentMemoryService(mockRepo as any);

    await service.storeMemory('user-mem-4', MemoryType.CAREER, 'Goal', 'Target Staff Engineer by Q4', 95);
    await service.storeMemory('user-mem-4', MemoryType.LEARNING, 'Concept', 'LSM compaction', 70);

    const top = await service.retrieveContext('user-mem-4', '');
    assert.strictEqual(top.length, 2);
    assert.strictEqual(top[0].importanceScore, 95);
  });

  test('5. summarizes episodic memories into executive briefing with retention score', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentMemoryService(mockRepo as any);

    await service.storeMemory('user-mem-5', MemoryType.EPISODIC, 'Distributed Systems', 'Completed Jepsen test suite', 85);
    await service.storeMemory('user-mem-5', MemoryType.EPISODIC, 'System Design', 'Designed rate limiter for 1M RPS', 90);

    const summary = await service.summarizeMemories('user-mem-5');
    assert.strictEqual(summary.totalMemoriesProcessed, 2);
    assert.ok(summary.keyThemes.includes('Distributed Systems'));
    assert.ok(summary.retentionScore >= 70);
  });

  test('6. prunes stale low-importance memories below threshold', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentMemoryService(mockRepo as any);

    await service.storeMemory('user-mem-6', MemoryType.EPISODIC, 'Low', 'Trivial debug log line', 25);
    await service.storeMemory('user-mem-6', MemoryType.LONG_TERM, 'High', 'Core architecture blueprint', 90);

    const result = await service.pruneStaleMemories('user-mem-6', 40);
    assert.strictEqual(result.prunedCount, 1);
    assert.strictEqual(result.remainingCount, 1);
  });

  test('7. isolates memories strictly by user id', async () => {
    const mockRepo = createMockRepo();
    const service = new AgentMemoryService(mockRepo as any);

    await service.storeMemory('user-A', MemoryType.CAREER, 'Secret', 'User A confidential roadmap', 90);
    const userBMemories = await service.listMemories('user-B');

    assert.strictEqual(userBMemories.length, 0);
  });
});
