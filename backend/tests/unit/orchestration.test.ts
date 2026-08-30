import { test, describe } from 'node:test';
import assert from 'node:assert';
import { OrchestrationService } from '../../src/modules/platform-integration/orchestrationService';
import { CrossModuleWorkflowService } from '../../src/modules/platform-integration/crossModuleWorkflowService';
import { PlatformIntegrationRepository } from '../../src/repositories/PlatformIntegrationRepository';
import { CrossModuleWorkflowStatus, OrchestrationStepStatus } from '@codeforge/shared';

describe('Phase 28: Orchestration Service Unit Tests', () => {
  const repo = new PlatformIntegrationRepository();
  const workflowService = new CrossModuleWorkflowService(repo);
  const orchestrationService = new OrchestrationService(repo);

  test('should trigger workflow execution step status change and complete workflow', async () => {
    const execution = await workflowService.initiateWorkflow('test-user-id', {
      workflowName: 'Ecosystem Scan Pipeline',
      triggerEvent: 'Schedule Cron Time Trigger',
      steps: [
        { stepNumber: 1, moduleName: 'Cybersecurity', actionTaken: 'Check WAF Rules' },
      ],
    });

    assert.ok(execution.id);
    assert.strictEqual(execution.status, CrossModuleWorkflowStatus.ACTIVE);

    const updated = await orchestrationService.orchestrateStep(execution.id, 1, true);
    assert.strictEqual(updated.status, CrossModuleWorkflowStatus.COMPLETED);
    assert.strictEqual(updated.executedSteps[0].status, OrchestrationStepStatus.SUCCESS);
  });
});
