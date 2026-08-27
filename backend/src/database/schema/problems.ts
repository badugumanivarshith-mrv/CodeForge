import {
  pgTable,
  uuid,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  jsonb,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { problemDifficultyEnum } from './enums';
import { topics } from './curriculum';

export const problems = pgTable(
  'problems',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    slug: varchar('slug', { length: 150 }).notNull().unique(),
    title: varchar('title', { length: 200 }).notNull(),
    difficulty: problemDifficultyEnum('difficulty').notNull(),
    promptMdx: text('prompt_mdx').notNull(),
    starterCode: jsonb('starter_code').notNull(), // { python: "def...", java: "class..." }
    boilerplateCode: jsonb('boilerplate_code').default({}).notNull(),
    solutionCode: jsonb('solution_code'),
    memoryLimitMb: integer('memory_limit_mb').default(256).notNull(),
    timeLimitMs: integer('time_limit_ms').default(2000).notNull(),
    isPublished: boolean('is_published').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    topicIdx: index('idx_problems_topic').on(table.topicId),
    diffIdx: index('idx_problems_difficulty').on(table.difficulty),
    slugIdx: index('idx_problems_slug').on(table.slug),
  }),
);

export const problemExamples = pgTable('problem_examples', {
  id: uuid('id').defaultRandom().primaryKey(),
  problemId: uuid('problem_id')
    .notNull()
    .references(() => problems.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(),
  inputData: text('input_data').notNull(),
  expectedOutput: text('expected_output').notNull(),
  explanationMdx: text('explanation_mdx'),
});

export const problemConstraints = pgTable('problem_constraints', {
  id: uuid('id').defaultRandom().primaryKey(),
  problemId: uuid('problem_id')
    .notNull()
    .references(() => problems.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(),
  constraintText: text('constraint_text').notNull(),
});

export const testCases = pgTable(
  'test_cases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    sequence: integer('sequence').notNull(),
    inputData: text('input_data').notNull(),
    expectedOutput: text('expected_output').notNull(),
    isHidden: boolean('is_hidden').default(true).notNull(),
    isSample: boolean('is_sample').default(false).notNull(),
    isEdgeCase: boolean('is_edge_case').default(false).notNull(),
    weight: integer('weight').default(1).notNull(),
  },
  table => ({
    problemIdx: index('idx_test_cases_problem').on(table.problemId),
  }),
);

export const problemTags = pgTable('problem_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  category: varchar('category', { length: 50 }).default('general').notNull(),
});

export const problemToTags = pgTable(
  'problem_to_tags',
  {
    problemId: uuid('problem_id')
      .notNull()
      .references(() => problems.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => problemTags.id, { onDelete: 'cascade' }),
  },
  table => ({
    pk: primaryKey({ columns: [table.problemId, table.tagId] }),
  }),
);

// Relations
export const problemsRelations = relations(problems, ({ one, many }) => ({
  topic: one(topics, {
    fields: [problems.topicId],
    references: [topics.id],
  }),
  examples: many(problemExamples),
  constraints: many(problemConstraints),
  testCases: many(testCases),
  tags: many(problemToTags),
}));

export const problemToTagsRelations = relations(problemToTags, ({ one }) => ({
  problem: one(problems, {
    fields: [problemToTags.problemId],
    references: [problems.id],
  }),
  tag: one(problemTags, {
    fields: [problemToTags.tagId],
    references: [problemTags.id],
  }),
}));
