import { randomUUID } from 'crypto';
import { eq, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  cognitiveGoals,
  cognitiveSubgoals,
  reasoningTraces,
  metacognitiveEvaluations,
  selfReflectionReports,
  learningEvolutionRecords,
  selfImprovementRecords,
  memoryRecords,
  memoryConsolidations,
  agentCouncils,
  councilDebates,
  councilVotes,
  executionLoops,
  predictiveForecasts,
  digitalBrains,
  strategicPlans,
} from '../database/schema';
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
  CognitiveGoalStatus,
  ReasoningStrategy,
  CognitiveMemoryType,
  AgentCouncilType,
  ConsensusStatus,
  PredictionHorizon,
  ExecutionLoopState,
  SelfImprovementDomain,
  MetacognitionConfidence,
  StrategicPriority,
} from '@codeforge/shared';
import { ICognitiveCoreRepository } from './interfaces/ICognitiveCoreRepository';

export class CognitiveCoreRepository implements ICognitiveCoreRepository {
  // In-Memory Fallbacks for zero-dependency or resilient local run
  private memoryGoals: Map<string, CognitiveGoalDto> = new Map();
  private memorySubgoals: Map<string, CognitiveSubgoalDto> = new Map();
  private memoryTraces: Map<string, ReasoningTraceDto> = new Map();
  private memoryMetaEvals: Map<string, MetacognitiveEvaluationDto> = new Map();
  private memoryReflections: Map<string, SelfReflectionReportDto> = new Map();
  private memoryLearning: Map<string, LearningEvolutionRecordDto> = new Map();
  private memoryImprovements: Map<string, SelfImprovementRecordDto> = new Map();
  private memoryRecordsMap: Map<string, MemoryRecordDto> = new Map();
  private memoryConsolidationsMap: Map<string, MemoryConsolidationReportDto> = new Map();
  private memoryCouncils: Map<string, AgentCouncilDto> = new Map();
  private memoryDebates: Map<string, CouncilDebateDto> = new Map();
  private memoryVotes: Map<string, CouncilVoteDto> = new Map();
  private memoryExecutionLoops: Map<string, ExecutionLoopRecordDto> = new Map();
  private memoryForecasts: Map<string, PredictiveForecastDto> = new Map();
  private memoryDigitalBrains: Map<string, DigitalBrainProfileDto> = new Map();
  private memoryStrategicPlans: Map<string, StrategicPlanDto> = new Map();

  // Goals & Subgoals
  async createGoal(data: Partial<CognitiveGoalDto>): Promise<CognitiveGoalDto> {
    const record: CognitiveGoalDto = {
      id: data.id || randomUUID(),
      userId: data.userId || randomUUID(),
      title: data.title || 'Untitled Goal',
      description: data.description || '',
      status: data.status || CognitiveGoalStatus.PENDING,
      priority: data.priority || StrategicPriority.MEDIUM,
      targetHorizon: data.targetHorizon || PredictionHorizon.THIRTY_DAYS,
      completionScore: data.completionScore ?? 0.0,
      subgoalsCount: data.subgoalsCount ?? 0,
      activeTracesCount: data.activeTracesCount ?? 0,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };

    try {
      if (db) {
        await db.insert(cognitiveGoals).values(record as any);
      }
    } catch {
      // fallback
    }
    this.memoryGoals.set(record.id, record);
    return record;
  }

