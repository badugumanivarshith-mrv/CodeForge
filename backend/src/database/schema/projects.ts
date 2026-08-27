import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import {
  languageIdEnum,
  problemDifficultyEnum,
  projectStatusEnum,
  assignmentStatusEnum,
} from './enums';
import { ProblemDifficulty, ProjectStatus, AssignmentStatus } from '@codeforge/shared';
import { languages } from './curriculum';
import { users } from './users';

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    languageId: languageIdEnum('language_id')
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 150 }).notNull().unique(),
    title: varchar('title', { length: 200 }).notNull(),
    descriptionMdx: text('description_mdx').notNull(),
    difficulty: problemDifficultyEnum('difficulty').default(ProblemDifficulty.MEDIUM).notNull(),
    status: projectStatusEnum('status').default(ProjectStatus.PUBLISHED).notNull(),
    repositoryTemplateUrl: varchar('repository_template_url', { length: 500 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    langIdx: index('idx_projects_language').on(table.languageId),
  }),
);

export const projectTasks = pgTable('project_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  descriptionMdx: text('description_mdx').notNull(),
  validationCriteriaJson: jsonb('validation_criteria_json').default({}).notNull(),
});

export const projectSubmissions = pgTable(
  'project_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    repositoryUrl: varchar('repository_url', { length: 500 }).notNull(),
    deploymentUrl: varchar('deployment_url', { length: 500 }),
    status: assignmentStatusEnum('status').default(AssignmentStatus.SUBMITTED).notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  },
  table => ({
    userProjectIdx: index('idx_project_submissions_user_project').on(table.userId, table.projectId),
  }),
);

export const projectFeedback = pgTable('project_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => projectSubmissions.id, { onDelete: 'cascade' }),
  reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'set null' }),
  isAiGenerated: boolean('is_ai_generated').default(true).notNull(),
  feedbackMdx: text('feedback_mdx').notNull(),
  score: integer('score'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const projectsRelations = relations(projects, ({ one, many }) => ({
  language: one(languages, {
    fields: [projects.languageId],
    references: [languages.id],
  }),
  tasks: many(projectTasks),
  submissions: many(projectSubmissions),
}));

export const projectSubmissionsRelations = relations(projectSubmissions, ({ one, many }) => ({
  project: one(projects, {
    fields: [projectSubmissions.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectSubmissions.userId],
    references: [users.id],
  }),
  feedback: many(projectFeedback),
}));
