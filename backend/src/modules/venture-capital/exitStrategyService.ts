import {
  ExitSimulationDto,
  LiquidityForecastDto,
  MnaTargetMatchDto,
  ExitType,
  StartupCategory,
} from '@codeforge/shared';
import { IVentureCapitalRepository, ventureCapitalRepository } from '../../repositories';

export class ExitStrategyService {
  constructor(private repo: IVentureCapitalRepository = ventureCapitalRepository) {}

  /**
   * Simulates venture exit paths (IPO, M&A, Secondary, Buyback) with proceeds waterfall distributions
   */
  async simulateExit(
    fundIdOrInput: string | {
      fundId: string;
      startupId: string;
      startupName?: string;
      exitType: ExitType;
      simulatedExitValuationUsd: number;
      ownershipPercent?: number;
      investedCapitalUsd?: number;
      timelineMonths?: number;
      targetAcquirerOrExchange?: string;
    },
    startupIdArg?: string,
    optionsArg?: {
      exitType: ExitType;
      simulatedExitValuationUsd: number;
      targetAcquirerOrExchange?: string;
      ownershipPercent?: number;
      investedCapitalUsd?: number;
      timelineMonths?: number;
    }
  ): Promise<ExitSimulationDto> {
    let fundId: string;
    let startupId: string;
    let startupName: string;
    let exitType: ExitType;
    let simulatedExitValuationUsd: number;
    let ownershipPercent: number;
    let investedCapitalUsd: number;
    let timelineMonths: number;
    let targetAcquirerOrExchange: string;

    if (typeof fundIdOrInput === 'string') {
      fundId = fundIdOrInput;
      startupId = startupIdArg!;
      exitType = optionsArg?.exitType || ExitType.STRATEGIC_ACQUISITION;
      simulatedExitValuationUsd = optionsArg?.simulatedExitValuationUsd || 150000000;
      targetAcquirerOrExchange = optionsArg?.targetAcquirerOrExchange || 'Global Cloud Titan';
      ownershipPercent = optionsArg?.ownershipPercent ?? 18.5;
      investedCapitalUsd = optionsArg?.investedCapitalUsd ?? 2500000;
      timelineMonths = optionsArg?.timelineMonths ?? 18;
      startupName = 'AgentForge Studio';
    } else {
      fundId = fundIdOrInput.fundId;
      startupId = fundIdOrInput.startupId;
      startupName = fundIdOrInput.startupName || 'AgentForge Studio';
      exitType = fundIdOrInput.exitType;
      simulatedExitValuationUsd = fundIdOrInput.simulatedExitValuationUsd;
      ownershipPercent = fundIdOrInput.ownershipPercent ?? 18.5;
      investedCapitalUsd = fundIdOrInput.investedCapitalUsd ?? 2500000;
      timelineMonths = fundIdOrInput.timelineMonths ?? 24;
      targetAcquirerOrExchange = fundIdOrInput.targetAcquirerOrExchange || (exitType === ExitType.IPO ? 'NASDAQ' : 'Global Cloud Titan');
    }

    const expectedProceeds = Math.round(simulatedExitValuationUsd * (ownershipPercent / 100));
    const netProfit = Math.max(0, expectedProceeds - investedCapitalUsd);
    const returnMultiple = Number((expectedProceeds / (investedCapitalUsd || 1)).toFixed(1));
    const carryGenerated = Math.round(netProfit * 0.2); // 20% standard GP carry

    const waterfallSummary = [
      {
        tier: 'Return of Invested Capital',
        amountUsd: investedCapitalUsd,
        percentage: Number(((investedCapitalUsd / expectedProceeds) * 100).toFixed(1)),
      },
      {
        tier: 'LP 8% Preferred Hurdle Return',
        amountUsd: Math.round(investedCapitalUsd * 0.08 * (timelineMonths / 12)),
        percentage: Number((((investedCapitalUsd * 0.08 * (timelineMonths / 12)) / expectedProceeds) * 100).toFixed(1)),
      },
      {
        tier: 'GP 20% Carried Interest',
        amountUsd: carryGenerated,
        percentage: Number(((carryGenerated / expectedProceeds) * 100).toFixed(1)),
      },
      {
        tier: 'LP Net Profit Distribution (80%)',
        amountUsd: Math.round(netProfit * 0.8),
        percentage: Number((((netProfit * 0.8) / expectedProceeds) * 100).toFixed(1)),
      },
    ];

    const simulation = await this.repo.createExitSimulation({
      fundId,
      startupId,
      startupName,
      exitType,
      targetAcquirerOrExchange,
      simulatedExitValuationUsd,
      expectedProceedsUsd: expectedProceeds,
      fundReturnMultiple: returnMultiple,
      netProfitUsd: netProfit,
      carryGeneratedUsd: carryGenerated,
      timelineMonths,
      confidenceRating: 89.5,
      waterfallSummary,
    });

    return simulation;
  }

  /**
   * Forecasts fund-level cash distributions and liquidity milestones over 12, 24, and 36 months
   */
  async forecastLiquidity(fundId: string): Promise<Array<{
    timeframeMonths: number;
    projectedLiquidityUsd: number;
    expectedExitsCount: number;
    projectedDpiIncrease: number;
  }>> {
    const exits = await this.repo.listExitSimulations(fundId);
    const exitCount = exits.length > 0 ? exits.length : 2;

    return [
      {
        timeframeMonths: 12,
        projectedLiquidityUsd: 18500000,
        expectedExitsCount: Math.max(1, Math.round(exitCount * 0.4)),
        projectedDpiIncrease: 0.18,
      },
      {
        timeframeMonths: 24,
        projectedLiquidityUsd: 42000000,
        expectedExitsCount: Math.max(2, Math.round(exitCount * 0.8)),
        projectedDpiIncrease: 0.42,
      },
      {
        timeframeMonths: 36,
        projectedLiquidityUsd: 85000000,
        expectedExitsCount: Math.max(3, exitCount + 1),
        projectedDpiIncrease: 0.85,
      },
    ];
  }

