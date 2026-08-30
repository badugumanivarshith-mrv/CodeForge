import { test, describe } from 'node:test';
import assert from 'node:assert';
import { TaskDelegationService } from '../../src/modules/agent-ecosystem/taskDelegationService';
import { AgentEcosystemRepository } from '../../src/repositories/AgentEcosystemRepository';
import { AgentTaskStatus } from '@codeforge/shared';

describe('Phase 29: Task Delegation Service Unit Tests', () => {
  const repo = new AgentEcosystemRepository();
  const service = new TaskDelegationService(repo);

  test('should delegate tasks to agents and verify pending state', async () => {
    const task = await service.delegateTask('test-user-id', {
      assignedAgentId: 'agent-seed-1',
      taskDescription: 'Compute ZK spec dialectic check on Memory Fabric',
      inputParams: { blockRange: [1000, 2000] },
    });

    assert.ok(task.id);
    assert.strictEqual(task.assignedAgentId, 'agent-seed-1');
    assert.strictEqual(task.status, AgentTaskStatus.PENDING);

    const list = await service.fetchTasks('agent-seed-1');
    assert.ok(list.length > 0);
  });
});
