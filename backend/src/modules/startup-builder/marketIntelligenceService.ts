import {
  MarketReportDto,
  GenerateMarketReportDto,
  StartupCategory,
  MarketRiskLevel,
} from '@codeforge/shared';
import { IStartupBuilderRepository, StartupBuilderRepository } from '../../repositories';

export class MarketIntelligenceService {
  constructor(private repo: IStartupBuilderRepository = new StartupBuilderRepository()) {}

  /**
   * Generates a market intelligence report with TAM, SAM, SOM, trends, and competitors
   */
  async generateMarketReport(input: GenerateMarketReportDto): Promise<MarketReportDto> {
    const sector = input.sector || StartupCategory.AI_DEVTOOLS;
    const { tam, sam, som, cagr } = this.calculateMarketSizing(sector);

    const trends = this.getSectorTrends(sector);
    const competitiveLandscape = this.getCompetitiveLandscape(sector);
    const opportunityGaps = this.getOpportunityGaps(sector);

    const report = await this.repo.createMarketReport({
      startupId: input.startupId,
      sector,
      tamUsd: tam,
      samUsd: sam,
      somUsd: som,
      cagrPercent: cagr,
      marketTrends: trends,
      competitiveLandscape,
      opportunityGaps,
      riskLevel: MarketRiskLevel.MODERATE,
      confidenceScore: 91.5,
    });

    return report;
  }

  /**
   * Maps competitive landscape and identifies white space opportunities
   */
  async mapCompetitiveLandscape(sector: StartupCategory): Promise<{
    sector: StartupCategory;
    topCompetitors: Array<{ competitorName: string; marketSharePercent: number; keyDifferentiator: string }>;
    opportunityRankings: Array<{ opportunity: string; marketDemandScore: number; barrierToEntry: string }>;
    strategicRecommendation: string;
  }> {
    const competitiveData = this.getCompetitiveLandscape(sector);
    const topCompetitors = competitiveData.map((c) => ({
      competitorName: c.competitorName,
      marketSharePercent: c.marketSharePercent,
      keyDifferentiator: c.strengths[0] || 'Broad market coverage',
    }));

    return {
      sector,
      topCompetitors,
      opportunityRankings: [
        {
          opportunity: 'Real-time Autonomous Dialectic Synthesis Engine',
          marketDemandScore: 96.5,
          barrierToEntry: 'High (Requires advanced AST compiler verification IP)',
        },
        {
          opportunity: 'Air-Gapped Zero-Knowledge Telemetry Gateway',
          marketDemandScore: 92.0,
          barrierToEntry: 'High (Requires cryptographic hardware enclave integrations)',
        },
        {
          opportunity: 'Developer-Led Bottom-Up Integration Hub',
          marketDemandScore: 88.0,
          barrierToEntry: 'Medium (Requires active open-source ecosystem support)',
        },
      ],
      strategicRecommendation: 'Differentiate on mathematical verification certainty and sub-10ms latency over legacy heuristics.',
    };
  }

  private calculateMarketSizing(sector: StartupCategory): { tam: number; sam: number; som: number; cagr: number } {
    const sectorSizes: Record<StartupCategory, { tam: number; sam: number; som: number; cagr: number }> = {
      [StartupCategory.AI_DEVTOOLS]: { tam: 65000000000, sam: 14000000000, som: 2800000000, cagr: 28.5 },
      [StartupCategory.AUTONOMOUS_AGENTS]: { tam: 92000000000, sam: 22000000000, som: 4500000000, cagr: 38.2 },
      [StartupCategory.ENTERPRISE_INFRA]: { tam: 120000000000, sam: 30000000000, som: 5000000000, cagr: 19.4 },
      [StartupCategory.FINTECH]: { tam: 85000000000, sam: 18000000000, som: 3200000000, cagr: 22.0 },
      [StartupCategory.CYBERSECURITY]: { tam: 110000000000, sam: 26000000000, som: 4800000000, cagr: 24.8 },
      [StartupCategory.HEALTH_AI]: { tam: 75000000000, sam: 16000000000, som: 2900000000, cagr: 31.0 },
      [StartupCategory.DEVELOPER_PLATFORM]: { tam: 55000000000, sam: 12000000000, som: 2200000000, cagr: 21.5 },
      [StartupCategory.KNOWLEDGE_TECH]: { tam: 48000000000, sam: 10000000000, som: 1800000000, cagr: 26.0 },
    };

    return sectorSizes[sector] || { tam: 50000000000, sam: 10000000000, som: 2000000000, cagr: 25.0 };
  }

  private getSectorTrends(sector: StartupCategory): string[] {
    return [
      `Rapid migration toward autonomous agentic workflows in ${sector}`,
      'Increasing enterprise demand for zero-knowledge compliance and data residency',
      'Integration of formal mathematical proofs into standard developer toolchains',
      'Decline of legacy rule-based heuristics in favor of continuous dialectic synthesis',
    ];
  }

  private getCompetitiveLandscape(sector: StartupCategory): Array<{
    competitorName: string;
    marketSharePercent: number;
    strengths: string[];
    weaknesses: string[];
  }> {
    return [
      {
        competitorName: 'Legacy Enterprise Suite Alpha',
        marketSharePercent: 32.5,
        strengths: ['Established brand', 'Large sales team', 'Broad legacy integrations'],
        weaknesses: ['High false positive rates', 'Slow innovation velocity', 'Expensive seat pricing'],
      },
      {
        competitorName: 'NextGen Cloud Tooling Beta',
        marketSharePercent: 19.0,
        strengths: ['Modern browser UI', 'Cloud native deployment', 'Good REST APIs'],
        weaknesses: ['Lacks formal ZK proof verification', 'High latency on large codebases'],
      },
      {
        competitorName: 'OpenSource Community Framework',
        marketSharePercent: 12.0,
        strengths: ['Developer adoption', 'Free tier availability', 'Active contributor base'],
        weaknesses: ['Zero enterprise SLA', 'No SOC2/air-gapped support', 'Fragmented maintenance'],
      },
    ];
  }

  private getOpportunityGaps(sector: StartupCategory): string[] {
    return [
      'Sub-10ms live dialectic verification embedded in local IDEs',
      'Autonomous pull request resolution with zero hallucination proofs',
      'Cryptographically provable compliance reports for financial and healthcare standards',
    ];
  }
}
