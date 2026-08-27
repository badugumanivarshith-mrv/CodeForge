import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  numeric,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { ratingReferenceTypeEnum } from './enums';
import { RatingReferenceType } from '@codeforge/shared';
import { users } from './users';

export const skillRatings = pgTable(
  'skill_ratings',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    currentRating: integer('current_rating').default(1200).notNull(),
    peakRating: integer('peak_rating').default(1200).notNull(),
    confidenceInterval: integer('confidence_interval').default(350).notNull(),
    matchesCount: integer('matches_count').default(0).notNull(),
    assessmentsCount: integer('assessments_count').default(0).notNull(),
    percentile: numeric('percentile', { precision: 5, scale: 2 }).default('50.00').notNull(),
    rankTier: varchar('rank_tier', { length: 50 }).default('Novice').notNull(),
    lastUpdated: timestamp('last_updated', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    ratingIdx: index('idx_skill_ratings_current').on(table.currentRating),
  }),
);

export const skillRatingHistory = pgTable(
  'skill_rating_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    previousRating: integer('previous_rating').notNull(),
    newRating: integer('new_rating').notNull(),
    ratingChange: integer('rating_change').notNull(),
    changeReason: varchar('change_reason', { length: 200 }).notNull(),
    referenceType: ratingReferenceTypeEnum('reference_type').default(RatingReferenceType.ASSESSMENT).notNull(),
    referenceId: uuid('reference_id'),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userTimeIdx: index('idx_skill_rating_history_user_time').on(table.userId, table.timestamp),
  }),
);

// Relations
export const skillRatingsRelations = relations(skillRatings, ({ one }) => ({
  user: one(users, {
    fields: [skillRatings.userId],
    references: [users.id],
  }),
}));

export const skillRatingHistoryRelations = relations(skillRatingHistory, ({ one }) => ({
  user: one(users, {
    fields: [skillRatingHistory.userId],
    references: [users.id],
  }),
}));
