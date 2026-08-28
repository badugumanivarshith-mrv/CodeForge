import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CollectiveIntelligenceService } from '../../src/modules/global-network/collectiveIntelligenceService';
import { TrendCategory } from '@codeforge/shared';

describe('Phase 16: Collective Intelligence Engine Unit Tests', () => {
  const createMockRepo = () => {
    return {
      async recordEvent() {
        return { id: 'evt-1' };
      },
    } as any;
  };

  test('should submit crowd knowledge and track submission counts', async () => {
    const service = new CollectiveIntelligenceService(createMockRepo());
    const res1 = await service.submitCrowdKnowledge({
      topic: 'Vector Database Sharding',
      insight: 'Dynamic HNSW graph repartitioning yields 40% lower query latency at scale.',
      confidenceRating: 0.92,
      tags: ['vector-db', 'performance'],
    });

    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.topic, 'Vector Database Sharding');
    assert.strictEqual(res1.totalSubmissions, 1);
  });

  test('should synthesize consensus with high agreement percentage', async () => {
    const service = new CollectiveIntelligenceService(createMockRepo());
    await service.submitCrowdKnowledge({
      topic: 'Agentic Consensus',
      insight: 'Use Raft-like leases for multi-agent DAG task arbitration.',
      confidenceRating: 0.95,
      tags: ['agents', 'consensus'],
    });
    await service.submitCrowdKnowledge({
      topic: 'Agentic Consensus',
      insight: 'Quorum thresholds prevent state desynchronization.',
      confidenceRating: 0.91,
      tags: ['agents', 'resilience'],
    });

    const consensus = await service.synthesizeConsensus('Agentic Consensus');
    assert.strictEqual(consensus.topic, 'Agentic Consensus');
    assert.ok(consensus.consensusScore >= 80, 'Consensus score should be at least 80');
    assert.ok(consensus.bestPractices.length >= 2, 'Should include synthesized best practices');
  });

  test('should detect emerging trend signals across the network', async () => {
    const service = new CollectiveIntelligenceService(createMockRepo());
    const trends = await service.detectEmergingTrends();

    assert.ok(Array.isArray(trends));
    assert.ok(trends.length >= 4);
    const techTrend = trends.find(t => t.category === TrendCategory.EMERGING_TECH);
    assert.ok(techTrend, 'Should find EMERGING_TECH trend');
    assert.ok(techTrend.growthRatePercent > 0);
  });

  test('should validate required fields when submitting crowd knowledge', async () => {
    const service = new CollectiveIntelligenceService(createMockRepo());
    await assert.rejects(async () => {
      await service.submitCrowdKnowledge({
        topic: '',
        insight: 'test',
      });
    }, /Topic and insight are required/);
  });
});
