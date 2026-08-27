import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  jsonb,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { contestStateEnum } from './enums';
import { ContestState } from '@codeforge/shared';
import { users } from './users';
import { problems } from './problems';
import { submissions } from './submissions';

export const contests = pgTable(
  'contests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 150 }).notNull().unique(),
    title: varchar('title', { length: 200 }).notNull(),
    descriptionMdx: text('description_mdx').notNull(),
    status: contestStateEnum('status').default(ContestState.UPCOMING).notNull(),
    startAt: timestamp('start_at', { withTimezone: true }).notNull(),
    endAt: timestamp('end_at', { withTimezone: true }).notNull(),
    durationMinutes: integer('duration_minutes').default(90).notNull(),
    createdBy: uuid('created_by').references(() => users.id, { onDelete: 'set null' }),
    participantCount: integer('participant_count').default(0).notNull(),
    totalPoints: integer('total_points').default(300).notNull(),
    rulesJson: jsonb('rules_json').default({}).notNull(),
    scoringFormula: varchar('scoring_formula', { length: 100 }).default('standard_icpc').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    statusIdx: index('idx_contests_status').on(table.status),
    startAtIdx: index('idx_contests_start_at').on(table.startAt),
  }),
);

export const contestProblems = pgTable(
  'contest_problems',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contestId: uuid('contest_id')
      .notNull()
      .references(() => contests.id, { onDelete: 'cascade' }),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    sequence: integer('sequence').notNull(),
    points: integer('points').default(100).notNull(),
    penaltyMinutes: integer('penalty_minutes').default(20).notNull(),
  },
  table => ({
    contestProblemUnique: unique('contest_problem_unique').on(table.contestId, table.problemId),
    contestSeqIdx: index('idx_contest_problems_contest_seq').on(table.contestId, table.sequence),
  }),
);

export const contestParticipants = pgTable(
  'contest_participants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contestId: uuid('contest_id')
      .notNull()
      .references(() => contests.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    registeredAt: timestamp('registered_at', { withTimezone: true }).defaultNow().notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    finishedAt: timestamp('finished_at', { withTimezone: true }),
    score: integer('score').default(0).notNull(),
    penaltyTimeMinutes: integer('penalty_time_minutes').default(0).notNull(),
    rank: integer('rank').default(1).notNull(),
    finalRatingChange: integer('final_rating_change'),
    status: varchar('status', { length: 50 }).default('registered').notNull(), // 'registered', 'in_progress', 'completed', 'disqualified'
  },
  table => ({
    contestUserUnique: unique('contest_user_unique').on(table.contestId, table.userId),
    contestRankIdx: index('idx_contest_participants_rank').on(table.contestId, table.score, table.penaltyTimeMinutes),
  }),
);

export const contestSubmissions = pgTable(
  'contest_submissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    contestId: uuid('contest_id')
      .notNull()
      .references(() => contests.id, { onDelete: 'cascade' }),
    participantId: uuid('participant_id')
      .notNull()
      .references(() => contestParticipants.id, { onDelete: 'cascade' }),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    submissionId: uuid('submission_id')
      .notNull()
      .references(() => submissions.id, { onDelete: 'cascade' }),
    scoreEarned: integer('score_earned').default(0).notNull(),
    isPassed: boolean('is_passed').default(false).notNull(),
    penaltyAppliedMinutes: integer('penalty_applied_minutes').default(0).notNull(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    contestParticipantIdx: index('idx_contest_submissions_part').on(table.contestId, table.participantId),
  }),
);

// Relations
export const contestsRelations = relations(contests, ({ one, many }) => ({
  creator: one(users, {
    fields: [contests.createdBy],
    references: [users.id],
  }),
  problems: many(contestProblems),
  participants: many(contestParticipants),
  submissions: many(contestSubmissions),
}));

export const contestProblemsRelations = relations(contestProblems, ({ one }) => ({
  contest: one(contests, {
    fields: [contestProblems.contestId],
    references: [contests.id],
  }),
  problem: one(problems, {
    fields: [contestProblems.problemId],
    references: [problems.id],
  }),
}));

export const contestParticipantsRelations = relations(contestParticipants, ({ one, many }) => ({
  contest: one(contests, {
    fields: [contestParticipants.contestId],
    references: [contests.id],
  }),
  user: one(users, {
    fields: [contestParticipants.userId],
    references: [users.id],
  }),
  submissions: many(contestSubmissions),
}));

export const contestSubmissionsRelations = relations(contestSubmissions, ({ one }) => ({
  contest: one(contests, {
    fields: [contestSubmissions.contestId],
    references: [contests.id],
  }),
  participant: one(contestParticipants, {
    fields: [contestSubmissions.participantId],
    references: [contestParticipants.id],
  }),
  problem: one(problems, {
    fields: [contestSubmissions.problemId],
    references: [problems.id],
  }),
  submission: one(submissions, {
    fields: [contestSubmissions.submissionId],
    references: [submissions.id],
  }),
}));
