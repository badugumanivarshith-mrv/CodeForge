import { pgTable, uuid, varchar, text, timestamp, numeric, integer, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import {
  agentTypeEnum,
  agentStatusEnum,
  agentTaskPriorityEnum,
  workflowStatusEnum,
  workflowTriggerTypeEnum,
  memoryTypeEnum,
  knowledgeNodeTypeEnum,
  knowledgeRelationTypeEnum,
  documentTypeEnum,
  decisionTypeEnum,
} from './enums';
import {
  AgentType,
  AgentStatus,
  AgentTaskPriority,
  WorkflowStatus,
  WorkflowTriggerType,
} from '@codeforge/shared';

// 1. AI Agents Registry
export const aiAgents = pgTable(
  'ai_agents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    type: agentTypeEnum('type').notNull(),
    status: agentStatusEnum('status').notNull().default(AgentStatus.IDLE),
    capabilities: jsonb('capabilities').$type<string[]>().default([]),
    systemPrompt: text('system_prompt').notNull().default(''),
    configuration: jsonb('configuration').$type<Record<string, unknown>>().default({}),
    tasksCompleted: integer('tasks_completed').default(0),
    successRate: numeric('success_rate', { precision: 5, scale: 2 }).default('100.00'),
    avgExecutionTimeMs: integer('avg_execution_time_ms').default(0),
    lastActiveAt: timestamp('last_active_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_ai_agents_user_id').on(table.userId),
    typeIdx: index('idx_ai_agents_type').on(table.type),
  })
);

// 2. Agent Tasks
export const agentTasks = pgTable(
  'agent_tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: uuid('agent_id').notNull().references(() => aiAgents.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    priority: agentTaskPriorityEnum('priority').notNull().default(AgentTaskPriority.MEDIUM),
    status: agentStatusEnum('status').notNull().default(AgentStatus.PLANNING),
    inputPayload: jsonb('input_payload').$type<Record<string, unknown>>().default({}),
    outputResult: jsonb('output_result').$type<Record<string, unknown>>(),
    dependencies: jsonb('dependencies').$type<string[]>().default([]),
    toolsUsed: jsonb('tools_used').$type<string[]>().default([]),
    executionTimeMs: integer('execution_time_ms').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    completedAt: timestamp('completed_at'),
  },
  (table) => ({
    agentIdIdx: index('idx_agent_tasks_agent_id').on(table.agentId),
    userIdIdx: index('idx_agent_tasks_user_id').on(table.userId),
    statusIdx: index('idx_agent_tasks_status').on(table.status),
  })
);

// 3. Agent Workflows
export const agentWorkflows = pgTable(
  'agent_workflows',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    triggerType: workflowTriggerTypeEnum('trigger_type').notNull().default(WorkflowTriggerType.MANUAL),
    status: workflowStatusEnum('status').notNull().default(WorkflowStatus.ACTIVE),
    steps: jsonb('steps').$type<any[]>().default([]),
    scheduleCron: varchar('schedule_cron', { length: 100 }),
    lastRunAt: timestamp('last_run_at'),
    nextRunAt: timestamp('next_run_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_agent_workflows_user_id').on(table.userId),
    statusIdx: index('idx_agent_workflows_status').on(table.status),
  })
);

// 4. Agent Memories
export const agentMemories = pgTable(
  'agent_memories',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    agentId: uuid('agent_id').references(() => aiAgents.id, { onDelete: 'set null' }),
    memoryType: memoryTypeEnum('memory_type').notNull(),
    content: text('content').notNull(),
    importanceScore: numeric('importance_score', { precision: 5, scale: 2 }).notNull().default('50.00'),
    contextKey: varchar('context_key', { length: 255 }).notNull(),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    lastAccessedAt: timestamp('last_accessed_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_agent_memories_user_id').on(table.userId),
    contextKeyIdx: index('idx_agent_memories_context_key').on(table.contextKey),
  })
);

// 5. Autonomous Projects
export const autonomousProjects = pgTable(
  'autonomous_projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    goal: text('goal').notNull(),
    status: varchar('status', { length: 50 }).notNull().default('planning'),
    roadmap: jsonb('roadmap').$type<any[]>().default([]),
    sprintPlan: jsonb('sprint_plan').$type<any[]>().default([]),
    weeklyObjectives: jsonb('weekly_objectives').$type<any[]>().default([]),
    resourceAllocation: jsonb('resource_allocation').$type<Record<string, unknown>>().default({}),
    riskFactors: jsonb('risk_factors').$type<string[]>().default([]),
    progressPercentage: numeric('progress_percentage', { precision: 5, scale: 2 }).default('0.00'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_autonomous_projects_user_id').on(table.userId),
  })
);

// 6. Research Reports
export const researchReports = pgTable(
  'research_reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    topic: varchar('topic', { length: 255 }).notNull(),
    category: varchar('category', { length: 100 }).notNull().default('GENERAL'),
    executiveSummary: text('executive_summary').notNull(),
    reportContent: text('report_content').notNull(),
    swotAnalysis: jsonb('swot_analysis').$type<Record<string, any>>().default({}),
    opportunityMatrix: jsonb('opportunity_matrix').$type<any[]>().default([]),
    keyTrends: jsonb('key_trends').$type<string[]>().default([]),
    recommendations: jsonb('recommendations').$type<string[]>().default([]),
    sources: jsonb('sources').$type<any[]>().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_research_reports_user_id').on(table.userId),
  })
);

