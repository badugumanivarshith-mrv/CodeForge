import {
  CivilizationMetricsDto,
  CivilizationReportDto,
  PlanetaryTwinDto,
  PlanetarySimulationDto,
  InnovationRecordDto,
  InnovationRankingDto,
  ResearchFederationDto,
  ResearchCollaborationDto,
  EconomicSignalDto,
  EconomicForecastDto,
  AgentFederationDto,
  AgentFederationReputationDto,
  GovernancePolicyDto,
  PolicySimulationDto,
  StrategicForecastDto,
  PlanetaryCommandCenterOverviewDto,
  PlanetaryTwinType,
  CivilizationHealthTier,
  GovernanceCouncilType,
  PolicyStatus,
  InnovationDomain,
  FederationProtocol,
  AgentFederationStatus,
  EconomicSignalType,
  ForesightHorizon,
} from '@codeforge/shared';

export interface IPlanetaryIntelligenceRepository {
  // Civilization Metrics & Reports
  recordCivilizationMetrics(metrics: Partial<CivilizationMetricsDto>): Promise<CivilizationMetricsDto>;
  getLatestCivilizationMetrics(): Promise<CivilizationMetricsDto>;
  createCivilizationReport(report: Partial<CivilizationReportDto>): Promise<CivilizationReportDto>;
  listCivilizationReports(limit?: number): Promise<CivilizationReportDto[]>;

  // Planetary Digital Twins
  createPlanetaryTwin(twin: Partial<PlanetaryTwinDto>): Promise<PlanetaryTwinDto>;
  getPlanetaryTwin(id: string): Promise<PlanetaryTwinDto | null>;
  listPlanetaryTwins(twinType?: PlanetaryTwinType): Promise<PlanetaryTwinDto[]>;
  updatePlanetaryTwinState(id: string, state: Record<string, any>): Promise<PlanetaryTwinDto | null>;
  recordPlanetarySimulation(simulation: Partial<PlanetarySimulationDto>): Promise<PlanetarySimulationDto>;
  getSimulationsByTwinId(twinId: string): Promise<PlanetarySimulationDto[]>;

  // Innovation Network
  createInnovationRecord(record: Partial<InnovationRecordDto>): Promise<InnovationRecordDto>;
  getInnovationRecord(id: string): Promise<InnovationRecordDto | null>;
  listInnovationRecords(domain?: InnovationDomain): Promise<InnovationRecordDto[]>;
  recordInnovationRanking(ranking: Partial<InnovationRankingDto>): Promise<InnovationRankingDto>;
  getLatestInnovationRankings(): Promise<InnovationRankingDto[]>;

  // Research Civilization
  createResearchFederation(fed: Partial<ResearchFederationDto>): Promise<ResearchFederationDto>;
  getResearchFederation(id: string): Promise<ResearchFederationDto | null>;
  listResearchFederations(): Promise<ResearchFederationDto[]>;
  createResearchCollaboration(collab: Partial<ResearchCollaborationDto>): Promise<ResearchCollaborationDto>;
  listCollaborationsByFederation(federationId: string): Promise<ResearchCollaborationDto[]>;

  // Economic Intelligence
  recordEconomicSignal(signal: Partial<EconomicSignalDto>): Promise<EconomicSignalDto>;
  listEconomicSignals(signalType?: EconomicSignalType, limit?: number): Promise<EconomicSignalDto[]>;
  createEconomicForecast(forecast: Partial<EconomicForecastDto>): Promise<EconomicForecastDto>;
  getLatestEconomicForecasts(limit?: number): Promise<EconomicForecastDto[]>;

  // Autonomous Agent Federation
  createAgentFederation(federation: Partial<AgentFederationDto>): Promise<AgentFederationDto>;
  getAgentFederation(id: string): Promise<AgentFederationDto | null>;
  listAgentFederations(status?: AgentFederationStatus): Promise<AgentFederationDto[]>;
  upsertAgentReputation(reputation: Partial<AgentFederationReputationDto>): Promise<AgentFederationReputationDto>;
  getAgentReputations(federationId: string): Promise<AgentFederationReputationDto[]>;

  // Autonomous Governance Platform
  createGovernancePolicy(policy: Partial<GovernancePolicyDto>): Promise<GovernancePolicyDto>;
  getGovernancePolicy(id: string): Promise<GovernancePolicyDto | null>;
  listGovernancePolicies(councilType?: GovernanceCouncilType, status?: PolicyStatus): Promise<GovernancePolicyDto[]>;
  updateGovernancePolicy(id: string, updates: Partial<GovernancePolicyDto>): Promise<GovernancePolicyDto | null>;
  recordPolicySimulation(sim: Partial<PolicySimulationDto>): Promise<PolicySimulationDto>;
  getPolicySimulations(policyId: string): Promise<PolicySimulationDto[]>;

  // Strategic Foresight Engine
  createStrategicForecast(forecast: Partial<StrategicForecastDto>): Promise<StrategicForecastDto>;
  listStrategicForecasts(horizon?: ForesightHorizon, domain?: InnovationDomain): Promise<StrategicForecastDto[]>;

  // Events & Telemetry Overview
  recordPlanetaryEvent(category: string, title: string, entityId: string, payload: Record<string, any>, severity?: string): Promise<any>;
  getCommandCenterOverview(): Promise<PlanetaryCommandCenterOverviewDto>;
}
