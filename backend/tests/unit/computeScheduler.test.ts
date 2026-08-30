import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AICloudRepository } from '../../src/repositories/AICloudRepository';
import { ComputeSchedulerService } from '../../src/modules/ai-cloud/computeSchedulerService';
import { ComputeNodeType, ComputeNodeStatus } from '@codeforge/shared';

describe('Phase 24: Compute Scheduler Service Unit Tests', () => {
  it('should allocate idle nodes or provision virtual units when empty', async () => {
    const repo = new AICloudRepository();
    const service = new ComputeSchedulerService(repo);

    // Schedule node 1
    const node1 = await service.scheduleNode('cluster-seed-1', ComputeNodeType.GPU_H100);
    assert.ok(node1);
    assert.strictEqual(node1.status, ComputeNodeStatus.BUSY);
    assert.strictEqual(node1.nodeType, ComputeNodeType.GPU_H100);

    // Release node
    await service.releaseNode(node1.id);
    const released = await repo.getNodeById(node1.id);
    assert.strictEqual(released?.status, ComputeNodeStatus.IDLE);
  });
});
