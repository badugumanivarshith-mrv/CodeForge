import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryEvolutionService } from '../../src/modules/cognitive-core/memoryEvolutionService';
import { CognitiveCoreRepository } from '../../src/repositories/CognitiveCoreRepository';
import { CognitiveMemoryType } from '@codeforge/shared';

describe('Phase 18: Memory Evolution System Unit Tests', () => {
  it('should store and retrieve memories across 5 cognitive memory tiers', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new MemoryEvolutionService(repo);

    const episodic = await service.storeMemory({
      userId: 'user-mem-1',
      memoryType: CognitiveMemoryType.EPISODIC,
      conceptKey: 'Distributed Consensus Rollout Failure #42',
      content: 'Identified race condition during Byzantine node reboot sequence',
      contextSummary: 'Cluster replication stress test',
      importanceWeight: 1.8,
    });

    assert.ok(episodic);
    assert.strictEqual(episodic.memoryType, CognitiveMemoryType.EPISODIC);

    const semantic = await service.storeMemory({
      userId: 'user-mem-1',
      memoryType: CognitiveMemoryType.SEMANTIC,
      conceptKey: 'Raft Consensus Axiom',
      content: 'Leader election safety requires strict quorum intersection',
      contextSummary: 'Formal protocol specification',
      importanceWeight: 2.0,
    });

    assert.ok(semantic);
    assert.strictEqual(semantic.memoryType, CognitiveMemoryType.SEMANTIC);

    const list = await service.getMemories('user-mem-1');
    assert.strictEqual(list.length, 2);
  });

  it('should perform Ebbinghaus consolidation and knowledge synthesis', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new MemoryEvolutionService(repo);

    await service.storeMemory({
      userId: 'user-mem-2',
      memoryType: CognitiveMemoryType.PROCEDURAL,
      conceptKey: 'Compiler Pipeline Hot Swap',
      content: 'Atomic pointer swap on JIT instruction cache',
      contextSummary: 'Runtime performance optimization',
    });

    const report = await service.consolidateMemories('user-mem-2');
    assert.ok(report);
    assert.ok(report.consolidatedCount > 0);
    assert.ok(report.synthesizedConcepts.length > 0);
    assert.ok(report.knowledgeCoherenceScore >= 95.0);
  });

  it('should compress raw multi-turn context into dense semantic nodes', async () => {
    const repo = new CognitiveCoreRepository();
    const service = new MemoryEvolutionService(repo);

    const raw = `
      Step 1: User requested distributed lock architecture.
      Step 2: Explored Redlock vs Raft lease options.
      Step 3: Benchmarked lease renewal under 500ms network partitions.
      Step 4: Selected monotonic epoch fenced leases.
    `;

    const compressed = await service.compressContext(raw);
    assert.ok(compressed);
    assert.ok(compressed.compressedContext.includes('[SEMANTIC-NODE]'));
    assert.ok(compressed.compressionRatio <= 0.7);
  });
});
