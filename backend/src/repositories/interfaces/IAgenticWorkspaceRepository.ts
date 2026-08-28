import {
  AgentDto,
  CreateAgentDto,
  UpdateAgentDto,
  AgentTaskDto,
  CreateAgentTaskDto,
  AgentWorkflowDto,
  CreateAgentWorkflowDto,
  UpdateAgentWorkflowDto,
  AgentMemoryDto,
  CreateAgentMemoryDto,
  AutonomousProjectDto,
  CreateAutonomousProjectDto,
  ResearchReportDto,
  CreateResearchReportDto,
  KnowledgeNodeDto,
  KnowledgeEdgeDto,
  KnowledgeGraphDto,
  WorkspaceDocumentDto,
  CreateWorkspaceDocumentDto,
  ExecutiveDecisionDto,
  CreateExecutiveDecisionDto,
  ProductivityAnalyticsDto,
  AgentType,
  AgentStatus,
  MemoryType,
} from '@codeforge/shared';

export interface IAgenticWorkspaceRepository {
  // 1. Agents
  createAgent(userId: string, data: CreateAgentDto): Promise<AgentDto>;
  getAgentById(agentId: string, userId: string): Promise<AgentDto | null>;
  listAgents(userId: string, filterType?: AgentType): Promise<AgentDto[]>;
  updateAgent(agentId: string, userId: string, data: UpdateAgentDto): Promise<AgentDto | null>;
  deleteAgent(agentId: string, userId: string): Promise<boolean>;

  // 2. Tasks
  createTask(userId: string, data: CreateAgentTaskDto): Promise<AgentTaskDto>;
  getTaskById(taskId: string, userId: string): Promise<AgentTaskDto | null>;
  listTasks(userId: string, agentId?: string, status?: AgentStatus): Promise<AgentTaskDto[]>;
  updateTask(taskId: string, userId: string, data: Partial<AgentTaskDto>): Promise<AgentTaskDto | null>;
  deleteTask(taskId: string, userId: string): Promise<boolean>;

  // 3. Workflows
  createWorkflow(userId: string, data: CreateAgentWorkflowDto): Promise<AgentWorkflowDto>;
  getWorkflowById(workflowId: string, userId: string): Promise<AgentWorkflowDto | null>;
  listWorkflows(userId: string): Promise<AgentWorkflowDto[]>;
  updateWorkflow(workflowId: string, userId: string, data: UpdateAgentWorkflowDto): Promise<AgentWorkflowDto | null>;
  deleteWorkflow(workflowId: string, userId: string): Promise<boolean>;

  // 4. Memory
  createMemory(userId: string, data: CreateAgentMemoryDto): Promise<AgentMemoryDto>;
  listMemories(userId: string, memoryType?: MemoryType, limit?: number): Promise<AgentMemoryDto[]>;
  searchMemories(userId: string, query: string, limit?: number): Promise<AgentMemoryDto[]>;
  deleteMemory(memoryId: string, userId: string): Promise<boolean>;

  // 5. Autonomous Projects
  createProject(userId: string, data: CreateAutonomousProjectDto & { roadmap?: any[]; sprintPlan?: any[]; weeklyObjectives?: any[]; resourceAllocation?: any; riskFactors?: string[] }): Promise<AutonomousProjectDto>;
  getProjectById(projectId: string, userId: string): Promise<AutonomousProjectDto | null>;
  listProjects(userId: string): Promise<AutonomousProjectDto[]>;
  updateProject(projectId: string, userId: string, data: Partial<AutonomousProjectDto>): Promise<AutonomousProjectDto | null>;
  deleteProject(projectId: string, userId: string): Promise<boolean>;

  // 6. Research Reports
  createResearchReport(userId: string, data: Omit<ResearchReportDto, 'id' | 'userId' | 'createdAt'>): Promise<ResearchReportDto>;
  getResearchReportById(reportId: string, userId: string): Promise<ResearchReportDto | null>;
  listResearchReports(userId: string, category?: string): Promise<ResearchReportDto[]>;
  deleteResearchReport(reportId: string, userId: string): Promise<boolean>;

  // 7. Knowledge Graph
  createNode(userId: string, data: Omit<KnowledgeNodeDto, 'id' | 'userId' | 'createdAt'>): Promise<KnowledgeNodeDto>;
  listNodes(userId: string): Promise<KnowledgeNodeDto[]>;
  deleteNode(nodeId: string, userId: string): Promise<boolean>;
  createEdge(userId: string, data: Omit<KnowledgeEdgeDto, 'id' | 'userId' | 'createdAt'>): Promise<KnowledgeEdgeDto>;
  listEdges(userId: string): Promise<KnowledgeEdgeDto[]>;
  deleteEdge(edgeId: string, userId: string): Promise<boolean>;
  getKnowledgeGraph(userId: string): Promise<KnowledgeGraphDto>;

  // 8. Documents
  createDocument(userId: string, data: Omit<WorkspaceDocumentDto, 'id' | 'userId' | 'createdAt'>): Promise<WorkspaceDocumentDto>;
  getDocumentById(documentId: string, userId: string): Promise<WorkspaceDocumentDto | null>;
  listDocuments(userId: string): Promise<WorkspaceDocumentDto[]>;
  deleteDocument(documentId: string, userId: string): Promise<boolean>;

  // 9. Decisions
  createDecision(userId: string, data: Omit<ExecutiveDecisionDto, 'id' | 'userId' | 'createdAt'>): Promise<ExecutiveDecisionDto>;
  getDecisionById(decisionId: string, userId: string): Promise<ExecutiveDecisionDto | null>;
  listDecisions(userId: string): Promise<ExecutiveDecisionDto[]>;
  deleteDecision(decisionId: string, userId: string): Promise<boolean>;

  // 10. Productivity Analytics
  saveAnalytics(userId: string, data: Omit<ProductivityAnalyticsDto, 'id' | 'userId' | 'createdAt'>): Promise<ProductivityAnalyticsDto>;
  getLatestAnalytics(userId: string, timeframe?: string): Promise<ProductivityAnalyticsDto | null>;
  listAnalytics(userId: string, limit?: number): Promise<ProductivityAnalyticsDto[]>;
}
