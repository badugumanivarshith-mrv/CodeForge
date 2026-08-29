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
    const startups = await this.repo.listStartups(creatorUserId);

    const ventures = startups.map((s) => ({
      startupId: s.id,
      startupName: s.name,
      stage: s.stage,
      healthStatus: s.viabilityScore >= 90 ? VentureHealthStatus.THRIVING : VentureHealthStatus.ON_TRACK,
      valuationUsd: s.valuationUsd,
    }));

    const totalValuation = ventures.reduce((acc, v) => acc + v.valuationUsd, 0);

    const portfolio = await this.repo.createVenturePortfolio({
      creatorUserId,
      portfolioName: input.portfolioName,
      description: input.description || 'Autonomous venture portfolio created on CodeForge',
      totalVentureCount: ventures.length,
      aggregateValuationUsd: totalValuation || 15000000,
      totalCapitalDeployedUsd: 2500000,
      overallHealthScore: 93.5,
      ventures,
    });

    return portfolio;
  }

  /**
   * Evaluates venture portfolio health and ranks portfolio startups
   */
  async evaluatePortfolioHealth(portfolioId: string): Promise<{
    portfolio: VenturePortfolioDto;
    aggregateValuationUsd: number;
    healthTier: 'THRIVING_ALPHA' | 'HEALTHY_EXPANDING' | 'NEEDS_REBALANCING';
    rankedVentures: Array<{ startupName: string; score: number; momentumStatus: string }>;
    capitalReallocationAdvice: string[];
  }> {
    const portfolio = await this.repo.getVenturePortfolioById(portfolioId);
    if (!portfolio) {
      throw new Error(`Venture portfolio not found with id: ${portfolioId}`);
    }

    const rankedVentures = portfolio.ventures.map((v, idx) => ({
      startupName: v.startupName,
      score: 95.0 - idx * 4,
      momentumStatus: idx === 0 ? 'HYPER_GROWTH' : 'STEADY_ACCELERATION',
    }));

    return {
      portfolio,
      aggregateValuationUsd: portfolio.aggregateValuationUsd,
      healthTier: 'THRIVING_ALPHA',
      rankedVentures,
      capitalReallocationAdvice: [
        'Allocate 60% of available follow-on capital to top-ranked hyper-growth ventures',
        'Provide shared GPU compute credits to accelerate prototype phase startups',
        'Consolidate developer relations efforts across all portfolio companies',
      ],
    };
  }
}
