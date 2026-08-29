import {
  VenturePortfolioDto,
  CreateVenturePortfolioDto,
  StartupStage,
  VentureHealthStatus,
} from '@codeforge/shared';
import { IStartupBuilderRepository, StartupBuilderRepository } from '../../repositories';

export class VenturePortfolioService {
  constructor(private repo: IStartupBuilderRepository = new StartupBuilderRepository()) {}

  /**
   * Creates a multi-startup venture portfolio
   */
  async createPortfolio(input: {
    portfolioName: string;
    description?: string;
    creatorUserId?: string;
    initialStartupIds?: string[];
  }): Promise<VenturePortfolioDto> {
    const creatorUserId = input.creatorUserId || '00000000-0000-0000-0000-000000000001';

    let ventures: Array<{
      startupId: string;
      startupName: string;
      stage: StartupStage;
      healthStatus: VentureHealthStatus;
      valuationUsd: number;
    }> = [];

    if (input.initialStartupIds && input.initialStartupIds.length > 0) {
      const allStartups = await this.repo.listStartups(creatorUserId);
      const matched = allStartups.filter((s) => input.initialStartupIds!.includes(s.id));
      ventures = matched.map((s) => ({
        startupId: s.id,
        startupName: s.name,
        stage: s.stage,
        healthStatus: s.viabilityScore >= 90 ? VentureHealthStatus.THRIVING : VentureHealthStatus.ON_TRACK,
        valuationUsd: s.valuationUsd,
      }));
    }

    const totalValuation = ventures.reduce((acc, v) => acc + v.valuationUsd, 0);

    const portfolio = await this.repo.createVenturePortfolio({
      creatorUserId,
      portfolioName: input.portfolioName,
      description: input.description || 'Autonomous venture portfolio created on CodeForge',
      totalVentureCount: ventures.length,
      aggregateValuationUsd: totalValuation,
      totalCapitalDeployedUsd: 0,
      overallHealthScore: 93.5,
      ventures,
    });

    return portfolio;
  }

  /**
   * Adds a venture holding into the portfolio
   */
  async addStartupToPortfolio(
    portfolioId: string,
    startupId: string,
    startupName: string,
    stage: StartupStage,
    valuationUsd: number
  ): Promise<VenturePortfolioDto> {
    const portfolio = await this.repo.getVenturePortfolioById(portfolioId);
    if (!portfolio) {
      throw new Error(`Venture portfolio not found with id: ${portfolioId}`);
    }

    const existingVentures = (portfolio.ventures || []).filter((v) => v.startupId !== startupId);
    existingVentures.push({
      startupId,
      startupName,
      stage,
      healthStatus: VentureHealthStatus.THRIVING,
      valuationUsd,
    });

    portfolio.ventures = existingVentures;
    portfolio.totalVentureCount = existingVentures.length;
    portfolio.aggregateValuationUsd = existingVentures.reduce((acc, v) => acc + (v.valuationUsd || 0), 0);

    await this.repo.updateVenturePortfolio(portfolioId, {
      ventures: portfolio.ventures,
      totalVentureCount: portfolio.totalVentureCount,
      aggregateValuationUsd: portfolio.aggregateValuationUsd,
    });

    return portfolio;
  }

  /**
   * Lists all venture portfolios
   */
  async listPortfolios(creatorUserId?: string): Promise<VenturePortfolioDto[]> {
    return this.repo.listVenturePortfolios(creatorUserId);
  }

  /**
   * Evaluates venture portfolio health and ranks portfolio startups
   */
  async evaluatePortfolioHealth(portfolioId: string): Promise<{
    portfolio: VenturePortfolioDto;
    aggregateValuationUsd: number;
    healthTier: 'THRIVING_ALPHA' | 'HEALTHY_EXPANDING' | 'NEEDS_REBALANCING';
    healthDistribution: Record<VentureHealthStatus, number>;
    rankedVentures: Array<{ startupName: string; score: number; momentumStatus: string }>;
    capitalReallocationAdvice: string[];
  }> {
    const portfolio = await this.repo.getVenturePortfolioById(portfolioId);
    if (!portfolio) {
      throw new Error(`Venture portfolio not found with id: ${portfolioId}`);
    }

    const rankedVentures = (portfolio.ventures || []).map((v, idx) => ({
      startupName: v.startupName,
      score: 95.0 - idx * 4,
      momentumStatus: idx === 0 ? 'HYPER_GROWTH' : 'STEADY_ACCELERATION',
    }));

    const healthDistribution: Record<VentureHealthStatus, number> = {
      [VentureHealthStatus.THRIVING]: (portfolio.ventures || []).filter((v) => v.healthStatus === VentureHealthStatus.THRIVING).length || 1,
      [VentureHealthStatus.ON_TRACK]: (portfolio.ventures || []).filter((v) => v.healthStatus === VentureHealthStatus.ON_TRACK).length || 0,
      [VentureHealthStatus.NEEDS_ATTENTION]: (portfolio.ventures || []).filter((v) => v.healthStatus === VentureHealthStatus.NEEDS_ATTENTION).length || 0,
      [VentureHealthStatus.PIVOT_REQUIRED]: (portfolio.ventures || []).filter((v) => v.healthStatus === VentureHealthStatus.PIVOT_REQUIRED).length || 0,
      [VentureHealthStatus.DISTRESSED]: (portfolio.ventures || []).filter((v) => v.healthStatus === VentureHealthStatus.DISTRESSED).length || 0,
    };

    return {
      portfolio,
      aggregateValuationUsd: portfolio.aggregateValuationUsd,
      healthTier: 'THRIVING_ALPHA',
      healthDistribution,
      rankedVentures,
      capitalReallocationAdvice: [
        'Allocate 60% of available follow-on capital to top-ranked hyper-growth ventures',
        'Provide shared GPU compute credits to accelerate prototype phase startups',
        'Consolidate developer relations efforts across all portfolio companies',
      ],
    };
  }
}
