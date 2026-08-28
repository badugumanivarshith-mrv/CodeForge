import { eq, and, desc, ilike, or } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  agentInstances,
  agentRuns,
  agentCloudTasks,
  agentSchedules,
  workflowDefinitions,
  workflowRuns,
  workflowSteps,
  eventStream,
  automationRules,
  agentCloudMemories,
  sharedMemories,
  knowledgeFabricEntities,
  knowledgeFabricEdges,
  decisionRecords,
  telemetryMetrics,
  agentPermissions,
  agentAuditLogs,
  teamAgents,
  organizationAgents,
} from '../database/schema/agent_cloud';
import { IAgentCloudRepository } from './interfaces/IAgentCloudRepository';
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
  TaskOSPriority,
  TaskOSStatus,
  MemoryFabricType,
  KnowledgeGraphDomain,
  DecisionCenterStatus,
  TelemetryMetricType,
} from '@codeforge/shared';

export class AgentCloudRepository implements IAgentCloudRepository {
  // Module 1: Persistent Agent Cloud
  async createAgentInstance(userId: string, data: CreateAgentInstanceDto, organizationId?: string | null): Promise<AgentInstanceDto> {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const [inserted] = await db
      .insert(agentInstances)
      .values({
        userId,
        organizationId: organizationId || null,
        name: data.name,
        slug,
        description: data.description,
        role: data.role,
        state: AgentCloudState.CREATED,
        systemPrompt: data.systemPrompt,
        capabilities: data.capabilities || [],
        assignedTools: data.assignedTools || [],
        isAlwaysOn: data.isAlwaysOn ?? false,
        scheduleCron: data.scheduleCron || null,
        config: data.config || {},
        errorCount: 0,
        totalRuns: 0,
      })
      .returning();

    return this.mapAgentInstance(inserted);
  }

  async getAgentInstanceById(id: string, userId?: string): Promise<AgentInstanceDto | null> {
    const condition = userId
      ? and(eq(agentInstances.id, id), eq(agentInstances.userId, userId))
      : eq(agentInstances.id, id);

    const [found] = await db.select().from(agentInstances).where(condition).limit(1);
    return found ? this.mapAgentInstance(found) : null;
  }

  async listAgentInstances(userId: string, role?: WorkforceAgentRole, state?: AgentCloudState): Promise<AgentInstanceDto[]> {
    const conditions = [eq(agentInstances.userId, userId)];
    if (role) conditions.push(eq(agentInstances.role, role));
    if (state) conditions.push(eq(agentInstances.state, state));

    const list = await db
      .select()
      .from(agentInstances)
      .where(and(...conditions))
      .orderBy(desc(agentInstances.createdAt));

    return list.map((a: any) => this.mapAgentInstance(a));
  }

  async updateAgentInstanceState(id: string, userId: string, state: AgentCloudState, errorIncrement = false): Promise<AgentInstanceDto | null> {
    const existing = await this.getAgentInstanceById(id, userId);
    if (!existing) return null;

    const [updated] = await db
      .update(agentInstances)
      .set({
        state,
        errorCount: errorIncrement ? existing.errorCount + 1 : existing.errorCount,
        lastHeartbeatAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(agentInstances.id, id), eq(agentInstances.userId, userId)))
      .returning();

    return updated ? this.mapAgentInstance(updated) : null;
  }

  async updateAgentHeartbeat(id: string, userId: string): Promise<void> {
    await db
      .update(agentInstances)
      .set({
        lastHeartbeatAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(agentInstances.id, id), eq(agentInstances.userId, userId)));
  }

  async deleteAgentInstance(id: string, userId: string): Promise<boolean> {
    const res = await db
      .delete(agentInstances)
      .where(and(eq(agentInstances.id, id), eq(agentInstances.userId, userId)))
      .returning();
    return res.length > 0;
  }

  async createAgentRun(agentId: string, userId: string, inputPayload: Record<string, any>): Promise<AgentRunDto> {
    const [inserted] = await db
      .insert(agentRuns)
      .values({
        agentId,
        userId,
        state: AgentCloudState.RUNNING,
        inputPayload,
        startedAt: new Date(),
      })
      .returning();

    // Increment agent totalRuns
    const agent = await this.getAgentInstanceById(agentId, userId);
    if (agent) {
      await db
        .update(agentInstances)
        .set({ totalRuns: agent.totalRuns + 1, lastHeartbeatAt: new Date() })
        .where(eq(agentInstances.id, agentId));
    }

    return this.mapAgentRun(inserted);
  }

