import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  primaryKey,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { forumTargetTypeEnum, forumVoteTypeEnum } from './enums';
import { ForumTargetType, ForumVoteType } from '@codeforge/shared';

export const forumTags = pgTable('forum_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  description: text('description'),
  postsCount: integer('posts_count').default(0).notNull(),
});

export const forumPosts = pgTable(
  'forum_posts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 250 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    contentMdx: text('content_mdx').notNull(),
    viewsCount: integer('views_count').default(0).notNull(),
    upvotesCount: integer('upvotes_count').default(0).notNull(),
    downvotesCount: integer('downvotes_count').default(0).notNull(),
    score: integer('score').default(0).notNull(),
    answersCount: integer('answers_count').default(0).notNull(),
    acceptedAnswerId: uuid('accepted_answer_id'),
    isClosed: boolean('is_closed').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userPostIdx: index('idx_forum_posts_user').on(table.userId),
    scoreIdx: index('idx_forum_posts_score').on(table.score),
  }),
);

export const forumAnswers = pgTable(
  'forum_answers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    postId: uuid('post_id')
      .notNull()
      .references(() => forumPosts.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    contentMdx: text('content_mdx').notNull(),
    upvotesCount: integer('upvotes_count').default(0).notNull(),
    downvotesCount: integer('downvotes_count').default(0).notNull(),
    score: integer('score').default(0).notNull(),
    isAccepted: boolean('is_accepted').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    postAnswerIdx: index('idx_forum_answers_post').on(table.postId),
    userAnswerIdx: index('idx_forum_answers_user').on(table.userId),
  }),
);

export const forumPostsTags = pgTable(
  'forum_posts_tags',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => forumPosts.id, { onDelete: 'cascade' }),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => forumTags.id, { onDelete: 'cascade' }),
  },
  table => ({
    pk: primaryKey({ columns: [table.postId, table.tagId] }),
  }),
);

export const forumVotes = pgTable(
  'forum_votes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    targetType: forumTargetTypeEnum('target_type').default(ForumTargetType.POST).notNull(),
    targetId: uuid('target_id').notNull(),
    voteType: forumVoteTypeEnum('vote_type').default(ForumVoteType.UPVOTE).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userVoteIdx: index('idx_forum_votes_user_target').on(table.userId, table.targetType, table.targetId),
  }),
);

export const forumReputations = pgTable(
  'forum_reputations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    score: integer('score').notNull(),
    pointsDelta: integer('points_delta').notNull(),
    reason: varchar('reason', { length: 100 }).notNull(),
    referenceId: uuid('reference_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userRepIdx: index('idx_forum_reputations_user').on(table.userId),
  }),
);

export const forumPostsRelations = relations(forumPosts, ({ one, many }) => ({
  user: one(users, {
    fields: [forumPosts.userId],
    references: [users.id],
  }),
  answers: many(forumAnswers),
  tags: many(forumPostsTags),
}));

export const forumAnswersRelations = relations(forumAnswers, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumAnswers.postId],
    references: [forumPosts.id],
  }),
  user: one(users, {
    fields: [forumAnswers.userId],
    references: [users.id],
  }),
}));

export const forumPostsTagsRelations = relations(forumPostsTags, ({ one }) => ({
  post: one(forumPosts, {
    fields: [forumPostsTags.postId],
    references: [forumPosts.id],
  }),
  tag: one(forumTags, {
    fields: [forumPostsTags.tagId],
    references: [forumTags.id],
  }),
}));
