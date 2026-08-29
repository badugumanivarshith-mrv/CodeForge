import { pgTable, uuid, text, timestamp, doublePrecision, integer, jsonb, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import {
  startupStageEnum,
  startupCategoryEnum,
  marketRiskLevelEnum,
  incubationPhaseEnum,
  customerPersonaTypeEnum,
  growthChannelEnum,
  ventureHealthStatusEnum,
  startupFundingStageEnum,
  investorTypeEnum,
  startupEventTypeEnum,
} from './enums';
import {
  StartupStage,
  StartupCategory,
  MarketRiskLevel,
  IncubationPhase,
  CustomerPersonaType,
  GrowthChannel,
  VentureHealthStatus,
  StartupFundingStage,
  InvestorType,
  StartupEventType,
} from '@codeforge/shared';

// 1. Startups Core Entity
export const startups = pgTable(
  'startups',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    creatorUserId: uuid('creator_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    tagline: text('tagline').notNull().default('Autonomous AI venture built with CodeForge'),
    category: startupCategoryEnum('category').notNull().default(StartupCategory.AI_DEVTOOLS),
    stage: startupStageEnum('stage').notNull().default(StartupStage.IDEATION),
    problemStatement: text('problem_statement').notNull(),
    solutionDescription: text('solution_description').notNull(),
    targetMarket: text('target_market').notNull(),
    viabilityScore: doublePrecision('viability_score').notNull().default(85.0),
    innovationScore: doublePrecision('innovation_score').notNull().default(90.0),
    readinessScore: doublePrecision('readiness_score').notNull().default(80.0),
    businessPlanSummary: text('business_plan_summary').notNull().default(''),
    currentFundingStage: startupFundingStageEnum('current_funding_stage').notNull().default(StartupFundingStage.PRE_SEED),
    totalRaisedUsd: doublePrecision('total_raised_usd').notNull().default(0),
    valuationUsd: doublePrecision('valuation_usd').notNull().default(2500000),
    monthlyBurnRateUsd: doublePrecision('monthly_burn_rate_usd').notNull().default(15000),
    runwayMonths: integer('runway_months').notNull().default(18),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    creatorIdx: index('startups_creator_idx').on(table.creatorUserId),
    slugIdx: index('startups_slug_idx').on(table.slug),
    categoryIdx: index('startups_category_idx').on(table.category),
    stageIdx: index('startups_stage_idx').on(table.stage),
  })
);

// 2. Startup Ideas
export const startupIdeas = pgTable(
  'startup_ideas',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    creatorUserId: uuid('creator_user_id').references(() => users.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    category: startupCategoryEnum('category').notNull(),
    problemStatement: text('problem_statement').notNull(),
    proposedSolution: text('proposed_solution').notNull(),
    marketOpportunity: text('market_opportunity').notNull(),
    differentiationMoat: text('differentiation_moat').notNull(),
    viabilityScore: doublePrecision('viability_score').notNull().default(85.0),
    marketSizeEstimate: text('market_size_estimate').notNull().default('$10B+ TAM'),
    competitors: jsonb('competitors').$type<string[]>().notNull().default([]),
    suggestedMonetization: jsonb('suggested_monetization').$type<string[]>().notNull().default([]),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index('startup_ideas_category_idx').on(table.category),
    creatorIdx: index('startup_ideas_creator_idx').on(table.creatorUserId),
  })
);

// 3. Market Reports
export const marketReports = pgTable(
  'market_reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startupId: uuid('startup_id').references(() => startups.id, { onDelete: 'set null' }),
    sector: startupCategoryEnum('sector').notNull(),
    tamUsd: doublePrecision('tam_usd').notNull(),
    samUsd: doublePrecision('sam_usd').notNull(),
    somUsd: doublePrecision('som_usd').notNull(),
    cagrPercent: doublePrecision('cagr_percent').notNull().default(22.5),
    marketTrends: jsonb('market_trends').$type<string[]>().notNull().default([]),
    competitiveLandscape: jsonb('competitive_landscape').$type<Array<{ competitorName: string; marketSharePercent: number; strengths: string[]; weaknesses: string[] }>>().notNull().default([]),
    opportunityGaps: jsonb('opportunity_gaps').$type<string[]>().notNull().default([]),
    riskLevel: marketRiskLevelEnum('risk_level').notNull().default(MarketRiskLevel.MODERATE),
    confidenceScore: doublePrecision('confidence_score').notNull().default(88.0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    startupIdx: index('market_reports_startup_idx').on(table.startupId),
    sectorIdx: index('market_reports_sector_idx').on(table.sector),
  })
);

