import { pgTable, uuid, varchar, text, timestamp, boolean, integer, doublePrecision, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import {
  cognitiveGoalStatusEnum,
  reasoningStrategyEnum,
  cognitiveMemoryTypeEnum,
  agentCouncilTypeEnum,
  consensusStatusEnum,
  predictionHorizonEnum,
  executionLoopStateEnum,
  selfImprovementDomainEnum,
  metacognitionConfidenceEnum,
  strategicPriorityEnum,
} from './enums.js';
import {
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

// 1. Cognitive Goals
export const cognitiveGoals = pgTable('cognitive_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  status: cognitiveGoalStatusEnum('status').notNull().default(CognitiveGoalStatus.PENDING),
  priority: strategicPriorityEnum('priority').notNull().default(StrategicPriority.MEDIUM),
  targetHorizon: predictionHorizonEnum('target_horizon').notNull().default(PredictionHorizon.THIRTY_DAYS),
  completionScore: doublePrecision('completion_score').notNull().default(0.0),
  subgoalsCount: integer('subgoals_count').notNull().default(0),
  activeTracesCount: integer('active_traces_count').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('cognitive_goals_user_id_idx').on(table.userId),
  statusIdx: index('cognitive_goals_status_idx').on(table.status),
  priorityIdx: index('cognitive_goals_priority_idx').on(table.priority),
}));

// 2. Cognitive Subgoals
export const cognitiveSubgoals = pgTable('cognitive_subgoals', {
  id: uuid('id').primaryKey().defaultRandom(),
  goalId: uuid('goal_id').notNull().references(() => cognitiveGoals.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  sequenceOrder: integer('sequence_order').notNull().default(1),
  status: cognitiveGoalStatusEnum('status').notNull().default(CognitiveGoalStatus.PENDING),
  estimatedComplexity: integer('estimated_complexity').notNull().default(1),
  assignedAgentId: varchar('assigned_agent_id', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  goalIdIdx: index('cognitive_subgoals_goal_id_idx').on(table.goalId),
  statusIdx: index('cognitive_subgoals_status_idx').on(table.status),
}));

// 3. Reasoning Traces
export const reasoningTraces = pgTable('reasoning_traces', {
  id: uuid('id').primaryKey().defaultRandom(),
  goalId: uuid('goal_id').references(() => cognitiveGoals.id, { onDelete: 'set null' }),
  strategy: reasoningStrategyEnum('strategy').notNull().default(ReasoningStrategy.FIRST_PRINCIPLES),
  inputPrompt: text('input_prompt').notNull(),
  hypothesisTree: jsonb('hypothesis_tree').notNull().default([]),
  synthesis: text('synthesis').notNull(),
  confidenceScore: doublePrecision('confidence_score').notNull().default(90.0),
  biasAudits: jsonb('bias_audits').notNull().default([]),
  executionTimeMs: integer('execution_time_ms').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  goalIdIdx: index('reasoning_traces_goal_id_idx').on(table.goalId),
  strategyIdx: index('reasoning_traces_strategy_idx').on(table.strategy),
}));

// 4. Metacognitive Evaluations
export const metacognitiveEvaluations = pgTable('metacognitive_evaluations', {
  id: uuid('id').primaryKey().defaultRandom(),
  traceId: uuid('trace_id').notNull().references(() => reasoningTraces.id, { onDelete: 'cascade' }),
  confidenceTier: metacognitionConfidenceEnum('confidence_tier').notNull().default(MetacognitionConfidence.HIGH),
  epistemicUncertainty: doublePrecision('epistemic_uncertainty').notNull().default(0.05),
  heuristicBiasesIdentified: jsonb('heuristic_biases_identified').notNull().default([]),
  suggestedMitigations: jsonb('suggested_mitigations').notNull().default([]),
  calibrationScore: doublePrecision('calibration_score').notNull().default(95.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  traceIdIdx: index('metacognitive_evaluations_trace_id_idx').on(table.traceId),
}));

// 5. Self-Reflection Reports
export const selfReflectionReports = pgTable('self_reflection_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  entityType: varchar('entity_type', { length: 50 }).notNull().default('agent'),
  entityId: varchar('entity_id', { length: 255 }).notNull(),
  observations: jsonb('observations').notNull().default([]),
  identifiedStrengths: jsonb('identified_strengths').notNull().default([]),
  identifiedDeficiencies: jsonb('identified_deficiencies').notNull().default([]),
  lessonsLearned: jsonb('lessons_learned').notNull().default([]),
  actionableAdjustments: jsonb('actionable_adjustments').notNull().default([]),
  impactScore: doublePrecision('impact_score').notNull().default(90.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  entityIdx: index('self_reflection_reports_entity_idx').on(table.entityType, table.entityId),
}));

