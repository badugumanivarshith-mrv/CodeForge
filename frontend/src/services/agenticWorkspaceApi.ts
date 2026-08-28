import { apiClient } from './apiClient';
import {
  AgentDto,
  AgentTaskDto,
  CreateAgentTaskDto,
  AgentWorkflowDto,
  CreateAgentWorkflowDto,
  AgentMemoryDto,
  CreateAgentMemoryDto,
  AutonomousProjectDto,
  CreateAutonomousProjectDto,
  ResearchReportDto,
  CreateResearchReportDto,
  KnowledgeGraphDto,
  WorkspaceDocumentDto,
  CreateWorkspaceDocumentDto,
  ExecutiveDecisionDto,
  CreateExecutiveDecisionDto,
  ProductivityAnalyticsDto,
  CommandCenterOverviewDto,
  AgentType,
  MemoryType,
} from '@codeforge/shared';

export const agenticWorkspaceApi = {
  // Command Center Overview
  getOverview: async (): Promise<CommandCenterOverviewDto> => {
    const res = await apiClient.get('/ai-workspace/overview');
    return res.data.data;
  },

  // Agents
  listAgents: async (type?: AgentType): Promise<AgentDto[]> => {
    const res = await apiClient.get('/ai-workspace/agents', { params: { type } });
    return res.data.data;
  },

  decomposeGoal: async (goal: string, agentType?: AgentType): Promise<any[]> => {
    const res = await apiClient.post('/ai-workspace/agents/decompose', { goal, agentType });
    return res.data.data;
  },

  dispatchMessage: async (fromAgent: AgentType, toAgent: AgentType, message: string): Promise<any> => {
    const res = await apiClient.post('/ai-workspace/agents/dispatch', { fromAgent, toAgent, message });
    return res.data.data;
  },

  // Tasks
  listTasks: async (agentId?: string): Promise<AgentTaskDto[]> => {
    const res = await apiClient.get('/ai-workspace/tasks', { params: { agentId } });
    return res.data.data;
  },

  createTask: async (data: CreateAgentTaskDto): Promise<AgentTaskDto> => {
    const res = await apiClient.post('/ai-workspace/tasks', data);
    return res.data.data;
  },

  executeTask: async (taskId: string): Promise<AgentTaskDto> => {
    const res = await apiClient.post(`/ai-workspace/tasks/${taskId}/execute`);
    return res.data.data;
  },

  // Workflows
  listWorkflows: async (): Promise<AgentWorkflowDto[]> => {
    const res = await apiClient.get('/ai-workspace/workflows');
    return res.data.data;
  },

  createWorkflow: async (data: CreateAgentWorkflowDto): Promise<AgentWorkflowDto> => {
    const res = await apiClient.post('/ai-workspace/workflows', data);
    return res.data.data;
  },

  triggerWorkflow: async (workflowId: string): Promise<AgentWorkflowDto> => {
    const res = await apiClient.post(`/ai-workspace/workflows/${workflowId}/trigger`);
    return res.data.data;
  },

  // Memory
  listMemories: async (type?: MemoryType): Promise<AgentMemoryDto[]> => {
    const res = await apiClient.get('/ai-workspace/memories', { params: { type } });
    return res.data.data;
  },

  storeMemory: async (data: CreateAgentMemoryDto): Promise<AgentMemoryDto> => {
    const res = await apiClient.post('/ai-workspace/memories', data);
    return res.data.data;
  },

  searchMemories: async (query: string): Promise<AgentMemoryDto[]> => {
    const res = await apiClient.get('/ai-workspace/memories/search', { params: { q: query } });
    return res.data.data;
  },

  summarizeMemories: async (): Promise<any> => {
    const res = await apiClient.get('/ai-workspace/memories/summary');
    return res.data.data;
  },

  // Autonomous Projects
  listProjects: async (): Promise<AutonomousProjectDto[]> => {
    const res = await apiClient.get('/ai-workspace/projects');
    return res.data.data;
  },

  createProject: async (data: CreateAutonomousProjectDto): Promise<AutonomousProjectDto> => {
    const res = await apiClient.post('/ai-workspace/projects', data);
    return res.data.data;
  },

  completeProjectObjective: async (projectId: string, week: number): Promise<AutonomousProjectDto> => {
    const res = await apiClient.post(`/ai-workspace/projects/${projectId}/weeks/${week}/complete`);
    return res.data.data;
  },

  // Research
  listResearchReports: async (category?: string): Promise<ResearchReportDto[]> => {
    const res = await apiClient.get('/ai-workspace/research', { params: { category } });
    return res.data.data;
  },

  conductResearch: async (data: CreateResearchReportDto): Promise<ResearchReportDto> => {
    const res = await apiClient.post('/ai-workspace/research', data);
    return res.data.data;
  },

  // Knowledge Graph
  getKnowledgeGraph: async (): Promise<KnowledgeGraphDto> => {
    const res = await apiClient.get('/ai-workspace/knowledge-graph');
    return res.data.data;
  },

  extractAndLinkEntities: async (textContent: string): Promise<any> => {
    const res = await apiClient.post('/ai-workspace/knowledge-graph/extract', { textContent });
    return res.data.data;
  },

  findSkillGaps: async (targetRole?: string): Promise<any> => {
    const res = await apiClient.get('/ai-workspace/knowledge-graph/skill-gaps', { params: { targetRole } });
    return res.data.data;
  },

  // Documents
  listDocuments: async (): Promise<WorkspaceDocumentDto[]> => {
    const res = await apiClient.get('/ai-workspace/documents');
    return res.data.data;
  },

  analyzeDocument: async (data: CreateWorkspaceDocumentDto): Promise<WorkspaceDocumentDto> => {
    const res = await apiClient.post('/ai-workspace/documents', data);
    return res.data.data;
  },

  // Decisions
  listDecisions: async (): Promise<ExecutiveDecisionDto[]> => {
    const res = await apiClient.get('/ai-workspace/decisions');
    return res.data.data;
  },

  evaluateDecision: async (data: CreateExecutiveDecisionDto): Promise<ExecutiveDecisionDto> => {
    const res = await apiClient.post('/ai-workspace/decisions', data);
    return res.data.data;
  },

  // Productivity Analytics
  getProductivityAnalytics: async (timeframe?: string): Promise<ProductivityAnalyticsDto> => {
    const res = await apiClient.get('/ai-workspace/analytics', { params: { timeframe } });
    return res.data.data;
  },
};
