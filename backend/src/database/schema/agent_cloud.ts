import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  doublePrecision,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { organizations } from './enterprise';
import {
  agentCloudStateEnum,
  distributedWorkflowTypeEnum,
  workflowRunStatusEnum,
  workflowStepStatusEnum,
  globalEventTypeEnum,
  workforceAgentRoleEnum,
  taskOSPriorityEnum,
  taskOSStatusEnum,
  memoryFabricTypeEnum,
  knowledgeGraphDomainEnum,
  decisionCenterStatusEnum,
  telemetryMetricTypeEnum,
} from './enums';
import {
  AgentCloudState,
  DistributedWorkflowType,
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

// ==========================================
// 1. AGENT INSTANCES (Persistent Agent Runtime)
// ==========================================
export const agentInstances = pgTable(
  'agent_instances',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description').notNull(),
    role: workforceAgentRoleEnum('role').notNull(),
    state: agentCloudStateEnum('state').default(AgentCloudState.CREATED).notNull(),
    systemPrompt: text('system_prompt').notNull(),
    capabilities: jsonb('capabilities').$type<string[]>().default([]).notNull(),
    assignedTools: jsonb('assigned_tools').$type<string[]>().default([]).notNull(),
    isAlwaysOn: boolean('is_always_on').default(false).notNull(),
    scheduleCron: varchar('schedule_cron', { length: 100 }),
    config: jsonb('config').$type<Record<string, any>>().default({}).notNull(),
    lastHeartbeatAt: timestamp('last_heartbeat_at', { withTimezone: true }),
    errorCount: integer('error_count').default(0).notNull(),
    totalRuns: integer('total_runs').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('idx_agent_inst_user').on(table.userId),
    stateIdx: index('idx_agent_inst_state').on(table.state),
    roleIdx: index('idx_agent_inst_role').on(table.role),
  })
);

// ==========================================
// 2. AGENT RUNS (Execution History & Auditing)
// ==========================================
export const agentRuns = pgTable(
  'agent_runs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    state: agentCloudStateEnum('state').default(AgentCloudState.RUNNING).notNull(),
    inputPayload: jsonb('input_payload').$type<Record<string, any>>().default({}).notNull(),
    outputPayload: jsonb('output_payload').$type<Record<string, any>>(),
    errorMessage: text('error_message'),
    executionTimeMs: integer('execution_time_ms').default(0).notNull(),
    tokensConsumed: integer('tokens_consumed').default(0).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  table => ({
    agentIdIdx: index('idx_agent_runs_agent').on(table.agentId),
    userIdIdx: index('idx_agent_runs_user').on(table.userId),
  })
);

// ==========================================
// 3. AGENT TASKS (Long-Running & Queued Tasks)
// ==========================================
export const agentCloudTasks = pgTable(
  'agent_cloud_tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    priority: taskOSPriorityEnum('priority').default(TaskOSPriority.MEDIUM).notNull(),
    status: taskOSStatusEnum('status').default(TaskOSStatus.TODO).notNull(),
    payload: jsonb('payload').$type<Record<string, any>>().default({}).notNull(),
    result: jsonb('result').$type<Record<string, any>>(),
    retryCount: integer('retry_count').default(0).notNull(),
    maxRetries: integer('max_retries').default(3).notNull(),
    deadline: timestamp('deadline', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    agentIdIdx: index('idx_cloud_tasks_agent').on(table.agentId),
    userIdIdx: index('idx_cloud_tasks_user').on(table.userId),
    statusIdx: index('idx_cloud_tasks_status').on(table.status),
  })
);

// ==========================================
// 4. AGENT SCHEDULES (Cron & Background Triggers)
// ==========================================
export const agentSchedules = pgTable(
  'agent_schedules',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    cronExpression: varchar('cron_expression', { length: 100 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    lastExecutedAt: timestamp('last_executed_at', { withTimezone: true }),
    nextExecutionAt: timestamp('next_execution_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    agentIdIdx: index('idx_agent_sched_agent').on(table.agentId),
    userIdIdx: index('idx_agent_sched_user').on(table.userId),
  })
);

// ==========================================
// 5. WORKFLOW DEFINITIONS (DAG Workflows)
// ==========================================
export const workflowDefinitions = pgTable(
  'workflow_definitions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull(),
    description: text('description').notNull(),
    workflowType: distributedWorkflowTypeEnum('workflow_type').notNull(),
    version: integer('version').default(1).notNull(),
    isEnterprise: boolean('is_enterprise').default(false).notNull(),
    steps: jsonb('steps').$type<any[]>().default([]).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('idx_wf_def_user').on(table.userId),
    typeIdx: index('idx_wf_def_type').on(table.workflowType),
  })
);

