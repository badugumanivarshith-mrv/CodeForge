import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import {
  StrategicForecastDto,
  ForesightHorizon,
  InnovationDomain,
} from '@codeforge/shared';

export class StrategicForesightService {
  private repo: IPlanetaryIntelligenceRepository;

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
    this.seedDefaultForecasts();
  }

  private async seedDefaultForecasts() {
    const existing = await this.repo.listStrategicForecasts();
    if (existing.length === 0) {
      await this.repo.createStrategicForecast({
        horizon: ForesightHorizon.ONE_YEAR,
        domain: InnovationDomain.AUTONOMOUS_SYSTEMS,
        title: 'Enterprise Autonomous Workforce Expansion (1-Year)',
        forecastNarrative: 'Over 65% of Fortune 500 engineering organizations deploy autonomous multi-agent sprint pipelines.',
        opportunityRank: 1,
        riskRank: 3,
        confidenceScore: 94.5,
        recommendedPlaybook: [
          'Standardize federated agent RPC endpoints',
          'Deploy continuous zero-trust audit loggers',
        ],
      });

      await this.repo.createStrategicForecast({
        horizon: ForesightHorizon.FIVE_YEAR,
        domain: InnovationDomain.AI_REASONING,
        title: 'Planetary Collective Superintelligence Convergence (5-Year)',
        forecastNarrative: 'Human-agent collaborative reasoning meshes solve previously intractable algorithmic and mathematical conjectures with formal proof generation.',
        opportunityRank: 1,
        riskRank: 1,
        confidenceScore: 89.0,
        recommendedPlaybook: [
          'Invest in decentralized cryptographic knowledge graphs',
          'Enforce democratic Bayesian consensus voting protocols',
        ],
      });

      await this.repo.createStrategicForecast({
        horizon: ForesightHorizon.TEN_YEAR,
        domain: InnovationDomain.QUANTUM_COMPUTE,
        title: 'Quantum-AI Planetary Infrastructure Integration (10-Year)',
        forecastNarrative: 'Fault-tolerant quantum processors execute real-time optimization across planetary energy, compute, and logistics grids.',
        opportunityRank: 2,
        riskRank: 2,
        confidenceScore: 82.0,
        recommendedPlaybook: [
          'Transition global network cryptography to post-quantum lattice primitives',
          'Form cross-institutional research federations',
        ],
      });
    }
  }

  async generateForecast(data: {
    horizon: ForesightHorizon;
    domain: InnovationDomain;
    title: string;
    forecastNarrative: string;
    opportunityRank?: number;
    riskRank?: number;
    confidenceScore?: number;
    recommendedPlaybook?: string[];
  }): Promise<StrategicForecastDto> {
    const forecast = await this.repo.createStrategicForecast({
      horizon: data.horizon,
      domain: data.domain,
      title: data.title,
      forecastNarrative: data.forecastNarrative,
      opportunityRank: data.opportunityRank || 1,
      riskRank: data.riskRank || 1,
      confidenceScore: data.confidenceScore ?? 91.0,
      recommendedPlaybook: data.recommendedPlaybook || ['Evaluate policy simulations', 'Calibrate digital twins'],
    });

    await this.repo.recordPlanetaryEvent(
      'foresight_updated',
      `Synthesized strategic horizon forecast: ${forecast.title}`,
      forecast.id,
      { horizon: forecast.horizon, confidence: forecast.confidenceScore }
    );

    return forecast;
  }

  async listForecasts(horizon?: ForesightHorizon, domain?: InnovationDomain): Promise<StrategicForecastDto[]> {
    return this.repo.listStrategicForecasts(horizon, domain);
  }
}
