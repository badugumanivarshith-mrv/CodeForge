import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  numeric,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { assignmentDifficultyEnum, assignmentStatusEnum } from './enums';
import { AssignmentStatus } from '@codeforge/shared';
import { topics } from './curriculum';
import { users } from './users';

export const assignments = pgTable(
  'assignments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 150 }).notNull().unique(),
    title: varchar('title', { length: 200 }).notNull(),
    difficulty: assignmentDifficultyEnum('difficulty').notNull(),
    descriptionMdx: text('description_mdx').notNull(),
    projectStructureJson: jsonb('project_structure_json').default({}).notNull(),
    starterFilesJson: jsonb('starter_files_json').notNull(),
    solutionFilesJson: jsonb('solution_files_json'),
    maxScore: integer('max_score').default(100).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    topicIdx: index('idx_assignments_topic').on(table.topicId),
  }),
);

export const assignmentRequirements = pgTable('assignment_requirements', {
  id: uuid('id').defaultRandom().primaryKey(),
  assignmentId: uuid('assignment_id')
    .notNull()
    .references(() => assignments.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  descriptionMdx: text('description_mdx').notNull(),
  maxPoints: integer('max_points').notNull(),
  weight: numeric('weight', { precision: 4, scale: 2 }).default('1.00').notNull(),
});

export const assignmentSubmissions = pgTable(
  'assignment_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    assignmentId: uuid('assignment_id')
      .notNull()
      .references(() => assignments.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    filesPayloadJson: jsonb('files_payload_json').notNull(),
    status: assignmentStatusEnum('status').default(AssignmentStatus.SUBMITTED).notNull(),
    totalScore: integer('total_score'),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
    gradedAt: timestamp('graded_at', { withTimezone: true }),
  },
  table => ({
    userAssignIdx: index('idx_assignment_submissions_user_assign').on(
      table.userId,
      table.assignmentId,
    ),
  }),
);

export const assignmentFeedback = pgTable('assignment_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id')
    .notNull()
    .references(() => assignmentSubmissions.id, { onDelete: 'cascade' }),
  reviewerId: uuid('reviewer_id').references(() => users.id, { onDelete: 'set null' }),
  isAiGenerated: boolean('is_ai_generated').default(true).notNull(),
  feedbackMdx: text('feedback_mdx').notNull(),
  scoresJson: jsonb('scores_json').default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  topic: one(topics, {
    fields: [assignments.topicId],
    references: [topics.id],
  }),
  requirements: many(assignmentRequirements),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(assignmentSubmissions, ({ one, many }) => ({
  assignment: one(assignments, {
    fields: [assignmentSubmissions.assignmentId],
    references: [assignments.id],
  }),
  user: one(users, {
    fields: [assignmentSubmissions.userId],
    references: [users.id],
  }),
  feedback: many(assignmentFeedback),
}));
