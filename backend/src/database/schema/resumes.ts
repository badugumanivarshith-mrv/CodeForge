import {
  pgTable,
  uuid,
  varchar,
  boolean,
  integer,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const resumes = pgTable(
  'resumes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }).notNull(),
    templateName: varchar('template_name', { length: 100 }).default('modern-ats').notNull(),
    targetRole: varchar('target_role', { length: 150 }).notNull(),
    personalInfoJson: jsonb('personal_info_json').default({}).notNull(),
    skillsJson: jsonb('skills_json').default([]).notNull(),
    experienceJson: jsonb('experience_json').default([]).notNull(),
    projectsJson: jsonb('projects_json').default([]).notNull(),
    educationJson: jsonb('education_json').default([]).notNull(),
    atsScore: integer('ats_score'),
    atsFeedbackJson: jsonb('ats_feedback_json').default({}).notNull(),
    isPublic: boolean('is_public').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userResumeIdx: index('idx_resumes_user').on(table.userId),
  }),
);

export const resumesRelations = relations(resumes, ({ one }) => ({
  user: one(users, {
    fields: [resumes.userId],
    references: [users.id],
  }),
}));
