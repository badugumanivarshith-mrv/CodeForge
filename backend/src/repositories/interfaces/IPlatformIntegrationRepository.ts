import {
  PlatformEventDto,
  CreatePlatformEventDto,
  UnifiedContextDto,
  CreateUnifiedContextDto,
  WorkflowExecutionDto,
  CreateWorkflowExecutionDto,
  PlatformOverviewDto,
  PlatformHealthDto,
  GlobalSearchResultDto,
  CrossModuleWorkflowStatus,
  OrchestrationStepStatus,
} from '@codeforge/shared';

export interface IPlatformIntegrationRepository {
  createPlatformEvent(dto: CreatePlatformEventDto): Promise<PlatformEventDto>;
  listPlatformEvents(): Promise<PlatformEventDto[]>;

  saveUnifiedContext(userId: string, dto: CreateUnifiedContextDto): Promise<UnifiedContextDto>;
  getUnifiedContext(userId: string, key: string): Promise<UnifiedContextDto | null>;
  listUnifiedContextKeys(userId: string): Promise<string[]>;

  createWorkflowExecution(userId: string, dto: CreateWorkflowExecutionDto): Promise<WorkflowExecutionDto>;
  updateWorkflowExecutionStep(
    id: string,
    stepNumber: number,
    status: OrchestrationStepStatus,
    resultSummary?: string
  ): Promise<WorkflowExecutionDto>;
  updateWorkflowStatus(id: string, status: CrossModuleWorkflowStatus): Promise<WorkflowExecutionDto>;
  getWorkflowExecution(id: string): Promise<WorkflowExecutionDto | null>;
  listWorkflowExecutions(userId: string): Promise<WorkflowExecutionDto[]>;

  getOverview(userId: string): Promise<PlatformOverviewDto>;
  getHealth(): Promise<PlatformHealthDto>;
  globalSearch(queryStr: string): Promise<GlobalSearchResultDto[]>;
}
