import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { interviewTypeEnum, interviewStatusEnum, problemDifficultyEnum } from './enums';
import { InterviewType, InterviewStatus, ProblemDifficulty } from '@codeforge/shared';

export const interviewSessions = pgTable(
  'interview_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    interviewType: interviewTypeEnum('interview_type').default(InterviewType.MIXED).notNull(),
    roleTitle: varchar('role_title', { length: 150 }).default('Software Engineer').notNull(),
    difficulty: problemDifficultyEnum('difficulty').default(ProblemDifficulty.MEDIUM).notNull(),
    status: interviewStatusEnum('status').default(InterviewStatus.IN_PROGRESS).notNull(),
    overallScore: integer('overall_score'),
    communicationScore: integer('communication_score'),
    technicalScore: integer('technical_score'),
    confidenceScore: integer('confidence_score'),
    feedbackSummaryMdx: text('feedback_summary_mdx'),
    improvementsJson: jsonb('improvements_json').default([]).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  table => ({
    userInterviewIdx: index('idx_interview_sessions_user').on(table.userId),
  }),
);

export const interviewExchanges = pgTable(
  'interview_exchanges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => interviewSessions.id, { onDelete: 'cascade' }),
    questionOrder: integer('question_order').notNull(),
    questionText: text('question_text').notNull(),
    userAnswerText: text('user_answer_text'),
    evaluationFeedback: text('evaluation_feedback'),
    score: integer('score'),
    timeSpentSeconds: integer('time_spent_seconds').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    sessionExchangeIdx: index('idx_interview_exchanges_session').on(table.sessionId),
  }),
);

export const interviewSessionsRelations = relations(interviewSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [interviewSessions.userId],
    references: [users.id],
  }),
  exchanges: many(interviewExchanges),
}));

export const interviewExchangesRelations = relations(interviewExchanges, ({ one }) => ({
  session: one(interviewSessions, {
    fields: [interviewExchanges.sessionId],
    references: [interviewSessions.id],
  }),
}));
