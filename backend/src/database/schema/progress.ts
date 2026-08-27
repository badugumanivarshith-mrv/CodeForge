import {
  pgTable,
  uuid,
  boolean,
  timestamp,
  integer,
  numeric,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { masteryLevelEnum, languageIdEnum } from './enums';
import { MasteryLevel } from '@codeforge/shared';
import { users } from './users';
import { topics, lessons, languages } from './curriculum';

export const userProgress = pgTable(
  'user_progress',
  {
    id: uuid('id').defaultRandom().primaryKey(),
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
    userLessonUnique: unique('user_lesson_unique').on(table.userId, table.lessonId),
    userIdx: index('idx_user_progress_user').on(table.userId),
  }),
);

export const topicMastery = pgTable(
  'topic_mastery',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    masteryLevel: masteryLevelEnum('mastery_level').default(MasteryLevel.NOVICE).notNull(),
    masteryScore: numeric('mastery_score', { precision: 4, scale: 2 }).default('0.00').notNull(),
    bktProbability: numeric('bkt_probability', { precision: 4, scale: 2 }).default('0.10').notNull(),
    problemsSolvedCount: integer('problems_solved_count').default(0).notNull(),
    quizScoreBest: integer('quiz_score_best').default(0).notNull(),
    assignmentsPassedCount: integer('assignments_passed_count').default(0).notNull(),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userTopicUnique: unique('user_topic_mastery_unique').on(table.userId, table.topicId),
    userTopicIdx: index('idx_topic_mastery_user_topic').on(table.userId, table.topicId),
  }),
);

export const languageMastery = pgTable(
  'language_mastery',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    languageId: languageIdEnum('language_id')
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    masteryScore: numeric('mastery_score', { precision: 4, scale: 2 }).default('0.00').notNull(),
    topicsCompletedCount: integer('topics_completed_count').default(0).notNull(),
    totalTopicsCount: integer('total_topics_count').default(10).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userLangUnique: unique('user_language_mastery_unique').on(table.userId, table.languageId),
    userLangIdx: index('idx_language_mastery_user_lang').on(table.userId, table.languageId),
  }),
);

export const learningSessions = pgTable(
  'learning_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    durationSeconds: integer('duration_seconds').default(0).notNull(),
    actionsCount: integer('actions_count').default(0).notNull(),
  },
  table => ({
    userSessionIdx: index('idx_learning_sessions_user').on(table.userId),
  }),
);

// Relations
export const topicMasteryRelations = relations(topicMastery, ({ one }) => ({
  user: one(users, {
    fields: [topicMastery.userId],
    references: [users.id],
  }),
  topic: one(topics, {
    fields: [topicMastery.topicId],
    references: [topics.id],
  }),
}));

export const languageMasteryRelations = relations(languageMastery, ({ one }) => ({
  user: one(users, {
    fields: [languageMastery.userId],
    references: [users.id],
  }),
  language: one(languages, {
    fields: [languageMastery.languageId],
    references: [languages.id],
  }),
}));
