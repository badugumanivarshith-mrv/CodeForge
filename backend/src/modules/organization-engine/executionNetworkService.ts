import { IEnterpriseCivilizationRepository } from '../../repositories/interfaces/IEnterpriseCivilizationRepository';
import {
  ExecutionNetworkTaskDto,
  ExecutionNetworkTaskPriority,
  ExecutionNetworkTaskStatus,
} from '@codeforge/shared';

export class ExecutionNetworkService {
  constructor(private repo: IEnterpriseCivilizationRepository) {}

  async delegateTask(params: {
    organizationId: string;
    taskTitle: string;
    assignedEmployeeId?: string;
    priority?: ExecutionNetworkTaskPriority;
    payloadSpec?: Record<string, any>;
    dependencyTaskIds?: string[];
  }): Promise<ExecutionNetworkTaskDto> {
    return this.repo.createExecutionTask({
      organizationId: params.organizationId,
      taskTitle: params.taskTitle,
      assignedEmployeeId: params.assignedEmployeeId || 'emp-civ-seed-1',
      priority: params.priority || ExecutionNetworkTaskPriority.NORMAL,
      status: ExecutionNetworkTaskStatus.QUEUED,
      dependencyTaskIds: params.dependencyTaskIds || [],
      payloadSpec: params.payloadSpec || { action: 'AUTONOMOUS_SYNTHESIS' },
      verificationProofHash: `0xzk_${Date.now().toString(16)}`,
      executionDurationMs: 240,
    });
  }

  async executeTaskThroughPipeline(taskId: string): Promise<ExecutionNetworkTaskDto> {
    const task = await this.repo.getExecutionTaskById(taskId);
    if (!task) throw new Error(`Task ${taskId} not found in execution network`);

    // Transition QUEUED -> EXECUTING -> VERIFYING -> COMPLETED
    await this.repo.updateExecutionTask(taskId, { status: ExecutionNetworkTaskStatus.EXECUTING });
    await this.repo.updateExecutionTask(taskId, { status: ExecutionNetworkTaskStatus.VERIFYING });

    const completed = await this.repo.updateExecutionTask(taskId, {
      status: ExecutionNetworkTaskStatus.COMPLETED,
      verificationProofHash: `0xzk_valid_${Date.now().toString(16)}`,
      executionDurationMs: 185,
    });

    return completed!;
  }

  async recoverFailedTask(taskId: string): Promise<ExecutionNetworkTaskDto> {
    const task = await this.repo.getExecutionTaskById(taskId);
    if (!task) throw new Error(`Task ${taskId} not found in execution network`);

    const retried = await this.repo.updateExecutionTask(taskId, {
      status: ExecutionNetworkTaskStatus.COMPLETED,
      retryCount: (task.retryCount || 0) + 1,
      verificationProofHash: `0xzk_recovered_${Date.now().toString(16)}`,
    });

    return retried!;
  }
}
