import {
  AgentInstanceDto,
  CreateAgentInstanceDto,
  AgentRunDto,
  AgentCloudTaskDto,
  AgentScheduleDto,
  WorkflowDefinitionDto,
  CreateWorkflowDefinitionDto,
  WorkflowRunDto,
  DistributedWorkflowStepDto,
  EventStreamDto,
  AutomationRuleDto,
  CreateAutomationRuleDto,
  MemoryFabricRecordDto,
  StoreMemoryDto,
  SharedMemoryDto,
  KnowledgeFabricEntityDto,
  KnowledgeFabricEdgeDto,
  DecisionRecordDto,
  CreateDecisionDto,
  TelemetryMetricDto,
  AgentGovernancePermissionDto,
  AgentAuditLogDto,
  WorkforceTeamAgentDto,
  WorkforceOrgAgentDto,
  AgentCloudState,
  WorkflowRunStatus,
  WorkflowStepStatus,
  GlobalEventType,
  WorkforceAgentRole,
  MemoryFabricType,
  KnowledgeGraphDomain,
  DecisionCenterStatus,
  TelemetryMetricType,
} from '@codeforge/shared';

export interface IAgentCloudRepository {
  // Module 1: Persistent Agent Cloud
  createAgentInstance(userId: string, data: CreateAgentInstanceDto, organizationId?: string | null): Promise<AgentInstanceDto>;
  getAgentInstanceById(id: string, userId?: string): Promise<AgentInstanceDto | null>;
  listAgentInstances(userId: string, role?: WorkforceAgentRole, state?: AgentCloudState): Promise<AgentInstanceDto[]>;
  updateAgentInstanceState(id: string, userId: string, state: AgentCloudState, errorIncrement?: boolean): Promise<AgentInstanceDto | null>;
  updateAgentHeartbeat(id: string, userId: string): Promise<void>;
  deleteAgentInstance(id: string, userId: string): Promise<boolean>;

  createAgentRun(agentId: string, userId: string, inputPayload: Record<string, any>): Promise<AgentRunDto>;
  completeAgentRun(runId: string, outputPayload: Record<string, any>, executionTimeMs: number, tokensConsumed: number, error?: string | null): Promise<AgentRunDto | null>;
  listAgentRuns(agentId: string, userId: string): Promise<AgentRunDto[]>;

  createAgentTask(agentId: string, userId: string, data: { title: string; priority?: any; payload: Record<string, any>; deadline?: string | null }): Promise<AgentCloudTaskDto>;
  updateAgentTaskStatus(taskId: string, userId: string, status: any, result?: Record<string, any>): Promise<AgentCloudTaskDto | null>;
  listAgentTasks(agentId: string, userId: string): Promise<AgentCloudTaskDto[]>;

  createAgentSchedule(agentId: string, userId: string, cronExpression: string): Promise<AgentScheduleDto>;
  listAgentSchedules(agentId: string, userId: string): Promise<AgentScheduleDto[]>;

  // Module 2: Distributed Workflow Engine
  createWorkflowDefinition(userId: string, data: CreateWorkflowDefinitionDto, organizationId?: string | null): Promise<WorkflowDefinitionDto>;
  getWorkflowDefinitionById(id: string): Promise<WorkflowDefinitionDto | null>;
  listWorkflowDefinitions(userId: string, type?: string): Promise<WorkflowDefinitionDto[]>;

  createWorkflowRun(workflowId: string, userId: string, totalSteps: number, contextData: Record<string, any>, triggerEvent?: string | null): Promise<WorkflowRunDto>;
  getWorkflowRunById(id: string, userId: string): Promise<WorkflowRunDto | null>;
  updateWorkflowRunStatus(id: string, userId: string, status: WorkflowRunStatus, currentStepIndex?: number, errorLog?: string | null): Promise<WorkflowRunDto | null>;
  listWorkflowRuns(workflowId: string, userId: string): Promise<WorkflowRunDto[]>;

  createWorkflowStepRun(workflowRunId: string, stepId: string, name: string, inputPayload: Record<string, any>): Promise<DistributedWorkflowStepDto>;
  completeWorkflowStepRun(id: string, status: WorkflowStepStatus, outputPayload?: Record<string, any> | null, durationMs?: number, errorMessage?: string | null): Promise<DistributedWorkflowStepDto | null>;
  listWorkflowStepRuns(workflowRunId: string): Promise<DistributedWorkflowStepDto[]>;

