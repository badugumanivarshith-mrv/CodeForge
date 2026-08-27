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
import {
  languageIdEnum,
  topicDifficultyEnum,
  contentStatusEnum,
} from './enums';
import { TopicDifficulty, ContentStatus } from '@codeforge/shared';

export const languages = pgTable('languages', {
  id: languageIdEnum('id').primaryKey(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 50 }).notNull(),
  monacoId: varchar('monaco_id', { length: 50 }).notNull(),
  compilerId: varchar('compiler_id', { length: 50 }).notNull(),
  version: varchar('version', { length: 30 }).default('latest').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  displayOrder: integer('display_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const topics = pgTable(
  'topics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    languageId: languageIdEnum('language_id')
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 100 }).notNull(),
    sequence: integer('sequence').notNull(), // 1 to 10
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description').notNull(),
    difficulty: topicDifficultyEnum('difficulty').default(TopicDifficulty.BEGINNER).notNull(),
    estimatedHours: integer('estimated_hours').default(3).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    langSeqIdx: index('idx_topics_language_seq').on(table.languageId, table.sequence),
    slugIdx: index('idx_topics_slug').on(table.slug),
  }),
);

export const lessons = pgTable(
  'lessons',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    sequence: integer('sequence').notNull(),
    slug: varchar('slug', { length: 150 }).notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    readTimeMinutes: integer('read_time_minutes').default(5).notNull(),
    status: contentStatusEnum('status').default(ContentStatus.DRAFT).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    topicSeqIdx: index('idx_lessons_topic_seq').on(table.topicId, table.sequence),
  }),
);

export const lessonSections = pgTable(
  'lesson_sections',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    sequence: integer('sequence').notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    contentMdx: text('content_mdx').notNull(),
    contentType: varchar('content_type', { length: 30 }).default('text').notNull(), // text, code_sandbox, video_callout, quiz_checkpoint
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    lessonSeqIdx: index('idx_lesson_sections_lesson_seq').on(table.lessonId, table.sequence),
  }),
);

export const learningExamples = pgTable('learning_examples', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonId: uuid('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(),
  title: varchar('title', { length: 200 }).notNull(),
  codeTemplate: text('code_template').notNull(),
  expectedOutput: text('expected_output').notNull(),
  explanationMdx: text('explanation_mdx'),
});

// Relations
export const languagesRelations = relations(languages, ({ many }) => ({
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  language: one(languages, {
    fields: [topics.languageId],
    references: [languages.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  topic: one(topics, {
    fields: [lessons.topicId],
    references: [topics.id],
  }),
  sections: many(lessonSections),
  examples: many(learningExamples),
}));
