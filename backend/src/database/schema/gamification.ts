import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
  date,
  jsonb,
  unique,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { xpTransactionTypeEnum, achievementTypeEnum } from './enums';
import { users } from './users';

export const xpTransactions = pgTable(
  'xp_transactions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    amount: integer('amount').notNull(),
    transactionType: xpTransactionTypeEnum('transaction_type').notNull(),
    description: text('description'),
    referenceId: uuid('reference_id'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userCreatedIdx: index('idx_xp_transactions_user_created').on(table.userId, table.createdAt),
  }),
);

export const levels = pgTable('levels', {
  levelNumber: integer('level_number').primaryKey(), // Level 1..50
  minXpRequired: integer('min_xp_required').notNull(),
  title: varchar('title', { length: 100 }).notNull(),
  badgeUrl: varchar('badge_url', { length: 500 }),
  rewardDescription: text('reward_description'),
});

export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  badgeIconUrl: varchar('badge_icon_url', { length: 500 }).notNull(),
  achievementType: achievementTypeEnum('achievement_type').notNull(),
  xpReward: integer('xp_reward').default(100).notNull(),
  criteriaJson: jsonb('criteria_json').notNull(),
});

export const userAchievements = pgTable(
  'user_achievements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    achievementId: uuid('achievement_id')
      .notNull()
      .references(() => achievements.id, { onDelete: 'cascade' }),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userAchievementUnique: unique('user_achievement_unique').on(
      table.userId,
      table.achievementId,
    ),
    userIdx: index('idx_user_achievements_user').on(table.userId),
  }),
);

export const streaks = pgTable('streaks', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').default(0).notNull(),
  longestStreak: integer('longest_streak').default(0).notNull(),
  lastActivityDate: date('last_activity_date'),
  freezeTokensAvailable: integer('freeze_tokens_available').default(1).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const leaderboards = pgTable(
  'leaderboards',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    totalXp: integer('total_xp').default(0).notNull(),
    rank: integer('rank').default(1).notNull(),
    leagueTier: varchar('league_tier', { length: 30 }).default('Bronze').notNull(),
    weeklyXp: integer('weekly_xp').default(0).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    totalXpIdx: index('idx_leaderboards_total_xp').on(table.totalXp),
    weeklyXpIdx: index('idx_leaderboards_weekly_xp').on(table.weeklyXp),
  }),
);

// Relations
export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
  user: one(users, {
    fields: [userAchievements.userId],
    references: [users.id],
  }),
  achievement: one(achievements, {
    fields: [userAchievements.achievementId],
    references: [achievements.id],
  }),
}));

export const leaderboardsRelations = relations(leaderboards, ({ one }) => ({
  user: one(users, {
    fields: [leaderboards.userId],
    references: [users.id],
  }),
}));
