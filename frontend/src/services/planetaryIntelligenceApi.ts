import { apiClient } from './apiClient';
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
  AgentDelegationPlanDto,
  GovernancePolicyDto,
  PolicySimulationDto,
  StrategicForecastDto,
  PlanetaryCommandCenterOverviewDto,
  PlanetaryClusterNodeDto,
  PlanetaryCollaborationMeshDto,
  PlanetaryTwinType,
  InnovationDomain,
} from '@codeforge/shared';

export const planetaryIntelligenceApi = {
  // Command Center Overview
  async getCommandCenterOverview(): Promise<PlanetaryCommandCenterOverviewDto> {
    const res = await apiClient.get('/planetary-intelligence/command-center/overview');
    return res.data.data;
  },

  // Planetary Clusters & Mesh
  async listClusters(): Promise<PlanetaryClusterNodeDto[]> {
    const res = await apiClient.get('/planetary-intelligence/clusters');
    return res.data.data;
  },

  async getCollaborationMesh(): Promise<PlanetaryCollaborationMeshDto> {
    const res = await apiClient.get('/planetary-intelligence/mesh');
    return res.data.data;
  },

  // Civilization Engine
  async getCivilizationHealth(): Promise<CivilizationMetricsDto> {
    const res = await apiClient.get('/planetary-intelligence/civilization/health');
    return res.data.data;
  },

  async generateCivilizationReport(): Promise<CivilizationReportDto> {
    const res = await apiClient.post('/planetary-intelligence/civilization/report', {});
    return res.data.data;
  },

  async listCivilizationReports(limit: number = 10): Promise<CivilizationReportDto[]> {
    const res = await apiClient.get('/planetary-intelligence/civilization/reports', { params: { limit } });
    return res.data.data;
  },

  // Governance Platform
  async listPolicies(): Promise<GovernancePolicyDto[]> {
    const res = await apiClient.get('/planetary-intelligence/governance/policies');
    return res.data.data;
  },

  async proposePolicy(data: Partial<GovernancePolicyDto>): Promise<GovernancePolicyDto> {
    const res = await apiClient.post('/planetary-intelligence/governance/policies', data);
    return res.data.data;
  },

  async simulatePolicy(id: string, simulationName: string): Promise<PolicySimulationDto> {
    const res = await apiClient.post(`/planetary-intelligence/governance/policies/${id}/simulate`, { simulationName });
    return res.data.data;
  },

  async enactPolicy(id: string): Promise<GovernancePolicyDto> {
    const res = await apiClient.post(`/planetary-intelligence/governance/policies/${id}/enact`, {});
    return res.data.data;
  },

  // Planetary Digital Twins
  async listTwins(twinType?: PlanetaryTwinType): Promise<PlanetaryTwinDto[]> {
    const res = await apiClient.get('/planetary-intelligence/twins', { params: { twinType } });
    return res.data.data;
  },

  async createTwin(data: Partial<PlanetaryTwinDto>): Promise<PlanetaryTwinDto> {
    const res = await apiClient.post('/planetary-intelligence/twins', data);
    return res.data.data;
  },

  async simulateTwin(id: string, scenarioName: string, horizonDays: number = 30, parameters: Record<string, any> = {}): Promise<PlanetarySimulationDto> {
    const res = await apiClient.post(`/planetary-intelligence/twins/${id}/simulate`, { scenarioName, horizonDays, parameters });
    return res.data.data;
  },

  // Innovation Network
  async listInnovations(domain?: InnovationDomain): Promise<InnovationRecordDto[]> {
    const res = await apiClient.get('/planetary-intelligence/innovations', { params: { domain } });
    return res.data.data;
  },

  async recordInnovation(data: Partial<InnovationRecordDto>): Promise<InnovationRecordDto> {
    const res = await apiClient.post('/planetary-intelligence/innovations', data);
    return res.data.data;
  },

  async rankInnovations(domain: InnovationDomain): Promise<InnovationRankingDto> {
    const res = await apiClient.get(`/planetary-intelligence/innovations/ranking/${domain}`);
    return res.data.data;
  },

  // Research Civilization
  async listResearchFederations(): Promise<ResearchFederationDto[]> {
    const res = await apiClient.get('/planetary-intelligence/research/federations');
    return res.data.data;
  },

  async createResearchFederation(data: Partial<ResearchFederationDto>): Promise<ResearchFederationDto> {
    const res = await apiClient.post('/planetary-intelligence/research/federations', data);
    return res.data.data;
  },

  async launchCollaboration(federationId: string, data: Partial<ResearchCollaborationDto>): Promise<ResearchCollaborationDto> {
    const res = await apiClient.post(`/planetary-intelligence/research/federations/${federationId}/collaborations`, data);
    return res.data.data;
  },

  // Economic Intelligence
  async listEconomicSignals(): Promise<EconomicSignalDto[]> {
    const res = await apiClient.get('/planetary-intelligence/economic/signals');
    return res.data.data;
  },

  async generateEconomicForecast(horizonMonths: number = 12): Promise<EconomicForecastDto> {
    const res = await apiClient.post('/planetary-intelligence/economic/forecast', { horizonMonths });
    return res.data.data;
  },

  // Agent Federation
  async listAgentFederations(): Promise<AgentFederationDto[]> {
    const res = await apiClient.get('/planetary-intelligence/agents/federations');
    return res.data.data;
  },

  async formAgentFederation(data: Partial<AgentFederationDto>): Promise<AgentFederationDto> {
    const res = await apiClient.post('/planetary-intelligence/agents/federations', data);
    return res.data.data;
  },

  async delegateTask(data: Partial<AgentDelegationPlanDto>): Promise<AgentDelegationPlanDto> {
    const res = await apiClient.post('/planetary-intelligence/agents/delegate', data);
    return res.data.data;
  },

  // Strategic Foresight
  async listStrategicForecasts(): Promise<StrategicForecastDto[]> {
    const res = await apiClient.get('/planetary-intelligence/foresight/forecasts');
    return res.data.data;
  },

  async generateStrategicForecast(data: Partial<StrategicForecastDto>): Promise<StrategicForecastDto> {
    const res = await apiClient.post('/planetary-intelligence/foresight/forecasts', data);
    return res.data.data;
  },
};
