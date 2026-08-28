import { test, describe } from 'node:test';
import assert from 'node:assert';
import { TaskOperatingSystemService } from '../../src/modules/agent-cloud/taskOperatingSystemService';
import { TaskOSPriority, TaskOSStatus } from '@codeforge/shared';

describe('AI Task Operating System Unit Tests', () => {
  const createMockRepo = () => {
    return {};
  };

  test('should create universal task graph nodes and calculate critical path plan', async () => {
    const mockRepo = createMockRepo();
    const service = new TaskOperatingSystemService(mockRepo as any);

    const task1 = await service.createTaskNode('user-1', {
      title: 'Design Zero-Trust Memory Isolation API',
      description: 'Define memory fabric RBAC schemas',
      priority: TaskOSPriority.CRITICAL,
      estimatedHours: 4,
    });

    const task2 = await service.createTaskNode('user-1', {
      title: 'Execute Memory Penetration & Concurrency Tests',
      description: 'Validate multi-tenant isolation under simulated adversarial access',
      priority: TaskOSPriority.HIGH,
      estimatedHours: 6,
      dependencies: [task1.id],
    });

    assert.strictEqual(task1.title, 'Design Zero-Trust Memory Isolation API');
    assert.strictEqual(task2.dependencies[0], task1.id);

    await service.linkTasks('user-1', task1.id, task2.id, 'blocks');

    const plan = await service.generateSmartPlan('user-1');
    assert.strictEqual(plan.totalEstimatedHours, 10);
    assert.strictEqual(plan.criticalPath.length, 2);
    assert.strictEqual(plan.edges.length, 1);
  });
});