// 7. Knowledge Graph Nodes
export const knowledgeGraphNodes = pgTable(
  'knowledge_graph_nodes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    nodeType: knowledgeNodeTypeEnum('node_type').notNull(),
    category: varchar('category', { length: 100 }).notNull().default('General'),
    properties: jsonb('properties').$type<Record<string, unknown>>().default({}),
    confidenceScore: numeric('confidence_score', { precision: 5, scale: 2 }).default('90.00'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_kg_nodes_user_id').on(table.userId),
  })
);

// 8. Knowledge Graph Edges
export const knowledgeGraphEdges = pgTable(
  'knowledge_graph_edges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    sourceNodeId: uuid('source_node_id').notNull().references(() => knowledgeGraphNodes.id, { onDelete: 'cascade' }),
    targetNodeId: uuid('target_node_id').notNull().references(() => knowledgeGraphNodes.id, { onDelete: 'cascade' }),
    relationType: knowledgeRelationTypeEnum('relation_type').notNull(),
    weight: numeric('weight', { precision: 5, scale: 2 }).default('1.00'),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_kg_edges_user_id').on(table.userId),
    sourceIdx: index('idx_kg_edges_source').on(table.sourceNodeId),
    targetIdx: index('idx_kg_edges_target').on(table.targetNodeId),
  })
);

// 9. Workspace Documents
export const workspaceDocuments = pgTable(
  'workspace_documents',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    documentType: documentTypeEnum('document_type').notNull(),
    summary: text('summary').notNull(),
    extractedSkills: jsonb('extracted_skills').$type<string[]>().default([]),
    extractedActions: jsonb('extracted_actions').$type<string[]>().default([]),
    flashcards: jsonb('flashcards').$type<any[]>().default([]),
    keyFindings: jsonb('key_findings').$type<string[]>().default([]),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_workspace_docs_user_id').on(table.userId),
  })
);

// 10. Executive Decisions
export const executiveDecisions = pgTable(
  'executive_decisions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    decisionType: decisionTypeEnum('decision_type').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    contextData: jsonb('context_data').$type<Record<string, unknown>>().default({}),
    optionsEvaluated: jsonb('options_evaluated').$type<any[]>().default([]),
    recommendedAction: text('recommended_action').notNull(),
    riskScore: numeric('risk_score', { precision: 5, scale: 2 }).notNull().default('20.00'),
    confidenceScore: numeric('confidence_score', { precision: 5, scale: 2 }).notNull().default('85.00'),
    expectedOutcomes: jsonb('expected_outcomes').$type<string[]>().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_exec_decisions_user_id').on(table.userId),
  })
);

// 11. Productivity Analytics
export const productivityAnalytics = pgTable(
  'productivity_analytics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    timeframe: varchar('timeframe', { length: 50 }).notNull().default('weekly'),
    periodDate: varchar('period_date', { length: 50 }).notNull(),
    focusMetrics: jsonb('focus_metrics').$type<Record<string, any>>().default({}),
    learningVelocity: numeric('learning_velocity', { precision: 5, scale: 2 }).default('80.00'),
    careerGrowthVelocity: numeric('career_growth_velocity', { precision: 5, scale: 2 }).default('75.00'),
    tasksCompleted: integer('tasks_completed').default(0),
    agentEffectivenessScore: numeric('agent_effectiveness_score', { precision: 5, scale: 2 }).default('85.00'),
    agentBreakdown: jsonb('agent_breakdown').$type<any[]>().default([]),
    recommendations: jsonb('recommendations').$type<string[]>().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_prod_analytics_user_id').on(table.userId),
    timeframeIdx: index('idx_prod_analytics_timeframe').on(table.timeframe),
  })
);

// Relations
export const aiAgentsRelations = relations(aiAgents, ({ one, many }) => ({
  user: one(users, { fields: [aiAgents.userId], references: [users.id] }),
  tasks: many(agentTasks),
  memories: many(agentMemories),
}));

export const agentTasksRelations = relations(agentTasks, ({ one }) => ({
  agent: one(aiAgents, { fields: [agentTasks.agentId], references: [aiAgents.id] }),
  user: one(users, { fields: [agentTasks.userId], references: [users.id] }),
}));

export const knowledgeGraphNodesRelations = relations(knowledgeGraphNodes, ({ many }) => ({
  outEdges: many(knowledgeGraphEdges, { relationName: 'sourceNode' }),
  inEdges: many(knowledgeGraphEdges, { relationName: 'targetNode' }),
}));

export const knowledgeGraphEdgesRelations = relations(knowledgeGraphEdges, ({ one }) => ({
  sourceNode: one(knowledgeGraphNodes, { fields: [knowledgeGraphEdges.sourceNodeId], references: [knowledgeGraphNodes.id], relationName: 'sourceNode' }),
  targetNode: one(knowledgeGraphNodes, { fields: [knowledgeGraphEdges.targetNodeId], references: [knowledgeGraphNodes.id], relationName: 'targetNode' }),
}));
