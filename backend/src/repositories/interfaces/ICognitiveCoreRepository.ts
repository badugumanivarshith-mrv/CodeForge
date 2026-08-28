import {
  CognitiveGoalDto,
  CognitiveSubgoalDto,
  ReasoningTraceDto,
  MetacognitiveEvaluationDto,
  SelfReflectionReportDto,
  LearningEvolutionRecordDto,
  SelfImprovementRecordDto,
  MemoryRecordDto,
  MemoryConsolidationReportDto,
  AgentCouncilDto,
  CouncilDebateDto,
  CouncilVoteDto,
  ExecutionLoopRecordDto,
  PredictiveForecastDto,
  DigitalBrainProfileDto,
  StrategicPlanDto,
  CognitiveMemoryType,
  AgentCouncilType,
  PredictionHorizon,
} from '@codeforge/shared';

export interface ICognitiveCoreRepository {
  // Goals & Subgoals
  createGoal(data: Partial<CognitiveGoalDto>): Promise<CognitiveGoalDto>;
  getGoal(id: string): Promise<CognitiveGoalDto | null>;
  listGoals(userId: string): Promise<CognitiveGoalDto[]>;
  updateGoal(id: string, updates: Partial<CognitiveGoalDto>): Promise<CognitiveGoalDto | null>;
  createSubgoal(data: Partial<CognitiveSubgoalDto>): Promise<CognitiveSubgoalDto>;
  listSubgoals(goalId: string): Promise<CognitiveSubgoalDto[]>;

  // Reasoning & Metacognition
  recordReasoningTrace(data: Partial<ReasoningTraceDto>): Promise<ReasoningTraceDto>;
  getReasoningTrace(id: string): Promise<ReasoningTraceDto | null>;
  listReasoningTraces(goalId?: string): Promise<ReasoningTraceDto[]>;
  recordMetacognitiveEvaluation(data: Partial<MetacognitiveEvaluationDto>): Promise<MetacognitiveEvaluationDto>;
  recordSelfReflection(data: Partial<SelfReflectionReportDto>): Promise<SelfReflectionReportDto>;
  listSelfReflections(entityId?: string): Promise<SelfReflectionReportDto[]>;

  // Memory Evolution
  recordMemory(data: Partial<MemoryRecordDto>): Promise<MemoryRecordDto>;
  listMemories(userId: string, memoryType?: CognitiveMemoryType): Promise<MemoryRecordDto[]>;
  recordMemoryConsolidation(data: Partial<MemoryConsolidationReportDto>): Promise<MemoryConsolidationReportDto>;
  listMemoryConsolidations(userId: string): Promise<MemoryConsolidationReportDto[]>;

  // Multi-Agent Councils & Debates
  createCouncil(data: Partial<AgentCouncilDto>): Promise<AgentCouncilDto>;
  getCouncil(id: string): Promise<AgentCouncilDto | null>;
  listCouncils(councilType?: AgentCouncilType): Promise<AgentCouncilDto[]>;
  createCouncilDebate(data: Partial<CouncilDebateDto>): Promise<CouncilDebateDto>;
  getCouncilDebate(id: string): Promise<CouncilDebateDto | null>;
  listCouncilDebates(councilId: string): Promise<CouncilDebateDto[]>;
  recordCouncilVote(data: Partial<CouncilVoteDto>): Promise<CouncilVoteDto>;
  listCouncilVotes(debateId: string): Promise<CouncilVoteDto[]>;
  updateCouncilDebate(id: string, updates: Partial<CouncilDebateDto>): Promise<CouncilDebateDto | null>;

  // Execution Loops
  recordExecutionLoop(data: Partial<ExecutionLoopRecordDto>): Promise<ExecutionLoopRecordDto>;
  getExecutionLoop(id: string): Promise<ExecutionLoopRecordDto | null>;
  listExecutionLoops(goalId: string): Promise<ExecutionLoopRecordDto[]>;

  // Predictive Intelligence
  createPredictiveForecast(data: Partial<PredictiveForecastDto>): Promise<PredictiveForecastDto>;
  listPredictiveForecasts(targetId?: string, horizon?: PredictionHorizon): Promise<PredictiveForecastDto[]>;

  // Digital Brain
  getDigitalBrain(userId: string): Promise<DigitalBrainProfileDto | null>;
  upsertDigitalBrain(data: Partial<DigitalBrainProfileDto>): Promise<DigitalBrainProfileDto>;

  // AI Strategy Engine
  createStrategicPlan(data: Partial<StrategicPlanDto>): Promise<StrategicPlanDto>;
  listStrategicPlans(): Promise<StrategicPlanDto[]>;

  // Learning & Self-Improvement
  recordLearningEvolution(data: Partial<LearningEvolutionRecordDto>): Promise<LearningEvolutionRecordDto>;
  recordSelfImprovement(data: Partial<SelfImprovementRecordDto>): Promise<SelfImprovementRecordDto>;
  listSelfImprovements(): Promise<SelfImprovementRecordDto[]>;
}