// ==========================================
// 6. WORKFLOW RUNS (Distributed Executions)
// ==========================================
export const workflowRuns = pgTable(
  'workflow_runs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workflowId: uuid('workflow_id').references(() => workflowDefinitions.id, { onDelete: 'cascade' }).notNull(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    status: workflowRunStatusEnum('status').default(WorkflowRunStatus.PENDING).notNull(),
    triggerEvent: varchar('trigger_event', { length: 150 }),
    currentStepIndex: integer('current_step_index').default(0).notNull(),
    totalSteps: integer('total_steps').default(0).notNull(),
    contextData: jsonb('context_data').$type<Record<string, any>>().default({}).notNull(),
    errorLog: text('error_log'),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  table => ({
    workflowIdIdx: index('idx_wf_run_wf').on(table.workflowId),
    userIdIdx: index('idx_wf_run_user').on(table.userId),
    statusIdx: index('idx_wf_run_status').on(table.status),
  })
);

// ==========================================
// 7. WORKFLOW STEPS (Step Level Execution)
// ==========================================
export const workflowSteps = pgTable(
  'workflow_steps',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workflowRunId: uuid('workflow_run_id').references(() => workflowRuns.id, { onDelete: 'cascade' }).notNull(),
    stepId: varchar('step_id', { length: 100 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    status: workflowStepStatusEnum('status').default(WorkflowStepStatus.PENDING).notNull(),
    inputPayload: jsonb('input_payload').$type<Record<string, any>>().default({}).notNull(),
    outputPayload: jsonb('output_payload').$type<Record<string, any>>(),
    retryAttempts: integer('retry_attempts').default(0).notNull(),
    durationMs: integer('duration_ms').default(0).notNull(),
    errorMessage: text('error_message'),
    executedAt: timestamp('executed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    workflowRunIdIdx: index('idx_wf_steps_run').on(table.workflowRunId),
  })
);

// ==========================================
// 8. WORKFLOW EVENTS (State Transitions)
// ==========================================
export const workflowEvents = pgTable(
  'workflow_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    workflowRunId: uuid('workflow_run_id').references(() => workflowRuns.id, { onDelete: 'cascade' }).notNull(),
    eventType: varchar('event_type', { length: 150 }).notNull(),
    payload: jsonb('payload').$type<Record<string, any>>().default({}).notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    workflowRunIdIdx: index('idx_wf_events_run').on(table.workflowRunId),
  })
);

// ==========================================
// 9. EVENT STREAM (Global Event Bus Log)
// ==========================================
export const eventStream = pgTable(
  'event_stream',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    eventType: globalEventTypeEnum('event_type').notNull(),
    payload: jsonb('payload').$type<Record<string, any>>().default({}).notNull(),
    source: varchar('source', { length: 150 }).default('system').notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    eventTypeIdx: index('idx_event_stream_type').on(table.eventType),
    userIdIdx: index('idx_event_stream_user').on(table.userId),
  })
);

// ==========================================
// 10. AUTOMATION RULES (Event Trigger Engine)
// ==========================================
export const automationRules = pgTable(
  'automation_rules',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description').notNull(),
    triggerEvent: globalEventTypeEnum('trigger_event').notNull(),
    conditionExpression: text('condition_expression'),
    actionWorkflowId: uuid('action_workflow_id').references(() => workflowDefinitions.id, { onDelete: 'set null' }),
    targetAgentId: uuid('target_agent_id').references(() => agentInstances.id, { onDelete: 'set null' }),
    isActive: boolean('is_active').default(true).notNull(),
    executionCount: integer('execution_count').default(0).notNull(),
    lastTriggeredAt: timestamp('last_triggered_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('idx_auto_rules_user').on(table.userId),
    triggerIdx: index('idx_auto_rules_trigger').on(table.triggerEvent),
  })
);

