import { eq, and, desc, sql, ilike } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  marketplaceAgents,
  marketplaceReviews,
  marketplaceDownloads,
  plugins,
  pluginVersions,
  pluginInstalls,
  integrations,
  workflowTemplates,
  developerApps,
  apiKeys,
  webhooks,
  subscriptions,
  transactions,
  creatorPayouts,
} from '../database/schema/ecosystem';
import { IEcosystemRepository } from './interfaces/IEcosystemRepository';
import {
  MarketplaceAgentDto,
  CreateMarketplaceAgentDto,
  UpdateMarketplaceAgentDto,
  AgentReviewDto,
  CreateAgentReviewDto,
  AgentDownloadDto,
  PluginDto,
  CreatePluginDto,
  UpdatePluginDto,
  PluginVersionDto,
  CreatePluginVersionDto,
  PluginInstallDto,
  InstallPluginDto,
  IntegrationDto,
  ConnectIntegrationDto,
  WorkflowTemplateDto,
  CreateWorkflowTemplateDto,
  DeveloperAppDto,
  CreateDeveloperAppDto,
  ApiKeyDto,
  CreateApiKeyDto,
  WebhookDto,
  CreateWebhookDto,
  SubscriptionDto,
  CreateSubscriptionDto,
  TransactionDto,
  CreatorPayoutDto,
  MarketplaceFilterParamsDto,
  PricingModel,
  AgentVerificationStatus,
  IntegrationStatus,
  SubscriptionStatus,
  TransactionType,
} from '@codeforge/shared';

export class EcosystemRepository implements IEcosystemRepository {
  // 1. Marketplace Agents
  async createMarketplaceAgent(creatorId: string, data: CreateMarketplaceAgentDto): Promise<MarketplaceAgentDto> {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const [agent] = await db
      .insert(marketplaceAgents)
      .values({
        creatorId,
        organizationId: data.organizationId,
        name: data.name,
        slug,
        description: data.description,
        category: data.category,
        pricingModel: data.pricingModel || PricingModel.FREE,
        priceCents: data.priceCents || 0,
        capabilities: data.capabilities,
        systemPrompt: data.systemPrompt,
        configSchema: data.configSchema || {},
        verificationStatus: AgentVerificationStatus.COMMUNITY,
        downloadCount: 0,
        ratingAverage: 5.0,
        ratingCount: 0,
        isFeatured: false,
        isEnterpriseApproved: false,
      })
      .returning();
    return this.mapMarketplaceAgent(agent);
  }

  async getMarketplaceAgentById(id: string): Promise<MarketplaceAgentDto | null> {
    const [agent] = await db.select().from(marketplaceAgents).where(eq(marketplaceAgents.id, id));
    return agent ? this.mapMarketplaceAgent(agent) : null;
  }

  async getMarketplaceAgentBySlug(slug: string): Promise<MarketplaceAgentDto | null> {
    const [agent] = await db.select().from(marketplaceAgents).where(eq(marketplaceAgents.slug, slug));
    return agent ? this.mapMarketplaceAgent(agent) : null;
  }

  async listMarketplaceAgents(params?: MarketplaceFilterParamsDto): Promise<MarketplaceAgentDto[]> {
    const conditions = [];
    if (params?.category) {
      conditions.push(eq(marketplaceAgents.category, params.category));
    }
    if (params?.pricing) {
      conditions.push(eq(marketplaceAgents.pricingModel, params.pricing));
    }
    if (params?.verifiedOnly) {
      conditions.push(eq(marketplaceAgents.verificationStatus, AgentVerificationStatus.VERIFIED));
    }
    if (params?.featuredOnly) {
      conditions.push(eq(marketplaceAgents.isFeatured, true));
    }
    if (params?.search) {
      conditions.push(ilike(marketplaceAgents.name, `%${params.search}%`));
    }

    const query = db
      .select()
      .from(marketplaceAgents)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(marketplaceAgents.downloadCount), desc(marketplaceAgents.ratingAverage));

