import { Request, Response } from 'express';
import { CognitiveCoreRepository } from '../repositories/CognitiveCoreRepository';
import {
  CognitiveEngineService,
  ReasoningEngineService,
  GoalManagementService,
  SelfReflectionService,
  MetacognitionService,
  LearningEvolutionService,
  MemoryEvolutionService,
  CollectiveReasoningService,
  AgentCouncilService,
  CognitiveExecutionFabricService,
  PredictiveIntelligenceService,
  DigitalBrainService,
  StrategyEngineService,
  SelfImprovementService,
} from '../modules/cognitive-core';
import {
  ReasoningStrategy,
  CognitiveMemoryType,
  AgentCouncilType,
  PredictionHorizon,
  SelfImprovementDomain,
} from '@codeforge/shared';

const repo = new CognitiveCoreRepository();

const cognitiveEngine = new CognitiveEngineService(repo);
const reasoningEngine = new ReasoningEngineService(repo);
const goalManager = new GoalManagementService(repo);
const selfReflection = new SelfReflectionService(repo);
const metacognition = new MetacognitionService(repo);
const learningEvolution = new LearningEvolutionService(repo);
const memoryEvolution = new MemoryEvolutionService(repo);
const collectiveReasoning = new CollectiveReasoningService(repo);
const agentCouncil = new AgentCouncilService(repo);
const executionFabric = new CognitiveExecutionFabricService(repo);
const predictiveIntelligence = new PredictiveIntelligenceService(repo);
const digitalBrain = new DigitalBrainService(repo);
const strategyEngine = new StrategyEngineService(repo);
const selfImprovement = new SelfImprovementService(repo);

export class CognitiveCoreController {
  // Command Center Overview
  async getExecutiveOverview(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await cognitiveEngine.getExecutiveOverview(userId);
    res.json({ success: true, data });
  }

  async evaluateCognitiveHealth(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await cognitiveEngine.evaluateCognitiveHealth(userId);
    res.json({ success: true, data });
  }

  // Goals
  async listGoals(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await goalManager.listGoals(userId);
    res.json({ success: true, data });
  }

  async createGoal(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await goalManager.createAndDecomposeGoal({
      userId,
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      targetHorizon: req.body.targetHorizon,
      subgoalTitles: req.body.subgoalTitles,
    });
    res.status(201).json({ success: true, data });
  }

  async getGoal(req: Request, res: Response): Promise<void> {
    const data = await goalManager.getGoal(req.params.id);
    if (!data) {
      res.status(404).json({ success: false, error: { message: 'Goal not found' } });
      return;
    }
    res.json({ success: true, data });
  }

  // Reasoning
  async executeReasoningTrace(req: Request, res: Response): Promise<void> {
    const data = await reasoningEngine.executeReasoningTrace({
      goalId: req.body.goalId,
      strategy: req.body.strategy || ReasoningStrategy.FIRST_PRINCIPLES,
      inputPrompt: req.body.inputPrompt || 'Synthesize optimal solution',
    });
    res.status(201).json({ success: true, data });
  }

  async listReasoningTraces(req: Request, res: Response): Promise<void> {
    const goalId = req.query.goalId as string | undefined;
    const data = await reasoningEngine.listTraces(goalId);
    res.json({ success: true, data });
  }

  // Memory
  async listMemories(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const memoryType = req.query.memoryType as CognitiveMemoryType | undefined;
    const data = await memoryEvolution.getMemories(userId, memoryType);
    res.json({ success: true, data });
  }

  async storeMemory(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await memoryEvolution.storeMemory({
      userId,
      memoryType: req.body.memoryType || CognitiveMemoryType.EPISODIC,
      conceptKey: req.body.conceptKey,
      content: req.body.content,
      contextSummary: req.body.contextSummary,
      importanceWeight: req.body.importanceWeight,
    });
    res.status(201).json({ success: true, data });
  }

  async consolidateMemories(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await memoryEvolution.consolidateMemories(userId);
    res.json({ success: true, data });
  }

