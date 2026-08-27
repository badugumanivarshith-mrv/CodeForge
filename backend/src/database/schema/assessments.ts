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
import {
  assessmentTypeEnum,
  assessmentSessionStatusEnum,
  assessmentQuestionTypeEnum,
  problemDifficultyEnum,
} from './enums';
import {
  AssessmentType,
  AssessmentSessionStatus,
  AssessmentQuestionType,
  ProblemDifficulty,
} from '@codeforge/shared';
import { users } from './users';
import { topics } from './curriculum';

export const assessmentQuestions = pgTable(
  'assessment_questions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    questionType: assessmentQuestionTypeEnum('question_type')
      .default(AssessmentQuestionType.MCQ)
      .notNull(),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    difficulty: problemDifficultyEnum('difficulty')
      .default(ProblemDifficulty.MEDIUM)
      .notNull(),
    promptMdx: text('prompt_mdx').notNull(),
    optionsJson: jsonb('options_json').default([]).notNull(), // [{ id, sequence, optionText, isCorrect }]
    codeSnippet: text('code_snippet'),
    starterCodeJson: jsonb('starter_code_json').default({}).notNull(),
    supportedLanguagesJson: jsonb('supported_languages_json').default(['python', 'javascript']).notNull(),
    solutionCode: text('solution_code'),
    points: integer('points').default(10).notNull(),
    estimatedTimeSeconds: integer('estimated_time_seconds').default(120).notNull(),
    explanationMdx: text('explanation_mdx'),
    scoringRulesJson: jsonb('scoring_rules_json').default({}).notNull(),
    metadataJson: jsonb('metadata_json').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    topicDiffIdx: index('idx_assessment_questions_topic_diff').on(table.topicId, table.difficulty),
    typeIdx: index('idx_assessment_questions_type').on(table.questionType),
  }),
);

export const assessmentSessions = pgTable(
  'assessment_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assessmentType: assessmentTypeEnum('assessment_type')
      .default(AssessmentType.DIAGNOSTIC)
      .notNull(),
    status: assessmentSessionStatusEnum('status')
      .default(AssessmentSessionStatus.NOT_STARTED)
      .notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    timeLimitMinutes: integer('time_limit_minutes').default(30).notNull(),
    currentQuestionIndex: integer('current_question_index').default(0).notNull(),
    totalQuestions: integer('total_questions').default(10).notNull(),
    currentDifficulty: problemDifficultyEnum('current_difficulty')
      .default(ProblemDifficulty.MEDIUM)
      .notNull(),
    questionSequenceJson: jsonb('question_sequence_json').default([]).notNull(),
    difficultyHistoryJson: jsonb('difficulty_history_json').default([]).notNull(),
    totalScore: integer('total_score').default(0).notNull(),
    maxScore: integer('max_score').default(100).notNull(),
    accuracyPercentage: numeric('accuracy_percentage', { precision: 5, scale: 2 })
      .default('0.00')
      .notNull(),
    finalSkillEstimate: varchar('final_skill_estimate', { length: 100 }),
    topicPerformanceJson: jsonb('topic_performance_json').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userStatusIdx: index('idx_assessment_sessions_user_status').on(table.userId, table.status),
    expiresAtIdx: index('idx_assessment_sessions_expires_at').on(table.expiresAt),
  }),
);

export const assessmentAttempts = pgTable(
  'assessment_attempts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => assessmentSessions.id, { onDelete: 'cascade' }),
    questionId: uuid('question_id')
      .notNull()
      .references(() => assessmentQuestions.id, { onDelete: 'cascade' }),
    questionType: assessmentQuestionTypeEnum('question_type').notNull(),
    selectedOptionIdsJson: jsonb('selected_option_ids_json').default([]).notNull(),
    userCode: text('user_code'),
    languageId: varchar('language_id', { length: 50 }),
    isCorrect: boolean('is_correct').default(false).notNull(),
    scoreEarned: integer('score_earned').default(0).notNull(),
    maxScore: integer('max_score').default(10).notNull(),
    timeSpentSeconds: integer('time_spent_seconds').default(0).notNull(),
    feedbackMdx: text('feedback_mdx'),
    evaluatedAt: timestamp('evaluated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    sessionQIdx: index('idx_assessment_attempts_session_q').on(table.sessionId, table.questionId),
  }),
);

export const assessmentResults = pgTable(
  'assessment_results',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: uuid('session_id')
      .notNull()
      .unique()
      .references(() => assessmentSessions.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    assessmentType: assessmentTypeEnum('assessment_type').notNull(),
    score: integer('score').notNull(),
    maxScore: integer('max_score').notNull(),
    percentage: numeric('percentage', { precision: 5, scale: 2 }).notNull(),
    accuracy: numeric('accuracy', { precision: 5, scale: 2 }).notNull(),
    timeSpentSeconds: integer('time_spent_seconds').notNull(),
    skillRatingBefore: integer('skill_rating_before').default(1200).notNull(),
    skillRatingAfter: integer('skill_rating_after').default(1200).notNull(),
    skillRatingDelta: integer('skill_rating_delta').default(0).notNull(),
    rankPercentile: numeric('rank_percentile', { precision: 5, scale: 2 })
      .default('50.00')
      .notNull(),
    topicBreakdownJson: jsonb('topic_breakdown_json').default({}).notNull(),
    errorCategoriesJson: jsonb('error_categories_json').default({}).notNull(),
    strengthsJson: jsonb('strengths_json').default([]).notNull(),
    weaknessesJson: jsonb('weaknesses_json').default([]).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userCreatedIdx: index('idx_assessment_results_user_created').on(table.userId, table.createdAt),
  }),
);

export const assessmentRemediations = pgTable('assessment_remediations', {
  id: uuid('id').defaultRandom().primaryKey(),
  assessmentId: uuid('assessment_id')
    .notNull()
    .unique()
    .references(() => assessmentSessions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  summary: text('summary').notNull(),
  weakConceptsJson: jsonb('weak_concepts_json').default([]).notNull(),
  prerequisiteGapsJson: jsonb('prerequisite_gaps_json').default([]).notNull(),
  actionItemsJson: jsonb('action_items_json').default([]).notNull(),
  estimatedStudyTimeMinutes: integer('estimated_study_time_minutes').default(45).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const assessmentQuestionsRelations = relations(assessmentQuestions, ({ one, many }) => ({
  topic: one(topics, {
    fields: [assessmentQuestions.topicId],
    references: [topics.id],
  }),
  attempts: many(assessmentAttempts),
}));

export const assessmentSessionsRelations = relations(assessmentSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [assessmentSessions.userId],
    references: [users.id],
  }),
  attempts: many(assessmentAttempts),
  result: one(assessmentResults, {
    fields: [assessmentSessions.id],
    references: [assessmentResults.sessionId],
  }),
  remediation: one(assessmentRemediations, {
    fields: [assessmentSessions.id],
    references: [assessmentRemediations.assessmentId],
  }),
}));

export const assessmentAttemptsRelations = relations(assessmentAttempts, ({ one }) => ({
  session: one(assessmentSessions, {
    fields: [assessmentAttempts.sessionId],
    references: [assessmentSessions.id],
  }),
  question: one(assessmentQuestions, {
    fields: [assessmentAttempts.questionId],
    references: [assessmentQuestions.id],
  }),
}));

export const assessmentResultsRelations = relations(assessmentResults, ({ one }) => ({
  session: one(assessmentSessions, {
    fields: [assessmentResults.sessionId],
    references: [assessmentSessions.id],
  }),
  user: one(users, {
    fields: [assessmentResults.userId],
    references: [users.id],
  }),
}));