    const rows = await query;
    return rows.map((r: typeof marketplaceAgents.$inferSelect) => this.mapMarketplaceAgent(r));
  }

  async updateMarketplaceAgent(id: string, creatorId: string, data: UpdateMarketplaceAgentDto): Promise<MarketplaceAgentDto | null> {
    const [agent] = await db
      .update(marketplaceAgents)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(and(eq(marketplaceAgents.id, id), eq(marketplaceAgents.creatorId, creatorId)))
      .returning();
    return agent ? this.mapMarketplaceAgent(agent) : null;
  }

  async deleteMarketplaceAgent(id: string, creatorId: string): Promise<boolean> {
    const result = await db
      .delete(marketplaceAgents)
      .where(and(eq(marketplaceAgents.id, id), eq(marketplaceAgents.creatorId, creatorId)))
      .returning();
    return result.length > 0;
  }

  async incrementAgentDownloadCount(agentId: string): Promise<void> {
    await db
      .update(marketplaceAgents)
      .set({
        downloadCount: sql`${marketplaceAgents.downloadCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(marketplaceAgents.id, agentId));
  }

  // 2. Reviews & Downloads
  async createReview(userId: string, data: CreateAgentReviewDto): Promise<AgentReviewDto> {
    const [review] = await db
      .insert(marketplaceReviews)
      .values({
        agentId: data.agentId,
        userId,
        rating: data.rating,
        reviewText: data.reviewText,
        isVerifiedBuyer: true,
      })
      .returning();

    // Recalculate average rating on the agent
    const reviews = await db.select().from(marketplaceReviews).where(eq(marketplaceReviews.agentId, data.agentId));
    const avg = reviews.reduce((sum: number, r: typeof marketplaceReviews.$inferSelect) => sum + r.rating, 0) / reviews.length;

    await db
      .update(marketplaceAgents)
      .set({
        ratingAverage: Math.round(avg * 10) / 10,
        ratingCount: reviews.length,
        updatedAt: new Date(),
      })
      .where(eq(marketplaceAgents.id, data.agentId));

    return this.mapReview(review);
  }

  async listReviewsByAgentId(agentId: string): Promise<AgentReviewDto[]> {
    const rows = await db
      .select()
      .from(marketplaceReviews)
      .where(eq(marketplaceReviews.agentId, agentId))
      .orderBy(desc(marketplaceReviews.createdAt));
    return rows.map((r: typeof marketplaceReviews.$inferSelect) => this.mapReview(r));
  }

  async recordDownload(agentId: string, userId: string, version: string = '1.0.0'): Promise<AgentDownloadDto> {
    const [download] = await db
      .insert(marketplaceDownloads)
      .values({
        agentId,
        userId,
        version,
      })
      .returning();
    await this.incrementAgentDownloadCount(agentId);
    return {
      id: download.id,
      agentId: download.agentId,
      userId: download.userId,
      version: download.version,
      createdAt: download.createdAt.toISOString(),
    };
  }

  async listDownloadsByAgentId(agentId: string): Promise<AgentDownloadDto[]> {
    const rows = await db.select().from(marketplaceDownloads).where(eq(marketplaceDownloads.agentId, agentId));
    return rows.map((r: typeof marketplaceDownloads.$inferSelect) => ({
      id: r.id,
      agentId: r.agentId,
      userId: r.userId,
      version: r.version,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  // 3. Plugins
  async createPlugin(creatorId: string, data: CreatePluginDto): Promise<PluginDto> {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const [plugin] = await db
      .insert(plugins)
      .values({
        creatorId,
        name: data.name,
        slug,
        description: data.description,
        pluginType: data.pluginType,
        requiredPermissions: data.requiredPermissions,
        repositoryUrl: data.repositoryUrl,
        isVerified: true,
        downloadCount: 0,
        ratingAverage: 5.0,
        ratingCount: 0,
      })
      .returning();

    // Create initial version
    await db.insert(pluginVersions).values({
      pluginId: plugin.id,
      version: data.initialVersion || '1.0.0',
      changelog: 'Initial public release',
      bundleUrl: `https://cdn.codeforge.dev/plugins/${plugin.id}/bundle-v1.0.0.js`,
      permissions: data.requiredPermissions,
      status: 'active',
    });

    return this.mapPlugin(plugin, data.initialVersion || '1.0.0');
  }

  async getPluginById(id: string): Promise<PluginDto | null> {
    const [plugin] = await db.select().from(plugins).where(eq(plugins.id, id));
    return plugin ? this.mapPlugin(plugin) : null;
  }

  async listPlugins(type?: string): Promise<PluginDto[]> {
    const rows = await db
      .select()
      .from(plugins)
      .where(type ? eq(plugins.pluginType, type as any) : undefined)
      .orderBy(desc(plugins.downloadCount));
    return rows.map((r: typeof plugins.$inferSelect) => this.mapPlugin(r));
  }

  async updatePlugin(id: string, creatorId: string, data: UpdatePluginDto): Promise<PluginDto | null> {
    const [plugin] = await db
      .update(plugins)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(plugins.id, id), eq(plugins.creatorId, creatorId)))
      .returning();
    return plugin ? this.mapPlugin(plugin) : null;
  }

  async deletePlugin(id: string, creatorId: string): Promise<boolean> {
    const result = await db
      .delete(plugins)
      .where(and(eq(plugins.id, id), eq(plugins.creatorId, creatorId)))
      .returning();
    return result.length > 0;
  }

  // 4. Plugin Versions & Installs
  async createPluginVersion(pluginId: string, data: CreatePluginVersionDto): Promise<PluginVersionDto> {
    const [version] = await db
      .insert(pluginVersions)
      .values({
        pluginId,
        version: data.version,
        changelog: data.changelog,
        bundleUrl: data.bundleUrl,
        permissions: data.permissions,
        status: 'active',
      })
      .returning();
    return this.mapPluginVersion(version);
  }

  async listPluginVersions(pluginId: string): Promise<PluginVersionDto[]> {
    const rows = await db
      .select()
      .from(pluginVersions)
      .where(eq(pluginVersions.pluginId, pluginId))
      .orderBy(desc(pluginVersions.createdAt));
    return rows.map((r: typeof pluginVersions.$inferSelect) => this.mapPluginVersion(r));
  }

  async installPlugin(userId: string, data: InstallPluginDto): Promise<PluginInstallDto> {
    // Check if already installed
    const [existing] = await db
      .select()
      .from(pluginInstalls)
      .where(and(eq(pluginInstalls.pluginId, data.pluginId), eq(pluginInstalls.userId, userId)));

    if (existing) {
      const [updated] = await db
        .update(pluginInstalls)
        .set({ isEnabled: true, updatedAt: new Date() })
        .where(eq(pluginInstalls.id, existing.id))
        .returning();
      return this.mapPluginInstall(updated);
    }

    const [install] = await db
      .insert(pluginInstalls)
      .values({
        pluginId: data.pluginId,
        userId,
        organizationId: data.organizationId,
        installedVersion: '1.0.0',
        isEnabled: true,
        configuration: data.configuration || {},
      })
      .returning();

    await db
      .update(plugins)
      .set({ downloadCount: sql`${plugins.downloadCount} + 1` })
      .where(eq(plugins.id, data.pluginId));

    return this.mapPluginInstall(install);
  }

  async uninstallPlugin(pluginId: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(pluginInstalls)
      .where(and(eq(pluginInstalls.pluginId, pluginId), eq(pluginInstalls.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async listUserPluginInstalls(userId: string): Promise<PluginInstallDto[]> {
    const rows = await db
      .select()
      .from(pluginInstalls)
      .where(eq(pluginInstalls.userId, userId))
      .orderBy(desc(pluginInstalls.createdAt));
    return rows.map((r: typeof pluginInstalls.$inferSelect) => this.mapPluginInstall(r));
  }

  async togglePluginInstall(installId: string, userId: string, isEnabled: boolean): Promise<PluginInstallDto | null> {
    const [updated] = await db
      .update(pluginInstalls)
      .set({ isEnabled, updatedAt: new Date() })
      .where(and(eq(pluginInstalls.id, installId), eq(pluginInstalls.userId, userId)))
      .returning();
    return updated ? this.mapPluginInstall(updated) : null;
  }

  // 5. Integrations
  async connectIntegration(userId: string, data: ConnectIntegrationDto): Promise<IntegrationDto> {
    const [existing] = await db
      .select()
      .from(integrations)
      .where(and(eq(integrations.userId, userId), eq(integrations.provider, data.provider)));

    if (existing) {
      const [updated] = await db
        .update(integrations)
        .set({
          status: IntegrationStatus.CONNECTED,
          config: data.config || existing.config,
          lastSyncedAt: new Date(),
          errorLog: null,
          updatedAt: new Date(),
        })
        .where(eq(integrations.id, existing.id))
        .returning();
      return this.mapIntegration(updated);
    }

    const [integration] = await db
      .insert(integrations)
      .values({
        userId,
        organizationId: data.organizationId,
        provider: data.provider,
        status: IntegrationStatus.CONNECTED,
        credentialsEncrypted: JSON.stringify(data.credentials || {}),
        config: data.config || {},
        lastSyncedAt: new Date(),
      })
      .returning();
    return this.mapIntegration(integration);
  }

  async getIntegration(userId: string, provider: string): Promise<IntegrationDto | null> {
    const [row] = await db
      .select()
      .from(integrations)
      .where(and(eq(integrations.userId, userId), eq(integrations.provider, provider as any)));
    return row ? this.mapIntegration(row) : null;
  }

  async listUserIntegrations(userId: string): Promise<IntegrationDto[]> {
    const rows = await db.select().from(integrations).where(eq(integrations.userId, userId));
    return rows.map((r: typeof integrations.$inferSelect) => this.mapIntegration(r));
  }

  async updateIntegrationStatus(id: string, userId: string, status: string, errorLog?: string): Promise<IntegrationDto | null> {
    const [row] = await db
      .update(integrations)
      .set({
        status: status as any,
        errorLog: errorLog || null,
        lastSyncedAt: status === IntegrationStatus.CONNECTED ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(integrations.id, id), eq(integrations.userId, userId)))
      .returning();
    return row ? this.mapIntegration(row) : null;
  }

  async disconnectIntegration(userId: string, provider: string): Promise<boolean> {
    const result = await db
      .delete(integrations)
      .where(and(eq(integrations.userId, userId), eq(integrations.provider, provider as any)))
      .returning();
    return result.length > 0;
  }

  // 6. Workflow Templates
  async createWorkflowTemplate(creatorId: string, data: CreateWorkflowTemplateDto): Promise<WorkflowTemplateDto> {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    const [template] = await db
      .insert(workflowTemplates)
      .values({
        creatorId,
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        triggerType: data.triggerType,
        steps: data.steps,
        isEnterprise: data.isEnterprise || false,
        ratingAverage: 5.0,
        ratingCount: 0,
        downloadCount: 0,
      })
      .returning();
    return this.mapWorkflowTemplate(template);
  }

  async getWorkflowTemplateById(id: string): Promise<WorkflowTemplateDto | null> {
    const [row] = await db.select().from(workflowTemplates).where(eq(workflowTemplates.id, id));
    return row ? this.mapWorkflowTemplate(row) : null;
  }

  async listWorkflowTemplates(category?: string): Promise<WorkflowTemplateDto[]> {
    const rows = await db
      .select()
      .from(workflowTemplates)
      .where(category ? eq(workflowTemplates.category, category as any) : undefined)
      .orderBy(desc(workflowTemplates.downloadCount));
    return rows.map((r: typeof workflowTemplates.$inferSelect) => this.mapWorkflowTemplate(r));
  }

  async deleteWorkflowTemplate(id: string, creatorId: string): Promise<boolean> {
    const result = await db
      .delete(workflowTemplates)
      .where(and(eq(workflowTemplates.id, id), eq(workflowTemplates.creatorId, creatorId)))
      .returning();
    return result.length > 0;
  }

  // 7. Developer Apps & API Keys
  async createDeveloperApp(userId: string, data: CreateDeveloperAppDto): Promise<DeveloperAppDto> {
    const [app] = await db
      .insert(developerApps)
      .values({
        userId,
        organizationId: data.organizationId,
        appName: data.appName,
        description: data.description,
        appType: data.appType || 'public',
        redirectUris: data.redirectUris || [],
        rateLimitTier: data.rateLimitTier || 'free',
      })
      .returning();
    return this.mapDeveloperApp(app);
  }

  async getDeveloperAppById(id: string, userId: string): Promise<DeveloperAppDto | null> {
    const [app] = await db
      .select()
      .from(developerApps)
      .where(and(eq(developerApps.id, id), eq(developerApps.userId, userId)));
    return app ? this.mapDeveloperApp(app) : null;
  }

  async listDeveloperApps(userId: string): Promise<DeveloperAppDto[]> {
    const rows = await db.select().from(developerApps).where(eq(developerApps.userId, userId));
    return rows.map((r: typeof developerApps.$inferSelect) => this.mapDeveloperApp(r));
  }

  async deleteDeveloperApp(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(developerApps)
      .where(and(eq(developerApps.id, id), eq(developerApps.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async createApiKey(userId: string, data: CreateApiKeyDto, keyHash: string, keyPrefix: string): Promise<ApiKeyDto> {
    const [key] = await db
      .insert(apiKeys)
      .values({
        userId,
        organizationId: data.organizationId,
        developerAppId: data.developerAppId,
        keyPrefix,
        keyHash,
        name: data.name,
        permissions: data.permissions || ['*'],
        usageCount: 0,
        isActive: true,
        expiresAt: data.expiresInDays
          ? new Date(Date.now() + data.expiresInDays * 86400 * 1000)
          : null,
      })
      .returning();
    return this.mapApiKey(key);
  }

  async listApiKeys(userId: string): Promise<ApiKeyDto[]> {
    const rows = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId));
    return rows.map((r: typeof apiKeys.$inferSelect) => this.mapApiKey(r));
  }

  async findApiKeyByPrefix(prefix: string): Promise<ApiKeyDto | null> {
    const [key] = await db.select().from(apiKeys).where(and(eq(apiKeys.keyPrefix, prefix), eq(apiKeys.isActive, true)));
    return key ? this.mapApiKey(key) : null;
  }

  async revokeApiKey(id: string, userId: string): Promise<boolean> {
    const [updated] = await db
      .update(apiKeys)
      .set({ isActive: false })
      .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)))
      .returning();
    return !!updated;
  }

  async incrementApiKeyUsage(id: string): Promise<void> {
    await db
      .update(apiKeys)
      .set({
        usageCount: sql`${apiKeys.usageCount} + 1`,
        lastUsedAt: new Date(),
      })
      .where(eq(apiKeys.id, id));
  }

  // 8. Webhooks
  async createWebhook(userId: string, data: CreateWebhookDto, secretHash: string): Promise<WebhookDto> {
    const [webhook] = await db
      .insert(webhooks)
      .values({
        userId,
        organizationId: data.organizationId,
        developerAppId: data.developerAppId,
        targetUrl: data.targetUrl,
        secretHash,
        subscribedEvents: data.subscribedEvents,
        isActive: true,
        failureCount: 0,
      })
      .returning();
    return this.mapWebhook(webhook);
  }

  async listWebhooks(userId: string): Promise<WebhookDto[]> {
    const rows = await db.select().from(webhooks).where(eq(webhooks.userId, userId));
    return rows.map((r: typeof webhooks.$inferSelect) => this.mapWebhook(r));
  }

  async deleteWebhook(id: string, userId: string): Promise<boolean> {
    const result = await db
      .delete(webhooks)
      .where(and(eq(webhooks.id, id), eq(webhooks.userId, userId)))
      .returning();
    return result.length > 0;
  }

  async recordWebhookFailure(id: string): Promise<void> {
    await db
      .update(webhooks)
      .set({
        failureCount: sql`${webhooks.failureCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(webhooks.id, id));
  }

  // 9. Subscriptions & Transactions & Payouts
  async createSubscription(userId: string, data: CreateSubscriptionDto): Promise<SubscriptionDto> {
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    const [sub] = await db
      .insert(subscriptions)
      .values({
        userId,
        organizationId: data.organizationId,
        itemType: data.itemType,
        itemId: data.itemId,
        tier: data.tier || 'standard',
        status: SubscriptionStatus.ACTIVE,
        amountCents: data.amountCents || 2900,
        currentPeriodStart: new Date(),
        currentPeriodEnd: periodEnd,
        cancelAtPeriodEnd: false,
      })
      .returning();
    return this.mapSubscription(sub);
  }

  async getSubscription(userId: string, itemType: string, itemId: string): Promise<SubscriptionDto | null> {
    const [sub] = await db
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          eq(subscriptions.itemType, itemType),
          eq(subscriptions.itemId, itemId)
        )
      );
    return sub ? this.mapSubscription(sub) : null;
  }

  async listUserSubscriptions(userId: string): Promise<SubscriptionDto[]> {
    const rows = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
    return rows.map((r: typeof subscriptions.$inferSelect) => this.mapSubscription(r));
  }

  async cancelSubscription(id: string, userId: string): Promise<SubscriptionDto | null> {
    const [sub] = await db
      .update(subscriptions)
      .set({ cancelAtPeriodEnd: true, updatedAt: new Date() })
      .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)))
      .returning();
    return sub ? this.mapSubscription(sub) : null;
  }

  async createTransaction(userId: string, data: Partial<TransactionDto>): Promise<TransactionDto> {
    const amount = data.amountCents || 0;
    const fee = data.feeCents ?? Math.round(amount * 0.15); // 15% platform fee
    const net = data.netCents ?? (amount - fee);

    const [tx] = await db
      .insert(transactions)
      .values({
        userId,
        organizationId: data.organizationId,
        transactionType: data.transactionType || TransactionType.AGENT_PURCHASE,
        referenceId: data.referenceId || `ref-${Date.now()}`,
        amountCents: amount,
        feeCents: fee,
        netCents: net,
        currency: data.currency || 'USD',
        status: data.status || 'succeeded',
        paymentMethod: data.paymentMethod || 'card',
      })
      .returning();
    return this.mapTransaction(tx);
  }

  async listUserTransactions(userId: string): Promise<TransactionDto[]> {
    const rows = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
    return rows.map((r: typeof transactions.$inferSelect) => this.mapTransaction(r));
  }

  async listCreatorTransactions(creatorId: string): Promise<TransactionDto[]> {
    const rows = await db
      .select()
      .from(transactions)
      .orderBy(desc(transactions.createdAt));
    return rows.map((r: typeof transactions.$inferSelect) => this.mapTransaction(r));
  }

  async createPayout(creatorId: string, amountCents: number, payoutMethod: string = 'stripe_connect'): Promise<CreatorPayoutDto> {
    const [payout] = await db
      .insert(creatorPayouts)
      .values({
        creatorId,
        amountCents,
        status: 'pending',
        payoutMethod,
      })
      .returning();
    return {
      id: payout.id,
      creatorId: payout.creatorId,
      amountCents: payout.amountCents,
      status: payout.status as any,
      payoutMethod: payout.payoutMethod,
      processedAt: payout.processedAt?.toISOString() || null,
      createdAt: payout.createdAt.toISOString(),
    };
  }

  async listCreatorPayouts(creatorId: string): Promise<CreatorPayoutDto[]> {
    const rows = await db
      .select()
      .from(creatorPayouts)
      .where(eq(creatorPayouts.creatorId, creatorId))
      .orderBy(desc(creatorPayouts.createdAt));
    return rows.map((r: typeof creatorPayouts.$inferSelect) => ({
      id: r.id,
      creatorId: r.creatorId,
      amountCents: r.amountCents,
      status: r.status as any,
      payoutMethod: r.payoutMethod,
      processedAt: r.processedAt?.toISOString() || null,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  // Private Mappers
  private mapMarketplaceAgent(row: typeof marketplaceAgents.$inferSelect): MarketplaceAgentDto {
    return {
      id: row.id,
      creatorId: row.creatorId,
      organizationId: row.organizationId,
      name: row.name,
      slug: row.slug,
      description: row.description,
      category: row.category,
      verificationStatus: row.verificationStatus,
      pricingModel: row.pricingModel,
      priceCents: row.priceCents,
      capabilities: row.capabilities,
      systemPrompt: row.systemPrompt,
      configSchema: row.configSchema,
      downloadCount: row.downloadCount,
      ratingAverage: row.ratingAverage,
      ratingCount: row.ratingCount,
      isFeatured: row.isFeatured,
      isEnterpriseApproved: row.isEnterpriseApproved,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapReview(row: typeof marketplaceReviews.$inferSelect): AgentReviewDto {
    return {
      id: row.id,
      agentId: row.agentId,
      userId: row.userId,
      rating: row.rating,
      reviewText: row.reviewText,
      isVerifiedBuyer: row.isVerifiedBuyer,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapPlugin(row: typeof plugins.$inferSelect, latestVersion: string = '1.0.0'): PluginDto {
    return {
      id: row.id,
      creatorId: row.creatorId,
      name: row.name,
      slug: row.slug,
      description: row.description,
      pluginType: row.pluginType,
      requiredPermissions: row.requiredPermissions,
      repositoryUrl: row.repositoryUrl,
      isVerified: row.isVerified,
      downloadCount: row.downloadCount,
      ratingAverage: row.ratingAverage,
      ratingCount: row.ratingCount,
      latestVersion,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapPluginVersion(row: typeof pluginVersions.$inferSelect): PluginVersionDto {
    return {
      id: row.id,
      pluginId: row.pluginId,
      version: row.version,
      changelog: row.changelog,
      bundleUrl: row.bundleUrl,
      permissions: row.permissions,
      status: row.status as any,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private mapPluginInstall(row: typeof pluginInstalls.$inferSelect): PluginInstallDto {
    return {
      id: row.id,
      pluginId: row.pluginId,
      userId: row.userId,
      organizationId: row.organizationId,
      installedVersion: row.installedVersion,
      isEnabled: row.isEnabled,
      configuration: row.configuration,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapIntegration(row: typeof integrations.$inferSelect): IntegrationDto {
    return {
      id: row.id,
      userId: row.userId,
      organizationId: row.organizationId,
      provider: row.provider,
      status: row.status,
      config: row.config,
      lastSyncedAt: row.lastSyncedAt?.toISOString() || null,
      errorLog: row.errorLog,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapWorkflowTemplate(row: typeof workflowTemplates.$inferSelect): WorkflowTemplateDto {
    return {
      id: row.id,
      creatorId: row.creatorId,
      title: row.title,
      slug: row.slug,
      description: row.description,
      category: row.category,
      triggerType: row.triggerType,
      steps: row.steps,
      isEnterprise: row.isEnterprise,
      ratingAverage: row.ratingAverage,
      ratingCount: row.ratingCount,
      downloadCount: row.downloadCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapDeveloperApp(row: typeof developerApps.$inferSelect): DeveloperAppDto {
    return {
      id: row.id,
      userId: row.userId,
      organizationId: row.organizationId,
      appName: row.appName,
      description: row.description,
      appType: row.appType as any,
      redirectUris: row.redirectUris,
      rateLimitTier: row.rateLimitTier as any,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapApiKey(row: typeof apiKeys.$inferSelect): ApiKeyDto {
    return {
      id: row.id,
      userId: row.userId,
      organizationId: row.organizationId,
      developerAppId: row.developerAppId,
      keyPrefix: row.keyPrefix,
      name: row.name,
      permissions: row.permissions,
      usageCount: row.usageCount,
      lastUsedAt: row.lastUsedAt?.toISOString() || null,
      expiresAt: row.expiresAt?.toISOString() || null,
      isActive: row.isActive,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private mapWebhook(row: typeof webhooks.$inferSelect): WebhookDto {
    return {
      id: row.id,
      userId: row.userId,
      organizationId: row.organizationId,
      developerAppId: row.developerAppId,
      targetUrl: row.targetUrl,
      subscribedEvents: row.subscribedEvents,
      isActive: row.isActive,
      failureCount: row.failureCount,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapSubscription(row: typeof subscriptions.$inferSelect): SubscriptionDto {
    return {
      id: row.id,
      userId: row.userId,
      organizationId: row.organizationId,
      itemType: row.itemType as any,
      itemId: row.itemId,
      tier: row.tier,
      status: row.status,
      amountCents: row.amountCents,
      currentPeriodStart: row.currentPeriodStart.toISOString(),
      currentPeriodEnd: row.currentPeriodEnd.toISOString(),
      cancelAtPeriodEnd: row.cancelAtPeriodEnd,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapTransaction(row: typeof transactions.$inferSelect): TransactionDto {
    return {
      id: row.id,
      userId: row.userId,
      organizationId: row.organizationId,
      transactionType: row.transactionType,
      referenceId: row.referenceId,
      amountCents: row.amountCents,
      feeCents: row.feeCents,
      netCents: row.netCents,
      currency: row.currency,
      status: row.status as any,
      paymentMethod: row.paymentMethod,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
