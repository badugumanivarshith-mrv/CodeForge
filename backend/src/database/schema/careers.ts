import {
  pgTable,
  uuid,
  varchar,
  integer,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { careerRoleEnum } from './enums';
import { CareerRole } from '@codeforge/shared';

export const careerGoals = pgTable(
  'career_goals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    targetRole: careerRoleEnum('target_role').default(CareerRole.FULLSTACK_DEVELOPER).notNull(),
    targetLevel: varchar('target_level', { length: 50 }).default('Mid-Level').notNull(),
    targetTimelineMonths: integer('target_timeline_months').default(6).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userCareerIdx: index('idx_career_goals_user').on(table.userId),
  }),
);

export const careerReadinessHistory = pgTable(
  'career_readiness_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    targetRole: careerRoleEnum('target_role').notNull(),
    readinessScore: integer('readiness_score').notNull(),
    skillGapsJson: jsonb('skill_gaps_json').default([]).notNull(),
    recommendationsJson: jsonb('recommendations_json').default([]).notNull(),
    computedAt: timestamp('computed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userHistoryIdx: index('idx_career_readiness_user').on(table.userId),
  }),
);

export const careerGoalsRelations = relations(careerGoals, ({ one }) => ({
  user: one(users, {
    fields: [careerGoals.userId],
    references: [users.id],
  }),
}));

export const careerReadinessHistoryRelations = relations(careerReadinessHistory, ({ one }) => ({
  user: one(users, {
    fields: [careerReadinessHistory.userId],
    references: [users.id],
  }),
}));