// 4. Customer Personas
export const customerPersonas = pgTable(
  'customer_personas',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startupId: uuid('startup_id').references(() => startups.id, { onDelete: 'cascade' }),
    personaType: customerPersonaTypeEnum('persona_type').notNull(),
    title: text('title').notNull(),
    demographics: jsonb('demographics').$type<{ roleTitle: string; companySize: string; budgetAuthorityUsd: number }>().notNull(),
    painPoints: jsonb('pain_points').$type<string[]>().notNull().default([]),
    buyingMotivations: jsonb('buying_motivations').$type<string[]>().notNull().default([]),
    willingnessToPayMonthlyUsd: doublePrecision('willingness_to_pay_monthly_usd').notNull().default(250),
    userJourneyStages: jsonb('user_journey_stages').$type<Array<{ stage: string; touchpoint: string; frictionPoint: string; delightMoment: string }>>().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    startupIdx: index('customer_personas_startup_idx').on(table.startupId),
    personaTypeIdx: index('customer_personas_type_idx').on(table.personaType),
  })
);

// 5. Product Incubations
export const productIncubations = pgTable(
  'product_incubations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startupId: uuid('startup_id').references(() => startups.id, { onDelete: 'cascade' }).notNull(),
    productName: text('product_name').notNull(),
    phase: incubationPhaseEnum('phase').notNull().default(IncubationPhase.IDEA),
    conceptSummary: text('concept_summary').notNull(),
    mvpFeatureSet: jsonb('mvp_feature_set').$type<Array<{ featureName: string; priority: 'must_have' | 'should_have' | 'nice_to_have'; complexity: 'low' | 'medium' | 'high'; status: string }>>().notNull().default([]),
    validationMetrics: jsonb('validation_metrics').$type<{ userInterviewsConducted: number; prototypeTestCount: number; earlyAccessSignups: number }>().notNull().default({ userInterviewsConducted: 0, prototypeTestCount: 0, earlyAccessSignups: 0 }),
    productMarketFitScore: doublePrecision('pmf_score').notNull().default(78.5),
    retentionEstimatePercent: doublePrecision('retention_estimate_percent').notNull().default(82.0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    startupIdx: index('product_incubations_startup_idx').on(table.startupId),
    phaseIdx: index('product_incubations_phase_idx').on(table.phase),
  })
);

// 6. Venture Portfolios
export const venturePortfolios = pgTable(
  'venture_portfolios',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    creatorUserId: uuid('creator_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    portfolioName: text('portfolio_name').notNull(),
    description: text('description').notNull().default('Autonomous venture investment portfolio'),
    totalVentureCount: integer('total_venture_count').notNull().default(0),
    aggregateValuationUsd: doublePrecision('aggregate_valuation_usd').notNull().default(0),
    totalCapitalDeployedUsd: doublePrecision('total_capital_deployed_usd').notNull().default(0),
    overallHealthScore: doublePrecision('overall_health_score').notNull().default(90.0),
    ventures: jsonb('ventures').$type<Array<{ startupId: string; startupName: string; stage: StartupStage; healthStatus: VentureHealthStatus; valuationUsd: number }>>().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    creatorIdx: index('venture_portfolios_creator_idx').on(table.creatorUserId),
  })
);

// 7. Fundraising Rounds
export const fundraisingRounds = pgTable(
  'fundraising_rounds',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startupId: uuid('startup_id').references(() => startups.id, { onDelete: 'cascade' }).notNull(),
    roundName: text('round_name').notNull(),
    stage: startupFundingStageEnum('stage').notNull().default(StartupFundingStage.SEED),
    targetRaiseUsd: doublePrecision('target_raise_usd').notNull(),
    committedUsd: doublePrecision('committed_usd').notNull().default(0),
    preMoneyValuationUsd: doublePrecision('pre_money_valuation_usd').notNull(),
    postMoneyValuationUsd: doublePrecision('post_money_valuation_usd').notNull(),
    leadInvestorId: uuid('lead_investor_id'),
    pitchDeckUrl: text('pitch_deck_url'),
    readinessScore: doublePrecision('readiness_score').notNull().default(85.0),
    isClosed: boolean('is_closed').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    closedAt: timestamp('closed_at', { withTimezone: true }),
  },
  (table) => ({
    startupIdx: index('fundraising_rounds_startup_idx').on(table.startupId),
    stageIdx: index('fundraising_rounds_stage_idx').on(table.stage),
  })
);

