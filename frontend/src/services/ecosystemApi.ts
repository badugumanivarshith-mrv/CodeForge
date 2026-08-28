import { apiClient } from './apiClient';
import {
  MarketplaceAgentDto,
  CreateMarketplaceAgentDto,
  AgentReviewDto,
  CreateAgentReviewDto,
  AgentDownloadDto,
  PluginDto,
  PluginInstallDto,
  InstallPluginDto,
  IntegrationDto,
  ConnectIntegrationDto,
  SyncIntegrationResultDto,
  WorkflowTemplateDto,
  ApiKeyDto,
  CreateApiKeyDto,
  WebhookDto,
  CreateWebhookDto,
  CreatorAnalyticsDto,
  MarketplaceOverviewDto,
  MarketplaceFilterParamsDto,
  AgentWorkflowDto,
  TransactionDto,
  CreatorPayoutDto,
  ApiResponse,
} from '@codeforge/shared';

export const ecosystemApi = {
  // 1. Marketplace Overview & Agents
  async getOverview(): Promise<MarketplaceOverviewDto> {
    const res = await apiClient.get<ApiResponse<MarketplaceOverviewDto>>('/ecosystem/overview');
    return res.data.data;
  },

  async listAgents(params?: MarketplaceFilterParamsDto): Promise<MarketplaceAgentDto[]> {
    const res = await apiClient.get<ApiResponse<MarketplaceAgentDto[]>>('/ecosystem/agents', { params });
    return res.data.data;
  },

  async getAgentById(id: string): Promise<MarketplaceAgentDto> {
    const res = await apiClient.get<ApiResponse<MarketplaceAgentDto>>(`/ecosystem/agents/${id}`);
    return res.data.data;
  },

  async publishAgent(data: CreateMarketplaceAgentDto): Promise<MarketplaceAgentDto> {
    const res = await apiClient.post<ApiResponse<MarketplaceAgentDto>>('/ecosystem/agents', data);
    return res.data.data;
  },

  async downloadAgent(agentId: string): Promise<AgentDownloadDto> {
    const res = await apiClient.post<ApiResponse<AgentDownloadDto>>(`/ecosystem/agents/${agentId}/download`);
    return res.data.data;
  },

  async submitReview(data: CreateAgentReviewDto): Promise<AgentReviewDto> {
    const res = await apiClient.post<ApiResponse<AgentReviewDto>>('/ecosystem/agents/reviews', data);
    return res.data.data;
  },

  async listReviews(agentId: string): Promise<AgentReviewDto[]> {
    const res = await apiClient.get<ApiResponse<AgentReviewDto[]>>(`/ecosystem/agents/${agentId}/reviews`);
    return res.data.data;
  },

  // 2. Plugins
  async listPlugins(type?: string): Promise<PluginDto[]> {
    const res = await apiClient.get<ApiResponse<PluginDto[]>>('/ecosystem/plugins', { params: { type } });
    return res.data.data;
  },

  async installPlugin(data: InstallPluginDto): Promise<PluginInstallDto> {
    const res = await apiClient.post<ApiResponse<PluginInstallDto>>('/ecosystem/plugins/install', data);
    return res.data.data;
  },

  async listUserInstalls(): Promise<PluginInstallDto[]> {
    const res = await apiClient.get<ApiResponse<PluginInstallDto[]>>('/ecosystem/plugins/installs');
    return res.data.data;
  },

  async togglePlugin(installId: string, isEnabled: boolean): Promise<PluginInstallDto> {
    const res = await apiClient.patch<ApiResponse<PluginInstallDto>>(`/ecosystem/plugins/installs/${installId}/toggle`, { isEnabled });
    return res.data.data;
  },

  async uninstallPlugin(pluginId: string): Promise<{ uninstalled: boolean }> {
    const res = await apiClient.delete<ApiResponse<{ uninstalled: boolean }>>(`/ecosystem/plugins/${pluginId}/uninstall`);
    return res.data.data;
  },

  // 3. Integration Hub
  async listIntegrations(): Promise<{ connected: IntegrationDto[]; catalog: any[] }> {
    const res = await apiClient.get<ApiResponse<{ connected: IntegrationDto[]; catalog: any[] }>>('/ecosystem/integrations');
    return res.data.data;
  },

  async connectIntegration(data: ConnectIntegrationDto): Promise<IntegrationDto> {
    const res = await apiClient.post<ApiResponse<IntegrationDto>>('/ecosystem/integrations/connect', data);
    return res.data.data;
  },

  async syncIntegration(provider: string): Promise<SyncIntegrationResultDto> {
    const res = await apiClient.post<ApiResponse<SyncIntegrationResultDto>>(`/ecosystem/integrations/${provider}/sync`);
    return res.data.data;
  },

  async disconnectIntegration(provider: string): Promise<{ disconnected: boolean }> {
    const res = await apiClient.delete<ApiResponse<{ disconnected: boolean }>>(`/ecosystem/integrations/${provider}/disconnect`);
    return res.data.data;
  },

  // 4. Workflow Templates
  async listWorkflowTemplates(category?: string): Promise<WorkflowTemplateDto[]> {
    const res = await apiClient.get<ApiResponse<WorkflowTemplateDto[]>>('/ecosystem/workflows/templates', { params: { category } });
    return res.data.data;
  },

  async cloneWorkflowTemplate(templateId: string): Promise<AgentWorkflowDto> {
    const res = await apiClient.post<ApiResponse<AgentWorkflowDto>>(`/ecosystem/workflows/templates/${templateId}/clone`);
    return res.data.data;
  },

  // 5. Developer Platform & API Keys
  async generateApiKey(data: CreateApiKeyDto): Promise<ApiKeyDto> {
    const res = await apiClient.post<ApiResponse<ApiKeyDto>>('/ecosystem/developer/api-keys', data);
    return res.data.data;
  },

  async listApiKeys(): Promise<ApiKeyDto[]> {
    const res = await apiClient.get<ApiResponse<ApiKeyDto[]>>('/ecosystem/developer/api-keys');
    return res.data.data;
  },

  async revokeApiKey(id: string): Promise<{ revoked: boolean }> {
    const res = await apiClient.delete<ApiResponse<{ revoked: boolean }>>(`/ecosystem/developer/api-keys/${id}`);
    return res.data.data;
  },

  async getSdkDocs(): Promise<any[]> {
    const res = await apiClient.get<ApiResponse<any[]>>('/ecosystem/developer/sdk-docs');
    return res.data.data;
  },

  // 6. Webhooks
  async registerWebhook(data: CreateWebhookDto): Promise<WebhookDto> {
    const res = await apiClient.post<ApiResponse<WebhookDto>>('/ecosystem/developer/webhooks', data);
    return res.data.data;
  },

  async listWebhooks(): Promise<WebhookDto[]> {
    const res = await apiClient.get<ApiResponse<WebhookDto[]>>('/ecosystem/developer/webhooks');
    return res.data.data;
  },

  async deleteWebhook(id: string): Promise<{ deleted: boolean }> {
    const res = await apiClient.delete<ApiResponse<{ deleted: boolean }>>(`/ecosystem/developer/webhooks/${id}`);
    return res.data.data;
  },

  // 7. Monetization & Creator
  async purchaseAgent(agentId: string, amountCents?: number): Promise<TransactionDto> {
    const res = await apiClient.post<ApiResponse<TransactionDto>>(`/ecosystem/monetization/purchase/agent/${agentId}`, { amountCents });
    return res.data.data;
  },

  async requestPayout(amountCents: number, payoutMethod?: string): Promise<CreatorPayoutDto> {
    const res = await apiClient.post<ApiResponse<CreatorPayoutDto>>('/ecosystem/monetization/payouts/request', { amountCents, payoutMethod });
    return res.data.data;
  },

  async getCreatorAnalytics(): Promise<CreatorAnalyticsDto> {
    const res = await apiClient.get<ApiResponse<CreatorAnalyticsDto>>('/ecosystem/creator/analytics');
    return res.data.data;
  },
};
