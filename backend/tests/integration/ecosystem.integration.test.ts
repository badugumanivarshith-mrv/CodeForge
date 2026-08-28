import { test, describe } from 'node:test';
import assert from 'node:assert';
import { MarketplaceService } from '../../src/modules/marketplace/marketplaceService';
import { PluginEngineService } from '../../src/modules/plugins/pluginEngineService';
import { IntegrationHubService } from '../../src/modules/integrations/integrationHubService';
import { WorkflowMarketplaceService } from '../../src/modules/workflows/workflowMarketplaceService';
import { DeveloperPlatformService } from '../../src/modules/developer/developerPlatformService';
import { MonetizationService } from '../../src/modules/monetization/monetizationService';
import { EcosystemAnalyticsService } from '../../src/modules/analytics/ecosystemAnalyticsService';
import {
  MarketplaceCategory,
  PricingModel,
  PluginType,
  PluginPermission,
  IntegrationProvider,
  IntegrationStatus,
  WorkflowCategory,
  WorkflowTriggerType,
  AgentType,
  WebhookEvent,
  AgentVerificationStatus,
} from '@codeforge/shared';

describe('Phase 14 Ecosystem & Integrations End-to-End Integration Tests', () => {
  const createIntegratedEcosystem = () => {
    const agents = new Map<string, any>();
    const reviews = new Map<string, any[]>();
    const downloads = new Map<string, any[]>();
    const plugins = new Map<string, any>();
    const pluginVersions = new Map<string, any[]>();
    const pluginInstalls = new Map<string, any>();
    const integrations = new Map<string, any>();
    const workflowTemplates = new Map<string, any>();
    const clonedWorkflows = new Map<string, any>();
    const apiKeys = new Map<string, any>();
    const webhooks = new Map<string, any>();
    const deliveries = new Map<string, any[]>();
    const transactions = new Map<string, any>();
    const payouts = new Map<string, any>();

    const repo = {
      agents,
      reviews,
      downloads,
      plugins,
      pluginVersions,
      pluginInstalls,
      integrations,
      workflowTemplates,
      apiKeys,
      webhooks,
      deliveries,
      transactions,
      payouts,

      // Agent Marketplace
      async createMarketplaceAgent(creatorId: string, data: any) {
        const agent = {
          id: `mp-${Date.now()}-${Math.random()}`,
          creatorId,
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          category: data.category,
          pricingModel: data.pricingModel || PricingModel.FREE,
          priceCents: data.priceCents || 0,
          capabilities: data.capabilities || [],
          systemPrompt: data.systemPrompt || '',
          configSchema: data.configSchema || {},
          verificationStatus: AgentVerificationStatus.COMMUNITY,
          downloadCount: 0,
          ratingAverage: 5.0,
          ratingCount: 0,
          isFeatured: false,
          isEnterpriseApproved: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        agents.set(agent.id, agent);
        return agent;
      },
      async getMarketplaceAgentById(id: string) {
        return agents.get(id) || null;
      },
      async listMarketplaceAgents(params?: any) {
        let list = Array.from(agents.values());
        if (params?.category) list = list.filter(a => a.category === params.category);
        return list;
      },
      async updateMarketplaceAgent(id: string, creatorId: string, data: any) {
        const a = agents.get(id);
        if (!a) return null;
        const updated = { ...a, ...data };
        agents.set(id, updated);
        return updated;
      },
      async createReview(userId: string, data: any) {
        const rev = {
          id: `rev-${Date.now()}`,
          agentId: data.agentId,
          userId,
          rating: data.rating,
          reviewText: data.reviewText,
          isVerifiedBuyer: true,
          createdAt: new Date().toISOString(),
        };
        const list = reviews.get(data.agentId) || [];
        list.push(rev);
        reviews.set(data.agentId, list);
        const agent = agents.get(data.agentId);
        if (agent) {
          agent.ratingAverage = data.rating;
          agent.ratingCount = list.length;
        }
        return rev;
      },
      async listReviewsByAgentId(agentId: string) {
        return reviews.get(agentId) || [];
      },
      async recordDownload(agentId: string, userId: string, version: string = '1.0.0') {
        const dl = { id: `dl-${Date.now()}`, agentId, userId, version, createdAt: new Date().toISOString() };
        const list = downloads.get(agentId) || [];
        list.push(dl);
        downloads.set(agentId, list);
        const agent = agents.get(agentId);
        if (agent) agent.downloadCount += 1;
        return dl;
      },

      // Plugins
      async createPlugin(creatorId: string, data: any) {
        const plugin = {
          id: `pl-${Date.now()}-${Math.random()}`,
          creatorId,
          name: data.name,
          slug: data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          pluginType: data.pluginType,
          requiredPermissions: data.requiredPermissions || [],
          isVerified: true,
          downloadCount: 0,
          ratingAverage: 5.0,
          ratingCount: 0,
          latestVersion: '1.0.0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        plugins.set(plugin.id, plugin);
        return plugin;
      },
      async getPluginById(id: string) {
        return plugins.get(id) || null;
      },
      async listPlugins(type?: string) {
        let list = Array.from(plugins.values());
        if (type) list = list.filter(p => p.pluginType === type);
        return list;
      },
      async installPlugin(userId: string, data: any) {
        const install = {
          id: `inst-${Date.now()}`,
          pluginId: data.pluginId,
          userId,
          installedVersion: '1.0.0',
          isEnabled: true,
          configuration: data.configuration || {},
          createdAt: new Date().toISOString(),
        };
        pluginInstalls.set(`${userId}-${data.pluginId}`, install);
        const p = plugins.get(data.pluginId);
        if (p) p.downloadCount += 1;
        return install;
      },
      async listUserPluginInstalls(userId: string) {
        return Array.from(pluginInstalls.values()).filter(i => i.userId === userId);
      },
      async togglePluginInstall(installId: string, userId: string, isEnabled: boolean) {
        for (const v of pluginInstalls.values()) {
          if (v.id === installId && v.userId === userId) {
            v.isEnabled = isEnabled;
            return v;
          }
        }
        return null;
      },

      // Integrations
      async connectIntegration(userId: string, data: any) {
        const item = {
          id: `int-${Date.now()}-${Math.random()}`,
          userId,
          provider: data.provider,
          status: IntegrationStatus.CONNECTED,
          config: data.config || {},
          lastSyncedAt: new Date().toISOString(),
          errorLog: null,
          createdAt: new Date().toISOString(),
        };
        integrations.set(`${userId}-${data.provider}`, item);
        return item;
      },
      async getIntegration(userId: string, provider: string) {
        return integrations.get(`${userId}-${provider}`) || null;
      },
      async listUserIntegrations(userId: string) {
        return Array.from(integrations.values()).filter(i => i.userId === userId);
      },
      async updateIntegrationStatus(id: string, userId: string, status: string, errorLog?: string) {
        for (const item of integrations.values()) {
          if (item.id === id && item.userId === userId) {
            item.status = status;
            item.errorLog = errorLog || null;
            item.lastSyncedAt = new Date().toISOString();
            return item;
          }
        }
        return null;
      },
      async disconnectIntegration(userId: string, provider: string) {
        const key = `${userId}-${provider}`;
        if (!integrations.has(key)) return false;
        integrations.delete(key);
        return true;
      },

      // Workflow Templates
      async createWorkflowTemplate(creatorId: string, data: any) {
        const item = {
          id: `wt-${Date.now()}-${Math.random()}`,
          creatorId,
          title: data.title,
          slug: data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: data.description,
          category: data.category,
          triggerType: data.triggerType,
          steps: data.steps,
          isEnterprise: false,
          ratingAverage: 5.0,
          ratingCount: 0,
          downloadCount: 0,
          createdAt: new Date().toISOString(),
        };
        workflowTemplates.set(item.id, item);
        return item;
      },
      async getWorkflowTemplateById(id: string) {
        return workflowTemplates.get(id) || null;
      },
      async listWorkflowTemplates(category?: string) {
        let list = Array.from(workflowTemplates.values());
        if (category) list = list.filter(t => t.category === category);
        return list;
      },

      // Developer Platform
      async createApiKey(userId: string, data: any, keyHash: string, keyPrefix: string) {
        const key = {
          id: `key-${Date.now()}-${Math.random()}`,
          userId,
          name: data.name,
          keyPrefix,
          keyHash,
          permissions: data.permissions || ['*'],
          expiresAt: null,
          lastUsedAt: null,
          usageCount: 0,
          isActive: true,
          createdAt: new Date().toISOString(),
        };
        apiKeys.set(key.id, key);
        return key;
      },
      async listApiKeys(userId: string) {
        return Array.from(apiKeys.values()).filter(k => k.userId === userId && k.isActive);
      },
      async findApiKeyByPrefix(prefix: string) {
        for (const k of apiKeys.values()) {
          if (k.keyPrefix === prefix && k.isActive) return k;
        }
        return null;
      },
      async getApiKeyByHash(hash: string) {
        for (const k of apiKeys.values()) {
          if (k.keyHash === hash && k.isActive) return k;
        }
        return null;
      },
      async incrementApiKeyUsage(id: string) {
        const k = apiKeys.get(id);
        if (k) {
          k.usageCount += 1;
          k.lastUsedAt = new Date().toISOString();
        }
      },
      async createWebhook(userId: string, data: any, secretHash: string) {
        const wh = {
          id: `wh-${Date.now()}-${Math.random()}`,
          userId,
          targetUrl: data.targetUrl,
          secretHash,
          subscribedEvents: data.subscribedEvents || [],
          isActive: true,
          failureCount: 0,
          createdAt: new Date().toISOString(),
        };
        webhooks.set(wh.id, wh);
        return wh;
      },
      async listWebhooks(userId: string) {
        return Array.from(webhooks.values()).filter(w => w.userId === userId && w.isActive);
      },
      async recordWebhookDelivery(webhookId: string, event: string, payload: any, statusCode: number, responseBody: string) {
        const d = { id: `del-${Date.now()}`, webhookId, event, payload, statusCode, responseBody, durationMs: 25, createdAt: new Date().toISOString() };
        const list = deliveries.get(webhookId) || [];
        list.push(d);
        deliveries.set(webhookId, list);
        return d;
      },

      // Monetization
      async createTransaction(userId: string, data: any) {
        const tx = {
          id: `tx-${Date.now()}`,
          userId,
          creatorId: data.creatorId,
          targetType: data.targetType || 'agent',
          targetId: data.referenceId || data.targetId,
          transactionType: data.transactionType,
          amountCents: data.amountCents,
          feeCents: data.feeCents,
          netCents: data.netCents,
          currency: data.currency || 'USD',
          status: 'completed',
          createdAt: new Date().toISOString(),
        };
        transactions.set(tx.id, tx);
        return tx;
      },
      async createPayout(creatorId: string, amountCents: number, payoutMethod: string = 'stripe_connect') {
        const p = {
          id: `pay-${Date.now()}`,
          creatorId,
          amountCents,
          currency: 'usd',
          payoutMethod,
          status: 'pending',
          processedAt: null,
          createdAt: new Date().toISOString(),
        };
        payouts.set(p.id, p);
        return p;
      },
      async listCreatorPayouts(creatorId: string) {
        return Array.from(payouts.values()).filter(p => p.creatorId === creatorId);
      },
    };

    const workspaceRepo = {
      async createWorkflow(userId: string, data: any) {
        const wf = {
          id: `wf-${Date.now()}`,
          userId,
          title: data.title,
          description: data.description,
          triggerType: data.triggerType,
          scheduleCron: null,
          status: 'active',
          steps: data.steps,
          lastRunAt: null,
          nextRunAt: null,
          createdAt: new Date().toISOString(),
        };
        clonedWorkflows.set(wf.id, wf);
        return wf;
      },
    };

    return {
      repo,
      marketplace: new MarketplaceService(repo as any),
      plugins: new PluginEngineService(repo as any),
      integrations: new IntegrationHubService(repo as any),
      workflows: new WorkflowMarketplaceService(repo as any, workspaceRepo as any),
      developer: new DeveloperPlatformService(repo as any),
      monetization: new MonetizationService(repo as any),
      analytics: new EcosystemAnalyticsService(repo as any),
    };
  };

  test('1. completes full agent publishing -> review -> download lifecycle', async () => {
    const sys = createIntegratedEcosystem();

    const agent = await sys.marketplace.publishAgent('creator-e2e', {
      name: 'E2E Verification Agent',
      description: 'End to end testing agent',
      category: MarketplaceCategory.CODING,
      capabilities: ['Verification'],
      systemPrompt: 'Verify',
    });
    assert.ok(agent.id);

    const review = await sys.marketplace.submitReview('user-reviewer', {
      agentId: agent.id,
      rating: 5,
      reviewText: 'Flawless agent execution!',
    });
    assert.strictEqual(review.rating, 5);

    const download = await sys.marketplace.downloadAgent(agent.id, 'user-installer');
    assert.strictEqual(download.agentId, agent.id);

    const updated = await sys.marketplace.getAgentById(agent.id);
    assert.strictEqual(updated?.downloadCount, 1);
    assert.strictEqual(updated?.ratingAverage, 5);
  });

  test('2. completes plugin publishing -> sandboxing audit -> install -> toggle lifecycle', async () => {
    const sys = createIntegratedEcosystem();

    const plugin = await sys.plugins.registerPlugin('plugin-dev', {
      name: 'Kubernetes Cluster Inspector',
      description: 'Inspects pods and nodes',
      pluginType: PluginType.AI_TOOL,
      requiredPermissions: [PluginPermission.READ_WORKSPACE, PluginPermission.NETWORK_ACCESS],
      initialVersion: '1.0.0',
    });

    const audit = await sys.plugins.auditPluginPermissions(plugin.id, plugin.requiredPermissions);
    assert.strictEqual(audit.isSafe, true);

    const install = await sys.plugins.installPlugin('user-k8s', { pluginId: plugin.id });
    assert.strictEqual(install.isEnabled, true);

    const toggled = await sys.plugins.togglePlugin(install.id, 'user-k8s', false);
    assert.strictEqual(toggled?.isEnabled, false);
  });

  test('3. connects multiple external integrations and performs batch sync', async () => {
    const sys = createIntegratedEcosystem();

    await sys.integrations.connect('user-multi', { provider: IntegrationProvider.GITHUB });
    await sys.integrations.connect('user-multi', { provider: IntegrationProvider.SLACK });

    const githubSync = await sys.integrations.syncIntegration('user-multi', IntegrationProvider.GITHUB);
    const slackSync = await sys.integrations.syncIntegration('user-multi', IntegrationProvider.SLACK);

    assert.strictEqual(githubSync.status, IntegrationStatus.CONNECTED);
    assert.strictEqual(slackSync.status, IntegrationStatus.CONNECTED);

    const all = await sys.integrations.listIntegrations('user-multi');
    assert.strictEqual(all.length, 2);
  });

  test('4. clones workflow template to user workspace and registers steps', async () => {
    const sys = createIntegratedEcosystem();
    const catalog = await sys.workflows.initializeStarterTemplates('admin');

    const cloned = await sys.workflows.cloneTemplateToWorkspace(catalog[0].id, 'user-target-wf');
    assert.ok(cloned);
    assert.strictEqual(cloned.userId, 'user-target-wf');
    assert.strictEqual(cloned.steps.length, catalog[0].steps.length);
  });

  test('5. generates developer API key, authenticates request, and delivers webhook event', async () => {
    const sys = createIntegratedEcosystem();

    const key = await sys.developer.generateApiKey('dev-tenant', { name: 'E2E Key' });
    const auth = await sys.developer.authenticateApiKey(key.rawKey!);
    assert.strictEqual(auth.apiKey?.userId, 'dev-tenant');

    const wh = await sys.developer.registerWebhook('dev-tenant', {
      targetUrl: 'https://webhook.site/test',
      subscribedEvents: [WebhookEvent.WORKFLOW_COMPLETED],
    });
    assert.ok(wh.id);

    const delivery = await sys.developer.dispatchWebhookEvent('dev-tenant', WebhookEvent.WORKFLOW_COMPLETED, {
      workflowId: 'wf-123',
    });
    assert.strictEqual(delivery.event, WebhookEvent.WORKFLOW_COMPLETED);
    assert.strictEqual(delivery.statusCode, 200);
  });

  test('6. processes monetization flow: paid agent purchase, 85/15 split, payout threshold request', async () => {
    const sys = createIntegratedEcosystem();

    const paidAgent = await sys.marketplace.publishAgent('creator-monetized', {
      name: 'Deep Math Solver',
      description: 'Solves complex proofs',
      category: MarketplaceCategory.RESEARCH,
      capabilities: ['Math Proofs'],
      systemPrompt: 'Prove theorems',
      pricingModel: PricingModel.PAID_ONE_TIME,
      priceCents: 10000, // $100.00
    });

    const tx = await sys.monetization.purchaseAgent('buyer-corp', paidAgent.id, 10000);
    assert.strictEqual(tx.amountCents, 10000);
    assert.strictEqual(tx.feeCents, 1500); // 15%
    assert.strictEqual(tx.netCents, 8500); // 85%

    const payout = await sys.monetization.requestPayout('creator-monetized', 8500);
    assert.strictEqual(payout.amountCents, 8500);
    assert.strictEqual(payout.status, 'pending');
  });

  test('7. aggregates global ecosystem statistics across all 14 database models', async () => {
    const sys = createIntegratedEcosystem();

    await sys.marketplace.initializeStarterAgents('admin');
    await sys.plugins.initializeStarterPlugins('admin');
    await sys.workflows.initializeStarterTemplates('admin');

    const overview = await sys.analytics.getMarketplaceOverview();
    assert.strictEqual(overview.stats.totalAgents, 6);
    assert.strictEqual(overview.stats.totalPlugins, 4);
    assert.strictEqual(overview.stats.totalWorkflows, 5);
  });

  test('8. verifies multi-tenant data isolation across all ecosystem services', async () => {
    const sys = createIntegratedEcosystem();

    await sys.integrations.connect('tenant-1', { provider: IntegrationProvider.LINKEDIN });
    await sys.developer.generateApiKey('tenant-1', { name: 'Key 1' });
    await sys.developer.registerWebhook('tenant-1', {
      targetUrl: 'https://t1.com/wh',
      subscribedEvents: [WebhookEvent.TASK_COMPLETED],
    });

    const t2Integrations = await sys.integrations.listIntegrations('tenant-2');
    const t2Keys = await sys.developer.listApiKeys('tenant-2');
    const t2Webhooks = await sys.developer.listWebhooks('tenant-2');

    assert.strictEqual(t2Integrations.length, 0);
    assert.strictEqual(t2Keys.length, 0);
    assert.strictEqual(t2Webhooks.length, 0);
  });
});
