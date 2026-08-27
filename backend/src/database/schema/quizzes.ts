import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { quizDifficultyEnum, questionTypeEnum } from './enums';
import { QuizDifficulty, QuestionType } from '@codeforge/shared';
import { topics } from './curriculum';
import { users } from './users';

export const quizzes = pgTable(
  'quizzes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    topicId: uuid('topic_id')
      .notNull()
      .unique()
      .references(() => topics.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description').notNull(),
    difficulty: quizDifficultyEnum('difficulty').default(QuizDifficulty.MEDIUM).notNull(),
    passingScorePercentage: integer('passing_score_percentage').default(80).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    topicIdx: index('idx_quizzes_topic').on(table.topicId),
  }),
);

export const quizQuestions = pgTable(
  'quiz_questions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id')
      .notNull()
      .references(() => quizzes.id, { onDelete: 'cascade' }),
    sequence: integer('sequence').notNull(),
    questionType: questionTypeEnum('question_type').default(QuestionType.MULTIPLE_CHOICE).notNull(),
    questionMdx: text('question_mdx').notNull(),
    codeSnippet: text('code_snippet'),
    explanationMdx: text('explanation_mdx'),
    points: integer('points').default(10).notNull(),
  },
  table => ({
    quizSeqIdx: index('idx_quiz_questions_quiz_seq').on(table.quizId, table.sequence),
  }),
);

export const quizOptions = pgTable('quiz_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id')
    .notNull()
    .references(() => quizQuestions.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(),
  optionText: text('option_text').notNull(),
  isCorrect: boolean('is_correct').default(false).notNull(),
});

export const quizAttempts = pgTable(
  'quiz_attempts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    quizId: uuid('quiz_id')
      .notNull()
      .references(() => quizzes.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    scorePercentage: integer('score_percentage').notNull(),
    isPassed: boolean('is_passed').default(false).notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  table => ({
    userQuizIdx: index('idx_quiz_attempts_user_quiz').on(table.userId, table.quizId),
  }),
);

export const quizAnswers = pgTable('quiz_answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  attemptId: uuid('attempt_id')
    .notNull()
    .references(() => quizAttempts.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id')
    .notNull()
    .references(() => quizQuestions.id, { onDelete: 'cascade' }),
  selectedOptionId: uuid('selected_option_id').references(() => quizOptions.id, {
    onDelete: 'set null',
  }),
  isCorrect: boolean('is_correct').notNull(),
});

// Relations
export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  topic: one(topics, {
    fields: [quizzes.topicId],
    references: [topics.id],
  }),
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
  options: many(quizOptions),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  answers: many(quizAnswers),
}));
