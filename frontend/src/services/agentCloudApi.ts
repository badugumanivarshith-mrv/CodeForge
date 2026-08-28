import { apiClient } from './apiClient';
import {
  AgentInstanceDto,
  CreateAgentInstanceDto,
  AgentRunDto,
  AgentHealthStatusDto,
  WorkflowDefinitionDto,
  CreateWorkflowDefinitionDto,
  WorkflowRunDto,
  EventStreamDto,
  PublishEventDto,
  AutomationRuleDto,
  CreateAutomationRuleDto,
  TaskGraphNodeDto,
  CreateTaskNodeDto,
  TaskOSPlanDto,
  MemoryFabricRecordDto,
  StoreMemoryDto,
  KnowledgeFabricEntityDto,
  KnowledgeFabricEdgeDto,
  KnowledgeDiscoveryDto,
  DecisionRecordDto,
  CreateDecisionDto,
  TelemetryDashboardDto,
  ComplianceReportDto,
  AgentAuditLogDto,
  CollaborativeWorkspaceDto,
  WorkforceTeamAgentDto,
  WorkforceOptimizationReportDto,
  ApiResponse,
  KnowledgeGraphDomain,
  DistributedWorkflowType,
} from '@codeforge/shared';

export const agentCloudApi = {
  // Module 1: Persistent Agent Cloud
  async listAgents(): Promise<AgentInstanceDto[]> {
    const res = await apiClient.get<ApiResponse<AgentInstanceDto[]>>('/agent-cloud/agents');
    return res.data.data;
  },

  async getAgent(id: string): Promise<AgentInstanceDto> {
    const res = await apiClient.get<ApiResponse<AgentInstanceDto>>(`/agent-cloud/agents/${id}`);
    return res.data.data;
  },

  async createAgent(data: CreateAgentInstanceDto): Promise<AgentInstanceDto> {
    const res = await apiClient.post<ApiResponse<AgentInstanceDto>>('/agent-cloud/agents', data);
    return res.data.data;
  },

  async startAgent(id: string): Promise<AgentInstanceDto> {
    const res = await apiClient.post<ApiResponse<AgentInstanceDto>>(`/agent-cloud/agents/${id}/start`);
    return res.data.data;
  },

  async pauseAgent(id: string): Promise<AgentInstanceDto> {
    const res = await apiClient.post<ApiResponse<AgentInstanceDto>>(`/agent-cloud/agents/${id}/pause`);
    return res.data.data;
  },

  async terminateAgent(id: string): Promise<AgentInstanceDto> {
    const res = await apiClient.post<ApiResponse<AgentInstanceDto>>(`/agent-cloud/agents/${id}/terminate`);
    return res.data.data;
  },

  async runAgent(id: string, inputPayload: Record<string, any> = {}): Promise<AgentRunDto> {
    const res = await apiClient.post<ApiResponse<AgentRunDto>>(`/agent-cloud/agents/${id}/run`, { inputPayload });
    return res.data.data;
  },

  async getAgentHealth(id: string): Promise<AgentHealthStatusDto> {
    const res = await apiClient.get<ApiResponse<AgentHealthStatusDto>>(`/agent-cloud/agents/${id}/health`);
    return res.data.data;
  },

  // Module 2: Distributed Workflow Engine
  async listWorkflows(type?: DistributedWorkflowType): Promise<WorkflowDefinitionDto[]> {
    const res = await apiClient.get<ApiResponse<WorkflowDefinitionDto[]>>('/agent-cloud/workflows', { params: { type } });
    return res.data.data;
  },

  async createWorkflow(data: CreateWorkflowDefinitionDto): Promise<WorkflowDefinitionDto> {
    const res = await apiClient.post<ApiResponse<WorkflowDefinitionDto>>('/agent-cloud/workflows', data);
    return res.data.data;
  },

  async executeWorkflow(workflowId: string, initialContext: Record<string, any> = {}): Promise<WorkflowRunDto> {
    const res = await apiClient.post<ApiResponse<WorkflowRunDto>>(`/agent-cloud/workflows/${workflowId}/execute`, { initialContext });
    return res.data.data;
  },

  async getWorkflowRun(runId: string): Promise<WorkflowRunDto> {
    const res = await apiClient.get<ApiResponse<WorkflowRunDto>>(`/agent-cloud/workflows/runs/${runId}`);
    return res.data.data;
  },

  // Module 3: Event Bus & Automation
  async publishEvent(data: PublishEventDto): Promise<EventStreamDto> {
    const res = await apiClient.post<ApiResponse<EventStreamDto>>('/agent-cloud/events/publish', data);
    return res.data.data;
  },

  async listEvents(limit = 50): Promise<EventStreamDto[]> {
    const res = await apiClient.get<ApiResponse<EventStreamDto[]>>('/agent-cloud/events', { params: { limit } });
    return res.data.data;
  },

  async createAutomationRule(data: CreateAutomationRuleDto): Promise<AutomationRuleDto> {
    const res = await apiClient.post<ApiResponse<AutomationRuleDto>>('/agent-cloud/automation/rules', data);
    return res.data.data;
  },

  async listAutomationRules(): Promise<AutomationRuleDto[]> {
    const res = await apiClient.get<ApiResponse<AutomationRuleDto[]>>('/agent-cloud/automation/rules');
    return res.data.data;
  },

  // Module 4: Execution Fabric
  async listTools(): Promise<{ name: string; category: string; description: string }[]> {
    const res = await apiClient.get<ApiResponse<{ name: string; category: string; description: string }[]>>('/agent-cloud/execution/tools');
    return res.data.data;
  },

  async invokeTool(toolName: string, parameters: Record<string, any> = {}): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/agent-cloud/execution/invoke', { toolName, parameters });
    return res.data.data;
  },

  // Module 5: Organizational Workforces
  async listTeamAgents(teamId: string): Promise<WorkforceTeamAgentDto[]> {
    const res = await apiClient.get<ApiResponse<WorkforceTeamAgentDto[]>>(`/agent-cloud/workforce/teams/${teamId}/agents`);
    return res.data.data;
  },

  async getWorkforceReport(scopeId: string): Promise<WorkforceOptimizationReportDto> {
    const res = await apiClient.get<ApiResponse<WorkforceOptimizationReportDto>>(`/agent-cloud/workforce/reports/${scopeId}`);
    return res.data.data;
  },

  // Module 6: Task Operating System
  async createTaskNode(data: CreateTaskNodeDto): Promise<TaskGraphNodeDto> {
    const res = await apiClient.post<ApiResponse<TaskGraphNodeDto>>('/agent-cloud/task-os/nodes', data);
    return res.data.data;
  },

  async getTaskGraph(): Promise<{ nodes: TaskGraphNodeDto[]; edges: any[] }> {
    const res = await apiClient.get<ApiResponse<{ nodes: TaskGraphNodeDto[]; edges: any[] }>>('/agent-cloud/task-os/graph');
    return res.data.data;
  },

  async getSmartPlan(): Promise<TaskOSPlanDto> {
    const res = await apiClient.get<ApiResponse<TaskOSPlanDto>>('/agent-cloud/task-os/plan');
    return res.data.data;
  },

  // Module 7: Memory Fabric 2.0
  async storeMemory(data: StoreMemoryDto): Promise<MemoryFabricRecordDto> {
    const res = await apiClient.post<ApiResponse<MemoryFabricRecordDto>>('/agent-cloud/memory', data);
    return res.data.data;
  },

  async searchMemory(query: string, memoryType?: string): Promise<MemoryFabricRecordDto[]> {
    const res = await apiClient.post<ApiResponse<MemoryFabricRecordDto[]>>('/agent-cloud/memory/search', { query, memoryType });
    return res.data.data;
  },

  // Module 8: Knowledge Fabric
  async getKnowledgeGraph(domain: KnowledgeGraphDomain = KnowledgeGraphDomain.GLOBAL): Promise<{ entities: KnowledgeFabricEntityDto[]; edges: KnowledgeFabricEdgeDto[] }> {
    const res = await apiClient.get<ApiResponse<{ entities: KnowledgeFabricEntityDto[]; edges: KnowledgeFabricEdgeDto[] }>>('/agent-cloud/knowledge/graph', { params: { domain } });
    return res.data.data;
  },

  async discoverConcepts(domain: KnowledgeGraphDomain, query: string): Promise<KnowledgeDiscoveryDto> {
    const res = await apiClient.get<ApiResponse<KnowledgeDiscoveryDto>>('/agent-cloud/knowledge/discover', { params: { domain, query } });
    return res.data.data;
  },

  // Module 9: AI Decision Center
  async createDecision(data: CreateDecisionDto): Promise<DecisionRecordDto> {
    const res = await apiClient.post<ApiResponse<DecisionRecordDto>>('/agent-cloud/decisions', data);
    return res.data.data;
  },

  async listDecisions(): Promise<DecisionRecordDto[]> {
    const res = await apiClient.get<ApiResponse<DecisionRecordDto[]>>('/agent-cloud/decisions');
    return res.data.data;
  },

  async executeDecision(id: string, optionId: string): Promise<DecisionRecordDto> {
    const res = await apiClient.post<ApiResponse<DecisionRecordDto>>(`/agent-cloud/decisions/${id}/execute`, { optionId });
    return res.data.data;
  },

  // Module 10: Real-Time Collaboration
  async createWorkspace(name: string): Promise<CollaborativeWorkspaceDto> {
    const res = await apiClient.post<ApiResponse<CollaborativeWorkspaceDto>>('/agent-cloud/collaboration/workspaces', { name });
    return res.data.data;
  },

  async getWorkspace(id: string): Promise<CollaborativeWorkspaceDto> {
    const res = await apiClient.get<ApiResponse<CollaborativeWorkspaceDto>>(`/agent-cloud/collaboration/workspaces/${id}`);
    return res.data.data;
  },

  // Module 11: Telemetry & Observability
  async getTelemetryDashboard(): Promise<TelemetryDashboardDto> {
    const res = await apiClient.get<ApiResponse<TelemetryDashboardDto>>('/agent-cloud/telemetry/dashboard');
    return res.data.data;
  },

  // Module 12: Governance, Security & Compliance
  async getComplianceReport(): Promise<ComplianceReportDto> {
    const res = await apiClient.get<ApiResponse<ComplianceReportDto>>('/agent-cloud/governance/compliance');
    return res.data.data;
  },

  async getAuditLogs(agentId: string): Promise<AgentAuditLogDto[]> {
    const res = await apiClient.get<ApiResponse<AgentAuditLogDto[]>>(`/agent-cloud/governance/audit/${agentId}`);
    return res.data.data;
  },
};