  async getGoal(id: string): Promise<CognitiveGoalDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(cognitiveGoals).where(eq(cognitiveGoals.id, id));
        if (rows.length > 0) return rows[0] as unknown as CognitiveGoalDto;
      }
    } catch {}
    return this.memoryGoals.get(id) || null;
  }

  async listGoals(userId: string): Promise<CognitiveGoalDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(cognitiveGoals).where(eq(cognitiveGoals.userId, userId));
        if (rows.length > 0) return rows as unknown as CognitiveGoalDto[];
      }
    } catch {}
    return Array.from(this.memoryGoals.values()).filter((g) => g.userId === userId);
  }

  async updateGoal(id: string, updates: Partial<CognitiveGoalDto>): Promise<CognitiveGoalDto | null> {
    const existing = await this.getGoal(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates, updatedAt: new Date().toISOString() };
    try {
      if (db) {
        await db.update(cognitiveGoals).set(updated as any).where(eq(cognitiveGoals.id, id));
      }
    } catch {}
    this.memoryGoals.set(id, updated);
    return updated;
  }

  async createSubgoal(data: Partial<CognitiveSubgoalDto>): Promise<CognitiveSubgoalDto> {
    const record: CognitiveSubgoalDto = {
      id: data.id || randomUUID(),
      goalId: data.goalId || randomUUID(),
      title: data.title || 'Subgoal',
      description: data.description || '',
      sequenceOrder: data.sequenceOrder ?? 1,
      status: data.status || CognitiveGoalStatus.PENDING,
      estimatedComplexity: data.estimatedComplexity ?? 1,
      assignedAgentId: data.assignedAgentId,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(cognitiveSubgoals).values(record as any);
      }
    } catch {}
    this.memorySubgoals.set(record.id, record);
    return record;
  }

  async listSubgoals(goalId: string): Promise<CognitiveSubgoalDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(cognitiveSubgoals).where(eq(cognitiveSubgoals.goalId, goalId));
        if (rows.length > 0) return rows as unknown as CognitiveSubgoalDto[];
      }
    } catch {}
    return Array.from(this.memorySubgoals.values()).filter((s) => s.goalId === goalId);
  }

  // Reasoning Traces & Metacognition
  async recordReasoningTrace(data: Partial<ReasoningTraceDto>): Promise<ReasoningTraceDto> {
    const record: ReasoningTraceDto = {
      id: data.id || randomUUID(),
      goalId: data.goalId,
      strategy: data.strategy || ReasoningStrategy.FIRST_PRINCIPLES,
      inputPrompt: data.inputPrompt || '',
      hypothesisTree: data.hypothesisTree || [],
      synthesis: data.synthesis || '',
      confidenceScore: data.confidenceScore ?? 92.0,
      biasAudits: data.biasAudits || [],
      executionTimeMs: data.executionTimeMs ?? 50,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(reasoningTraces).values(record as any);
      }
    } catch {}
    this.memoryTraces.set(record.id, record);
    return record;
  }

  async getReasoningTrace(id: string): Promise<ReasoningTraceDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(reasoningTraces).where(eq(reasoningTraces.id, id));
        if (rows.length > 0) return rows[0] as unknown as ReasoningTraceDto;
      }
    } catch {}
    return this.memoryTraces.get(id) || null;
  }

  async listReasoningTraces(goalId?: string): Promise<ReasoningTraceDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(reasoningTraces);
        if (rows.length > 0) {
          let list = rows as unknown as ReasoningTraceDto[];
          if (goalId) list = list.filter((r) => r.goalId === goalId);
          return list;
        }
      }
    } catch {}
    let list = Array.from(this.memoryTraces.values());
    if (goalId) list = list.filter((r) => r.goalId === goalId);
    return list;
  }

  async recordMetacognitiveEvaluation(data: Partial<MetacognitiveEvaluationDto>): Promise<MetacognitiveEvaluationDto> {
    const record: MetacognitiveEvaluationDto = {
      id: data.id || randomUUID(),
      traceId: data.traceId || randomUUID(),
      confidenceTier: data.confidenceTier || MetacognitionConfidence.HIGH,
      epistemicUncertainty: data.epistemicUncertainty ?? 0.05,
      heuristicBiasesIdentified: data.heuristicBiasesIdentified || [],
      suggestedMitigations: data.suggestedMitigations || [],
      calibrationScore: data.calibrationScore ?? 95.0,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(metacognitiveEvaluations).values(record as any);
      }
    } catch {}
    this.memoryMetaEvals.set(record.id, record);
    return record;
  }

  async recordSelfReflection(data: Partial<SelfReflectionReportDto>): Promise<SelfReflectionReportDto> {
    const record: SelfReflectionReportDto = {
      id: data.id || randomUUID(),
      entityType: data.entityType || 'agent',
      entityId: data.entityId || 'agent-default',
      observations: data.observations || [],
      identifiedStrengths: data.identifiedStrengths || [],
      identifiedDeficiencies: data.identifiedDeficiencies || [],
      lessonsLearned: data.lessonsLearned || [],
      actionableAdjustments: data.actionableAdjustments || [],
      impactScore: data.impactScore ?? 90.0,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(selfReflectionReports).values(record as any);
      }
    } catch {}
    this.memoryReflections.set(record.id, record);
    return record;
  }

  async listSelfReflections(entityId?: string): Promise<SelfReflectionReportDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(selfReflectionReports);
        if (rows.length > 0) {
          let list = rows as unknown as SelfReflectionReportDto[];
          if (entityId) list = list.filter((r) => r.entityId === entityId);
          return list;
        }
      }
    } catch {}
    let list = Array.from(this.memoryReflections.values());
    if (entityId) list = list.filter((r) => r.entityId === entityId);
    return list;
  }

  // Memory Evolution
  async recordMemory(data: Partial<MemoryRecordDto>): Promise<MemoryRecordDto> {
    const record: MemoryRecordDto = {
      id: data.id || randomUUID(),
      userId: data.userId || randomUUID(),
      memoryType: data.memoryType || CognitiveMemoryType.EPISODIC,
      conceptKey: data.conceptKey || 'concept',
      content: data.content || '',
      contextSummary: data.contextSummary || '',
      importanceWeight: data.importanceWeight ?? 1.0,
      accessCount: data.accessCount ?? 1,
      decayRate: data.decayRate ?? 0.05,
      lastRecalledAt: data.lastRecalledAt || new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(memoryRecords).values(record as any);
      }
    } catch {}
    this.memoryRecordsMap.set(record.id, record);
    return record;
  }

  async listMemories(userId: string, memoryType?: CognitiveMemoryType): Promise<MemoryRecordDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(memoryRecords).where(eq(memoryRecords.userId, userId));
        if (rows.length > 0) {
          let list = rows as unknown as MemoryRecordDto[];
          if (memoryType) list = list.filter((m) => m.memoryType === memoryType);
          return list;
        }
      }
    } catch {}
    let list = Array.from(this.memoryRecordsMap.values()).filter((m) => m.userId === userId);
    if (memoryType) list = list.filter((m) => m.memoryType === memoryType);
    return list;
  }

  async recordMemoryConsolidation(data: Partial<MemoryConsolidationReportDto>): Promise<MemoryConsolidationReportDto> {
    const record: MemoryConsolidationReportDto = {
      id: data.id || randomUUID(),
      userId: data.userId || randomUUID(),
      consolidatedCount: data.consolidatedCount ?? 0,
      forgottenCount: data.forgottenCount ?? 0,
      synthesizedConcepts: data.synthesizedConcepts || [],
      compressionRatio: data.compressionRatio ?? 0.7,
      knowledgeCoherenceScore: data.knowledgeCoherenceScore ?? 95.0,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(memoryConsolidations).values(record as any);
      }
    } catch {}
    this.memoryConsolidationsMap.set(record.id, record);
    return record;
  }

  async listMemoryConsolidations(userId: string): Promise<MemoryConsolidationReportDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(memoryConsolidations).where(eq(memoryConsolidations.userId, userId));
        if (rows.length > 0) return rows as unknown as MemoryConsolidationReportDto[];
      }
    } catch {}
    return Array.from(this.memoryConsolidationsMap.values()).filter((c) => c.userId === userId);
  }

  // Multi-Agent Councils & Debates
  async createCouncil(data: Partial<AgentCouncilDto>): Promise<AgentCouncilDto> {
    const record: AgentCouncilDto = {
      id: data.id || randomUUID(),
      councilType: data.councilType || AgentCouncilType.ENGINEERING_COUNCIL,
      councilName: data.councilName || 'Engineering Council',
      leadAgentId: data.leadAgentId || 'agent-lead-1',
      participatingAgentIds: data.participatingAgentIds || [],
      activeDebatesCount: data.activeDebatesCount ?? 0,
      consensusRatio: data.consensusRatio ?? 1.0,
      charterStatement: data.charterStatement || 'To deliberate and guide cognitive decisions.',
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(agentCouncils).values(record as any);
      }
    } catch {}
    this.memoryCouncils.set(record.id, record);
    return record;
  }

  async getCouncil(id: string): Promise<AgentCouncilDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(agentCouncils).where(eq(agentCouncils.id, id));
        if (rows.length > 0) return rows[0] as unknown as AgentCouncilDto;
      }
    } catch {}
    return this.memoryCouncils.get(id) || null;
  }

  async listCouncils(councilType?: AgentCouncilType): Promise<AgentCouncilDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(agentCouncils);
        if (rows.length > 0) {
          let list = rows as unknown as AgentCouncilDto[];
          if (councilType) list = list.filter((c) => c.councilType === councilType);
          return list;
        }
      }
    } catch {}
    let list = Array.from(this.memoryCouncils.values());
    if (councilType) list = list.filter((c) => c.councilType === councilType);
    return list;
  }

  async createCouncilDebate(data: Partial<CouncilDebateDto>): Promise<CouncilDebateDto> {
    const record: CouncilDebateDto = {
      id: data.id || randomUUID(),
      councilId: data.councilId || randomUUID(),
      topic: data.topic || 'Debate Topic',
      status: data.status || ConsensusStatus.DELIBERATING,
      perspectives: data.perspectives || [],
      contradictionsDetected: data.contradictionsDetected || [],
      convergedSynthesis: data.convergedSynthesis,
      consensusScore: data.consensusScore ?? 0.0,
      createdAt: data.createdAt || new Date().toISOString(),
      resolvedAt: data.resolvedAt,
    };
    try {
      if (db) {
        await db.insert(councilDebates).values(record as any);
      }
    } catch {}
    this.memoryDebates.set(record.id, record);
    return record;
  }

  async getCouncilDebate(id: string): Promise<CouncilDebateDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(councilDebates).where(eq(councilDebates.id, id));
        if (rows.length > 0) return rows[0] as unknown as CouncilDebateDto;
      }
    } catch {}
    return this.memoryDebates.get(id) || null;
  }

  async listCouncilDebates(councilId: string): Promise<CouncilDebateDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(councilDebates).where(eq(councilDebates.councilId, councilId));
        if (rows.length > 0) return rows as unknown as CouncilDebateDto[];
      }
    } catch {}
    return Array.from(this.memoryDebates.values()).filter((d) => d.councilId === councilId);
  }

  async recordCouncilVote(data: Partial<CouncilVoteDto>): Promise<CouncilVoteDto> {
    const record: CouncilVoteDto = {
      id: data.id || randomUUID(),
      debateId: data.debateId || randomUUID(),
      agentId: data.agentId || 'agent-voter',
      voteOption: data.voteOption || 'aye',
      rationale: data.rationale || 'Support proposal',
      weight: data.weight ?? 1.0,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(councilVotes).values(record as any);
      }
    } catch {}
    this.memoryVotes.set(record.id, record);
    return record;
  }

  async listCouncilVotes(debateId: string): Promise<CouncilVoteDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(councilVotes).where(eq(councilVotes.debateId, debateId));
        if (rows.length > 0) return rows as unknown as CouncilVoteDto[];
      }
    } catch {}
    return Array.from(this.memoryVotes.values()).filter((v) => v.debateId === debateId);
  }

  async updateCouncilDebate(id: string, updates: Partial<CouncilDebateDto>): Promise<CouncilDebateDto | null> {
    const existing = await this.getCouncilDebate(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    try {
      if (db) {
        await db.update(councilDebates).set(updated as any).where(eq(councilDebates.id, id));
      }
    } catch {}
    this.memoryDebates.set(id, updated);
    return updated;
  }

  // Execution Loops
  async recordExecutionLoop(data: Partial<ExecutionLoopRecordDto>): Promise<ExecutionLoopRecordDto> {
    const record: ExecutionLoopRecordDto = {
      id: data.id || randomUUID(),
      goalId: data.goalId || randomUUID(),
      currentState: data.currentState || ExecutionLoopState.EXECUTE,
      iteration: data.iteration ?? 1,
      maxIterations: data.maxIterations ?? 5,
      observations: data.observations || [],
      reflectionSummary: data.reflectionSummary,
      appliedImprovements: data.appliedImprovements || [],
      hasSucceeded: data.hasSucceeded ?? false,
      durationMs: data.durationMs ?? 100,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(executionLoops).values(record as any);
      }
    } catch {}
    this.memoryExecutionLoops.set(record.id, record);
    return record;
  }

  async getExecutionLoop(id: string): Promise<ExecutionLoopRecordDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(executionLoops).where(eq(executionLoops.id, id));
        if (rows.length > 0) return rows[0] as unknown as ExecutionLoopRecordDto;
      }
    } catch {}
    return this.memoryExecutionLoops.get(id) || null;
  }

  async listExecutionLoops(goalId: string): Promise<ExecutionLoopRecordDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(executionLoops).where(eq(executionLoops.goalId, goalId));
        if (rows.length > 0) return rows as unknown as ExecutionLoopRecordDto[];
      }
    } catch {}
    return Array.from(this.memoryExecutionLoops.values()).filter((e) => e.goalId === goalId);
  }

  // Predictive Intelligence
  async createPredictiveForecast(data: Partial<PredictiveForecastDto>): Promise<PredictiveForecastDto> {
    const record: PredictiveForecastDto = {
      id: data.id || randomUUID(),
      targetScope: data.targetScope || 'user',
      targetId: data.targetId || 'user-default',
      horizon: data.horizon || PredictionHorizon.THIRTY_DAYS,
      successProbability: data.successProbability ?? 0.88,
      expectedOutcomes: data.expectedOutcomes || [],
      riskFactors: data.riskFactors || [],
      predictiveConfidence: data.predictiveConfidence ?? 91.0,
      actionableRecommendations: data.actionableRecommendations || [],
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(predictiveForecasts).values(record as any);
      }
    } catch {}
    this.memoryForecasts.set(record.id, record);
    return record;
  }

  async listPredictiveForecasts(targetId?: string, horizon?: PredictionHorizon): Promise<PredictiveForecastDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(predictiveForecasts);
        if (rows.length > 0) {
          let list = rows as unknown as PredictiveForecastDto[];
          if (targetId) list = list.filter((f) => f.targetId === targetId);
          if (horizon) list = list.filter((f) => f.horizon === horizon);
          return list;
        }
      }
    } catch {}
    let list = Array.from(this.memoryForecasts.values());
    if (targetId) list = list.filter((f) => f.targetId === targetId);
    if (horizon) list = list.filter((f) => f.horizon === horizon);
    return list;
  }

  // Digital Brain
  async getDigitalBrain(userId: string): Promise<DigitalBrainProfileDto | null> {
    try {
      if (db) {
        const rows = await db.select().from(digitalBrains).where(eq(digitalBrains.userId, userId));
        if (rows.length > 0) return rows[0] as unknown as DigitalBrainProfileDto;
      }
    } catch {}
    return this.memoryDigitalBrains.get(userId) || null;
  }

  async upsertDigitalBrain(data: Partial<DigitalBrainProfileDto>): Promise<DigitalBrainProfileDto> {
    const userId = data.userId || randomUUID();
    const existing = await this.getDigitalBrain(userId);
    const record: DigitalBrainProfileDto = {
      id: existing?.id || data.id || randomUUID(),
      userId,
      totalMemoriesCount: data.totalMemoriesCount ?? existing?.totalMemoriesCount ?? 0,
      knowledgeNodesCount: data.knowledgeNodesCount ?? existing?.knowledgeNodesCount ?? 0,
      cognitiveEfficiencyScore: data.cognitiveEfficiencyScore ?? existing?.cognitiveEfficiencyScore ?? 95.0,
      dominantThinkingPatterns: data.dominantThinkingPatterns || existing?.dominantThinkingPatterns || ['Deductive Systems Architecture'],
      recentSyntheses: data.recentSyntheses || existing?.recentSyntheses || [],
      activeGoalsSummary: data.activeGoalsSummary || existing?.activeGoalsSummary || [],
      updatedAt: new Date().toISOString(),
    };
    try {
      if (db) {
        if (existing) {
          await db.update(digitalBrains).set(record as any).where(eq(digitalBrains.userId, userId));
        } else {
          await db.insert(digitalBrains).values(record as any);
        }
      }
    } catch {}
    this.memoryDigitalBrains.set(userId, record);
    return record;
  }

  // AI Strategy Engine
  async createStrategicPlan(data: Partial<StrategicPlanDto>): Promise<StrategicPlanDto> {
    const record: StrategicPlanDto = {
      id: data.id || randomUUID(),
      scope: data.scope || 'enterprise',
      priority: data.priority || StrategicPriority.HIGH,
      horizon: data.horizon || PredictionHorizon.ONE_YEAR,
      title: data.title || 'Strategic Plan',
      strategicNarrative: data.strategicNarrative || '',
      resourceAllocationMap: data.resourceAllocationMap || {},
      milestones: data.milestones || [],
      riskAssessments: data.riskAssessments || [],
      expectedRoiScore: data.expectedRoiScore ?? 90.0,
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(strategicPlans).values(record as any);
      }
    } catch {}
    this.memoryStrategicPlans.set(record.id, record);
    return record;
  }

  async listStrategicPlans(): Promise<StrategicPlanDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(strategicPlans);
        if (rows.length > 0) return rows as unknown as StrategicPlanDto[];
      }
    } catch {}
    return Array.from(this.memoryStrategicPlans.values());
  }

  // Learning & Self-Improvement
  async recordLearningEvolution(data: Partial<LearningEvolutionRecordDto>): Promise<LearningEvolutionRecordDto> {
    const record: LearningEvolutionRecordDto = {
      id: data.id || randomUUID(),
      domain: data.domain || SelfImprovementDomain.AGENT_WEIGHTS,
      targetEntityId: data.targetEntityId || 'entity-1',
      preAdaptationPerformance: data.preAdaptationPerformance ?? 80.0,
      postAdaptationPerformance: data.postAdaptationPerformance ?? 92.0,
      performanceDelta: data.performanceDelta ?? 12.0,
      reinforcementIterations: data.reinforcementIterations ?? 1,
      adaptationSummary: data.adaptationSummary || 'Reinforced learning weights',
      appliedAt: data.appliedAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(learningEvolutionRecords).values(record as any);
      }
    } catch {}
    this.memoryLearning.set(record.id, record);
    return record;
  }

  async recordSelfImprovement(data: Partial<SelfImprovementRecordDto>): Promise<SelfImprovementRecordDto> {
    const record: SelfImprovementRecordDto = {
      id: data.id || randomUUID(),
      domain: data.domain || SelfImprovementDomain.WORKFLOW_ROUTING,
      componentName: data.componentName || 'Core Router',
      optimizationType: data.optimizationType || 'Latency Optimization',
      improvementScore: data.improvementScore ?? 95.0,
      accuracyDelta: data.accuracyDelta ?? 4.5,
      latencyReductionPercent: data.latencyReductionPercent ?? 18.0,
      status: data.status || 'applied',
      createdAt: data.createdAt || new Date().toISOString(),
    };
    try {
      if (db) {
        await db.insert(selfImprovementRecords).values(record as any);
      }
    } catch {}
    this.memoryImprovements.set(record.id, record);
    return record;
  }

  async listSelfImprovements(): Promise<SelfImprovementRecordDto[]> {
    try {
      if (db) {
        const rows = await db.select().from(selfImprovementRecords);
        if (rows.length > 0) return rows as unknown as SelfImprovementRecordDto[];
      }
    } catch {}
    return Array.from(this.memoryImprovements.values());
  }
}
