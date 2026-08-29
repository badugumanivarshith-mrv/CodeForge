import { pgTable, text, timestamp, uuid, integer, doublePrecision, boolean, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';
import {
  dealStageEnum,
  dealPriorityEnum,
  diligenceCategoryEnum,
  diligenceRiskSeverityEnum,
  investmentRecommendationEnum,
  committeeTypeEnum,
  committeeVoteTypeEnum,
  fundTypeEnum,
  fundStatusEnum,
  exitTypeEnum,
  exitStatusEnum,
  allocationStrategyEnum,
  syndicateRoleEnum,
  startupCategoryEnum,
  startupStageEnum,
  ventureHealthStatusEnum,
} from './enums';

// 1. Funds Table
export const funds = pgTable('funds', {
  id: uuid('id').defaultRandom().primaryKey(),
  fundName: text('fund_name').notNull(),
  fundType: fundTypeEnum('fund_type').notNull(),
  status: fundStatusEnum('status').notNull(),
  targetSizeUsd: doublePrecision('target_size_usd').notNull(),
  committedCapitalUsd: doublePrecision('committed_capital_usd').default(0).notNull(),
  deployedCapitalUsd: doublePrecision('deployed_capital_usd').default(0).notNull(),
  reserveCapitalUsd: doublePrecision('reserve_capital_usd').default(0).notNull(),
  vintageYear: integer('vintage_year').notNull(),
  managementFeePercent: doublePrecision('management_fee_percent').default(2.0).notNull(),
  carriedInterestPercent: doublePrecision('carried_interest_percent').default(20.0).notNull(),
  hurdleRatePercent: doublePrecision('hurdle_rate_percent').default(8.0).notNull(),
  totalInvestments: integer('total_investments').default(0).notNull(),
  activeHoldingsCount: integer('active_holdings_count').default(0).notNull(),
  exitCount: integer('exit_count').default(0).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Deal Flow Table
export const dealFlow = pgTable('deal_flow', {
  id: uuid('id').defaultRandom().primaryKey(),
  startupId: text('startup_id'),
  startupName: text('startup_name').notNull(),
  tagline: text('tagline').notNull(),
  category: startupCategoryEnum('category').notNull(),
  stage: dealStageEnum('stage').notNull(),
  priority: dealPriorityEnum('priority').notNull(),
  source: text('source').notNull(),
  sourceUrl: text('source_url'),
  initialValuationUsd: doublePrecision('initial_valuation_usd').default(0).notNull(),
  targetRaiseUsd: doublePrecision('target_raise_usd').default(0).notNull(),
  tractionSummary: text('traction_summary').notNull(),
  fitScore: doublePrecision('fit_score').default(0).notNull(),
  leadPartnerUserId: uuid('lead_partner_user_id').references(() => users.id, { onDelete: 'set null' }),
  tags: jsonb('tags').$type<string[]>().default([]).notNull(),
  assignedAnalyst: text('assigned_analyst'),
  notes: text('notes'),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Founder Scores Table
export const founderScores = pgTable('founder_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  startupId: text('startup_id').notNull(),
  founderName: text('founder_name').notNull(),
  technicalDepthScore: doublePrecision('technical_depth_score').notNull(),
  convictionScore: doublePrecision('conviction_score').notNull(),
  executionVelocityScore: doublePrecision('execution_velocity_score').notNull(),
  domainExpertiseScore: doublePrecision('domain_expertise_score').notNull(),
  resilienceScore: doublePrecision('resilience_score').notNull(),
  compositeScore: doublePrecision('composite_score').notNull(),
  strengths: jsonb('strengths').$type<string[]>().default([]).notNull(),
  growthAreas: jsonb('growth_areas').$type<string[]>().default([]).notNull(),
  assessmentNarrative: text('assessment_narrative').notNull(),
  evaluatedAt: timestamp('evaluated_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 4. Opportunity Scores Table
export const opportunityScores = pgTable('opportunity_scores', {
  id: uuid('id').defaultRandom().primaryKey(),
  startupId: text('startup_id').notNull(),
  marketTamScore: doublePrecision('market_tam_score').notNull(),
  timingMoatScore: doublePrecision('timing_moat_score').notNull(),
  competitiveAdvantageScore: doublePrecision('competitive_advantage_score').notNull(),
  unitEconomicsPotentialScore: doublePrecision('unit_economics_potential_score').notNull(),
  scalabilityScore: doublePrecision('scalability_score').notNull(),
  compositeScore: doublePrecision('composite_score').notNull(),
  keyDrivers: jsonb('key_drivers').$type<string[]>().default([]).notNull(),
  majorRisks: jsonb('major_risks').$type<string[]>().default([]).notNull(),
  scoredAt: timestamp('scored_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Due Diligence Reports Table
export const dueDiligenceReports = pgTable('due_diligence_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  dealId: text('deal_id'),
  startupId: text('startup_id').notNull(),
  overallScore: doublePrecision('overall_score').notNull(),
  recommendation: investmentRecommendationEnum('recommendation').notNull(),
  executiveSummary: text('executive_summary').notNull(),
  dimensions: jsonb('dimensions').default([]).notNull(),
  detectedRisks: jsonb('detected_risks').default([]).notNull(),
  redFlags: jsonb('red_flags').$type<string[]>().default([]).notNull(),
  greenLights: jsonb('green_lights').$type<string[]>().default([]).notNull(),
  completedAt: timestamp('completed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Investment Decisions Table
export const investmentDecisions = pgTable('investment_decisions', {
  id: uuid('id').defaultRandom().primaryKey(),
  dealId: text('deal_id'),
  startupId: text('startup_id').notNull(),
  fundId: text('fund_id'),
  recommendation: investmentRecommendationEnum('recommendation').notNull(),
  quorumMet: boolean('quorum_met').default(true).notNull(),
  totalVotes: integer('total_votes').notNull(),
  yesVotes: integer('yes_votes').notNull(),
  noVotes: integer('no_votes').notNull(),
  conditionalVotes: integer('conditional_votes').default(0).notNull(),
  abstainVotes: integer('abstain_votes').default(0).notNull(),
  convictionScore: doublePrecision('conviction_score').notNull(),
  proposedInvestmentUsd: doublePrecision('proposed_investment_usd').notNull(),
  proposedValuationUsd: doublePrecision('proposed_valuation_usd').notNull(),
  keyDebatePoints: jsonb('key_debate_points').$type<string[]>().default([]).notNull(),
  contradictionsDetected: jsonb('contradictions_detected').$type<string[]>().default([]).notNull(),
  consensusRationale: text('consensus_rationale').notNull(),
  votes: jsonb('votes').default([]).notNull(),
  decidedAt: timestamp('decided_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Portfolio Holdings Table
export const portfolioHoldings = pgTable('portfolio_holdings', {
  id: uuid('id').defaultRandom().primaryKey(),
  fundId: text('fund_id').notNull(),
  startupId: text('startup_id').notNull(),
  startupName: text('startup_name').notNull(),
  category: startupCategoryEnum('category').notNull(),
  stage: startupStageEnum('stage').notNull(),
  initialInvestedUsd: doublePrecision('initial_invested_usd').notNull(),
  followOnInvestedUsd: doublePrecision('follow_on_invested_usd').default(0).notNull(),
  totalInvestedUsd: doublePrecision('total_invested_usd').notNull(),
  ownershipPercent: doublePrecision('ownership_percent').notNull(),
  currentValuationUsd: doublePrecision('current_valuation_usd').notNull(),
  holdingValueUsd: doublePrecision('holding_value_usd').notNull(),
  moic: doublePrecision('moic').default(1.0).notNull(),
  irr: doublePrecision('irr').default(0).notNull(),
  healthStatus: ventureHealthStatusEnum('health_status').notNull(),
  boardSeat: boolean('board_seat').default(false).notNull(),
  proRataRights: boolean('pro_rata_rights').default(true).notNull(),
  acquiredAt: timestamp('acquired_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 8. Fund Metrics Table
export const fundMetrics = pgTable('fund_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  fundId: text('fund_id').notNull(),
  totalCommittedUsd: doublePrecision('total_committed_usd').notNull(),
  totalCalledUsd: doublePrecision('total_called_usd').notNull(),
  totalDistributedUsd: doublePrecision('total_distributed_usd').notNull(),
  navUsd: doublePrecision('nav_usd').notNull(),
  dpi: doublePrecision('dpi').notNull(),
  rvpi: doublePrecision('rvpi').notNull(),
  tvpi: doublePrecision('tvpi').notNull(),
  grossIrrPercent: doublePrecision('gross_irr_percent').notNull(),
  netIrrPercent: doublePrecision('net_irr_percent').notNull(),
  moic: doublePrecision('moic').notNull(),
  calculatedAt: timestamp('calculated_at').defaultNow().notNull(),
});

// 9. Exit Simulations Table
export const exitSimulations = pgTable('exit_simulations', {
  id: uuid('id').defaultRandom().primaryKey(),
  fundId: text('fund_id').notNull(),
  startupId: text('startup_id').notNull(),
  startupName: text('startup_name').notNull(),
  exitType: exitTypeEnum('exit_type').notNull(),
  targetAcquirerOrExchange: text('target_acquirer_or_exchange').notNull(),
  simulatedExitValuationUsd: doublePrecision('simulated_exit_valuation_usd').notNull(),
  expectedProceedsUsd: doublePrecision('expected_proceeds_usd').notNull(),
  fundReturnMultiple: doublePrecision('fund_return_multiple').notNull(),
  netProfitUsd: doublePrecision('net_profit_usd').notNull(),
  carryGeneratedUsd: doublePrecision('carry_generated_usd').notNull(),
  timelineMonths: integer('timeline_months').notNull(),
  confidenceRating: doublePrecision('confidence_rating').notNull(),
  waterfallSummary: jsonb('waterfall_summary').default([]).notNull(),
  simulatedAt: timestamp('simulated_at').defaultNow().notNull(),
});

// 10. LP Profiles Table
export const lpProfiles = pgTable('lp_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  lpName: text('lp_name').notNull(),
  lpType: text('lp_type').notNull(),
  committedTotalUsd: doublePrecision('committed_total_usd').notNull(),
  activeFunds: jsonb('active_funds').$type<string[]>().default([]).notNull(),
  preferredSectors: jsonb('preferred_sectors').default([]).notNull(),
  coInvestmentAppetite: boolean('co_investment_appetite').default(true).notNull(),
  relationshipHealth: doublePrecision('relationship_health').default(90.0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 11. Syndicates Table
export const syndicates = pgTable('syndicates', {
  id: uuid('id').defaultRandom().primaryKey(),
  dealId: text('deal_id'),
  startupId: text('startup_id').notNull(),
  syndicateName: text('syndicate_name').notNull(),
  leadInvestorId: text('lead_investor_id').notNull(),
  targetRaiseUsd: doublePrecision('target_raise_usd').notNull(),
  committedUsd: doublePrecision('committed_usd').default(0).notNull(),
  allocationSpots: integer('allocation_spots').default(20).notNull(),
  carryPercent: doublePrecision('carry_percent').default(10.0).notNull(),
  members: jsonb('members').default([]).notNull(),
  status: text('status').default('OPEN').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 12. Capital Allocation Plans Table
export const capitalAllocationPlans = pgTable('capital_allocation_plans', {
  id: uuid('id').defaultRandom().primaryKey(),
  fundId: text('fund_id').notNull(),
  strategy: allocationStrategyEnum('strategy').notNull(),
  availableCapitalUsd: doublePrecision('available_capital_usd').notNull(),
  newDealsAllocationUsd: doublePrecision('new_deals_allocation_usd').notNull(),
  followOnReserveUsd: doublePrecision('follow_on_reserve_usd').notNull(),
  contingencyBufferUsd: doublePrecision('contingency_buffer_usd').notNull(),
  allocationsByStage: jsonb('allocations_by_stage').default({}).notNull(),
  allocationsBySector: jsonb('allocations_by_sector').default({}).notNull(),
  scenarioSensitivities: jsonb('scenario_sensitivities').default([]).notNull(),
  optimizedAt: timestamp('optimized_at').defaultNow().notNull(),
});