  async completeAgentRun(runId: string, outputPayload: Record<string, any>, executionTimeMs: number, tokensConsumed: number, error?: string | null): Promise<AgentRunDto | null> {
    const [updated] = await db
      .update(agentRuns)
      .set({
        state: error ? AgentCloudState.FAILED : AgentCloudState.COMPLETED,
        outputPayload,
        errorMessage: error || null,
        executionTimeMs,
        tokensConsumed,
        completedAt: new Date(),
      })
      .where(eq(agentRuns.id, runId))
      .returning();

    return updated ? this.mapAgentRun(updated) : null;
  }

  async listAgentRuns(agentId: string, userId: string): Promise<AgentRunDto[]> {
    const list = await db
      .select()
      .from(agentRuns)
      .where(and(eq(agentRuns.agentId, agentId), eq(agentRuns.userId, userId)))
      .orderBy(desc(agentRuns.startedAt));

    return list.map((r: any) => this.mapAgentRun(r));
  }

  async createAgentTask(agentId: string, userId: string, data: { title: string; priority?: any; payload: Record<string, any>; deadline?: string | null }): Promise<AgentCloudTaskDto> {
    const [inserted] = await db
      .insert(agentCloudTasks)
      .values({
        agentId,
        userId,
        title: data.title,
        priority: data.priority || TaskOSPriority.MEDIUM,
        status: TaskOSStatus.TODO,
        payload: data.payload,
        deadline: data.deadline ? new Date(data.deadline) : null,
      })
      .returning();

    return this.mapAgentTask(inserted);
  }

  async updateAgentTaskStatus(taskId: string, userId: string, status: any, result?: Record<string, any>): Promise<AgentCloudTaskDto | null> {
    const [updated] = await db
      .update(agentCloudTasks)
      .set({
        status,
        result: result || null,
        updatedAt: new Date(),
      })
      .where(and(eq(agentCloudTasks.id, taskId), eq(agentCloudTasks.userId, userId)))
      .returning();

    return updated ? this.mapAgentTask(updated) : null;
  }

  async listAgentTasks(agentId: string, userId: string): Promise<AgentCloudTaskDto[]> {
    const list = await db
      .select()
      .from(agentCloudTasks)
      .where(and(eq(agentCloudTasks.agentId, agentId), eq(agentCloudTasks.userId, userId)))
      .orderBy(desc(agentCloudTasks.createdAt));

    return list.map((t: any) => this.mapAgentTask(t));
  }

