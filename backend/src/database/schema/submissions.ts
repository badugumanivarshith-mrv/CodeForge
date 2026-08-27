import {
  pgTable,
  uuid,
  timestamp,
  text,
  integer,
  jsonb,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { submissionStatusEnum, languageIdEnum } from './enums';
import { SubmissionStatus } from '@codeforge/shared';
import { users } from './users';
import { languages } from './curriculum';
import { problems, testCases } from './problems';

export const submissions = pgTable(
  'submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    languageId: languageIdEnum('language_id')
      .notNull()
      .references(() => languages.id),
    sourceCode: text('source_code').notNull(),
    status: submissionStatusEnum('status').default(SubmissionStatus.QUEUED).notNull(),
    executionTimeMs: integer('execution_time_ms'),
    memoryUsedKb: integer('memory_used_kb'),
    passedTestCases: integer('passed_test_cases').default(0).notNull(),
    totalTestCases: integer('total_test_cases').default(0).notNull(),
    compileOutput: text('compile_output'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userProblemIdx: index('idx_submissions_user_problem').on(table.userId, table.problemId),
    statusIdx: index('idx_submissions_status').on(table.status),
    createdAtIdx: index('idx_submissions_created_at').on(table.createdAt),
  }),
);

export const submissionResults = pgTable('submission_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  submissionId: uuid('submission_id')
    .notNull()
    .unique()
    .references(() => submissions.id, { onDelete: 'cascade' }),
  status: submissionStatusEnum('status').notNull(),
  totalRuntimeMs: integer('total_runtime_ms').default(0).notNull(),
  peakMemoryKb: integer('peak_memory_kb').default(0).notNull(),
  verdictDetailsJson: jsonb('verdict_details_json').default({}).notNull(),
});

export const submissionTestResults = pgTable(
  'submission_test_results',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    testCaseId: uuid('test_case_id')
      .notNull()
      .references(() => testCases.id, { onDelete: 'cascade' }),
    status: submissionStatusEnum('status').notNull(),
    actualOutput: text('actual_output'),
    executionTimeMs: integer('execution_time_ms').default(0).notNull(),
    memoryKb: integer('memory_kb').default(0).notNull(),
    errorMessage: text('error_message'),
  },
  table => ({
    submissionIdx: index('idx_submission_test_results_submission').on(table.submissionId),
  }),
);

// Relations
export const submissionsRelations = relations(submissions, ({ one, many }) => ({
  user: one(users, {
    fields: [submissions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
  result: one(submissionResults, {
    fields: [submissions.id],
    references: [submissionResults.submissionId],
  }),
  testResults: many(submissionTestResults),
}));
