import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  numeric,
  primaryKey,
  unique,
} from 'drizzle-orm/pg-core';
import { MistakeCategory } from '@codeforge/shared';
import { users } from './users';
import { topics, lessons, languages } from './curriculum';

export const userLessonProgress = pgTable(
  'user_lesson_progress',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    isCompleted: boolean('is_completed').default(true).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    pk: primaryKey({ columns: [table.userId, table.lessonId] }),
  }),
);

export const userTopicMastery = pgTable(
  'user_topic_mastery',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    masteryScore: numeric('mastery_score', { precision: 4, scale: 2 }).default('0.00').notNull(),
    bktProbability: numeric('bkt_probability', { precision: 4, scale: 2 }).default('0.10').notNull(),
    problemsSolvedCount: integer('problems_solved_count').default(0).notNull(),
    quizHighestScore: integer('quiz_highest_score').default(0).notNull(),
    assignmentsPassed: integer('assignments_passed').default(0).notNull(),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userTopicUnique: unique('user_topic_unique').on(table.userId, table.topicId),
  }),
);

export const userMistakeMemory = pgTable('user_mistake_memory', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  languageId: varchar('language_id', { length: 50 })
    .notNull()
    .references(() => languages.id),
  topicId: uuid('topic_id')
    .notNull()
    .references(() => topics.id, { onDelete: 'cascade' }),
  mistakeCategory: varchar('mistake_category', { length: 50 }).$type<MistakeCategory>().notNull(),
  codeContext: text('code_context').notNull(),
  explanation: text('explanation').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