  // Councils & Debates
  async listCouncils(req: Request, res: Response): Promise<void> {
    const type = req.query.councilType as AgentCouncilType | undefined;
    const data = await agentCouncil.listCouncils(type);
    res.json({ success: true, data });
  }

  async initiateDebate(req: Request, res: Response): Promise<void> {
    const data = await collectiveReasoning.initiateDebate({
      councilId: req.body.councilId,
      topic: req.body.topic,
      perspectives: req.body.perspectives || [],
    });
    res.status(201).json({ success: true, data });
  }

  async castVote(req: Request, res: Response): Promise<void> {
    const data = await collectiveReasoning.castVote({
      debateId: req.params.debateId,
      agentId: req.body.agentId || 'agent-voter',
      voteOption: req.body.voteOption || 'aye',
      rationale: req.body.rationale || 'Support consensus',
      weight: req.body.weight,
    });
    res.status(201).json({ success: true, data });
  }

  async resolveConsensus(req: Request, res: Response): Promise<void> {
    const data = await collectiveReasoning.resolveConsensus(req.params.debateId);
    if (!data) {
      res.status(404).json({ success: false, error: { message: 'Debate not found' } });
      return;
    }
    res.json({ success: true, data });
  }

  // Execution Loops
  async runExecutionLoop(req: Request, res: Response): Promise<void> {
    const data = await executionFabric.runExecutionLoop(req.body.goalId, req.body.maxIterations);
    res.status(201).json({ success: true, data });
  }

  // Predictive Intelligence
  async generateForecast(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await predictiveIntelligence.generateForecast({
      targetScope: req.body.targetScope || 'user',
      targetId: req.body.targetId || userId,
      horizon: req.body.horizon || PredictionHorizon.THIRTY_DAYS,
    });
    res.status(201).json({ success: true, data });
  }

  async listForecasts(req: Request, res: Response): Promise<void> {
    const targetId = req.query.targetId as string | undefined;
    const horizon = req.query.horizon as PredictionHorizon | undefined;
    const data = await predictiveIntelligence.listForecasts(targetId, horizon);
    res.json({ success: true, data });
  }

  // Digital Brain
  async getBrainProfile(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await digitalBrain.getBrainProfile(userId);
    res.json({ success: true, data });
  }

  async explainReasoning(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await digitalBrain.explainReasoning(userId, req.body.decisionContext || 'General Strategy');
    res.json({ success: true, data });
  }

  // AI Strategy Engine
  async createStrategicPlan(req: Request, res: Response): Promise<void> {
    const data = await strategyEngine.createStrategicPlan({
      scope: req.body.scope,
      priority: req.body.priority,
      horizon: req.body.horizon,
      title: req.body.title,
      strategicNarrative: req.body.strategicNarrative,
      resourceAllocationMap: req.body.resourceAllocationMap,
    });
    res.status(201).json({ success: true, data });
  }

  async listStrategicPlans(req: Request, res: Response): Promise<void> {
    const data = await strategyEngine.listStrategicPlans();
    res.json({ success: true, data });
  }

  // Self-Reflection
  async generateReflection(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user?.id || 'demo-user';
    const data = await selfReflection.generateReflection({
      entityType: req.body.entityType,
      entityId: req.body.entityId || userId,
      recentActionSummaries: req.body.recentActionSummaries,
    });
    res.status(201).json({ success: true, data });
  }

  async listReflections(req: Request, res: Response): Promise<void> {
    const entityId = req.query.entityId as string | undefined;
    const data = await selfReflection.listReflections(entityId);
    res.json({ success: true, data });
  }

  // Self-Improvement
  async triggerOptimization(req: Request, res: Response): Promise<void> {
    const data = await selfImprovement.triggerOptimization({
      domain: req.body.domain || SelfImprovementDomain.WORKFLOW_ROUTING,
      componentName: req.body.componentName || 'Router',
      optimizationType: req.body.optimizationType || 'Optimization Pass',
    });
    res.status(201).json({ success: true, data });
  }

  async listImprovements(req: Request, res: Response): Promise<void> {
    const data = await selfImprovement.listImprovements();
    res.json({ success: true, data });
  }
}
