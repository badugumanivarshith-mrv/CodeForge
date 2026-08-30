import { pgTable, uuid, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { aiAgents } from './agentic_workspace';

export const agentInteractions = pgTable('agent_interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceAgentId: uuid('source_agent_id').references(() => aiAgents.id).notNull(),
  targetAgentId: uuid('target_agent_id').references(() => aiAgents.id).notNull(),
  messageType: varchar('message_type', { length: 255 }).notNull(),
  payload: jsonb('payload').default({}).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});
