import { IPlatformIntegrationRepository } from '../../repositories/interfaces/IPlatformIntegrationRepository';
import { WorkflowExecutionDto, OrchestrationStepStatus, CrossModuleWorkflowStatus } from '@codeforge/shared';

export class OrchestrationService {
  constructor(private platformRepo: IPlatformIntegrationRepository) {}

  public async orchestrateStep(
    executionId: string,
    stepNumber: number,
    simulateSuccess = true
  ): Promise<WorkflowExecutionDto> {
    // Transition step status to running
    await this.platformRepo.updateWorkflowExecutionStep(executionId, stepNumber, OrchestrationStepStatus.RUNNING);

    const status = simulateSuccess ? OrchestrationStepStatus.SUCCESS : OrchestrationStepStatus.FAILED;
    const summary = simulateSuccess
      ? `Step ${stepNumber} completed execution successfully.`
      : `Step ${stepNumber} execution crashed.`;

    const updated = await this.platformRepo.updateWorkflowExecutionStep(executionId, stepNumber, status, summary);

    // If it is the final step, auto complete workflow status
    const allDone = updated.executedSteps.every((s) => s.status === OrchestrationStepStatus.SUCCESS);
    const anyFailed = updated.executedSteps.some((s) => s.status === OrchestrationStepStatus.FAILED);

    if (allDone) {
      await this.platformRepo.updateWorkflowStatus(executionId, CrossModuleWorkflowStatus.COMPLETED);
    } else if (anyFailed) {
      await this.platformRepo.updateWorkflowStatus(executionId, CrossModuleWorkflowStatus.FAILED);
    }

    const finalWf = await this.platformRepo.getWorkflowExecution(executionId);
    return finalWf!;
  }
}