// ==========================================
// 11. AGENT MEMORIES (Memory Fabric 2.0)
// ==========================================
export const agentCloudMemories = pgTable(
  'agent_cloud_memories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'set null' }),
    memoryType: memoryFabricTypeEnum('memory_type').notNull(),
    key: varchar('key', { length: 255 }).notNull(),
    content: text('content').notNull(),
    vectorSummary: text('vector_summary'),
    importance: doublePrecision('importance').default(1.0).notNull(),
    accessCount: integer('access_count').default(0).notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}).notNull(),
    lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }).defaultNow().notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('idx_cloud_mem_user').on(table.userId),
    agentIdIdx: index('idx_cloud_mem_agent').on(table.agentId),
    typeIdx: index('idx_cloud_mem_type').on(table.memoryType),
  })
);

// ==========================================
// 12. SHARED MEMORIES (Org & Team Cross-Agent)
// ==========================================
export const sharedMemories = pgTable(
  'shared_memories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    scopeType: varchar('scope_type', { length: 50 }).notNull(), // 'team' | 'organization' | 'global'
    scopeId: uuid('scope_id').notNull(),
    memoryKey: varchar('memory_key', { length: 255 }).notNull(),
    memoryValue: text('memory_value').notNull(),
    contributors: jsonb('contributors').$type<string[]>().default([]).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    scopeIdx: index('idx_shared_mem_scope').on(table.scopeType, table.scopeId),
  })
);

// ==========================================
// 13. KNOWLEDGE GRAPH ENTITIES (Knowledge Fabric)
// ==========================================
export const knowledgeFabricEntities = pgTable(
  'knowledge_fabric_entities',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    domain: knowledgeGraphDomainEnum('domain').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    entityType: varchar('entity_type', { length: 100 }).notNull(),
    description: text('description').notNull(),
    properties: jsonb('properties').$type<Record<string, any>>().default({}).notNull(),
    centralityScore: doublePrecision('centrality_score').default(0.0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    domainIdx: index('idx_kfe_domain').on(table.domain),
    nameIdx: index('idx_kfe_name').on(table.name),
  })
);

// ==========================================
// 14. KNOWLEDGE GRAPH EDGES (Entity Relationships)
// ==========================================
export const knowledgeFabricEdges = pgTable(
  'knowledge_fabric_edges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sourceEntityId: uuid('source_entity_id').references(() => knowledgeFabricEntities.id, { onDelete: 'cascade' }).notNull(),
    targetEntityId: uuid('target_entity_id').references(() => knowledgeFabricEntities.id, { onDelete: 'cascade' }).notNull(),
    relationType: varchar('relation_type', { length: 150 }).notNull(),
    weight: doublePrecision('weight').default(1.0).notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    sourceIdx: index('idx_kfe_source').on(table.sourceEntityId),
    targetIdx: index('idx_kfe_target').on(table.targetEntityId),
  })
);

// ==========================================
// 15. DECISION RECORDS (AI Decision Center)
// ==========================================
export const decisionRecords = pgTable(
  'decision_records',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    context: text('context').notNull(),
    status: decisionCenterStatusEnum('status').default(DecisionCenterStatus.DRAFT).notNull(),
    options: jsonb('options').$type<any[]>().default([]).notNull(),
    recommendedOptionId: varchar('recommended_option_id', { length: 100 }),
    confidenceScore: doublePrecision('confidence_score').default(0.85).notNull(),
    strategicRoadmap: jsonb('strategic_roadmap').$type<any[]>().default([]).notNull(),
    executedOptionId: varchar('executed_option_id', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userIdIdx: index('idx_decision_rec_user').on(table.userId),
    statusIdx: index('idx_decision_rec_status').on(table.status),
  })
);

// ==========================================
// 16. TELEMETRY METRICS (Observability)
// ==========================================
export const telemetryMetrics = pgTable(
  'telemetry_metrics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'set null' }),
    metricType: telemetryMetricTypeEnum('metric_type').notNull(),
    value: doublePrecision('value').notNull(),
    unit: varchar('unit', { length: 50 }).notNull(),
    tags: jsonb('tags').$type<Record<string, string>>().default({}).notNull(),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    typeIdx: index('idx_telemetry_type').on(table.metricType),
    agentIdx: index('idx_telemetry_agent').on(table.agentId),
  })
);

