import { IPlanetaryIntelligenceRepository } from '../../repositories/interfaces/IPlanetaryIntelligenceRepository';
import {
  PlanetaryTwinDto,
  PlanetarySimulationDto,
  PlanetaryTwinType,
} from '@codeforge/shared';

export class PlanetaryTwinService {
  private repo: IPlanetaryIntelligenceRepository;

  constructor(repo: IPlanetaryIntelligenceRepository) {
    this.repo = repo;
    this.seedDefaultPlanetaryTwins();
  }

  private async seedDefaultPlanetaryTwins() {
    const twins = await this.repo.listPlanetaryTwins();
    if (twins.length === 0) {
      const defaults = [
        {
          twinType: PlanetaryTwinType.GLOBAL_ECONOMY,
          entityName: 'Planetary Economy Twin',
          stateSnapshot: { gdpGrowthVelocity: 18.5, computeLiquidityUsd: 142000000, activeVentures: 420 },
          fidelityScore: 98.2,
          syncFrequencySeconds: 60,
        },
        {
          twinType: PlanetaryTwinType.EDUCATION,
          entityName: 'Planetary Education & Skills Twin',
          stateSnapshot: { verifiedTalentNodes: 125000, curriculumAbsorptionVelocity: 94.1 },
          fidelityScore: 97.4,
          syncFrequencySeconds: 120,
        },
        {
          twinType: PlanetaryTwinType.WORKFORCE,
          entityName: 'Autonomous Agent Workforce Twin',
          stateSnapshot: { liveAgentInstances: 84000, autonomousTaskCompletionRate: 99.2 },
          fidelityScore: 99.0,
          syncFrequencySeconds: 30,
        },
        {
          twinType: PlanetaryTwinType.RESEARCH,
          entityName: 'Global Science & Research Twin',
          stateSnapshot: { openPublicationsCount: 18500, activeFederationsCount: 14 },
          fidelityScore: 96.8,
          syncFrequencySeconds: 300,
        },
        {
          twinType: PlanetaryTwinType.ENTERPRISE,
          entityName: 'Federated Enterprise Twin',
          stateSnapshot: { activeDigitalDepartments: 380, sprintVelocityAverage: 88.5 },
          fidelityScore: 97.9,
          syncFrequencySeconds: 60,
        },
        {
          twinType: PlanetaryTwinType.INNOVATION,
          entityName: 'Planetary Patent & Innovation Twin',
          stateSnapshot: { technologyMaturityMean: 7.2, commercialAdoptionRate: 68.4 },
          fidelityScore: 98.6,
          syncFrequencySeconds: 180,
        },
      ];

      for (const d of defaults) {
        await this.repo.createPlanetaryTwin(d);
      }
    }
  }

  async createTwin(data: Partial<PlanetaryTwinDto>): Promise<PlanetaryTwinDto> {
    const twin = await this.repo.createPlanetaryTwin(data);
    await this.repo.recordPlanetaryEvent(
      'twin_calibrated',
      `Calibrated planetary digital twin: ${twin.entityName}`,
      twin.id,
      { twinType: twin.twinType, fidelity: twin.fidelityScore }
    );
    return twin;
  }

  async runScenarioSimulation(twinId: string, scenarioName: string, horizonDays: number = 30, customParameters: Record<string, any> = {}): Promise<PlanetarySimulationDto> {
    const twin = await this.repo.getPlanetaryTwin(twinId);
    if (!twin) {
      throw new Error(`Planetary twin not found: ${twinId}`);
    }

    const simulation = await this.repo.recordPlanetarySimulation({
      twinId,
      scenarioName,
      horizonDays,
      parameters: customParameters,
      projectedOutcomes: [
        { milestone: 'Operational Throughput Peak', probability: 0.96, impact: '+32% Sprint Velocity' },
        { milestone: 'Infrastructure Cost Equilibrium', probability: 0.91, impact: '-18% Token Spend' },
        { milestone: 'Autonomous Zero-Downtime Migration', probability: 0.99, impact: '100% Availability' },
      ],
      monteCarloConfidence: 0.975,
      optimizedInterventions: [
        'Scale APAC cluster edge cache',
        'Enable multi-agent speculative task pipelines',
      ],
    });

    await this.repo.updatePlanetaryTwinState(twinId, {
      lastScenarioOutcome: scenarioName,
      lastSimulatedAt: simulation.simulatedAt,
    });

    return simulation;
  }

  async listTwins(twinType?: PlanetaryTwinType): Promise<PlanetaryTwinDto[]> {
    return this.repo.listPlanetaryTwins(twinType);
  }

  async getTwin(id: string): Promise<PlanetaryTwinDto | null> {
    return this.repo.getPlanetaryTwin(id);
  }

  async getSimulations(twinId: string): Promise<PlanetarySimulationDto[]> {
    return this.repo.getSimulationsByTwinId(twinId);
  }
}
