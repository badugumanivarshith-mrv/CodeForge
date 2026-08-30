import { IPlatformIntegrationRepository } from '../../repositories/interfaces/IPlatformIntegrationRepository';
import { CreateWorkflowExecutionDto, WorkflowExecutionDto } from '@codeforge/shared';

export class CrossModuleWorkflowService {
  constructor(private platformRepo: IPlatformIntegrationRepository) {}

  public async initiateWorkflow(userId: string, dto: CreateWorkflowExecutionDto): Promise<WorkflowExecutionDto> {
    return this.platformRepo.createWorkflowExecution(userId, dto);
  }

  public async listWorkflows(userId: string): Promise<WorkflowExecutionDto[]> {
    return this.platformRepo.listWorkflowExecutions(userId);
  }

  public async getWorkflow(id: string): Promise<WorkflowExecutionDto | null> {
    return this.platformRepo.getWorkflowExecution(id);
  }
}