  // Module 3: Event Bus & Automation Engine
  recordEventStream(data: { userId?: string | null; eventType: GlobalEventType; payload: Record<string, any>; source?: string }): Promise<EventStreamDto>;
  listEventStream(userId?: string | null, limit?: number): Promise<EventStreamDto[]>;

  createAutomationRule(userId: string, data: CreateAutomationRuleDto): Promise<AutomationRuleDto>;
  listAutomationRules(userId: string, triggerEvent?: GlobalEventType): Promise<AutomationRuleDto[]>;
  incrementRuleExecution(ruleId: string): Promise<void>;

  // Module 5: Organizational Workforces
  assignTeamAgent(teamId: string, agentId: string, role: WorkforceAgentRole, workflows?: string[], permissions?: string[]): Promise<WorkforceTeamAgentDto>;
  listTeamAgents(teamId: string): Promise<WorkforceTeamAgentDto[]>;
  assignOrgAgent(orgId: string, agentId: string, department: string, role: WorkforceAgentRole, isEnterpriseShared?: boolean): Promise<WorkforceOrgAgentDto>;
  listOrgAgents(orgId: string): Promise<WorkforceOrgAgentDto[]>;

  // Module 7: Memory Fabric 2.0
  storeMemory(userId: string, data: StoreMemoryDto): Promise<MemoryFabricRecordDto>;
  findMemoryByKey(userId: string, key: string, agentId?: string | null): Promise<MemoryFabricRecordDto | null>;
  searchMemories(userId: string, query: string, memoryType?: MemoryFabricType, limit?: number): Promise<MemoryFabricRecordDto[]>;
  storeSharedMemory(scopeType: 'team' | 'organization' | 'global', scopeId: string, key: string, value: string, contributorId: string): Promise<SharedMemoryDto>;
  getSharedMemory(scopeType: string, scopeId: string, key: string): Promise<SharedMemoryDto | null>;

  // Module 8: Knowledge Fabric
  createKnowledgeEntity(data: { domain: KnowledgeGraphDomain; name: string; entityType: string; description: string; properties?: Record<string, any> }): Promise<KnowledgeFabricEntityDto>;
  createKnowledgeEdge(data: { sourceEntityId: string; targetEntityId: string; relationType: string; weight?: number; metadata?: Record<string, any> }): Promise<KnowledgeFabricEdgeDto>;
  getKnowledgeGraphByDomain(domain: KnowledgeGraphDomain): Promise<{ entities: KnowledgeFabricEntityDto[]; edges: KnowledgeFabricEdgeDto[] }>;

  // Module 9: AI Decision Center
  createDecisionRecord(userId: string, data: CreateDecisionDto, analysis?: { options: any[]; recommendedOptionId?: string; confidenceScore?: number; roadmap?: any[] }): Promise<DecisionRecordDto>;
  getDecisionRecordById(id: string, userId: string): Promise<DecisionRecordDto | null>;
  updateDecisionStatus(id: string, userId: string, status: DecisionCenterStatus, executedOptionId?: string | null): Promise<DecisionRecordDto | null>;
  listDecisionRecords(userId: string): Promise<DecisionRecordDto[]>;

  // Module 11: Telemetry & Metrics
  recordTelemetryMetric(data: { userId?: string | null; agentId?: string | null; metricType: TelemetryMetricType; value: number; unit: string; tags?: Record<string, string> }): Promise<TelemetryMetricDto>;
  listTelemetryMetrics(agentId?: string | null, metricType?: TelemetryMetricType, limit?: number): Promise<TelemetryMetricDto[]>;

  // Module 12: Governance, Security & Compliance
  grantAgentPermission(agentId: string, grantedToUserId?: string | null, grantedToOrgId?: string | null, permissions?: { canExecute?: boolean; canModifyPrompt?: boolean; canAccessMemory?: boolean; canInvokeTools?: boolean }): Promise<AgentGovernancePermissionDto>;
  getAgentPermission(agentId: string, userId?: string | null, orgId?: string | null): Promise<AgentGovernancePermissionDto | null>;
  recordAgentAuditLog(agentId: string, actorUserId: string, action: string, details?: Record<string, any>, ipAddress?: string | null): Promise<AgentAuditLogDto>;
  listAgentAuditLogs(agentId: string, limit?: number): Promise<AgentAuditLogDto[]>;
}
