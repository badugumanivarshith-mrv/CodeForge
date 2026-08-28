import { apiClient } from './apiClient';
import {
  CognitiveGoalDto,
  CognitiveSubgoalDto,
  ReasoningTraceDto,
  SelfReflectionReportDto,
  MemoryRecordDto,
  MemoryConsolidationReportDto,
  AgentCouncilDto,
  CouncilDebateDto,
  CouncilVoteDto,
  ExecutionLoopRecordDto,
  PredictiveForecastDto,
  DigitalBrainProfileDto,
  StrategicPlanDto,
  SelfImprovementRecordDto,
  ExecutiveCommandCenterOverviewDto,
  ReasoningStrategy,
  CognitiveMemoryType,
  AgentCouncilType,
  PredictionHorizon,
  SelfImprovementDomain,
} from '@codeforge/shared';

export const cognitiveOsApi = {
  // Command Center Overview & Diagnostic
  async getExecutiveOverview(): Promise<ExecutiveCommandCenterOverviewDto> {
    const res = await apiClient.get('/cognitive-core/overview');
    return res.data.data;
  },

  async evaluateCognitiveHealth(): Promise<{
    healthScore: number;
    subsystemScores: Record<string, number>;
    status: 'OPTIMAL' | 'DEGRADED' | 'CALIBRATING';
  }> {
    const res = await apiClient.get('/cognitive-core/health');
    return res.data.data;
  },

  // Goals & Decomposition
  async listGoals(): Promise<CognitiveGoalDto[]> {
    const res = await apiClient.get('/cognitive-core/goals');
    return res.data.data;
  },

  async createGoal(data: {
    title: string;
    description: string;
    priority?: string;
    targetHorizon?: PredictionHorizon;
    subgoalTitles?: string[];
  }): Promise<{ goal: CognitiveGoalDto; subgoals: CognitiveSubgoalDto[] }> {
    const res = await apiClient.post('/cognitive-core/goals', data);
    return res.data.data;
  },

  async getGoal(id: string): Promise<{ goal: CognitiveGoalDto; subgoals: CognitiveSubgoalDto[] }> {
    const res = await apiClient.get(`/cognitive-core/goals/${id}`);
    return res.data.data;
  },

  // Reasoning Traces
  async executeReasoningTrace(data: {
    goalId?: string;
    strategy: ReasoningStrategy;
    inputPrompt: string;
  }): Promise<{ trace: ReasoningTraceDto }> {
    const res = await apiClient.post('/cognitive-core/reasoning/trace', data);
    return res.data.data;
  },

  async listReasoningTraces(goalId?: string): Promise<ReasoningTraceDto[]> {
    const res = await apiClient.get('/cognitive-core/reasoning/traces', { params: { goalId } });
    return res.data.data;
  },

  // Memory Evolution (5 Tiers)
  async listMemories(memoryType?: CognitiveMemoryType): Promise<MemoryRecordDto[]> {
    const res = await apiClient.get('/cognitive-core/memory', { params: { memoryType } });
    return res.data.data;
  },

  async storeMemory(data: Partial<MemoryRecordDto>): Promise<MemoryRecordDto> {
    const res = await apiClient.post('/cognitive-core/memory', data);
    return res.data.data;
  },

  async consolidateMemories(): Promise<MemoryConsolidationReportDto> {
    const res = await apiClient.post('/cognitive-core/memory/consolidate', {});
    return res.data.data;
  },

  // Multi-Agent Councils & Debates
  async listCouncils(councilType?: AgentCouncilType): Promise<AgentCouncilDto[]> {
    const res = await apiClient.get('/cognitive-core/councils', { params: { councilType } });
    return res.data.data;
  },

  async initiateDebate(data: {
    councilId: string;
    topic: string;
    perspectives: Array<{ agentId: string; role: string; argument: string; confidence: number }>;
  }): Promise<CouncilDebateDto> {
    const res = await apiClient.post('/cognitive-core/councils/debates', data);
    return res.data.data;
  },

  async castVote(debateId: string, data: { agentId: string; voteOption: string; rationale: string }): Promise<CouncilVoteDto> {
    const res = await apiClient.post(`/cognitive-core/councils/debates/${debateId}/votes`, data);
    return res.data.data;
  },

  async resolveConsensus(debateId: string): Promise<CouncilDebateDto> {
    const res = await apiClient.post(`/cognitive-core/councils/debates/${debateId}/resolve`, {});
    return res.data.data;
  },

  // Autonomous Execution Fabric
  async runExecutionLoop(goalId: string, maxIterations?: number): Promise<ExecutionLoopRecordDto> {
    const res = await apiClient.post('/cognitive-core/execution/loop', { goalId, maxIterations });
    return res.data.data;
  },

  // Predictive Intelligence
  async listForecasts(targetId?: string, horizon?: PredictionHorizon): Promise<PredictiveForecastDto[]> {
    const res = await apiClient.get('/cognitive-core/predictions', { params: { targetId, horizon } });
    return res.data.data;
  },

  async generateForecast(data: {
    targetScope?: string;
    targetId?: string;
    horizon: PredictionHorizon;
  }): Promise<PredictiveForecastDto> {
    const res = await apiClient.post('/cognitive-core/predictions/generate', data);
    return res.data.data;
  },

  // Personal Digital Brain
  async getBrainProfile(): Promise<DigitalBrainProfileDto> {
    const res = await apiClient.get('/cognitive-core/brain/profile');
    return res.data.data;
  },

  async explainReasoning(decisionContext: string): Promise<{
    decisionSummary: string;
    premisesUsed: string[];
    axiomsApplied: string[];
    confidenceMetric: number;
    verifiableProofs: string[];
  }> {
    const res = await apiClient.post('/cognitive-core/brain/explain', { decisionContext });
    return res.data.data;
  },

  // AI Strategy Engine
  async listStrategicPlans(): Promise<StrategicPlanDto[]> {
    const res = await apiClient.get('/cognitive-core/strategy/plans');
    return res.data.data;
  },

  async createStrategicPlan(data: Partial<StrategicPlanDto>): Promise<StrategicPlanDto> {
    const res = await apiClient.post('/cognitive-core/strategy/plans', data);
    return res.data.data;
  },

  // Self-Reflection & Self-Improvement
  async listReflections(entityId?: string): Promise<SelfReflectionReportDto[]> {
    const res = await apiClient.get('/cognitive-core/reflection', { params: { entityId } });
    return res.data.data;
  },

  async generateReflection(data: { entityType?: string; entityId?: string; recentActionSummaries?: string[] }): Promise<SelfReflectionReportDto> {
    const res = await apiClient.post('/cognitive-core/reflection', data);
    return res.data.data;
  },

  async listImprovements(): Promise<SelfImprovementRecordDto[]> {
    const res = await apiClient.get('/cognitive-core/improvement');
    return res.data.data;
  },

  async triggerOptimization(data: { domain: SelfImprovementDomain; componentName: string; optimizationType: string }): Promise<SelfImprovementRecordDto> {
    const res = await apiClient.post('/cognitive-core/improvement/optimize', data);
    return res.data.data;
  },
};
