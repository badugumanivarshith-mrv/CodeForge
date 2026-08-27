import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  jsonb,
  timestamp,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const portfolioProjects = pgTable(
  'portfolio_projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description').notNull(),
    repositoryUrl: varchar('repository_url', { length: 500 }),
    demoUrl: varchar('demo_url', { length: 500 }),
    technologiesJson: jsonb('technologies_json').default([]).notNull(),
    isFeatured: boolean('is_featured').default(false).notNull(),
    starsCount: integer('stars_count').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userProjectIdx: index('idx_portfolio_projects_user').on(table.userId),
  }),
);

export const portfolioSettings = pgTable(
  'portfolio_settings',
  {
    userId: uuid('user_id')
      .primaryKey()
      .references(() => users.id, { onDelete: 'cascade' }),
    headline: varchar('headline', { length: 255 }),
    aboutMdx: text('about_mdx'),
    isPublic: boolean('is_public').default(true).notNull(),
    themePreference: varchar('theme_preference', { length: 50 }).default('modern-dark').notNull(),
    customSlug: varchar('custom_slug', { length: 100 }).unique(),
    featuredSkillIdsJson: jsonb('featured_skill_ids_json').default([]).notNull(),
    socialLinksJson: jsonb('social_links_json').default({}).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
);

export const portfolioProjectsRelations = relations(portfolioProjects, ({ one }) => ({
  user: one(users, {
    fields: [portfolioProjects.userId],
    references: [users.id],
  }),
}));

export const portfolioSettingsRelations = relations(portfolioSettings, ({ one }) => ({
  user: one(users, {
    fields: [portfolioSettings.userId],
    references: [users.id],
  }),
}));
