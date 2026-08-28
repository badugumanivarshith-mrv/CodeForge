import { eq, desc, and, sql, ilike } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  aiAgents,
  agentTasks,
  agentWorkflows,
  agentMemories,
  autonomousProjects,
  researchReports,
  knowledgeGraphNodes,
  knowledgeGraphEdges,
  workspaceDocuments,
  executiveDecisions,
  productivityAnalytics,
} from '../database/schema';
import { IAgenticWorkspaceRepository } from './interfaces/IAgenticWorkspaceRepository';
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
  KnowledgeNodeDto,
  KnowledgeEdgeDto,
  KnowledgeGraphDto,
  WorkspaceDocumentDto,
  ExecutiveDecisionDto,
  ProductivityAnalyticsDto,
  AgentType,
  AgentStatus,
  MemoryType,
} from '@codeforge/shared';

export class AgenticWorkspaceRepository implements IAgenticWorkspaceRepository {
  // 1. Agents
  async createAgent(userId: string, data: CreateAgentDto): Promise<AgentDto> {
    const [inserted] = await db.insert(aiAgents).values({
      userId,
      name: data.name,
      type: data.type,
      status: AgentStatus.IDLE,
      capabilities: data.capabilities || [],
      systemPrompt: data.systemPrompt || '',
      configuration: data.configuration || {},
      tasksCompleted: 0,
      successRate: '100.00',
      avgExecutionTimeMs: 0,
    }).returning();

    return this.mapAgent(inserted);
  }

  async getAgentById(agentId: string, userId: string): Promise<AgentDto | null> {
    const records = await db.select().from(aiAgents)
      .where(and(eq(aiAgents.id, agentId), eq(aiAgents.userId, userId)))
      .limit(1);

    if (!records.length) return null;
    return this.mapAgent(records[0]);
  }

  async listAgents(userId: string, filterType?: AgentType): Promise<AgentDto[]> {
    let query = db.select().from(aiAgents).where(eq(aiAgents.userId, userId));
    const records = await query.orderBy(desc(aiAgents.createdAt));

    const mapped = records.map(r => this.mapAgent(r));
    if (filterType) {
      return mapped.filter(a => a.type === filterType);
    }
    return mapped;
  }

  async updateAgent(agentId: string, userId: string, data: UpdateAgentDto): Promise<AgentDto | null> {
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (data.name !== undefined) updates.name = data.name;
    if (data.status !== undefined) updates.status = data.status;
    if (data.capabilities !== undefined) updates.capabilities = data.capabilities;
    if (data.systemPrompt !== undefined) updates.systemPrompt = data.systemPrompt;
    if (data.configuration !== undefined) updates.configuration = data.configuration;

    const [updated] = await db.update(aiAgents)
      .set(updates)
      .where(and(eq(aiAgents.id, agentId), eq(aiAgents.userId, userId)))
      .returning();

    if (!updated) return null;
    return this.mapAgent(updated);
  }

