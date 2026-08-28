import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import {
  EconomicSignalDto,
  EconomicForecastDto,
  EconomicSignalType,
} from '@codeforge/shared';

export class EconomicIntelligenceService {
  private repo: IPlanetaryIntelligenceRepository;

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
  }

  async recordSignal(data: {
    signalType: EconomicSignalType;
    sector: string;
    intensityScore: number;
    region?: string;
    metadata?: Record<string, any>;
  }): Promise<EconomicSignalDto> {
    const signal = await this.repo.recordEconomicSignal({
      signalType: data.signalType,
      sector: data.sector,
      intensityScore: data.intensityScore,
      region: data.region || 'Global Mesh',
      metadata: data.metadata || {},
    });

    return signal;
  }

  async generateMacroForecast(horizonMonths: number = 12): Promise<EconomicForecastDto> {
    const signals = await this.repo.listEconomicSignals(undefined, 50);
    const avgIntensity = signals.length > 0
      ? signals.reduce((acc, s) => acc + s.intensityScore, 0) / signals.length
      : 85.0;

    const forecast = await this.repo.createEconomicForecast({
      horizonMonths,
      talentDemandGrowth: parseFloat((avgIntensity * 0.28).toFixed(1)),
      skillPremiumTrends: [
        { skill: 'Autonomous Agent Engineering', changePercent: 36.4 },
        { skill: 'Distributed Consensus & Raft Optimization', changePercent: 28.5 },
        { skill: 'Post-Quantum Applied Cryptography', changePercent: 31.0 },
      ],
      macroEconomicHealthScore: parseFloat((avgIntensity * 1.05).toFixed(1)),
      forecastSummary: `Global AI & Autonomous Developer economic growth accelerates over the next ${horizonMonths} months with capital allocation surging in multi-agent orchestration infrastructure.`,
    });

    return forecast;
  }

  async listSignals(signalType?: EconomicSignalType, limit: number = 20): Promise<EconomicSignalDto[]> {
    return this.repo.listEconomicSignals(signalType, limit);
  }

  async listForecasts(limit: number = 10): Promise<EconomicForecastDto[]> {
    return this.repo.getLatestEconomicForecasts(limit);
  }
}