// 8. Investor Profiles
export const investorProfiles = pgTable(
  'investor_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    investorName: text('investor_name').notNull(),
    investorType: investorTypeEnum('investor_type').notNull().default(InvestorType.VENTURE_CAPITAL),
    investmentThesis: text('investment_thesis').notNull(),
    sweetSpotCheckSizeUsd: doublePrecision('sweet_spot_check_size_usd').notNull().default(500000),
    preferredStages: jsonb('preferred_stages').$type<StartupFundingStage[]>().notNull().default([StartupFundingStage.SEED]),
    preferredCategories: jsonb('preferred_categories').$type<StartupCategory[]>().notNull().default([StartupCategory.AI_DEVTOOLS]),
    portfolioCompanyCount: integer('portfolio_company_count').notNull().default(12),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    typeIdx: index('investor_profiles_type_idx').on(table.investorType),
  })
);

// 9. Growth Forecasts
export const growthForecasts = pgTable(
  'growth_forecasts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startupId: uuid('startup_id').references(() => startups.id, { onDelete: 'cascade' }).notNull(),
    primaryChannel: growthChannelEnum('primary_channel').notNull().default(GrowthChannel.PRODUCT_LED),
    monthlyActiveUsersForecast: jsonb('mau_forecast').$type<Array<{ month: number; mau: number }>>().notNull().default([]),
    customerAcquisitionCostUsd: doublePrecision('cac_usd').notNull().default(45.0),
    customerLifetimeValueUsd: doublePrecision('ltv_usd').notNull().default(1200.0),
    ltvCacRatio: doublePrecision('ltv_cac_ratio').notNull().default(26.6),
    monthlyChurnPercent: doublePrecision('monthly_churn_percent').notNull().default(1.8),
    monthlyRevenueForecastUsd: jsonb('mrr_forecast').$type<Array<{ month: number; mrr: number }>>().notNull().default([]),
    viralCoefficient: doublePrecision('viral_coefficient').notNull().default(1.4),
    overallGrowthScore: doublePrecision('overall_growth_score').notNull().default(92.0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    startupIdx: index('growth_forecasts_startup_idx').on(table.startupId),
  })
);

// 10. Startup Metrics
export const startupMetrics = pgTable(
  'startup_metrics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startupId: uuid('startup_id').references(() => startups.id, { onDelete: 'cascade' }).notNull(),
    mrrUsd: doublePrecision('mrr_usd').notNull().default(0),
    arrUsd: doublePrecision('arr_usd').notNull().default(0),
    burnRateMonthlyUsd: doublePrecision('burn_rate_monthly_usd').notNull().default(15000),
    runwayMonths: integer('runway_months').notNull().default(18),
    activeUsers: integer('active_users').notNull().default(100),
    churnRatePercent: doublePrecision('churn_rate_percent').notNull().default(1.5),
    healthStatus: ventureHealthStatusEnum('health_status').notNull().default(VentureHealthStatus.THRIVING),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    startupIdx: index('startup_metrics_startup_idx').on(table.startupId),
  })
);

// 11. Startup Events
export const startupEvents = pgTable(
  'startup_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startupId: uuid('startup_id').references(() => startups.id, { onDelete: 'cascade' }).notNull(),
    eventType: startupEventTypeEnum('event_type').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    startupIdx: index('startup_events_startup_idx').on(table.startupId),
    eventTypeIdx: index('startup_events_type_idx').on(table.eventType),
  })
);

// Relational Definitions
export const startupsRelations = relations(startups, ({ one, many }) => ({
  creator: one(users, {
    fields: [startups.creatorUserId],
    references: [users.id],
  }),
  marketReports: many(marketReports),
  customerPersonas: many(customerPersonas),
  productIncubations: many(productIncubations),
  fundraisingRounds: many(fundraisingRounds),
  growthForecasts: many(growthForecasts),
  metrics: many(startupMetrics),
  events: many(startupEvents),
}));

export const productIncubationsRelations = relations(productIncubations, ({ one }) => ({
  startup: one(startups, {
    fields: [productIncubations.startupId],
    references: [startups.id],
  }),
}));

export const fundraisingRoundsRelations = relations(fundraisingRounds, ({ one }) => ({
  startup: one(startups, {
    fields: [fundraisingRounds.startupId],
    references: [startups.id],
  }),
}));
