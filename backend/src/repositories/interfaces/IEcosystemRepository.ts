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
} from '@codeforge/shared';

export interface IEcosystemRepository {
  // 1. Marketplace Agents
  createMarketplaceAgent(creatorId: string, data: CreateMarketplaceAgentDto): Promise<MarketplaceAgentDto>;
  getMarketplaceAgentById(id: string): Promise<MarketplaceAgentDto | null>;
  getMarketplaceAgentBySlug(slug: string): Promise<MarketplaceAgentDto | null>;
  listMarketplaceAgents(params?: MarketplaceFilterParamsDto): Promise<MarketplaceAgentDto[]>;
  updateMarketplaceAgent(id: string, creatorId: string, data: UpdateMarketplaceAgentDto): Promise<MarketplaceAgentDto | null>;
  deleteMarketplaceAgent(id: string, creatorId: string): Promise<boolean>;
  incrementAgentDownloadCount(agentId: string): Promise<void>;

  // 2. Reviews & Downloads
  createReview(userId: string, data: CreateAgentReviewDto): Promise<AgentReviewDto>;
  listReviewsByAgentId(agentId: string): Promise<AgentReviewDto[]>;
  recordDownload(agentId: string, userId: string, version?: string): Promise<AgentDownloadDto>;
  listDownloadsByAgentId(agentId: string): Promise<AgentDownloadDto[]>;

  // 3. Plugins
  createPlugin(creatorId: string, data: CreatePluginDto): Promise<PluginDto>;
  getPluginById(id: string): Promise<PluginDto | null>;
  listPlugins(type?: string): Promise<PluginDto[]>;
  updatePlugin(id: string, creatorId: string, data: UpdatePluginDto): Promise<PluginDto | null>;
  deletePlugin(id: string, creatorId: string): Promise<boolean>;

  // 4. Plugin Versions & Installs
  createPluginVersion(pluginId: string, data: CreatePluginVersionDto): Promise<PluginVersionDto>;
  listPluginVersions(pluginId: string): Promise<PluginVersionDto[]>;
  installPlugin(userId: string, data: InstallPluginDto): Promise<PluginInstallDto>;
  uninstallPlugin(pluginId: string, userId: string): Promise<boolean>;
  listUserPluginInstalls(userId: string): Promise<PluginInstallDto[]>;
  togglePluginInstall(installId: string, userId: string, isEnabled: boolean): Promise<PluginInstallDto | null>;

  // 5. Integrations
  connectIntegration(userId: string, data: ConnectIntegrationDto): Promise<IntegrationDto>;
  getIntegration(userId: string, provider: string): Promise<IntegrationDto | null>;
  listUserIntegrations(userId: string): Promise<IntegrationDto[]>;
  updateIntegrationStatus(id: string, userId: string, status: string, errorLog?: string): Promise<IntegrationDto | null>;
  disconnectIntegration(userId: string, provider: string): Promise<boolean>;

  // 6. Workflow Templates
  createWorkflowTemplate(creatorId: string, data: CreateWorkflowTemplateDto): Promise<WorkflowTemplateDto>;
  getWorkflowTemplateById(id: string): Promise<WorkflowTemplateDto | null>;
  listWorkflowTemplates(category?: string): Promise<WorkflowTemplateDto[]>;
  deleteWorkflowTemplate(id: string, creatorId: string): Promise<boolean>;

  // 7. Developer Apps & API Keys
  createDeveloperApp(userId: string, data: CreateDeveloperAppDto): Promise<DeveloperAppDto>;
  getDeveloperAppById(id: string, userId: string): Promise<DeveloperAppDto | null>;
  listDeveloperApps(userId: string): Promise<DeveloperAppDto[]>;
  deleteDeveloperApp(id: string, userId: string): Promise<boolean>;

  createApiKey(userId: string, data: CreateApiKeyDto, keyHash: string, keyPrefix: string): Promise<ApiKeyDto>;
  listApiKeys(userId: string): Promise<ApiKeyDto[]>;
  findApiKeyByPrefix(prefix: string): Promise<ApiKeyDto | null>;
  revokeApiKey(id: string, userId: string): Promise<boolean>;
  incrementApiKeyUsage(id: string): Promise<void>;

  // 8. Webhooks
  createWebhook(userId: string, data: CreateWebhookDto, secretHash: string): Promise<WebhookDto>;
  listWebhooks(userId: string): Promise<WebhookDto[]>;
  deleteWebhook(id: string, userId: string): Promise<boolean>;
  recordWebhookFailure(id: string): Promise<void>;

  // 9. Subscriptions & Transactions & Payouts
  createSubscription(userId: string, data: CreateSubscriptionDto): Promise<SubscriptionDto>;
  getSubscription(userId: string, itemType: string, itemId: string): Promise<SubscriptionDto | null>;
  listUserSubscriptions(userId: string): Promise<SubscriptionDto[]>;
  cancelSubscription(id: string, userId: string): Promise<SubscriptionDto | null>;

  createTransaction(userId: string, data: Partial<TransactionDto>): Promise<TransactionDto>;
  listUserTransactions(userId: string): Promise<TransactionDto[]>;
  listCreatorTransactions(creatorId: string): Promise<TransactionDto[]>;

  createPayout(creatorId: string, amountCents: number, payoutMethod?: string): Promise<CreatorPayoutDto>;
  listCreatorPayouts(creatorId: string): Promise<CreatorPayoutDto[]>;
}