// 6. Learning Evolution Records
export const learningEvolutionRecords = pgTable('learning_evolution_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  domain: selfImprovementDomainEnum('domain').notNull().default(SelfImprovementDomain.AGENT_WEIGHTS),
  targetEntityId: varchar('target_entity_id', { length: 255 }).notNull(),
  preAdaptationPerformance: doublePrecision('pre_adaptation_performance').notNull().default(80.0),
  postAdaptationPerformance: doublePrecision('post_adaptation_performance').notNull().default(92.0),
  performanceDelta: doublePrecision('performance_delta').notNull().default(12.0),
  reinforcementIterations: integer('reinforcement_iterations').notNull().default(1),
  adaptationSummary: text('adaptation_summary').notNull(),
  appliedAt: timestamp('applied_at').defaultNow().notNull(),
}, (table) => ({
  domainIdx: index('learning_evolution_records_domain_idx').on(table.domain),
  targetEntityIdIdx: index('learning_evolution_records_target_entity_id_idx').on(table.targetEntityId),
}));

// 7. Self-Improvement Records
export const selfImprovementRecords = pgTable('self_improvement_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  domain: selfImprovementDomainEnum('domain').notNull().default(SelfImprovementDomain.WORKFLOW_ROUTING),
  componentName: varchar('component_name', { length: 255 }).notNull(),
  optimizationType: varchar('optimization_type', { length: 100 }).notNull(),
  improvementScore: doublePrecision('improvement_score').notNull().default(95.0),
  accuracyDelta: doublePrecision('accuracy_delta').notNull().default(5.5),
  latencyReductionPercent: doublePrecision('latency_reduction_percent').notNull().default(20.0),
  status: varchar('status', { length: 50 }).notNull().default('applied'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  domainIdx: index('self_improvement_records_domain_idx').on(table.domain),
  componentNameIdx: index('self_improvement_records_component_name_idx').on(table.componentName),
}));

// 8. Memory Records (5 Tiers)
export const memoryRecords = pgTable('memory_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  memoryType: cognitiveMemoryTypeEnum('memory_type').notNull().default(CognitiveMemoryType.EPISODIC),
  conceptKey: varchar('concept_key', { length: 255 }).notNull(),
  content: text('content').notNull(),
  contextSummary: text('context_summary').notNull(),
  importanceWeight: doublePrecision('importance_weight').notNull().default(1.0),
  accessCount: integer('access_count').notNull().default(1),
  decayRate: doublePrecision('decay_rate').notNull().default(0.05),
  lastRecalledAt: timestamp('last_recalled_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('memory_records_user_id_idx').on(table.userId),
  memoryTypeIdx: index('memory_records_memory_type_idx').on(table.memoryType),
  conceptKeyIdx: index('memory_records_concept_key_idx').on(table.conceptKey),
}));

// 9. Memory Consolidations
export const memoryConsolidations = pgTable('memory_consolidations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  consolidatedCount: integer('consolidated_count').notNull().default(0),
  forgottenCount: integer('forgotten_count').notNull().default(0),
  synthesizedConcepts: jsonb('synthesized_concepts').notNull().default([]),
  compressionRatio: doublePrecision('compression_ratio').notNull().default(0.7),
  knowledgeCoherenceScore: doublePrecision('knowledge_coherence_score').notNull().default(95.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('memory_consolidations_user_id_idx').on(table.userId),
}));

// 10. Agent Councils
export const agentCouncils = pgTable('agent_councils', {
  id: uuid('id').primaryKey().defaultRandom(),
  councilType: agentCouncilTypeEnum('council_type').notNull().default(AgentCouncilType.ENGINEERING_COUNCIL),
  councilName: varchar('council_name', { length: 255 }).notNull(),
  leadAgentId: varchar('lead_agent_id', { length: 255 }).notNull(),
  participatingAgentIds: jsonb('participating_agent_ids').notNull().default([]),
  activeDebatesCount: integer('active_debates_count').notNull().default(0),
  consensusRatio: doublePrecision('consensus_ratio').notNull().default(1.0),
  charterStatement: text('charter_statement').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  councilTypeIdx: index('agent_councils_council_type_idx').on(table.councilType),
}));

// 11. Council Debates
export const councilDebates = pgTable('council_debates', {
  id: uuid('id').primaryKey().defaultRandom(),
  councilId: uuid('council_id').notNull().references(() => agentCouncils.id, { onDelete: 'cascade' }),
  topic: text('topic').notNull(),
  status: consensusStatusEnum('status').notNull().default(ConsensusStatus.DELIBERATING),
  perspectives: jsonb('perspectives').notNull().default([]),
  contradictionsDetected: jsonb('contradictions_detected').notNull().default([]),
  convergedSynthesis: text('converged_synthesis'),
  consensusScore: doublePrecision('consensus_score').default(0.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
}, (table) => ({
  councilIdIdx: index('council_debates_council_id_idx').on(table.councilId),
  statusIdx: index('council_debates_status_idx').on(table.status),
}));

// 12. Council Votes
export const councilVotes = pgTable('council_votes', {
  id: uuid('id').primaryKey().defaultRandom(),
  debateId: uuid('debate_id').notNull().references(() => councilDebates.id, { onDelete: 'cascade' }),
  agentId: varchar('agent_id', { length: 255 }).notNull(),
  voteOption: varchar('vote_option', { length: 100 }).notNull(),
  rationale: text('rationale').notNull(),
  weight: doublePrecision('weight').notNull().default(1.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  debateIdIdx: index('council_votes_debate_id_idx').on(table.debateId),
  agentIdIdx: index('council_votes_agent_id_idx').on(table.agentId),
}));

// 13. Execution Loops
export const executionLoops = pgTable('execution_loops', {
  id: uuid('id').primaryKey().defaultRandom(),
  goalId: uuid('goal_id').notNull().references(() => cognitiveGoals.id, { onDelete: 'cascade' }),
  currentState: executionLoopStateEnum('current_state').notNull().default(ExecutionLoopState.EXECUTE),
  iteration: integer('iteration').notNull().default(1),
  maxIterations: integer('max_iterations').notNull().default(5),
  observations: jsonb('observations').notNull().default([]),
  reflectionSummary: text('reflection_summary'),
  appliedImprovements: jsonb('applied_improvements').notNull().default([]),
  hasSucceeded: boolean('has_succeeded').notNull().default(false),
  durationMs: integer('duration_ms').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  goalIdIdx: index('execution_loops_goal_id_idx').on(table.goalId),
  currentStateIdx: index('execution_loops_current_state_idx').on(table.currentState),
}));

