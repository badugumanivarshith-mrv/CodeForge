import { pgTable, uuid, varchar, timestamp, jsonb, integer, doublePrecision } from 'drizzle-orm/pg-core';
import { platformEventSeverityEnum, crossModuleWorkflowStatusEnum } from './enums';
import { users } from './users';

export const platformEvents = pgTable('platform_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceModule: varchar('source_module', { length: 255 }).notNull(),
  eventName: varchar('event_name', { length: 255 }).notNull(),
  severity: platformEventSeverityEnum('severity').notNull(),
  payload: jsonb('payload').default({}).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const unifiedContext = pgTable('unified_context', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  contextKey: varchar('context_key', { length: 255 }).notNull(),
  contextValue: jsonb('context_value').default({}).notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const workflowExecutions = pgTable('workflow_executions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  workflowName: varchar('workflow_name', { length: 255 }).notNull(),
  status: crossModuleWorkflowStatusEnum('status').notNull(),
  triggerEvent: varchar('trigger_event', { length: 255 }).notNull(),
  executedSteps: jsonb('executed_steps').$type<Array<{
    stepNumber: number;
    moduleName: string;
    actionTaken: string;
    status: string;
    resultSummary?: string;
  }>>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

export const integrationMetrics = pgTable('integration_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  uptimeSeconds: integer('uptime_seconds').default(0).notNull(),
  cpuUsagePercent: doublePrecision('cpu_usage_percent').default(0.0).notNull(),
  memoryUsagePercent: doublePrecision('memory_usage_percent').default(0.0).notNull(),
  moduleHealthStates: jsonb('module_health_states').default({}).notNull(),
  activeWorkflowsCount: integer('active_workflows_count').default(0).notNull(),
  totalErrorsLogged: integer('total_errors_logged').default(0).notNull(),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});