  async deleteAgent(agentId: string, userId: string): Promise<boolean> {
    const result = await db.delete(aiAgents)
      .where(and(eq(aiAgents.id, agentId), eq(aiAgents.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 2. Tasks
  async createTask(userId: string, data: CreateAgentTaskDto): Promise<AgentTaskDto> {
    const [inserted] = await db.insert(agentTasks).values({
      userId,
      agentId: data.agentId,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: AgentStatus.PLANNING,
      inputPayload: data.inputPayload || {},
      dependencies: data.dependencies || [],
      toolsUsed: data.toolsUsed || [],
      executionTimeMs: 0,
    }).returning();

    return this.mapTask(inserted);
  }

  async getTaskById(taskId: string, userId: string): Promise<AgentTaskDto | null> {
    const records = await db.select().from(agentTasks)
      .where(and(eq(agentTasks.id, taskId), eq(agentTasks.userId, userId)))
      .limit(1);

    if (!records.length) return null;
    return this.mapTask(records[0]);
  }

  async listTasks(userId: string, agentId?: string, status?: AgentStatus): Promise<AgentTaskDto[]> {
    const records = await db.select().from(agentTasks)
      .where(eq(agentTasks.userId, userId))
      .orderBy(desc(agentTasks.createdAt));

    let mapped = records.map(r => this.mapTask(r));
    if (agentId) mapped = mapped.filter(t => t.agentId === agentId);
    if (status) mapped = mapped.filter(t => t.status === status);
    return mapped;
  }

  async updateTask(taskId: string, userId: string, data: Partial<AgentTaskDto>): Promise<AgentTaskDto | null> {
    const updates: Record<string, any> = {};
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.priority !== undefined) updates.priority = data.priority;
    if (data.status !== undefined) updates.status = data.status;
    if (data.inputPayload !== undefined) updates.inputPayload = data.inputPayload;
    if (data.outputResult !== undefined) updates.outputResult = data.outputResult;
    if (data.dependencies !== undefined) updates.dependencies = data.dependencies;
    if (data.toolsUsed !== undefined) updates.toolsUsed = data.toolsUsed;
    if (data.executionTimeMs !== undefined) updates.executionTimeMs = data.executionTimeMs;
    if (data.completedAt !== undefined) updates.completedAt = data.completedAt ? new Date(data.completedAt) : null;

    const [updated] = await db.update(agentTasks)
      .set(updates)
      .where(and(eq(agentTasks.id, taskId), eq(agentTasks.userId, userId)))
      .returning();

    if (!updated) return null;
    return this.mapTask(updated);
  }

  async deleteTask(taskId: string, userId: string): Promise<boolean> {
    const result = await db.delete(agentTasks)
      .where(and(eq(agentTasks.id, taskId), eq(agentTasks.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 3. Workflows
  async createWorkflow(userId: string, data: CreateAgentWorkflowDto): Promise<AgentWorkflowDto> {
    const [inserted] = await db.insert(agentWorkflows).values({
      userId,
      title: data.title,
      description: data.description,
      triggerType: data.triggerType,
      steps: data.steps || [],
      scheduleCron: data.scheduleCron,
    }).returning();

    return this.mapWorkflow(inserted);
  }

  async getWorkflowById(workflowId: string, userId: string): Promise<AgentWorkflowDto | null> {
    const records = await db.select().from(agentWorkflows)
      .where(and(eq(agentWorkflows.id, workflowId), eq(agentWorkflows.userId, userId)))
      .limit(1);

    if (!records.length) return null;
    return this.mapWorkflow(records[0]);
  }

  async listWorkflows(userId: string): Promise<AgentWorkflowDto[]> {
    const records = await db.select().from(agentWorkflows)
      .where(eq(agentWorkflows.userId, userId))
      .orderBy(desc(agentWorkflows.createdAt));

    return records.map(r => this.mapWorkflow(r));
  }

  async updateWorkflow(workflowId: string, userId: string, data: UpdateAgentWorkflowDto): Promise<AgentWorkflowDto | null> {
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.status !== undefined) updates.status = data.status;
    if (data.steps !== undefined) updates.steps = data.steps;
    if (data.scheduleCron !== undefined) updates.scheduleCron = data.scheduleCron;

    const [updated] = await db.update(agentWorkflows)
      .set(updates)
      .where(and(eq(agentWorkflows.id, workflowId), eq(agentWorkflows.userId, userId)))
      .returning();

    if (!updated) return null;
    return this.mapWorkflow(updated);
  }

  async deleteWorkflow(workflowId: string, userId: string): Promise<boolean> {
    const result = await db.delete(agentWorkflows)
      .where(and(eq(agentWorkflows.id, workflowId), eq(agentWorkflows.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 4. Memory
  async createMemory(userId: string, data: CreateAgentMemoryDto): Promise<AgentMemoryDto> {
    const [inserted] = await db.insert(agentMemories).values({
      userId,
      agentId: data.agentId,
      memoryType: data.memoryType,
      content: data.content,
      importanceScore: String(data.importanceScore || 50.00),
      contextKey: data.contextKey,
      metadata: data.metadata || {},
    }).returning();

    return this.mapMemory(inserted);
  }

  async listMemories(userId: string, memoryType?: MemoryType, limit = 50): Promise<AgentMemoryDto[]> {
    const records = await db.select().from(agentMemories)
      .where(eq(agentMemories.userId, userId))
      .orderBy(desc(agentMemories.importanceScore))
      .limit(limit);

    const mapped = records.map(r => this.mapMemory(r));
    if (memoryType) {
      return mapped.filter(m => m.memoryType === memoryType);
    }
    return mapped;
  }

  async searchMemories(userId: string, query: string, limit = 10): Promise<AgentMemoryDto[]> {
    const records = await db.select().from(agentMemories)
      .where(and(
        eq(agentMemories.userId, userId),
        ilike(agentMemories.content, `%${query}%`)
      ))
      .orderBy(desc(agentMemories.importanceScore))
      .limit(limit);

    return records.map(r => this.mapMemory(r));
  }

  async deleteMemory(memoryId: string, userId: string): Promise<boolean> {
    const result = await db.delete(agentMemories)
      .where(and(eq(agentMemories.id, memoryId), eq(agentMemories.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 5. Autonomous Projects
  async createProject(userId: string, data: CreateAutonomousProjectDto & { roadmap?: any[]; sprintPlan?: any[]; weeklyObjectives?: any[]; resourceAllocation?: any; riskFactors?: string[] }): Promise<AutonomousProjectDto> {
    const [inserted] = await db.insert(autonomousProjects).values({
      userId,
      title: data.title,
      description: data.description,
      goal: data.goal,
      roadmap: data.roadmap || [],
      sprintPlan: data.sprintPlan || [],
      weeklyObjectives: data.weeklyObjectives || [],
      resourceAllocation: data.resourceAllocation || {},
      riskFactors: data.riskFactors || [],
      progressPercentage: '0.00',
    }).returning();

    return this.mapProject(inserted);
  }

  async getProjectById(projectId: string, userId: string): Promise<AutonomousProjectDto | null> {
    const records = await db.select().from(autonomousProjects)
      .where(and(eq(autonomousProjects.id, projectId), eq(autonomousProjects.userId, userId)))
      .limit(1);

    if (!records.length) return null;
    return this.mapProject(records[0]);
  }

  async listProjects(userId: string): Promise<AutonomousProjectDto[]> {
    const records = await db.select().from(autonomousProjects)
      .where(eq(autonomousProjects.userId, userId))
      .orderBy(desc(autonomousProjects.createdAt));

    return records.map(r => this.mapProject(r));
  }

  async updateProject(projectId: string, userId: string, data: Partial<AutonomousProjectDto>): Promise<AutonomousProjectDto | null> {
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.goal !== undefined) updates.goal = data.goal;
    if (data.status !== undefined) updates.status = data.status;
    if (data.roadmap !== undefined) updates.roadmap = data.roadmap;
    if (data.sprintPlan !== undefined) updates.sprintPlan = data.sprintPlan;
    if (data.weeklyObjectives !== undefined) updates.weeklyObjectives = data.weeklyObjectives;
    if (data.resourceAllocation !== undefined) updates.resourceAllocation = data.resourceAllocation;
    if (data.riskFactors !== undefined) updates.riskFactors = data.riskFactors;
    if (data.progressPercentage !== undefined) updates.progressPercentage = String(data.progressPercentage);

    const [updated] = await db.update(autonomousProjects)
      .set(updates)
      .where(and(eq(autonomousProjects.id, projectId), eq(autonomousProjects.userId, userId)))
      .returning();

    if (!updated) return null;
    return this.mapProject(updated);
  }

  async deleteProject(projectId: string, userId: string): Promise<boolean> {
    const result = await db.delete(autonomousProjects)
      .where(and(eq(autonomousProjects.id, projectId), eq(autonomousProjects.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 6. Research Reports
  async createResearchReport(userId: string, data: Omit<ResearchReportDto, 'id' | 'userId' | 'createdAt'>): Promise<ResearchReportDto> {
    const [inserted] = await db.insert(researchReports).values({
      userId,
      topic: data.topic,
      category: data.category || 'GENERAL',
      executiveSummary: data.executiveSummary,
      reportContent: data.reportContent,
      swotAnalysis: data.swotAnalysis || {},
      opportunityMatrix: data.opportunityMatrix || [],
      keyTrends: data.keyTrends || [],
      recommendations: data.recommendations || [],
      sources: data.sources || [],
    }).returning();

    return this.mapResearchReport(inserted);
  }

  async getResearchReportById(reportId: string, userId: string): Promise<ResearchReportDto | null> {
    const records = await db.select().from(researchReports)
      .where(and(eq(researchReports.id, reportId), eq(researchReports.userId, userId)))
      .limit(1);

    if (!records.length) return null;
    return this.mapResearchReport(records[0]);
  }

  async listResearchReports(userId: string, category?: string): Promise<ResearchReportDto[]> {
    const records = await db.select().from(researchReports)
      .where(eq(researchReports.userId, userId))
      .orderBy(desc(researchReports.createdAt));

    const mapped = records.map(r => this.mapResearchReport(r));
    if (category) {
      return mapped.filter(r => r.category.toLowerCase() === category.toLowerCase());
    }
    return mapped;
  }

  async deleteResearchReport(reportId: string, userId: string): Promise<boolean> {
    const result = await db.delete(researchReports)
      .where(and(eq(researchReports.id, reportId), eq(researchReports.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 7. Knowledge Graph
  async createNode(userId: string, data: Omit<KnowledgeNodeDto, 'id' | 'userId' | 'createdAt'>): Promise<KnowledgeNodeDto> {
    const [inserted] = await db.insert(knowledgeGraphNodes).values({
      userId,
      name: data.name,
      nodeType: data.nodeType,
      category: data.category || 'General',
      properties: data.properties || {},
      confidenceScore: String(data.confidenceScore || 90.00),
    }).returning();

    return this.mapKnowledgeNode(inserted);
  }

  async listNodes(userId: string): Promise<KnowledgeNodeDto[]> {
    const records = await db.select().from(knowledgeGraphNodes)
      .where(eq(knowledgeGraphNodes.userId, userId))
      .orderBy(desc(knowledgeGraphNodes.createdAt));

    return records.map(r => this.mapKnowledgeNode(r));
  }

  async deleteNode(nodeId: string, userId: string): Promise<boolean> {
    const result = await db.delete(knowledgeGraphNodes)
      .where(and(eq(knowledgeGraphNodes.id, nodeId), eq(knowledgeGraphNodes.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async createEdge(userId: string, data: Omit<KnowledgeEdgeDto, 'id' | 'userId' | 'createdAt'>): Promise<KnowledgeEdgeDto> {
    const [inserted] = await db.insert(knowledgeGraphEdges).values({
      userId,
      sourceNodeId: data.sourceNodeId,
      targetNodeId: data.targetNodeId,
      relationType: data.relationType,
      weight: String(data.weight || 1.00),
      metadata: data.metadata || {},
    }).returning();

    return this.mapKnowledgeEdge(inserted);
  }

  async listEdges(userId: string): Promise<KnowledgeEdgeDto[]> {
    const records = await db.select().from(knowledgeGraphEdges)
      .where(eq(knowledgeGraphEdges.userId, userId))
      .orderBy(desc(knowledgeGraphEdges.createdAt));

    return records.map(r => this.mapKnowledgeEdge(r));
  }

  async deleteEdge(edgeId: string, userId: string): Promise<boolean> {
    const result = await db.delete(knowledgeGraphEdges)
      .where(and(eq(knowledgeGraphEdges.id, edgeId), eq(knowledgeGraphEdges.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async getKnowledgeGraph(userId: string): Promise<KnowledgeGraphDto> {
    const nodes = await this.listNodes(userId);
    const edges = await this.listEdges(userId);

    const totalNodes = nodes.length;
    const totalEdges = edges.length;
    const density = totalNodes > 1 ? Number((totalEdges / (totalNodes * (totalNodes - 1))).toFixed(4)) : 0;
    const topConcepts = nodes.slice(0, 5).map(n => n.name);

    return {
      nodes,
      edges,
      stats: {
        totalNodes,
        totalEdges,
        density,
        topConcepts,
      },
    };
  }

  // 8. Documents
  async createDocument(userId: string, data: Omit<WorkspaceDocumentDto, 'id' | 'userId' | 'createdAt'>): Promise<WorkspaceDocumentDto> {
    const [inserted] = await db.insert(workspaceDocuments).values({
      userId,
      title: data.title,
      documentType: data.documentType,
      summary: data.summary,
      extractedSkills: data.extractedSkills || [],
      extractedActions: data.extractedActions || [],
      flashcards: data.flashcards || [],
      keyFindings: data.keyFindings || [],
      metadata: data.metadata || {},
    }).returning();

    return this.mapDocument(inserted);
  }

  async getDocumentById(documentId: string, userId: string): Promise<WorkspaceDocumentDto | null> {
    const records = await db.select().from(workspaceDocuments)
      .where(and(eq(workspaceDocuments.id, documentId), eq(workspaceDocuments.userId, userId)))
      .limit(1);

    if (!records.length) return null;
    return this.mapDocument(records[0]);
  }

  async listDocuments(userId: string): Promise<WorkspaceDocumentDto[]> {
    const records = await db.select().from(workspaceDocuments)
      .where(eq(workspaceDocuments.userId, userId))
      .orderBy(desc(workspaceDocuments.createdAt));

    return records.map(r => this.mapDocument(r));
  }

  async deleteDocument(documentId: string, userId: string): Promise<boolean> {
    const result = await db.delete(workspaceDocuments)
      .where(and(eq(workspaceDocuments.id, documentId), eq(workspaceDocuments.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 9. Decisions
  async createDecision(userId: string, data: Omit<ExecutiveDecisionDto, 'id' | 'userId' | 'createdAt'>): Promise<ExecutiveDecisionDto> {
    const [inserted] = await db.insert(executiveDecisions).values({
      userId,
      decisionType: data.decisionType,
      title: data.title,
      contextData: data.contextData || {},
      optionsEvaluated: data.optionsEvaluated || [],
      recommendedAction: data.recommendedAction,
      riskScore: String(data.riskScore || 20.00),
      confidenceScore: String(data.confidenceScore || 85.00),
      expectedOutcomes: data.expectedOutcomes || [],
    }).returning();

    return this.mapDecision(inserted);
  }

  async getDecisionById(decisionId: string, userId: string): Promise<ExecutiveDecisionDto | null> {
    const records = await db.select().from(executiveDecisions)
      .where(and(eq(executiveDecisions.id, decisionId), eq(executiveDecisions.userId, userId)))
      .limit(1);

    if (!records.length) return null;
    return this.mapDecision(records[0]);
  }

  async listDecisions(userId: string): Promise<ExecutiveDecisionDto[]> {
    const records = await db.select().from(executiveDecisions)
      .where(eq(executiveDecisions.userId, userId))
      .orderBy(desc(executiveDecisions.createdAt));

    return records.map(r => this.mapDecision(r));
  }

  async deleteDecision(decisionId: string, userId: string): Promise<boolean> {
    const result = await db.delete(executiveDecisions)
      .where(and(eq(executiveDecisions.id, decisionId), eq(executiveDecisions.userId, userId)))
      .returning();
    return result.length > 0;
  }

  // 10. Productivity Analytics
  async saveAnalytics(userId: string, data: Omit<ProductivityAnalyticsDto, 'id' | 'userId' | 'createdAt'>): Promise<ProductivityAnalyticsDto> {
    const [inserted] = await db.insert(productivityAnalytics).values({
      userId,
      timeframe: data.timeframe,
      periodDate: data.periodDate,
      focusMetrics: data.focusMetrics as any,
      learningVelocity: String(data.learningVelocity || 80.00),
      careerGrowthVelocity: String(data.careerGrowthVelocity || 75.00),
      tasksCompleted: data.tasksCompleted || 0,
      agentEffectivenessScore: String(data.agentEffectivenessScore || 85.00),
      agentBreakdown: data.agentBreakdown as any,
      recommendations: data.recommendations || [],
    }).returning();

    return this.mapAnalytics(inserted);
  }

  async getLatestAnalytics(userId: string, timeframe = 'weekly'): Promise<ProductivityAnalyticsDto | null> {
    const records = await db.select().from(productivityAnalytics)
      .where(and(
        eq(productivityAnalytics.userId, userId),
        eq(productivityAnalytics.timeframe, timeframe)
      ))
      .orderBy(desc(productivityAnalytics.createdAt))
      .limit(1);

    if (!records.length) return null;
    return this.mapAnalytics(records[0]);
  }

  async listAnalytics(userId: string, limit = 12): Promise<ProductivityAnalyticsDto[]> {
    const records = await db.select().from(productivityAnalytics)
      .where(eq(productivityAnalytics.userId, userId))
      .orderBy(desc(productivityAnalytics.createdAt))
      .limit(limit);

    return records.map(r => this.mapAnalytics(r));
  }

  // Mappers
  private mapAgent(r: any): AgentDto {
    return {
      id: r.id,
      userId: r.userId,
      name: r.name,
      type: r.type as AgentType,
      status: r.status as AgentStatus,
      capabilities: r.capabilities || [],
      systemPrompt: r.systemPrompt,
      configuration: r.configuration || {},
      stats: {
        tasksCompleted: r.tasksCompleted || 0,
        successRate: Number(r.successRate),
        avgExecutionTimeMs: r.avgExecutionTimeMs || 0,
        lastActiveAt: r.lastActiveAt ? r.lastActiveAt.toISOString() : undefined,
      },
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  private mapTask(r: any): AgentTaskDto {
    return {
      id: r.id,
      agentId: r.agentId,
      userId: r.userId,
      title: r.title,
      description: r.description,
      priority: r.priority,
      status: r.status as AgentStatus,
      inputPayload: r.inputPayload || {},
      outputResult: r.outputResult,
      dependencies: r.dependencies || [],
      toolsUsed: r.toolsUsed || [],
      executionTimeMs: r.executionTimeMs || 0,
      createdAt: r.createdAt.toISOString(),
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
    };
  }

  private mapWorkflow(r: any): AgentWorkflowDto {
    return {
      id: r.id,
      userId: r.userId,
      title: r.title,
      description: r.description,
      triggerType: r.triggerType,
      status: r.status,
      steps: r.steps || [],
      scheduleCron: r.scheduleCron,
      lastRunAt: r.lastRunAt ? r.lastRunAt.toISOString() : null,
      nextRunAt: r.nextRunAt ? r.nextRunAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  private mapMemory(r: any): AgentMemoryDto {
    return {
      id: r.id,
      userId: r.userId,
      agentId: r.agentId,
      memoryType: r.memoryType,
      content: r.content,
      importanceScore: Number(r.importanceScore),
      contextKey: r.contextKey,
      metadata: r.metadata || {},
      createdAt: r.createdAt.toISOString(),
      lastAccessedAt: r.lastAccessedAt.toISOString(),
    };
  }

  private mapProject(r: any): AutonomousProjectDto {
    return {
      id: r.id,
      userId: r.userId,
      title: r.title,
      description: r.description,
      goal: r.goal,
      status: r.status,
      roadmap: r.roadmap || [],
      sprintPlan: r.sprintPlan || [],
      weeklyObjectives: r.weeklyObjectives || [],
      resourceAllocation: r.resourceAllocation || { recommendedHoursPerWeek: 15, primaryTools: [], suggestedLibraries: [] },
      riskFactors: r.riskFactors || [],
      progressPercentage: Number(r.progressPercentage),
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    };
  }

  private mapResearchReport(r: any): ResearchReportDto {
    return {
      id: r.id,
      userId: r.userId,
      topic: r.topic,
      category: r.category,
      executiveSummary: r.executiveSummary,
      reportContent: r.reportContent,
      swotAnalysis: r.swotAnalysis || { strengths: [], weaknesses: [], opportunities: [], threats: [] },
      opportunityMatrix: r.opportunityMatrix || [],
      keyTrends: r.keyTrends || [],
      recommendations: r.recommendations || [],
      sources: r.sources || [],
      createdAt: r.createdAt.toISOString(),
    };
  }

  private mapKnowledgeNode(r: any): KnowledgeNodeDto {
    return {
      id: r.id,
      userId: r.userId,
      name: r.name,
      nodeType: r.nodeType,
      category: r.category,
      properties: r.properties || {},
      confidenceScore: Number(r.confidenceScore),
      createdAt: r.createdAt.toISOString(),
    };
  }

  private mapKnowledgeEdge(r: any): KnowledgeEdgeDto {
    return {
      id: r.id,
      userId: r.userId,
      sourceNodeId: r.sourceNodeId,
      targetNodeId: r.targetNodeId,
      relationType: r.relationType,
      weight: Number(r.weight),
      metadata: r.metadata || {},
      createdAt: r.createdAt.toISOString(),
    };
  }

  private mapDocument(r: any): WorkspaceDocumentDto {
    return {
      id: r.id,
      userId: r.userId,
      title: r.title,
      documentType: r.documentType,
      summary: r.summary,
      extractedSkills: r.extractedSkills || [],
      extractedActions: r.extractedActions || [],
      flashcards: r.flashcards || [],
      keyFindings: r.keyFindings || [],
      metadata: r.metadata || {},
      createdAt: r.createdAt.toISOString(),
    };
  }

  private mapDecision(r: any): ExecutiveDecisionDto {
    return {
      id: r.id,
      userId: r.userId,
      decisionType: r.decisionType,
      title: r.title,
      contextData: r.contextData || {},
      optionsEvaluated: r.optionsEvaluated || [],
      recommendedAction: r.recommendedAction,
      riskScore: Number(r.riskScore),
      confidenceScore: Number(r.confidenceScore),
      expectedOutcomes: r.expectedOutcomes || [],
      createdAt: r.createdAt.toISOString(),
    };
  }

  private mapAnalytics(r: any): ProductivityAnalyticsDto {
    return {
      id: r.id,
      userId: r.userId,
      timeframe: r.timeframe,
      periodDate: r.periodDate,
      focusMetrics: r.focusMetrics || { focusScore: 80, deepWorkHours: 24, distractionScore: 15, peakProductivityHours: '09:00 - 13:00' },
      learningVelocity: Number(r.learningVelocity),
      careerGrowthVelocity: Number(r.careerGrowthVelocity),
      tasksCompleted: r.tasksCompleted || 0,
      agentEffectivenessScore: Number(r.agentEffectivenessScore),
      agentBreakdown: r.agentBreakdown || [],
      recommendations: r.recommendations || [],
      createdAt: r.createdAt.toISOString(),
    };
  }
}

export const agenticWorkspaceRepository = new AgenticWorkspaceRepository();