// ==========================================
// 17. AGENT PERMISSIONS (Governance & ACL)
// ==========================================
export const agentPermissions = pgTable(
  'agent_permissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'cascade' }).notNull(),
    grantedToUserId: uuid('granted_to_user_id').references(() => users.id, { onDelete: 'cascade' }),
    grantedToOrgId: uuid('granted_to_org_id').references(() => organizations.id, { onDelete: 'cascade' }),
    canExecute: boolean('can_execute').default(true).notNull(),
    canModifyPrompt: boolean('can_modify_prompt').default(false).notNull(),
    canAccessMemory: boolean('can_access_memory').default(true).notNull(),
    canInvokeTools: boolean('can_invoke_tools').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    agentIdIdx: index('idx_agent_perm_agent').on(table.agentId),
    userIdIdx: index('idx_agent_perm_user').on(table.grantedToUserId),
  })
);

// ==========================================
// 18. AGENT AUDIT LOGS (Security & Compliance)
// ==========================================
export const agentAuditLogs = pgTable(
  'agent_audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'cascade' }).notNull(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    action: varchar('action', { length: 150 }).notNull(),
    details: jsonb('details').$type<Record<string, any>>().default({}).notNull(),
    ipAddress: varchar('ip_address', { length: 50 }),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    agentIdIdx: index('idx_agent_audit_agent').on(table.agentId),
    actorIdIdx: index('idx_agent_audit_actor').on(table.actorUserId),
  })
);

// ==========================================
// 19. TEAM AGENTS (Organizational Pools)
// ==========================================
export const teamAgents = pgTable(
  'team_agents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    teamId: uuid('team_id').notNull(),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'cascade' }).notNull(),
    role: workforceAgentRoleEnum('role').notNull(),
    assignedWorkflows: jsonb('assigned_workflows').$type<string[]>().default([]).notNull(),
    permissions: jsonb('permissions').$type<string[]>().default(['execute']).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    teamIdIdx: index('idx_team_agents_team').on(table.teamId),
    agentIdIdx: index('idx_team_agents_agent').on(table.agentId),
  })
);

// ==========================================
// 20. ORGANIZATION AGENTS (Enterprise Workforces)
// ==========================================
export const organizationAgents = pgTable(
  'organization_agents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
    agentId: uuid('agent_id').references(() => agentInstances.id, { onDelete: 'cascade' }).notNull(),
    department: varchar('department', { length: 150 }).notNull(),
    role: workforceAgentRoleEnum('role').notNull(),
    isEnterpriseShared: boolean('is_enterprise_shared').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    orgIdIdx: index('idx_org_agents_org').on(table.organizationId),
    agentIdIdx: index('idx_org_agents_agent').on(table.agentId),
  })
);

// ==========================================
// RELATIONS DEFINITIONS
// ==========================================
export const agentInstancesRelations = relations(agentInstances, ({ one, many }) => ({
  user: one(users, {
    fields: [agentInstances.userId],
    references: [users.id],
  }),
  runs: many(agentRuns),
  tasks: many(agentCloudTasks),
  schedules: many(agentSchedules),
  memories: many(agentCloudMemories),
  permissions: many(agentPermissions),
  auditLogs: many(agentAuditLogs),
}));

export const workflowDefinitionsRelations = relations(workflowDefinitions, ({ one, many }) => ({
  user: one(users, {
    fields: [workflowDefinitions.userId],
    references: [users.id],
  }),
  runs: many(workflowRuns),
  automationRules: many(automationRules),
}));

export const workflowRunsRelations = relations(workflowRuns, ({ one, many }) => ({
  workflow: one(workflowDefinitions, {
    fields: [workflowRuns.workflowId],
    references: [workflowDefinitions.id],
  }),
  user: one(users, {
    fields: [workflowRuns.userId],
    references: [users.id],
  }),
  steps: many(workflowSteps),
  events: many(workflowEvents),
}));
