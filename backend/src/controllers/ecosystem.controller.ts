import { Request, Response } from 'express';
import { EcosystemRepository } from '../repositories/EcosystemRepository';
import { AgenticWorkspaceRepository } from '../repositories/AgenticWorkspaceRepository';
import { MarketplaceService } from '../modules/marketplace/marketplaceService';
import { PluginEngineService } from '../modules/plugins/pluginEngineService';
import { IntegrationHubService } from '../modules/integrations/integrationHubService';
import { WorkflowMarketplaceService } from '../modules/workflows/workflowMarketplaceService';
import { DeveloperPlatformService } from '../modules/developer/developerPlatformService';
import { MonetizationService } from '../modules/monetization/monetizationService';
import { EcosystemAnalyticsService } from '../modules/analytics/ecosystemAnalyticsService';
import { ApiResponse } from '@codeforge/shared';

const ecosystemRepo = new EcosystemRepository();
const workspaceRepo = new AgenticWorkspaceRepository();

const marketplaceService = new MarketplaceService(ecosystemRepo);
const pluginEngineService = new PluginEngineService(ecosystemRepo);
const integrationHubService = new IntegrationHubService(ecosystemRepo);
const workflowMarketplaceService = new WorkflowMarketplaceService(ecosystemRepo, workspaceRepo);
const developerPlatformService = new DeveloperPlatformService(ecosystemRepo);
const monetizationService = new MonetizationService(ecosystemRepo);
const analyticsService = new EcosystemAnalyticsService(ecosystemRepo);

export class EcosystemController {
  // 1. Marketplace Agents
  static async listAgents(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      await marketplaceService.initializeStarterAgents(userId);
      const agents = await marketplaceService.listAgents(req.query as any);
      const response: ApiResponse<typeof agents> = { success: true, data: agents };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getAgentById(req: Request, res: Response): Promise<void> {
    try {
      const agent = await marketplaceService.getAgentById(req.params.id);
      if (!agent) {
        res.status(404).json({ success: false, message: 'Agent not found' });
        return;
      }
      const response: ApiResponse<typeof agent> = { success: true, data: agent };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async publishAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const agent = await marketplaceService.publishAgent(userId, req.body);
      const response: ApiResponse<typeof agent> = { success: true, data: agent };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async submitReview(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const review = await marketplaceService.submitReview(userId, req.body);
      const response: ApiResponse<typeof review> = { success: true, data: review };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listReviews(req: Request, res: Response): Promise<void> {
    try {
      const reviews = await marketplaceService.listReviews(req.params.agentId);
      const response: ApiResponse<typeof reviews> = { success: true, data: reviews };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async downloadAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const download = await marketplaceService.downloadAgent(req.params.agentId, userId);
      const response: ApiResponse<typeof download> = { success: true, data: download };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // 2. Plugins
  static async listPlugins(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      await pluginEngineService.initializeStarterPlugins(userId);
      const plugins = await pluginEngineService.listPlugins(req.query.type as string);
      const response: ApiResponse<typeof plugins> = { success: true, data: plugins };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async installPlugin(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const install = await pluginEngineService.installPlugin(userId, req.body);
      const response: ApiResponse<typeof install> = { success: true, data: install };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listUserInstalls(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const installs = await pluginEngineService.listUserInstalls(userId);
      const response: ApiResponse<typeof installs> = { success: true, data: installs };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async togglePlugin(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const updated = await pluginEngineService.togglePlugin(req.params.installId, userId, req.body.isEnabled);
      const response: ApiResponse<typeof updated> = { success: true, data: updated };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async uninstallPlugin(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const uninstalled = await pluginEngineService.uninstallPlugin(req.params.pluginId, userId);
      const response: ApiResponse<{ uninstalled: boolean }> = { success: true, data: { uninstalled } };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 3. Integrations Hub
  static async listIntegrations(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const integrations = await integrationHubService.listIntegrations(userId);
      const catalog = await integrationHubService.getIntegrationCatalog();
      const response: ApiResponse<{ connected: typeof integrations; catalog: typeof catalog }> = {
        success: true,
        data: { connected: integrations, catalog },
      };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async connectIntegration(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const integration = await integrationHubService.connect(userId, req.body);
      const response: ApiResponse<typeof integration> = { success: true, data: integration };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async syncIntegration(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const syncResult = await integrationHubService.syncIntegration(userId, req.params.provider as any);
      const response: ApiResponse<typeof syncResult> = { success: true, data: syncResult };
      res.json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async disconnectIntegration(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const disconnected = await integrationHubService.disconnect(userId, req.params.provider as any);
      const response: ApiResponse<{ disconnected: boolean }> = { success: true, data: { disconnected } };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 4. Workflow Templates
  static async listWorkflowTemplates(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id || 'system';
      await workflowMarketplaceService.initializeStarterTemplates(userId);
      const templates = await workflowMarketplaceService.listTemplates(req.query.category as string);
      const response: ApiResponse<typeof templates> = { success: true, data: templates };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async cloneWorkflowTemplate(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const cloned = await workflowMarketplaceService.cloneTemplateToWorkspace(req.params.templateId, userId);
      const response: ApiResponse<typeof cloned> = { success: true, data: cloned };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // 5. Developer Platform & API Keys
  static async generateApiKey(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const key = await developerPlatformService.generateApiKey(userId, req.body);
      const response: ApiResponse<typeof key> = { success: true, data: key };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listApiKeys(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const keys = await developerPlatformService.listApiKeys(userId);
      const response: ApiResponse<typeof keys> = { success: true, data: keys };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async revokeApiKey(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const revoked = await developerPlatformService.revokeApiKey(req.params.id, userId);
      const response: ApiResponse<{ revoked: boolean }> = { success: true, data: { revoked } };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getSdkDocs(_req: Request, res: Response): Promise<void> {
    try {
      const docs = developerPlatformService.getSdkDocumentation();
      const response: ApiResponse<typeof docs> = { success: true, data: docs };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 6. Webhooks
  static async registerWebhook(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const webhook = await developerPlatformService.registerWebhook(userId, req.body);
      const response: ApiResponse<typeof webhook> = { success: true, data: webhook };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async listWebhooks(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const webhooks = await developerPlatformService.listWebhooks(userId);
      const response: ApiResponse<typeof webhooks> = { success: true, data: webhooks };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async deleteWebhook(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const deleted = await developerPlatformService.deleteWebhook(req.params.id, userId);
      const response: ApiResponse<{ deleted: boolean }> = { success: true, data: { deleted } };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 7. Monetization & Purchases
  static async purchaseAgent(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const tx = await monetizationService.purchaseAgent(userId, req.params.agentId, req.body.amountCents || 1900);
      const response: ApiResponse<typeof tx> = { success: true, data: tx };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  static async requestPayout(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const payout = await monetizationService.requestPayout(userId, req.body.amountCents, req.body.payoutMethod);
      const response: ApiResponse<typeof payout> = { success: true, data: payout };
      res.status(201).json(response);
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // 8. Analytics & Overview
  static async getOverview(_req: Request, res: Response): Promise<void> {
    try {
      const overview = await analyticsService.getMarketplaceOverview();
      const response: ApiResponse<typeof overview> = { success: true, data: overview };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getCreatorAnalytics(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user.id;
      const stats = await analyticsService.getCreatorAnalytics(userId);
      const response: ApiResponse<typeof stats> = { success: true, data: stats };
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
