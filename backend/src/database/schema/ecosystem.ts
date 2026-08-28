import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, real } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { organizations } from './enterprise';
import {
  marketplaceCategoryEnum,
  pricingModelEnum,
  agentVerificationStatusEnum,
  pluginTypeEnum,
  integrationProviderEnum,
  integrationStatusEnum,
  workflowCategoryEnum,
  workflowTriggerTypeEnum,
  subscriptionStatusEnum,
  transactionTypeEnum,
} from './enums';
import {
  MarketplaceCategory,
  PricingModel,
  AgentVerificationStatus,
  PluginType,
  PluginPermission,
  IntegrationProvider,
  IntegrationStatus,
  WorkflowCategory,
  WorkflowTriggerType,
  SubscriptionStatus,
  TransactionType,
  WebhookEvent,
  AgentType,
} from '@codeforge/shared';

// 1. Marketplace Agents
export const marketplaceAgents = pgTable('marketplace_agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  category: marketplaceCategoryEnum('category').notNull().default(MarketplaceCategory.CAREER),
  verificationStatus: agentVerificationStatusEnum('verification_status').notNull().default(AgentVerificationStatus.COMMUNITY),
  pricingModel: pricingModelEnum('pricing_model').notNull().default(PricingModel.FREE),
  priceCents: integer('price_cents').notNull().default(0),
  capabilities: jsonb('capabilities').$type<string[]>().notNull().default([]),
  systemPrompt: text('system_prompt').notNull(),
  configSchema: jsonb('config_schema').$type<Record<string, unknown>>().notNull().default({}),
  downloadCount: integer('download_count').notNull().default(0),
  ratingAverage: real('rating_average').notNull().default(5.0),
  ratingCount: integer('rating_count').notNull().default(0),
  isFeatured: boolean('is_featured').notNull().default(false),
  isEnterpriseApproved: boolean('is_enterprise_approved').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Marketplace Reviews
export const marketplaceReviews = pgTable('marketplace_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentId: uuid('agent_id').notNull().references(() => marketplaceAgents.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull().default(5),
  reviewText: text('review_text').notNull(),
  isVerifiedBuyer: boolean('is_verified_buyer').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Marketplace Downloads
export const marketplaceDownloads = pgTable('marketplace_downloads', {
  id: uuid('id').defaultRandom().primaryKey(),
  agentId: uuid('agent_id').notNull().references(() => marketplaceAgents.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  version: varchar('version', { length: 50 }).notNull().default('1.0.0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Plugins
export const plugins = pgTable('plugins', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  pluginType: pluginTypeEnum('plugin_type').notNull().default(PluginType.AI_TOOL),
  requiredPermissions: jsonb('required_permissions').$type<PluginPermission[]>().notNull().default([]),
  repositoryUrl: varchar('repository_url', { length: 512 }),
  isVerified: boolean('is_verified').notNull().default(false),
  downloadCount: integer('download_count').notNull().default(0),
  ratingAverage: real('rating_average').notNull().default(5.0),
  ratingCount: integer('rating_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 5. Plugin Versions
export const pluginVersions = pgTable('plugin_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  pluginId: uuid('plugin_id').notNull().references(() => plugins.id, { onDelete: 'cascade' }),
  version: varchar('version', { length: 50 }).notNull(),
  changelog: text('changelog').notNull(),
  bundleUrl: varchar('bundle_url', { length: 512 }).notNull(),
  permissions: jsonb('permissions').$type<PluginPermission[]>().notNull().default([]),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. Plugin Installs
export const pluginInstalls = pgTable('plugin_installs', {
  id: uuid('id').defaultRandom().primaryKey(),
  pluginId: uuid('plugin_id').notNull().references(() => plugins.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  installedVersion: varchar('installed_version', { length: 50 }).notNull(),
  isEnabled: boolean('is_enabled').notNull().default(true),
  configuration: jsonb('configuration').$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 7. Integrations
export const integrations = pgTable('integrations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  provider: integrationProviderEnum('provider').notNull().default(IntegrationProvider.GITHUB),
  status: integrationStatusEnum('status').notNull().default(IntegrationStatus.DISCONNECTED),
  credentialsEncrypted: text('credentials_encrypted'),
  config: jsonb('config').$type<Record<string, unknown>>().notNull().default({}),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
  errorLog: text('error_log'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 8. Workflow Templates
export const workflowTemplates = pgTable('workflow_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  category: workflowCategoryEnum('category').notNull().default(WorkflowCategory.CAREER_PLANNING),
  triggerType: workflowTriggerTypeEnum('trigger_type').notNull().default(WorkflowTriggerType.MANUAL),
  steps: jsonb('steps').$type<{
    stepId: string;
    stepNumber: number;
    agentType: AgentType;
    action: string;
    inputTemplate: string;
    dependencies: string[];
  }[]>().notNull().default([]),
  isEnterprise: boolean('is_enterprise').notNull().default(false),
  ratingAverage: real('rating_average').notNull().default(5.0),
  ratingCount: integer('rating_count').notNull().default(0),
  downloadCount: integer('download_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 9. Developer Apps
export const developerApps = pgTable('developer_apps', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  appName: varchar('app_name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  appType: varchar('app_type', { length: 50 }).notNull().default('public'),
  redirectUris: jsonb('redirect_uris').$type<string[]>().notNull().default([]),
  clientSecretHash: text('client_secret_hash'),
  rateLimitTier: varchar('rate_limit_tier', { length: 50 }).notNull().default('free'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 10. API Keys
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  developerAppId: uuid('developer_app_id').references(() => developerApps.id, { onDelete: 'cascade' }),
  keyPrefix: varchar('key_prefix', { length: 20 }).notNull(),
  keyHash: text('key_hash').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  permissions: jsonb('permissions').$type<string[]>().notNull().default(['*']),
  usageCount: integer('usage_count').notNull().default(0),
  lastUsedAt: timestamp('last_used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 11. Webhooks
export const webhooks = pgTable('webhooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  developerAppId: uuid('developer_app_id').references(() => developerApps.id, { onDelete: 'cascade' }),
  targetUrl: varchar('target_url', { length: 1024 }).notNull(),
  secretHash: text('secret_hash').notNull(),
  subscribedEvents: jsonb('subscribed_events').$type<WebhookEvent[]>().notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  failureCount: integer('failure_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 12. Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  itemType: varchar('item_type', { length: 50 }).notNull(), // 'agent' | 'plugin' | 'platform_tier'
  itemId: varchar('item_id', { length: 255 }).notNull(),
  tier: varchar('tier', { length: 50 }).notNull().default('standard'),
  status: subscriptionStatusEnum('status').notNull().default(SubscriptionStatus.ACTIVE),
  amountCents: integer('amount_cents').notNull().default(0),
  currentPeriodStart: timestamp('current_period_start', { withTimezone: true }).defaultNow().notNull(),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }).notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 13. Transactions
export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'cascade' }),
  transactionType: transactionTypeEnum('transaction_type').notNull().default(TransactionType.AGENT_PURCHASE),
  referenceId: varchar('reference_id', { length: 255 }).notNull(),
  amountCents: integer('amount_cents').notNull(),
  feeCents: integer('fee_cents').notNull().default(0),
  netCents: integer('net_cents').notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  status: varchar('status', { length: 50 }).notNull().default('succeeded'),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull().default('card'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 14. Creator Payouts
export const creatorPayouts = pgTable('creator_payouts', {
  id: uuid('id').defaultRandom().primaryKey(),
  creatorId: uuid('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  amountCents: integer('amount_cents').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  payoutMethod: varchar('payout_method', { length: 50 }).notNull().default('stripe_connect'),
  processedAt: timestamp('processed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const marketplaceAgentsRelations = relations(marketplaceAgents, ({ one, many }) => ({
  creator: one(users, { fields: [marketplaceAgents.creatorId], references: [users.id] }),
  reviews: many(marketplaceReviews),
  downloads: many(marketplaceDownloads),
}));

export const marketplaceReviewsRelations = relations(marketplaceReviews, ({ one }) => ({
  agent: one(marketplaceAgents, { fields: [marketplaceReviews.agentId], references: [marketplaceAgents.id] }),
  user: one(users, { fields: [marketplaceReviews.userId], references: [users.id] }),
}));

export const pluginsRelations = relations(plugins, ({ one, many }) => ({
  creator: one(users, { fields: [plugins.creatorId], references: [users.id] }),
  versions: many(pluginVersions),
  installs: many(pluginInstalls),
}));

export const pluginVersionsRelations = relations(pluginVersions, ({ one }) => ({
  plugin: one(plugins, { fields: [pluginVersions.pluginId], references: [plugins.id] }),
}));

export const pluginInstallsRelations = relations(pluginInstalls, ({ one }) => ({
  plugin: one(plugins, { fields: [pluginInstalls.pluginId], references: [plugins.id] }),
  user: one(users, { fields: [pluginInstalls.userId], references: [users.id] }),
}));

export const integrationsRelations = relations(integrations, ({ one }) => ({
  user: one(users, { fields: [integrations.userId], references: [users.id] }),
}));

export const workflowTemplatesRelations = relations(workflowTemplates, ({ one }) => ({
  creator: one(users, { fields: [workflowTemplates.creatorId], references: [users.id] }),
}));

export const developerAppsRelations = relations(developerApps, ({ one, many }) => ({
  user: one(users, { fields: [developerApps.userId], references: [users.id] }),
  apiKeys: many(apiKeys),
  webhooks: many(webhooks),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, { fields: [apiKeys.userId], references: [users.id] }),
  developerApp: one(developerApps, { fields: [apiKeys.developerAppId], references: [developerApps.id] }),
}));

export const webhooksRelations = relations(webhooks, ({ one }) => ({
  user: one(users, { fields: [webhooks.userId], references: [users.id] }),
  developerApp: one(developerApps, { fields: [webhooks.developerAppId], references: [developerApps.id] }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
}));

export const creatorPayoutsRelations = relations(creatorPayouts, ({ one }) => ({
  creator: one(users, { fields: [creatorPayouts.creatorId], references: [users.id] }),
}));
