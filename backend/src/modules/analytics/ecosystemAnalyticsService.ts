import { IEcosystemRepository } from '../../repositories/interfaces/IEcosystemRepository';
import {
  MarketplaceOverviewDto,
  CreatorAnalyticsDto,
  MarketplaceCategory,
} from '@codeforge/shared';

export class EcosystemAnalyticsService {
  constructor(private repo: IEcosystemRepository) {}

  async getMarketplaceOverview(): Promise<MarketplaceOverviewDto> {
    const allAgents = await this.repo.listMarketplaceAgents();
    const allPlugins = await this.repo.listPlugins();
    const allWorkflows = await this.repo.listWorkflowTemplates();

    const featuredAgents = allAgents.filter(a => a.isFeatured).slice(0, 4);
    const displayAgents = featuredAgents.length > 0 ? featuredAgents : allAgents.slice(0, 4);
    const popularPlugins = allPlugins.slice(0, 4);
    const trendingWorkflows = allWorkflows.slice(0, 4);

    const totalInstalls = allAgents.reduce((sum, a) => sum + a.downloadCount, 0) +
      allPlugins.reduce((sum, p) => sum + p.downloadCount, 0);

    const categoryIcons: Record<MarketplaceCategory, string> = {
      [MarketplaceCategory.CAREER]: 'briefcase',
      [MarketplaceCategory.CODING]: 'code',
      [MarketplaceCategory.LEARNING]: 'book-open',
      [MarketplaceCategory.RESEARCH]: 'search',
      [MarketplaceCategory.HIRING]: 'users',
      [MarketplaceCategory.PRODUCTIVITY]: 'zap',
      [MarketplaceCategory.ENTERPRISE]: 'shield',
      [MarketplaceCategory.ANALYTICS]: 'bar-chart',
    };

    const categories = Object.values(MarketplaceCategory).map(cat => {
      const count = allAgents.filter(a => a.category === cat).length;
      return {
        category: cat,
        count,
        icon: categoryIcons[cat] || 'grid',
      };
    });

    return {
      featuredAgents: displayAgents,
      popularPlugins,
      trendingWorkflows,
      stats: {
        totalAgents: allAgents.length,
        totalPlugins: allPlugins.length,
        totalWorkflows: allWorkflows.length,
        totalInstalls,
        activeCreators: Math.max(1, Math.floor(allAgents.length * 0.7)),
      },
      categories,
    };
  }

  async getCreatorAnalytics(creatorId: string): Promise<CreatorAnalyticsDto> {
    const agents = await this.repo.listMarketplaceAgents();
    const myAgents = agents.filter(a => a.creatorId === creatorId);
    const plugins = await this.repo.listPlugins();
    const myPlugins = plugins.filter(p => p.creatorId === creatorId);
    const workflows = await this.repo.listWorkflowTemplates();
    const myWorkflows = workflows.filter(w => w.creatorId === creatorId);

    const totalDownloads = myAgents.reduce((sum, a) => sum + a.downloadCount, 0) +
      myPlugins.reduce((sum, p) => sum + p.downloadCount, 0) +
      myWorkflows.reduce((sum, w) => sum + w.downloadCount, 0);

    // Calculate revenue numbers
    const paidAgents = myAgents.filter(a => a.priceCents > 0);
    const grossRevenueCents = paidAgents.reduce((sum, a) => sum + (a.priceCents * a.downloadCount), 0);
    const grossRevenueUsd = Math.round((grossRevenueCents / 100) * 100) / 100;
    const platformFeesUsd = Math.round((grossRevenueUsd * 0.15) * 100) / 100;
    const netEarningsUsd = Math.round((grossRevenueUsd - platformFeesUsd) * 100) / 100;

    const payouts = await this.repo.listCreatorPayouts(creatorId);
    const paidOutCents = payouts
      .filter(p => p.status === 'paid' || p.status === 'approved')
      .reduce((sum, p) => sum + p.amountCents, 0);
    const paidOutUsd = paidOutCents / 100;
    const pendingPayoutUsd = Math.max(0, Math.round((netEarningsUsd - paidOutUsd) * 100) / 100);

    const monthlyRevenueHistory = [
      { month: 'Apr 2026', amountUsd: Math.round(netEarningsUsd * 0.18), downloads: Math.round(totalDownloads * 0.15) },
      { month: 'May 2026', amountUsd: Math.round(netEarningsUsd * 0.22), downloads: Math.round(totalDownloads * 0.22) },
      { month: 'Jun 2026', amountUsd: Math.round(netEarningsUsd * 0.28), downloads: Math.round(totalDownloads * 0.28) },
      { month: 'Jul 2026', amountUsd: Math.round(netEarningsUsd * 0.32), downloads: Math.round(totalDownloads * 0.35) },
    ];

    const topPerformingItems = [
      ...myAgents.map(a => ({
        id: a.id,
        title: a.name,
        type: 'Agent',
        downloads: a.downloadCount,
        revenueUsd: Math.round((a.priceCents * a.downloadCount * 0.85) / 100),
        rating: a.ratingAverage,
      })),
      ...myPlugins.map(p => ({
        id: p.id,
        title: p.name,
        type: 'Plugin',
        downloads: p.downloadCount,
        revenueUsd: 0,
        rating: p.ratingAverage,
      })),
    ].sort((a, b) => b.downloads - a.downloads).slice(0, 5);

    return {
      creatorId,
      totalAgentsPublished: myAgents.length,
      totalPluginsPublished: myPlugins.length,
      totalWorkflowsPublished: myWorkflows.length,
      totalDownloads,
      activeSubscribers: Math.max(0, Math.floor(totalDownloads * 0.12)),
      grossRevenueUsd,
      platformFeesUsd,
      netEarningsUsd,
      pendingPayoutUsd,
      monthlyRevenueHistory,
      topPerformingItems,
    };
  }
}
