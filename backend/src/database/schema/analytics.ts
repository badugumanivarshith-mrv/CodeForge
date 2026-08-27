import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  date,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './users';

export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
    eventName: varchar('event_name', { length: 100 }).notNull(),
    category: varchar('category', { length: 50 }).notNull(), // 'lesson', 'quiz', 'problem', 'ai', 'navigation'
    propertiesJson: jsonb('properties_json').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    eventNameTimeIdx: index('idx_analytics_events_name_time').on(
      table.eventName,
      table.createdAt,
    ),
  }),
);

export const userActivityLogs = pgTable(
  'user_activity_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    activityDate: date('activity_date').notNull(),
    actionType: varchar('action_type', { length: 50 }).notNull(), // 'solved_problem', 'viewed_lesson', etc.
    metadataJson: jsonb('metadata_json').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userDateIdx: index('idx_user_activity_user_date').on(table.userId, table.activityDate),
  }),
);
