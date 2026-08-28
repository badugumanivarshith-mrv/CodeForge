import { apiClient } from './apiClient';
import {
  GlobalNetworkNodeDto,
  GlobalNetworkEdgeDto,
  GlobalGraphDto,
  GlobalNetworkRecommendationDto,
  GlobalRankingDto,
  CollectiveConsensusDto,
  CrowdKnowledgeSubmissionDto,
  TrendSignalDto,
  AutonomousDepartmentDto,
  AutonomousOptimizationReportDto,
  TalentProfileDto,
  SkillVerificationRequestDto,
  TalentMatchScoreDto,
  StartupProfileDto,
  VentureIntelligenceReportDto,
  ResearchPublicationDto,
  DigitalTwinDto,
  SimulationScenarioDto,
  EcosystemReputationDto,
  EcosystemRewardDto,
  EcosystemLearningMetricDto,
  GlobalCommandCenterOverviewDto,
  SuperintelligenceInsightDto,
  ApiResponse,
  GlobalNodeType,
  DigitalTwinType,
  SuperintelligenceScope,
  VentureStage,
} from '@codeforge/shared';

export const globalEcosystemApi = {
  // Module 1: Global AI Network
  async getGlobalGraph(): Promise<GlobalGraphDto> {
    const res = await apiClient.get<ApiResponse<GlobalGraphDto>>('/global-ecosystem/network/graph');
    return res.data.data;
  },

  async registerNode(data: { entityId: string; nodeType: GlobalNodeType; label: string; score?: number; metadata?: Record<string, any> }): Promise<GlobalNetworkNodeDto> {
    const res = await apiClient.post<ApiResponse<GlobalNetworkNodeDto>>('/global-ecosystem/network/nodes', data);
    return res.data.data;
  },

  async connectNodes(data: { sourceNodeId: string; targetNodeId: string; edgeType: any; weight?: number }): Promise<GlobalNetworkEdgeDto> {
    const res = await apiClient.post<ApiResponse<GlobalNetworkEdgeDto>>('/global-ecosystem/network/edges', data);
    return res.data.data;
  },

  async getRecommendations(nodeId: string): Promise<GlobalNetworkRecommendationDto[]> {
    const res = await apiClient.get<ApiResponse<GlobalNetworkRecommendationDto[]>>(`/global-ecosystem/network/recommendations/${nodeId}`);
    return res.data.data;
  },

  async getRankings(nodeType?: GlobalNodeType): Promise<GlobalRankingDto[]> {
    const res = await apiClient.get<ApiResponse<GlobalRankingDto[]>>('/global-ecosystem/network/rankings', {
      params: { type: nodeType },
    });
    return res.data.data;
  },

  // Module 2: Collective Intelligence Engine
  async submitKnowledge(data: CrowdKnowledgeSubmissionDto): Promise<{ success: boolean; topic: string; totalSubmissions: number }> {
    const res = await apiClient.post<ApiResponse<{ success: boolean; topic: string; totalSubmissions: number }>>('/global-ecosystem/collective/knowledge', data);
    return res.data.data;
  },

  async getConsensus(topic?: string): Promise<CollectiveConsensusDto> {
    const res = await apiClient.get<ApiResponse<CollectiveConsensusDto>>('/global-ecosystem/collective/consensus', {
      params: { topic },
    });
    return res.data.data;
  },

  async getTrends(): Promise<TrendSignalDto[]> {
    const res = await apiClient.get<ApiResponse<TrendSignalDto[]>>('/global-ecosystem/collective/trends');
    return res.data.data;
  },

  // Module 3: Autonomous Enterprise Platform
  async listDepartments(orgId: string): Promise<AutonomousDepartmentDto[]> {
    const res = await apiClient.get<ApiResponse<AutonomousDepartmentDto[]>>(`/global-ecosystem/enterprise/departments/${orgId}`);
    return res.data.data;
  },

  async createDepartment(data: { orgId: string; name: string; headAgentId?: string | null; budgetAllocatedUsd?: number }): Promise<AutonomousDepartmentDto> {
    const res = await apiClient.post<ApiResponse<AutonomousDepartmentDto>>('/global-ecosystem/enterprise/departments', data);
    return res.data.data;
  },

  async getEnterpriseOptimization(orgId: string): Promise<AutonomousOptimizationReportDto> {
    const res = await apiClient.get<ApiResponse<AutonomousOptimizationReportDto>>(`/global-ecosystem/enterprise/optimization/${orgId}`);
    return res.data.data;
  },

  // Module 4: Global Talent Cloud
  async createOrUpdateTalentProfile(data: Partial<TalentProfileDto>): Promise<TalentProfileDto> {
    const res = await apiClient.post<ApiResponse<TalentProfileDto>>('/global-ecosystem/talent/profile', data);
    return res.data.data;
  },

  async getTalentProfile(userId: string): Promise<TalentProfileDto> {
    const res = await apiClient.get<ApiResponse<TalentProfileDto>>(`/global-ecosystem/talent/profile/${userId}`);
    return res.data.data;
  },

  async searchTalent(query?: { skill?: string; tier?: string }): Promise<TalentProfileDto[]> {
    const res = await apiClient.get<ApiResponse<TalentProfileDto[]>>('/global-ecosystem/talent/search', {
      params: query,
    });
    return res.data.data;
  },

  async requestVerification(data: SkillVerificationRequestDto): Promise<any> {
    const res = await apiClient.post<ApiResponse<any>>('/global-ecosystem/talent/verify-skill', data);
    return res.data.data;
  },

  async matchTalent(data: { roleTitle: string; requiredSkills: string[] }): Promise<TalentMatchScoreDto[]> {
    const res = await apiClient.post<ApiResponse<TalentMatchScoreDto[]>>('/global-ecosystem/talent/match', data);
    return res.data.data;
  },

  // Module 5: AI Entrepreneurship Platform
  async launchStartup(data: Partial<StartupProfileDto>): Promise<StartupProfileDto> {
    const res = await apiClient.post<ApiResponse<StartupProfileDto>>('/global-ecosystem/startups', data);
    return res.data.data;
  },

  async listStartups(stage?: VentureStage, industry?: string): Promise<StartupProfileDto[]> {
    const res = await apiClient.get<ApiResponse<StartupProfileDto[]>>('/global-ecosystem/startups', {
      params: { stage, industry },
    });
    return res.data.data;
  },

  async getVentureIntelligence(startupId: string): Promise<VentureIntelligenceReportDto> {
    const res = await apiClient.get<ApiResponse<VentureIntelligenceReportDto>>(`/global-ecosystem/startups/${startupId}/intelligence`);
    return res.data.data;
  },

  // Module 6: Global Research Network
  async publishPaper(data: Partial<ResearchPublicationDto>): Promise<ResearchPublicationDto> {
    const res = await apiClient.post<ApiResponse<ResearchPublicationDto>>('/global-ecosystem/research/papers', data);
    return res.data.data;
  },

  async listPapers(domain?: string): Promise<ResearchPublicationDto[]> {
    const res = await apiClient.get<ApiResponse<ResearchPublicationDto[]>>('/global-ecosystem/research/papers', {
      params: { domain },
    });
    return res.data.data;
  },

  // Module 7: Digital Twin Ecosystem
  async createTwin(data: { entityId: string; twinType: DigitalTwinType; name: string; stateSnapshot?: Record<string, any>; behavioralModel?: Record<string, any> }): Promise<DigitalTwinDto> {
    const res = await apiClient.post<ApiResponse<DigitalTwinDto>>('/global-ecosystem/digital-twins', data);
    return res.data.data;
  },

  async listTwins(twinType?: DigitalTwinType): Promise<DigitalTwinDto[]> {
    const res = await apiClient.get<ApiResponse<DigitalTwinDto[]>>('/global-ecosystem/digital-twins', {
      params: { type: twinType },
    });
    return res.data.data;
  },

  async runSimulation(twinId: string, scenarioTitle: string, inputParameters?: Record<string, any>): Promise<SimulationScenarioDto> {
    const res = await apiClient.post<ApiResponse<SimulationScenarioDto>>(`/global-ecosystem/digital-twins/${twinId}/simulate`, {
      scenarioTitle,
      inputParameters,
    });
    return res.data.data;
  },

  // Module 8: AI Economy & Token System
  async getReputation(userId: string): Promise<EcosystemReputationDto> {
    const res = await apiClient.get<ApiResponse<EcosystemReputationDto>>(`/global-ecosystem/economy/reputation/${userId}`);
    return res.data.data;
  },

  async rewardContribution(data: { credits: number; reason: string }): Promise<EcosystemRewardDto> {
    const res = await apiClient.post<ApiResponse<EcosystemRewardDto>>('/global-ecosystem/economy/reward', data);
    return res.data.data;
  },

  // Module 9: Self-Improving AI Ecosystem
  async getLearningMetrics(): Promise<EcosystemLearningMetricDto[]> {
    const res = await apiClient.get<ApiResponse<EcosystemLearningMetricDto[]>>('/global-ecosystem/self-improvement/metrics');
    return res.data.data;
  },

  async triggerSelfImprovement(moduleName: string): Promise<EcosystemLearningMetricDto> {
    const res = await apiClient.post<ApiResponse<EcosystemLearningMetricDto>>('/global-ecosystem/self-improvement/cycle', { moduleName });
    return res.data.data;
  },

  // Module 10: Global Command Center & Superintelligence
  async getCommandCenterOverview(): Promise<GlobalCommandCenterOverviewDto> {
    const res = await apiClient.get<ApiResponse<GlobalCommandCenterOverviewDto>>('/global-ecosystem/command-center/overview');
    return res.data.data;
  },

  async getStrategicInsights(scope?: SuperintelligenceScope): Promise<SuperintelligenceInsightDto[]> {
    const res = await apiClient.get<ApiResponse<SuperintelligenceInsightDto[]>>('/global-ecosystem/superintelligence/insights', {
      params: { scope },
    });
    return res.data.data;
  },
};
