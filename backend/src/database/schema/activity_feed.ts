import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { activityTypeEnum } from './enums';
import { ActivityType } from '@codeforge/shared';

export const activityFeedEvents = pgTable(
  'activity_feed_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    activityType: activityTypeEnum('activity_type').default(ActivityType.ASSESSMENT_COMPLETED).notNull(),
    title: varchar('title', { length: 250 }).notNull(),
    description: text('description').notNull(),
    metadataJson: jsonb('metadata_json').default({}).notNull(),
    isPublic: boolean('is_public').default(true).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userFeedIdx: index('idx_activity_feed_user').on(table.userId),
    publicFeedIdx: index('idx_activity_feed_public_created').on(table.isPublic, table.createdAt),
  }),
);

export const activityFeedEventsRelations = relations(activityFeedEvents, ({ one }) => ({
  user: one(users, {
    fields: [activityFeedEvents.userId],
    references: [users.id],
  }),
}));