  /**
   * Forecasts fund-level cash distributions and liquidity milestones over 12 and 24 months
   */
  async forecastFundLiquidity(fundId: string): Promise<LiquidityForecastDto> {
    const exits = await this.repo.listExitSimulations(fundId);

    const total12Mo = 18500000;
    const total24Mo = 42000000;

    return {
      fundId,
      twelveMonthLiquidityUsd: total12Mo,
      twentyFourMonthLiquidityUsd: total24Mo,
      expectedExitsCount: exits.length > 0 ? exits.length : 3,
      projectedDpiIncrease: 0.48,
      pipelineSummary: '3 near-term acquisitions and 1 candidate for IPO acceleration.',
    };
  }

  /**
   * Matches candidate startup with high-synergy strategic corporate acquirers
   */
  async matchStrategicAcquirers(startupId: string, category: StartupCategory): Promise<MnaTargetMatchDto[]> {
    const defaultAcquirers: Record<StartupCategory, MnaTargetMatchDto[]> = {
      [StartupCategory.AI_DEVTOOLS]: [
        {
          acquirerName: 'OmniCloud Titan Corp',
          strategicFitScore: 96.0,
          historicalMnaActivity: 'High ($4B+ across 12 devtools acquisitions in 3 years)',
          estimatedOfferRangeUsd: '$120M - $250M',
          synergyRationale: 'Integrates formal neural synthesis directly into enterprise IDE and CI/CD compiler pipelines.',
        },
        {
          acquirerName: 'HyperScale Enterprise Systems',
          strategicFitScore: 92.5,
          historicalMnaActivity: 'Moderate ($800M across 4 acquisitions)',
          estimatedOfferRangeUsd: '$90M - $190M',
          synergyRationale: 'Strengthens zero-defect compliance guarantees for aerospace and banking cloud infrastructure.',
        },
      ],
      [StartupCategory.AUTONOMOUS_AGENTS]: [
        {
          acquirerName: 'Cognitive OS Holdings',
          strategicFitScore: 95.0,
          historicalMnaActivity: 'Very High',
          estimatedOfferRangeUsd: '$150M - $300M',
          synergyRationale: 'Supercharges multi-agent reasoning fleet with real-time autonomous execution.',
        },
      ],
      [StartupCategory.CYBERSECURITY]: [
        {
          acquirerName: 'Global Cyber Defense Corp',
          strategicFitScore: 94.0,
          historicalMnaActivity: 'High',
          estimatedOfferRangeUsd: '$100M - $220M',
          synergyRationale: 'Deploys hardware-level zero-trust enclaves.',
        },
      ],
      [StartupCategory.CYBERSECURITY_AI]: [
        {
          acquirerName: 'ZeroTrust Global Corp',
          strategicFitScore: 94.5,
          historicalMnaActivity: 'High',
          estimatedOfferRangeUsd: '$110M - $230M',
          synergyRationale: 'Adds cryptographic proof verification to next-gen firewalls.',
        },
      ],
      [StartupCategory.ENTERPRISE_INFRA]: [
        {
          acquirerName: 'Matrix Cloud Infrastructure',
          strategicFitScore: 93.0,
          historicalMnaActivity: 'Moderate',
          estimatedOfferRangeUsd: '$80M - $180M',
          synergyRationale: 'High-throughput sub-millisecond distributed state consensus.',
        },
      ],
      [StartupCategory.FINTECH]: [
        {
          acquirerName: 'Quant Financial Systems',
          strategicFitScore: 91.0,
          historicalMnaActivity: 'Moderate',
          estimatedOfferRangeUsd: '$75M - $160M',
          synergyRationale: 'Autonomous trading and risk hedging algorithms.',
        },
      ],
      [StartupCategory.HEALTH_AI]: [
        {
          acquirerName: 'BioHealth Tech Titan',
          strategicFitScore: 92.0,
          historicalMnaActivity: 'Moderate',
          estimatedOfferRangeUsd: '$90M - $200M',
          synergyRationale: 'Genomic AI modeling and clinical trial optimization.',
        },
      ],
      [StartupCategory.DEVELOPER_PLATFORM]: [
        {
          acquirerName: 'DevHub Global',
          strategicFitScore: 95.0,
          historicalMnaActivity: 'High',
          estimatedOfferRangeUsd: '$100M - $250M',
          synergyRationale: 'End-to-end developer productivity and pipeline automation.',
        },
      ],
      [StartupCategory.KNOWLEDGE_TECH]: [
        {
          acquirerName: 'Cognitive Search Corp',
          strategicFitScore: 93.5,
          historicalMnaActivity: 'Moderate',
          estimatedOfferRangeUsd: '$80M - $170M',
          synergyRationale: 'Enterprise graph search and semantic knowledge retrieval.',
        },
      ],
      [StartupCategory.DATA_INTELLIGENCE]: [
        {
          acquirerName: 'DataCorp Enterprise',
          strategicFitScore: 94.0,
          historicalMnaActivity: 'High',
          estimatedOfferRangeUsd: '$110M - $240M',
          synergyRationale: 'Real-time telemetry and predictive data pipeline analytics.',
        },
      ],
    };

    return defaultAcquirers[category] || defaultAcquirers[StartupCategory.AI_DEVTOOLS];
  }
}

export const exitStrategyService = new ExitStrategyService();
