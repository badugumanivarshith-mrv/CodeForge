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
import { studyGroupRoleEnum } from './enums';
import { StudyGroupRole } from '@codeforge/shared';

export const studyGroups = pgTable(
  'study_groups',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 150 }).notNull(),
    slug: varchar('slug', { length: 150 }).notNull().unique(),
    description: text('description').notNull(),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    avatarUrl: varchar('avatar_url', { length: 500 }),
    isPrivate: boolean('is_private').default(false).notNull(),
    maxMembers: integer('max_members').default(50).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    ownerIdx: index('idx_study_groups_owner').on(table.ownerId),
  }),
);

export const studyGroupMembers = pgTable(
  'study_group_members',
  {
    groupId: uuid('group_id')
      .notNull()
      .references(() => studyGroups.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: studyGroupRoleEnum('role').default(StudyGroupRole.MEMBER).notNull(),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    pk: primaryKey({ columns: [table.groupId, table.userId] }),
    userGroupIdx: index('idx_group_members_user').on(table.userId),
  }),
);

export const studyGroupDiscussions = pgTable(
  'study_group_discussions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    groupId: uuid('group_id')
      .notNull()
      .references(() => studyGroups.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 250 }).notNull(),
    contentMdx: text('content_mdx').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    groupDiscussionIdx: index('idx_group_discussions_group').on(table.groupId),
  }),
);

export const studyGroupGoals = pgTable(
  'study_group_goals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    groupId: uuid('group_id')
      .notNull()
      .references(() => studyGroups.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 250 }).notNull(),
    targetTopicId: varchar('target_topic_id', { length: 150 }),
    targetContestId: uuid('target_contest_id'),
    targetDate: timestamp('target_date', { withTimezone: true }),
    isCompleted: boolean('is_completed').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    groupGoalIdx: index('idx_group_goals_group').on(table.groupId),
  }),
);

export const studyGroupsRelations = relations(studyGroups, ({ one, many }) => ({
  owner: one(users, {
    fields: [studyGroups.ownerId],
    references: [users.id],
  }),
  members: many(studyGroupMembers),
  discussions: many(studyGroupDiscussions),
  goals: many(studyGroupGoals),
}));

export const studyGroupMembersRelations = relations(studyGroupMembers, ({ one }) => ({
  group: one(studyGroups, {
    fields: [studyGroupMembers.groupId],
    references: [studyGroups.id],
  }),
  user: one(users, {
    fields: [studyGroupMembers.userId],
    references: [users.id],
  }),
}));

export const studyGroupDiscussionsRelations = relations(studyGroupDiscussions, ({ one }) => ({
  group: one(studyGroups, {
    fields: [studyGroupDiscussions.groupId],
    references: [studyGroups.id],
  }),
  user: one(users, {
    fields: [studyGroupDiscussions.userId],
    references: [users.id],
  }),
}));

export const studyGroupGoalsRelations = relations(studyGroupGoals, ({ one }) => ({
  group: one(studyGroups, {
    fields: [studyGroupGoals.groupId],
    references: [studyGroups.id],
  }),
}));