  async createAgentSchedule(agentId: string, userId: string, cronExpression: string): Promise<AgentScheduleDto> {
    const [inserted] = await db
      .insert(agentSchedules)
      .values({
        agentId,
        userId,
        cronExpression,
        isActive: true,
      })
      .returning();

    return {
      id: inserted.id,
      agentId: inserted.agentId,
      userId: inserted.userId,
      cronExpression: inserted.cronExpression,
      isActive: inserted.isActive,
      lastExecutedAt: inserted.lastExecutedAt ? inserted.lastExecutedAt.toISOString() : null,
      nextExecutionAt: inserted.nextExecutionAt ? inserted.nextExecutionAt.toISOString() : null,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listAgentSchedules(agentId: string, userId: string): Promise<AgentScheduleDto[]> {
    const list = await db
      .select()
      .from(agentSchedules)
      .where(and(eq(agentSchedules.agentId, agentId), eq(agentSchedules.userId, userId)))
      .orderBy(desc(agentSchedules.createdAt));

    return list.map((s: any) => ({
      id: s.id,
      agentId: s.agentId,
      userId: s.userId,
      cronExpression: s.cronExpression,
      isActive: s.isActive,
      lastExecutedAt: s.lastExecutedAt ? s.lastExecutedAt.toISOString() : null,
      nextExecutionAt: s.nextExecutionAt ? s.nextExecutionAt.toISOString() : null,
      createdAt: s.createdAt.toISOString(),
    }));
  }

  // Module 2: Distributed Workflow Engine
  async createWorkflowDefinition(userId: string, data: CreateWorkflowDefinitionDto, organizationId?: string | null): Promise<WorkflowDefinitionDto> {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const [inserted] = await db
      .insert(workflowDefinitions)
      .values({
        userId,
        organizationId: organizationId || null,
        title: data.title,
        slug,
        description: data.description,
        workflowType: data.workflowType,
        version: 1,
        isEnterprise: data.isEnterprise ?? false,
        steps: data.steps,
      })
      .returning();

    return this.mapWorkflowDefinition(inserted);
  }

  async getWorkflowDefinitionById(id: string): Promise<WorkflowDefinitionDto | null> {
    const [found] = await db.select().from(workflowDefinitions).where(eq(workflowDefinitions.id, id)).limit(1);
    return found ? this.mapWorkflowDefinition(found) : null;
  }

  async listWorkflowDefinitions(userId: string, type?: string): Promise<WorkflowDefinitionDto[]> {
    const conditions = [eq(workflowDefinitions.userId, userId)];
    if (type) conditions.push(eq(workflowDefinitions.workflowType, type as any));

    const list = await db
      .select()
      .from(workflowDefinitions)
      .where(and(...conditions))
      .orderBy(desc(workflowDefinitions.createdAt));

    return list.map((w: any) => this.mapWorkflowDefinition(w));
  }

  async createWorkflowRun(workflowId: string, userId: string, totalSteps: number, contextData: Record<string, any>, triggerEvent?: string | null): Promise<WorkflowRunDto> {
    const [inserted] = await db
      .insert(workflowRuns)
      .values({
        workflowId,
        userId,
        status: WorkflowRunStatus.RUNNING,
        triggerEvent: triggerEvent || null,
        currentStepIndex: 0,
        totalSteps,
        contextData,
        startedAt: new Date(),
      })
      .returning();

    return this.mapWorkflowRun(inserted);
  }

  async getWorkflowRunById(id: string, userId: string): Promise<WorkflowRunDto | null> {
    const [found] = await db
      .select()
      .from(workflowRuns)
      .where(and(eq(workflowRuns.id, id), eq(workflowRuns.userId, userId)))
      .limit(1);
    return found ? this.mapWorkflowRun(found) : null;
  }

  async updateWorkflowRunStatus(id: string, userId: string, status: WorkflowRunStatus, currentStepIndex?: number, errorLog?: string | null): Promise<WorkflowRunDto | null> {
    const updateData: any = {
      status,
      errorLog: errorLog || null,
    };
    if (currentStepIndex !== undefined) updateData.currentStepIndex = currentStepIndex;
    if (status === WorkflowRunStatus.COMPLETED || status === WorkflowRunStatus.FAILED) {
      updateData.completedAt = new Date();
    }

    const [updated] = await db
      .update(workflowRuns)
      .set(updateData)
      .where(and(eq(workflowRuns.id, id), eq(workflowRuns.userId, userId)))
      .returning();

    return updated ? this.mapWorkflowRun(updated) : null;
  }

  async listWorkflowRuns(workflowId: string, userId: string): Promise<WorkflowRunDto[]> {
    const list = await db
      .select()
      .from(workflowRuns)
      .where(and(eq(workflowRuns.workflowId, workflowId), eq(workflowRuns.userId, userId)))
      .orderBy(desc(workflowRuns.startedAt));

    return list.map((r: any) => this.mapWorkflowRun(r));
  }

  async createWorkflowStepRun(workflowRunId: string, stepId: string, name: string, inputPayload: Record<string, any>): Promise<DistributedWorkflowStepDto> {
    const [inserted] = await db
      .insert(workflowSteps)
      .values({
        workflowRunId,
        stepId,
        name,
        status: WorkflowStepStatus.RUNNING,
        inputPayload,
        executedAt: new Date(),
      })
      .returning();

    return this.mapWorkflowStep(inserted);
  }

  async completeWorkflowStepRun(id: string, status: WorkflowStepStatus, outputPayload?: Record<string, any> | null, durationMs = 0, errorMessage?: string | null): Promise<DistributedWorkflowStepDto | null> {
    const [updated] = await db
      .update(workflowSteps)
      .set({
        status,
        outputPayload: outputPayload || null,
        durationMs,
        errorMessage: errorMessage || null,
      })
      .where(eq(workflowSteps.id, id))
      .returning();

    return updated ? this.mapWorkflowStep(updated) : null;
  }

  async listWorkflowStepRuns(workflowRunId: string): Promise<DistributedWorkflowStepDto[]> {
    const list = await db
      .select()
      .from(workflowSteps)
      .where(eq(workflowSteps.workflowRunId, workflowRunId))
      .orderBy(workflowSteps.executedAt);

    return list.map((s: any) => this.mapWorkflowStep(s));
  }

  // Module 3: Event Bus & Automation Engine
  async recordEventStream(data: { userId?: string | null; eventType: GlobalEventType; payload: Record<string, any>; source?: string }): Promise<EventStreamDto> {
    const [inserted] = await db
      .insert(eventStream)
      .values({
        userId: data.userId || null,
        eventType: data.eventType,
        payload: data.payload,
        source: data.source || 'system',
        timestamp: new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      userId: inserted.userId,
      eventType: inserted.eventType as GlobalEventType,
      payload: inserted.payload,
      source: inserted.source,
      timestamp: inserted.timestamp.toISOString(),
    };
  }

  async listEventStream(userId?: string | null, limit = 50): Promise<EventStreamDto[]> {
    let query = db.select().from(eventStream);
    if (userId) {
      query = query.where(eq(eventStream.userId, userId)) as any;
    }
    const list = await query.orderBy(desc(eventStream.timestamp)).limit(limit);

    return list.map((e: any) => ({
      id: e.id,
      userId: e.userId,
      eventType: e.eventType as GlobalEventType,
      payload: e.payload,
      source: e.source,
      timestamp: e.timestamp.toISOString(),
    }));
  }

  async createAutomationRule(userId: string, data: CreateAutomationRuleDto): Promise<AutomationRuleDto> {
    const [inserted] = await db
      .insert(automationRules)
      .values({
        userId,
        name: data.name,
        description: data.description,
        triggerEvent: data.triggerEvent,
        conditionExpression: data.conditionExpression || null,
        actionWorkflowId: data.actionWorkflowId || null,
        targetAgentId: data.targetAgentId || null,
        isActive: true,
      })
      .returning();

    return this.mapAutomationRule(inserted);
  }

  async listAutomationRules(userId: string, triggerEvent?: GlobalEventType): Promise<AutomationRuleDto[]> {
    const conditions = [eq(automationRules.userId, userId)];
    if (triggerEvent) conditions.push(eq(automationRules.triggerEvent, triggerEvent));

    const list = await db
      .select()
      .from(automationRules)
      .where(and(...conditions))
      .orderBy(desc(automationRules.createdAt));

    return list.map((r: any) => this.mapAutomationRule(r));
  }

  async incrementRuleExecution(ruleId: string): Promise<void> {
    const [rule] = await db.select().from(automationRules).where(eq(automationRules.id, ruleId)).limit(1);
    if (rule) {
      await db
        .update(automationRules)
        .set({
          executionCount: rule.executionCount + 1,
          lastTriggeredAt: new Date(),
        })
        .where(eq(automationRules.id, ruleId));
    }
  }

  // Module 5: Organizational Workforces
  async assignTeamAgent(teamId: string, agentId: string, role: WorkforceAgentRole, workflows: string[] = [], permissions: string[] = ['execute']): Promise<WorkforceTeamAgentDto> {
    const [inserted] = await db
      .insert(teamAgents)
      .values({
        teamId,
        agentId,
        role,
        assignedWorkflows: workflows,
        permissions,
      })
      .returning();

    return {
      id: inserted.id,
      teamId: inserted.teamId,
      agentId: inserted.agentId,
      role: inserted.role as WorkforceAgentRole,
      assignedWorkflows: inserted.assignedWorkflows,
      permissions: inserted.permissions,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listTeamAgents(teamId: string): Promise<WorkforceTeamAgentDto[]> {
    const list = await db.select().from(teamAgents).where(eq(teamAgents.teamId, teamId)).orderBy(desc(teamAgents.createdAt));
    return list.map((a: any) => ({
      id: a.id,
      teamId: a.teamId,
      agentId: a.agentId,
      role: a.role as WorkforceAgentRole,
      assignedWorkflows: a.assignedWorkflows,
      permissions: a.permissions,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  async assignOrgAgent(orgId: string, agentId: string, department: string, role: WorkforceAgentRole, isEnterpriseShared = false): Promise<WorkforceOrgAgentDto> {
    const [inserted] = await db
      .insert(organizationAgents)
      .values({
        organizationId: orgId,
        agentId,
        department,
        role,
        isEnterpriseShared,
      })
      .returning();

    return {
      id: inserted.id,
      organizationId: inserted.organizationId,
      agentId: inserted.agentId,
      department: inserted.department,
      role: inserted.role as WorkforceAgentRole,
      isEnterpriseShared: inserted.isEnterpriseShared,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async listOrgAgents(orgId: string): Promise<WorkforceOrgAgentDto[]> {
    const list = await db.select().from(organizationAgents).where(eq(organizationAgents.organizationId, orgId)).orderBy(desc(organizationAgents.createdAt));
    return list.map((a: any) => ({
      id: a.id,
      organizationId: a.organizationId,
      agentId: a.agentId,
      department: a.department,
      role: a.role as WorkforceAgentRole,
      isEnterpriseShared: a.isEnterpriseShared,
      createdAt: a.createdAt.toISOString(),
    }));
  }

  // Module 7: Memory Fabric 2.0
  async storeMemory(userId: string, data: StoreMemoryDto): Promise<MemoryFabricRecordDto> {
    const [inserted] = await db
      .insert(agentCloudMemories)
      .values({
        userId,
        agentId: data.agentId || null,
        memoryType: data.memoryType,
        key: data.key,
        content: data.content,
        importance: data.importance ?? 1.0,
        metadata: data.metadata || {},
        lastAccessedAt: new Date(),
      })
      .returning();

    return this.mapAgentMemory(inserted);
  }

  async findMemoryByKey(userId: string, key: string, agentId?: string | null): Promise<MemoryFabricRecordDto | null> {
    const conditions = [eq(agentCloudMemories.userId, userId), eq(agentCloudMemories.key, key)];
    if (agentId) conditions.push(eq(agentCloudMemories.agentId, agentId));

    const [found] = await db.select().from(agentCloudMemories).where(and(...conditions)).limit(1);
    if (found) {
      await db.update(agentCloudMemories).set({ accessCount: found.accessCount + 1, lastAccessedAt: new Date() }).where(eq(agentCloudMemories.id, found.id));
      return this.mapAgentMemory(found);
    }
    return null;
  }

  async searchMemories(userId: string, query: string, memoryType?: MemoryFabricType, limit = 20): Promise<MemoryFabricRecordDto[]> {
    const conditions = [eq(agentCloudMemories.userId, userId)];
    if (memoryType) conditions.push(eq(agentCloudMemories.memoryType, memoryType));
    if (query) {
      conditions.push(or(ilike(agentCloudMemories.key, `%${query}%`), ilike(agentCloudMemories.content, `%${query}%`)) as any);
    }

    const list = await db.select().from(agentCloudMemories).where(and(...conditions)).orderBy(desc(agentCloudMemories.importance)).limit(limit);
    return list.map((m: any) => this.mapAgentMemory(m));
  }

  async storeSharedMemory(scopeType: 'team' | 'organization' | 'global', scopeId: string, key: string, value: string, contributorId: string): Promise<SharedMemoryDto> {
    const [existing] = await db
      .select()
      .from(sharedMemories)
      .where(and(eq(sharedMemories.scopeType, scopeType), eq(sharedMemories.scopeId, scopeId), eq(sharedMemories.memoryKey, key)))
      .limit(1);

    if (existing) {
      const contributors = Array.from(new Set([...existing.contributors, contributorId]));
      const [updated] = await db
        .update(sharedMemories)
        .set({ memoryValue: value, contributors, updatedAt: new Date() })
        .where(eq(sharedMemories.id, existing.id))
        .returning();

      return {
        id: updated.id,
        scopeType: updated.scopeType as any,
        scopeId: updated.scopeId,
        memoryKey: updated.memoryKey,
        memoryValue: updated.memoryValue,
        contributors: updated.contributors,
        updatedAt: updated.updatedAt.toISOString(),
      };
    }

    const [inserted] = await db
      .insert(sharedMemories)
      .values({
        scopeType,
        scopeId,
        memoryKey: key,
        memoryValue: value,
        contributors: [contributorId],
      })
      .returning();

    return {
      id: inserted.id,
      scopeType: inserted.scopeType as any,
      scopeId: inserted.scopeId,
      memoryKey: inserted.memoryKey,
      memoryValue: inserted.memoryValue,
      contributors: inserted.contributors,
      updatedAt: inserted.updatedAt.toISOString(),
    };
  }

  async getSharedMemory(scopeType: string, scopeId: string, key: string): Promise<SharedMemoryDto | null> {
    const [found] = await db
      .select()
      .from(sharedMemories)
      .where(and(eq(sharedMemories.scopeType, scopeType), eq(sharedMemories.scopeId, scopeId), eq(sharedMemories.memoryKey, key)))
      .limit(1);

    if (!found) return null;
    return {
      id: found.id,
      scopeType: found.scopeType as any,
      scopeId: found.scopeId,
      memoryKey: found.memoryKey,
      memoryValue: found.memoryValue,
      contributors: found.contributors,
      updatedAt: found.updatedAt.toISOString(),
    };
  }

  // Module 8: Knowledge Fabric
  async createKnowledgeEntity(data: { domain: KnowledgeGraphDomain; name: string; entityType: string; description: string; properties?: Record<string, any> }): Promise<KnowledgeFabricEntityDto> {
    const [inserted] = await db
      .insert(knowledgeFabricEntities)
      .values({
        domain: data.domain,
        name: data.name,
        entityType: data.entityType,
        description: data.description,
        properties: data.properties || {},
        centralityScore: 0.0,
      })
      .returning();

    return {
      id: inserted.id,
      domain: inserted.domain as KnowledgeGraphDomain,
      name: inserted.name,
      entityType: inserted.entityType,
      description: inserted.description,
      properties: inserted.properties,
      centralityScore: inserted.centralityScore,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async createKnowledgeEdge(data: { sourceEntityId: string; targetEntityId: string; relationType: string; weight?: number; metadata?: Record<string, any> }): Promise<KnowledgeFabricEdgeDto> {
    const [inserted] = await db
      .insert(knowledgeFabricEdges)
      .values({
        sourceEntityId: data.sourceEntityId,
        targetEntityId: data.targetEntityId,
        relationType: data.relationType,
        weight: data.weight ?? 1.0,
        metadata: data.metadata || {},
      })
      .returning();

    return {
      id: inserted.id,
      sourceEntityId: inserted.sourceEntityId,
      targetEntityId: inserted.targetEntityId,
      relationType: inserted.relationType,
      weight: inserted.weight,
      metadata: inserted.metadata,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async getKnowledgeGraphByDomain(domain: KnowledgeGraphDomain): Promise<{ entities: KnowledgeFabricEntityDto[]; edges: KnowledgeFabricEdgeDto[] }> {
    const entities = await db.select().from(knowledgeFabricEntities).where(eq(knowledgeFabricEntities.domain, domain));
    const edges = await db.select().from(knowledgeFabricEdges);

    const entityIds = new Set(entities.map((e: any) => e.id));
    const validEdges = edges.filter((ed: any) => entityIds.has(ed.sourceEntityId) && entityIds.has(ed.targetEntityId));

    return {
      entities: entities.map((e: any) => ({
        id: e.id,
        domain: e.domain as KnowledgeGraphDomain,
        name: e.name,
        entityType: e.entityType,
        description: e.description,
        properties: e.properties,
        centralityScore: e.centralityScore,
        createdAt: e.createdAt.toISOString(),
      })),
      edges: validEdges.map((ed: any) => ({
        id: ed.id,
        sourceEntityId: ed.sourceEntityId,
        targetEntityId: ed.targetEntityId,
        relationType: ed.relationType,
        weight: ed.weight,
        metadata: ed.metadata,
        createdAt: ed.createdAt.toISOString(),
      })),
    };
  }

  // Module 9: AI Decision Center
  async createDecisionRecord(userId: string, data: CreateDecisionDto, analysis?: { options: any[]; recommendedOptionId?: string; confidenceScore?: number; roadmap?: any[] }): Promise<DecisionRecordDto> {
    const [inserted] = await db
      .insert(decisionRecords)
      .values({
        userId,
        title: data.title,
        context: data.context,
        status: DecisionCenterStatus.RECOMMENDED,
        options: analysis?.options || data.options || [],
        recommendedOptionId: analysis?.recommendedOptionId || null,
        confidenceScore: analysis?.confidenceScore ?? 0.88,
        strategicRoadmap: analysis?.roadmap || [],
      })
      .returning();

    return this.mapDecisionRecord(inserted);
  }

  async getDecisionRecordById(id: string, userId: string): Promise<DecisionRecordDto | null> {
    const [found] = await db
      .select()
      .from(decisionRecords)
      .where(and(eq(decisionRecords.id, id), eq(decisionRecords.userId, userId)))
      .limit(1);

    return found ? this.mapDecisionRecord(found) : null;
  }

  async updateDecisionStatus(id: string, userId: string, status: DecisionCenterStatus, executedOptionId?: string | null): Promise<DecisionRecordDto | null> {
    const [updated] = await db
      .update(decisionRecords)
      .set({
        status,
        executedOptionId: executedOptionId || null,
        updatedAt: new Date(),
      })
      .where(and(eq(decisionRecords.id, id), eq(decisionRecords.userId, userId)))
      .returning();

    return updated ? this.mapDecisionRecord(updated) : null;
  }

  async listDecisionRecords(userId: string): Promise<DecisionRecordDto[]> {
    const list = await db
      .select()
      .from(decisionRecords)
      .where(eq(decisionRecords.userId, userId))
      .orderBy(desc(decisionRecords.createdAt));

    return list.map((d: any) => this.mapDecisionRecord(d));
  }

  // Module 11: Telemetry & Metrics
  async recordTelemetryMetric(data: { userId?: string | null; agentId?: string | null; metricType: TelemetryMetricType; value: number; unit: string; tags?: Record<string, string> }): Promise<TelemetryMetricDto> {
    const [inserted] = await db
      .insert(telemetryMetrics)
      .values({
        userId: data.userId || null,
        agentId: data.agentId || null,
        metricType: data.metricType,
        value: data.value,
        unit: data.unit,
        tags: data.tags || {},
        recordedAt: new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      userId: inserted.userId,
      agentId: inserted.agentId,
      metricType: inserted.metricType as TelemetryMetricType,
      value: inserted.value,
      unit: inserted.unit,
      tags: inserted.tags,
      recordedAt: inserted.recordedAt.toISOString(),
    };
  }

  async listTelemetryMetrics(agentId?: string | null, metricType?: TelemetryMetricType, limit = 100): Promise<TelemetryMetricDto[]> {
    const conditions: any[] = [];
    if (agentId) conditions.push(eq(telemetryMetrics.agentId, agentId));
    if (metricType) conditions.push(eq(telemetryMetrics.metricType, metricType));

    let query = db.select().from(telemetryMetrics);
    if (conditions.length > 0) query = query.where(and(...conditions)) as any;

    const list = await query.orderBy(desc(telemetryMetrics.recordedAt)).limit(limit);
    return list.map((t: any) => ({
      id: t.id,
      userId: t.userId,
      agentId: t.agentId,
      metricType: t.metricType as TelemetryMetricType,
      value: t.value,
      unit: t.unit,
      tags: t.tags,
      recordedAt: t.recordedAt.toISOString(),
    }));
  }

  // Module 12: Governance, Security & Compliance
  async grantAgentPermission(agentId: string, grantedToUserId?: string | null, grantedToOrgId?: string | null, permissions?: { canExecute?: boolean; canModifyPrompt?: boolean; canAccessMemory?: boolean; canInvokeTools?: boolean }): Promise<AgentGovernancePermissionDto> {
    const [inserted] = await db
      .insert(agentPermissions)
      .values({
        agentId,
        grantedToUserId: grantedToUserId || null,
        grantedToOrgId: grantedToOrgId || null,
        canExecute: permissions?.canExecute ?? true,
        canModifyPrompt: permissions?.canModifyPrompt ?? false,
        canAccessMemory: permissions?.canAccessMemory ?? true,
        canInvokeTools: permissions?.canInvokeTools ?? true,
      })
      .returning();

    return {
      id: inserted.id,
      agentId: inserted.agentId,
      grantedToUserId: inserted.grantedToUserId,
      grantedToOrgId: inserted.grantedToOrgId,
      canExecute: inserted.canExecute,
      canModifyPrompt: inserted.canModifyPrompt,
      canAccessMemory: inserted.canAccessMemory,
      canInvokeTools: inserted.canInvokeTools,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async getAgentPermission(agentId: string, userId?: string | null, orgId?: string | null): Promise<AgentGovernancePermissionDto | null> {
    const conditions = [eq(agentPermissions.agentId, agentId)];
    if (userId) conditions.push(eq(agentPermissions.grantedToUserId, userId));
    if (orgId) conditions.push(eq(agentPermissions.grantedToOrgId, orgId));

    const [found] = await db.select().from(agentPermissions).where(and(...conditions)).limit(1);
    if (!found) return null;

    return {
      id: found.id,
      agentId: found.agentId,
      grantedToUserId: found.grantedToUserId,
      grantedToOrgId: found.grantedToOrgId,
      canExecute: found.canExecute,
      canModifyPrompt: found.canModifyPrompt,
      canAccessMemory: found.canAccessMemory,
      canInvokeTools: found.canInvokeTools,
      createdAt: found.createdAt.toISOString(),
    };
  }

  async recordAgentAuditLog(agentId: string, actorUserId: string, action: string, details?: Record<string, any>, ipAddress?: string | null): Promise<AgentAuditLogDto> {
    const [inserted] = await db
      .insert(agentAuditLogs)
      .values({
        agentId,
        actorUserId,
        action,
        details: details || {},
        ipAddress: ipAddress || null,
        timestamp: new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      agentId: inserted.agentId,
      actorUserId: inserted.actorUserId,
      action: inserted.action,
      details: inserted.details,
      ipAddress: inserted.ipAddress,
      timestamp: inserted.timestamp.toISOString(),
    };
  }

  async listAgentAuditLogs(agentId: string, limit = 50): Promise<AgentAuditLogDto[]> {
    const list = await db
      .select()
      .from(agentAuditLogs)
      .where(eq(agentAuditLogs.agentId, agentId))
      .orderBy(desc(agentAuditLogs.timestamp))
      .limit(limit);

    return list.map((l: any) => ({
      id: l.id,
      agentId: l.agentId,
      actorUserId: l.actorUserId,
      action: l.action,
      details: l.details,
      ipAddress: l.ipAddress,
      timestamp: l.timestamp.toISOString(),
    }));
  }

  // Mappers
  private mapAgentInstance(a: any): AgentInstanceDto {
    return {
      id: a.id,
      userId: a.userId,
      name: a.name,
      slug: a.slug,
      description: a.description,
      role: a.role as WorkforceAgentRole,
      state: a.state as AgentCloudState,
      systemPrompt: a.systemPrompt,
      capabilities: a.capabilities,
      assignedTools: a.assignedTools,
      isAlwaysOn: a.isAlwaysOn,
      scheduleCron: a.scheduleCron,
      config: a.config,
      lastHeartbeatAt: a.lastHeartbeatAt ? a.lastHeartbeatAt.toISOString() : null,
      errorCount: a.errorCount,
      totalRuns: a.totalRuns,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    };
  }

  private mapAgentRun(r: any): AgentRunDto {
    return {
      id: r.id,
      agentId: r.agentId,
      userId: r.userId,
      state: r.state as AgentCloudState,
      inputPayload: r.inputPayload,
      outputPayload: r.outputPayload,
      errorMessage: r.errorMessage,
      executionTimeMs: r.executionTimeMs,
      tokensConsumed: r.tokensConsumed,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
    };
  }

  private mapAgentTask(t: any): AgentCloudTaskDto {
    return {
      id: t.id,
      agentId: t.agentId,
      userId: t.userId,
      title: t.title,
      priority: t.priority,
      status: t.status,
      payload: t.payload,
      result: t.result,
      retryCount: t.retryCount,
      maxRetries: t.maxRetries,
      deadline: t.deadline ? t.deadline.toISOString() : null,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    };
  }

  private mapWorkflowDefinition(w: any): WorkflowDefinitionDto {
    return {
      id: w.id,
      userId: w.userId,
      title: w.title,
      slug: w.slug,
      description: w.description,
      workflowType: w.workflowType as any,
      version: w.version,
      isEnterprise: w.isEnterprise,
      steps: w.steps,
      createdAt: w.createdAt.toISOString(),
      updatedAt: w.updatedAt.toISOString(),
    };
  }

  private mapWorkflowRun(r: any): WorkflowRunDto {
    return {
      id: r.id,
      workflowId: r.workflowId,
      userId: r.userId,
      status: r.status as WorkflowRunStatus,
      triggerEvent: r.triggerEvent,
      currentStepIndex: r.currentStepIndex,
      totalSteps: r.totalSteps,
      contextData: r.contextData,
      errorLog: r.errorLog,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt ? r.completedAt.toISOString() : null,
    };
  }

  private mapWorkflowStep(s: any): DistributedWorkflowStepDto {
    return {
      id: s.id,
      workflowRunId: s.workflowRunId,
      stepId: s.stepId,
      name: s.name,
      status: s.status as WorkflowStepStatus,
      inputPayload: s.inputPayload,
      outputPayload: s.outputPayload,
      retryAttempts: s.retryAttempts,
      durationMs: s.durationMs,
      errorMessage: s.errorMessage,
      executedAt: s.executedAt.toISOString(),
    };
  }

  private mapAutomationRule(r: any): AutomationRuleDto {
    return {
      id: r.id,
      userId: r.userId,
      name: r.name,
      description: r.description,
      triggerEvent: r.triggerEvent as GlobalEventType,
      conditionExpression: r.conditionExpression,
      actionWorkflowId: r.actionWorkflowId,
      targetAgentId: r.targetAgentId,
      isActive: r.isActive,
      executionCount: r.executionCount,
      lastTriggeredAt: r.lastTriggeredAt ? r.lastTriggeredAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
    };
  }

  private mapAgentMemory(m: any): MemoryFabricRecordDto {
    return {
      id: m.id,
      userId: m.userId,
      agentId: m.agentId,
      memoryType: m.memoryType as MemoryFabricType,
      key: m.key,
      content: m.content,
      vectorSummary: m.vectorSummary,
      importance: m.importance,
      accessCount: m.accessCount,
      metadata: m.metadata,
      lastAccessedAt: m.lastAccessedAt.toISOString(),
      createdAt: m.createdAt.toISOString(),
    };
  }

  private mapDecisionRecord(d: any): DecisionRecordDto {
    return {
      id: d.id,
      userId: d.userId,
      title: d.title,
      context: d.context,
      status: d.status as DecisionCenterStatus,
      options: d.options,
      recommendedOptionId: d.recommendedOptionId,
      confidenceScore: d.confidenceScore,
      strategicRoadmap: d.strategicRoadmap,
      executedOptionId: d.executedOptionId,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    };
  }
}
