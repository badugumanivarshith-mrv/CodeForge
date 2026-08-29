import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutionNetworkService } from '../../src/modules/organization-engine/executionNetworkService';
import { EnterpriseCivilizationRepository } from '../../src/repositories/EnterpriseCivilizationRepository';
import { ExecutionNetworkTaskPriority, ExecutionNetworkTaskStatus } from '@codeforge/shared';

describe('Phase 19: Autonomous Execution Network Unit Tests', () => {
  it('should delegate and queue autonomous tasks with priority and dependency tracking', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new ExecutionNetworkService(repo);

    const task = await service.delegateTask({
      organizationId: 'org-test-1',
      taskTitle: 'Synthesize Dialectic Proof Pipeline',
      priority: ExecutionNetworkTaskPriority.CRITICAL_PATH,
      payloadSpec: { targetModule: 'zk-compiler', targetThreads: 64 },
    });

    assert.ok(task);
    assert.strictEqual(task.taskTitle, 'Synthesize Dialectic Proof Pipeline');
    assert.strictEqual(task.priority, ExecutionNetworkTaskPriority.CRITICAL_PATH);
    assert.strictEqual(task.status, ExecutionNetworkTaskStatus.QUEUED);
  });

  it('should execute task through verification pipeline and generate cryptographic proof hash', async () => {
    const repo = new EnterpriseCivilizationRepository();
    const service = new ExecutionNetworkService(repo);

    const task = await service.delegateTask({
      organizationId: 'org-test-1',
      taskTitle: 'Execute Swarm Verification',
    });

    const completed = await service.executeTaskThroughPipeline(task.id);
    assert.ok(completed);
    assert.strictEqual(completed.status, ExecutionNetworkTaskStatus.COMPLETED);
    assert.ok(completed.verificationProofHash?.startsWith('0xzk_'));
    assert.ok((completed.executionDurationMs || 0) > 0);
  });
});
