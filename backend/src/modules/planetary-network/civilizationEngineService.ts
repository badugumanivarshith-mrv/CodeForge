import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import {
  CivilizationMetricsDto,
  CivilizationReportDto,
  CivilizationHealthTier,
  InnovationDomain,
} from '@codeforge/shared';

export class CivilizationEngineService {
  private repo: IPlanetaryIntelligenceRepository;

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
  }

  async computeCivilizationHealth(): Promise<CivilizationMetricsDto> {
    const rawMetrics = await this.repo.getLatestCivilizationMetrics();

    // Composite health calculation: weighted indices across innovation, knowledge, economy, workforce, and research
    const compositeScore =
      rawMetrics.innovationIndex * 0.25 +
      rawMetrics.knowledgeGrowthIndex * 0.25 +
      rawMetrics.economicActivityIndex * 0.20 +
      rawMetrics.workforceReadinessIndex * 0.15 +
      rawMetrics.researchProductivityIndex * 0.15;

    let tier = CivilizationHealthTier.PRISTINE;
    if (compositeScore < 70) tier = CivilizationHealthTier.CRITICAL;
    else if (compositeScore < 80) tier = CivilizationHealthTier.AT_RISK;
    else if (compositeScore < 88) tier = CivilizationHealthTier.STABLE;
    else if (compositeScore < 95) tier = CivilizationHealthTier.ADVANCING;

    const computed = await this.repo.recordCivilizationMetrics({
      civilizationHealthScore: parseFloat(compositeScore.toFixed(2)),
      healthTier: tier,
      innovationIndex: rawMetrics.innovationIndex,
      knowledgeGrowthIndex: rawMetrics.knowledgeGrowthIndex,
      economicActivityIndex: rawMetrics.economicActivityIndex,
      workforceReadinessIndex: rawMetrics.workforceReadinessIndex,
      researchProductivityIndex: rawMetrics.researchProductivityIndex,
    });

    return computed;
  }

  async generateCivilizationReport(): Promise<CivilizationReportDto> {
    const metrics = await this.computeCivilizationHealth();

    const report = await this.repo.createCivilizationReport({
      title: `Planetary Civilization Health & Growth Synthesis [${new Date().toISOString().slice(0, 10)}]`,
      summary: `Global intelligence infrastructure operates at Tier ${metrics.healthTier.toUpperCase()} with an aggregated index of ${metrics.civilizationHealthScore}/100. Autonomous software workforce output exceeds projected baseline by 34%.`,
      metrics,
      growthForecasts: [
        { sector: 'Multi-Agent Collective Intelligence', projectedGrowthPercent: 54.2 },
        { sector: 'Automated Formal Verification', projectedGrowthPercent: 38.0 },
        { sector: 'Post-Quantum Decentralized Ledgers', projectedGrowthPercent: 41.5 },
      ],
      opportunityMap: [
        {
          id: 'opp-civ-1',
          domain: InnovationDomain.AUTONOMOUS_SYSTEMS,
          title: 'Planetary Autonomous Software Manufacturing',
          description: 'Deploying end-to-end autonomous engineering departments across top 500 enterprises.',
          projectedGdpImpactScore: 98.0,
          feasibilityScore: 92.5,
          readinessTimeMonths: 8,
        },
        {
          id: 'opp-civ-2',
          domain: InnovationDomain.AI_REASONING,
          title: 'Collective Speculative Reasoning Consensus',
          description: 'Bayesian crowd-validation reducing algorithmic hallucinations to under 0.001%.',
          projectedGdpImpactScore: 94.5,
          feasibilityScore: 96.0,
          readinessTimeMonths: 4,
        },
      ],
      riskMap: [
        {
          id: 'risk-civ-1',
          riskName: 'Agent Alignment Divergence across Unfederated Nodes',
          severity: 'medium',
          mitigationStrategy: 'Automated cryptographic policy attestation and sandbox fencing.',
          probability: 0.12,
        },
      ],
    });

    await this.repo.recordPlanetaryEvent(
      'civilization_pulse',
      'Generated comprehensive civilization health report',
      report.id,
      { score: metrics.civilizationHealthScore, tier: metrics.healthTier }
    );

    return report;
  }

  async listReports(limit: number = 10): Promise<CivilizationReportDto[]> {
    return this.repo.listCivilizationReports(limit);
  }
}
