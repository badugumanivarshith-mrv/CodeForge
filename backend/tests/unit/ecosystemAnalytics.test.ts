import { test, describe } from 'node:test';
import assert from 'node:assert';
import { EcosystemAnalyticsService } from '../../src/modules/analytics/ecosystemAnalyticsService';
import {
  MarketplaceCategory,
  PluginType,
  WorkflowCategory,
} from '@codeforge/shared';

describe('Ecosystem Analytics & Creator Telemetry Unit Tests', () => {
  const createMockRepo = () => {
    const agents = new Map<string, any>();
    const plugins = new Map<string, any>();
    const integrations = new Map<string, any>();
    const templates = new Map<string, any>();

    return {
      agents,
      plugins,
      integrations,
      templates,
      async listMarketplaceAgents() {
        return Array.from(agents.values());
      },
      async listPlugins() {
        return Array.from(plugins.values());
      },
      async listUserIntegrations(userId: string) {
        return Array.from(integrations.values()).filter(i => i.userId === userId);
      },
      async listWorkflowTemplates() {
        return Array.from(templates.values());
      },
      async listCreatorPayouts() {
        return [];
      },
    };
  };

  test('1. rolls up global marketplace overview counts correctly', async () => {
    const mockRepo = createMockRepo();
    const service = new EcosystemAnalyticsService(mockRepo as any);

    mockRepo.agents.set('a1', {
      id: 'a1',
      category: MarketplaceCategory.CODING,
      downloadCount: 150,
      isFeatured: true,
      ratingAverage: 4.8,
    });
    mockRepo.agents.set('a2', {
      id: 'a2',
      category: MarketplaceCategory.SECURITY,
      downloadCount: 50,
      isFeatured: false,
      ratingAverage: 4.5,
    });
    mockRepo.plugins.set('p1', { id: 'p1', pluginType: PluginType.AI_TOOL, downloadCount: 80, isFeatured: false });
    mockRepo.templates.set('t1', { id: 't1', category: WorkflowCategory.DEVOPS_AUTOMATION, downloadCount: 45 });

    const overview = await service.getMarketplaceOverview();
    assert.strictEqual(overview.stats.totalAgents, 2);
    assert.strictEqual(overview.stats.totalPlugins, 1);
    assert.strictEqual(overview.stats.totalWorkflows, 1);
    assert.strictEqual(overview.stats.totalInstalls, 280);
    assert.strictEqual(overview.featuredAgents.length, 1);
  });

  test('2. aggregates downloads breakdown by category accurately', async () => {
    const mockRepo = createMockRepo();
    const service = new EcosystemAnalyticsService(mockRepo as any);

    mockRepo.agents.set('a1', { id: 'a1', category: MarketplaceCategory.CODING, downloadCount: 200, isFeatured: false });
    mockRepo.agents.set('a2', { id: 'a2', category: MarketplaceCategory.CODING, downloadCount: 100, isFeatured: false });
    mockRepo.agents.set('a3', { id: 'a3', category: MarketplaceCategory.RESEARCH, downloadCount: 50, isFeatured: false });

    const overview = await service.getMarketplaceOverview();
    const codingEntry = overview.categories.find(c => c.category === MarketplaceCategory.CODING);
    const researchEntry = overview.categories.find(c => c.category === MarketplaceCategory.RESEARCH);

    assert.strictEqual(codingEntry?.count, 2);
    assert.strictEqual(researchEntry?.count, 1);
  });

  test('3. computes creator revenue analytics and 85% net earnings projection', async () => {
    const mockRepo = createMockRepo();
    const service = new EcosystemAnalyticsService(mockRepo as any);

    mockRepo.agents.set('a1', {
      id: 'a1',
      creatorId: 'creator-star',
      name: 'Algorithm Verifier',
      downloadCount: 120,
      priceCents: 5000,
      ratingAverage: 4.9,
    });
    mockRepo.plugins.set('p1', {
      id: 'p1',
      creatorId: 'creator-star',
      name: 'Prometheus Bridge',
      downloadCount: 40,
      ratingAverage: 4.7,
    });

    const analytics = await service.getCreatorAnalytics('creator-star');
    assert.strictEqual(analytics.totalDownloads, 160);
    assert.ok(analytics.grossRevenueUsd > 0);
    assert.ok(analytics.netEarningsUsd > 0);
    assert.strictEqual(
      analytics.netEarningsUsd,
      Math.round(analytics.grossRevenueUsd * 0.85 * 100) / 100
    );
  });

  test('4. returns empty breakdown and zero totals for brand new empty ecosystem', async () => {
    const mockRepo = createMockRepo();
    const service = new EcosystemAnalyticsService(mockRepo as any);

    const overview = await service.getMarketplaceOverview();
    assert.strictEqual(overview.stats.totalAgents, 0);
    assert.strictEqual(overview.stats.totalPlugins, 0);
    assert.strictEqual(overview.stats.totalWorkflows, 0);
    assert.strictEqual(overview.stats.totalInstalls, 0);
    assert.strictEqual(overview.featuredAgents.length, 0);
  });

  test('5. lists top performing items sorted by revenue generation', async () => {
    const mockRepo = createMockRepo();
    const service = new EcosystemAnalyticsService(mockRepo as any);

    mockRepo.agents.set('a1', {
      id: 'a1',
      creatorId: 'creator-top',
      name: 'High Earner Agent',
      downloadCount: 500,
      priceCents: 4900,
      ratingAverage: 5.0,
    });

    const analytics = await service.getCreatorAnalytics('creator-top');
    assert.ok(analytics.topPerformingItems.length >= 1);
    assert.strictEqual(analytics.topPerformingItems[0].title, 'High Earner Agent');
  });

  test('6. generates trailing monthly revenue history milestones', async () => {
    const mockRepo = createMockRepo();
    const service = new EcosystemAnalyticsService(mockRepo as any);

    mockRepo.agents.set('a1', {
      id: 'a1',
      creatorId: 'creator-growth',
      name: 'Growth Agent',
      downloadCount: 80,
      priceCents: 2000,
      ratingAverage: 4.8,
    });

    const analytics = await service.getCreatorAnalytics('creator-growth');
    assert.strictEqual(analytics.monthlyRevenueHistory.length, 4);
    assert.ok(analytics.monthlyRevenueHistory[3].amountUsd >= 0);
  });

  test('7. handles creator with 0 published items without NaN or arithmetic errors', async () => {
    const mockRepo = createMockRepo();
    const service = new EcosystemAnalyticsService(mockRepo as any);

    const analytics = await service.getCreatorAnalytics('creator-zero');
    assert.strictEqual(analytics.totalDownloads, 0);
    assert.strictEqual(analytics.grossRevenueUsd, 0);
    assert.strictEqual(analytics.netEarningsUsd, 0);
    assert.strictEqual(analytics.pendingPayoutUsd, 0);
    assert.strictEqual(analytics.topPerformingItems.length, 0);
  });
});