// 14. Predictive Forecasts
export const predictiveForecasts = pgTable('predictive_forecasts', {
  id: uuid('id').primaryKey().defaultRandom(),
  targetScope: varchar('target_scope', { length: 50 }).notNull().default('user'),
  targetId: varchar('target_id', { length: 255 }).notNull(),
  horizon: predictionHorizonEnum('horizon').notNull().default(PredictionHorizon.THIRTY_DAYS),
  successProbability: doublePrecision('success_probability').notNull().default(0.85),
  expectedOutcomes: jsonb('expected_outcomes').notNull().default([]),
  riskFactors: jsonb('risk_factors').notNull().default([]),
  predictiveConfidence: doublePrecision('predictive_confidence').notNull().default(90.0),
  actionableRecommendations: jsonb('actionable_recommendations').notNull().default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  targetIdx: index('predictive_forecasts_target_idx').on(table.targetScope, table.targetId),
  horizonIdx: index('predictive_forecasts_horizon_idx').on(table.horizon),
}));

// 15. Digital Brain Profiles
export const digitalBrains = pgTable('digital_brains', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  totalMemoriesCount: integer('total_memories_count').notNull().default(0),
  knowledgeNodesCount: integer('knowledge_nodes_count').notNull().default(0),
  cognitiveEfficiencyScore: doublePrecision('cognitive_efficiency_score').notNull().default(95.0),
  dominantThinkingPatterns: jsonb('dominant_thinking_patterns').notNull().default([]),
  recentSyntheses: jsonb('recent_syntheses').notNull().default([]),
  activeGoalsSummary: jsonb('active_goals_summary').notNull().default([]),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index('digital_brains_user_id_idx').on(table.userId),
}));

// 16. Strategic Plans
export const strategicPlans = pgTable('strategic_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  scope: varchar('scope', { length: 100 }).notNull().default('enterprise'),
  priority: strategicPriorityEnum('priority').notNull().default(StrategicPriority.HIGH),
  horizon: predictionHorizonEnum('horizon').notNull().default(PredictionHorizon.ONE_YEAR),
  title: varchar('title', { length: 255 }).notNull(),
  strategicNarrative: text('strategic_narrative').notNull(),
  resourceAllocationMap: jsonb('resource_allocation_map').notNull().default({}),
  milestones: jsonb('milestones').notNull().default([]),
  riskAssessments: jsonb('risk_assessments').notNull().default([]),
  expectedRoiScore: doublePrecision('expected_roi_score').notNull().default(92.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  scopeIdx: index('strategic_plans_scope_idx').on(table.scope),
  priorityIdx: index('strategic_plans_priority_idx').on(table.priority),
}));

// Relations
export const cognitiveGoalsRelations = relations(cognitiveGoals, ({ one, many }) => ({
  user: one(users, { fields: [cognitiveGoals.userId], references: [users.id] }),
  subgoals: many(cognitiveSubgoals),
  traces: many(reasoningTraces),
  executionLoops: many(executionLoops),
}));

export const cognitiveSubgoalsRelations = relations(cognitiveSubgoals, ({ one }) => ({
  goal: one(cognitiveGoals, { fields: [cognitiveSubgoals.goalId], references: [cognitiveGoals.id] }),
}));

export const reasoningTracesRelations = relations(reasoningTraces, ({ one, many }) => ({
  goal: one(cognitiveGoals, { fields: [reasoningTraces.goalId], references: [cognitiveGoals.id] }),
  metacognitiveEvaluations: many(metacognitiveEvaluations),
}));

export const agentCouncilsRelations = relations(agentCouncils, ({ many }) => ({
  debates: many(councilDebates),
}));

export const councilDebatesRelations = relations(councilDebates, ({ one, many }) => ({
  council: one(agentCouncils, { fields: [councilDebates.councilId], references: [agentCouncils.id] }),
  votes: many(councilVotes),
}));
