import { test, describe } from 'node:test';
import assert from 'node:assert';
import { ExecutionFabricService } from '../../src/modules/agent-cloud/executionFabricService';

describe('AI Execution Fabric Unit Tests', () => {
  const createMockRepo = () => {
    return {};
  };

  test('should invoke tools and record quota consumption in execution fabric', async () => {
    const mockRepo = createMockRepo();
    const service = new ExecutionFabricService(mockRepo as any);

    const tools = service.listAvailableTools();
    assert.ok(tools.length >= 4);

    const result = await service.invokeTool('user-1', {
      toolName: 'code_sandbox_execute',
      parameters: { code: 'console.log("Autonomous Fabric");', language: 'typescript' },
    });

    assert.strictEqual(result.success, true);
    assert.strictEqual(result.result.status, 'success');
    assert.ok(result.durationMs >= 0);

    const quota = await service.getOrCreateQuota('user-1');
    assert.ok(quota.usedMonthlyTokens > 0);
    assert.ok(quota.usedDailyRuns > 0);

    const task = service.enqueueDistributedTask('high_priority_workforce', 1, { action: 'deploy_agent' });
    assert.ok(task.id);
    assert.strictEqual(task.status, 'queued');

    const processed = await service.processNextQueuedTask();
    assert.ok(processed);
    assert.strictEqual(processed?.status, 'completed');
  });
});
