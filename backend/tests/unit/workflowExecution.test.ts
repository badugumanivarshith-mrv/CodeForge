import { test, describe } from 'node:test';
import assert from 'node:assert';
import { CrossModuleWorkflowService } from '../../src/modules/platform-integration/crossModuleWorkflowService';
import { PlatformIntegrationRepository } from '../../src/repositories/PlatformIntegrationRepository';
import { CrossModuleWorkflowStatus } from '@codeforge/shared';

describe('Phase 28: Cross Module Workflow Service Unit Tests', () => {
  const repo = new PlatformIntegrationRepository();
  const service = new CrossModuleWorkflowService(repo);

  test('should initiate, retrieve, and list cross-module workflows', async () => {
    const execution = await service.initiateWorkflow('user-test-id-1', {
      workflowName: 'Autopilot Cloud Deployment Scan',
      triggerEvent: 'Git Merge Tag Event',
      steps: [
        { stepNumber: 1, moduleName: 'Software Factory', actionTaken: 'Validate Invariant Proofs' },
        { stepNumber: 2, moduleName: 'AI Cloud', actionTaken: 'Deploy Image to Zone A' },
      ],
    });

    assert.ok(execution.id);
    assert.strictEqual(execution.workflowName, 'Autopilot Cloud Deployment Scan');
    assert.strictEqual(execution.status, CrossModuleWorkflowStatus.ACTIVE);

    const retrieved = await service.getWorkflow(execution.id);
    assert.ok(retrieved);
    assert.strictEqual(retrieved.workflowName, 'Autopilot Cloud Deployment Scan');

    const list = await service.listWorkflows('user-test-id-1');
    assert.strictEqual(list.length, 1);
  });
});
