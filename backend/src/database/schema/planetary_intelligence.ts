import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  jsonb,
  integer,
  doublePrecision,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import {
  planetaryTwinTypeEnum,
  civilizationHealthTierEnum,
  governanceCouncilTypeEnum,
  policyStatusEnum,
  innovationDomainEnum,
  federationProtocolEnum,
  agentFederationStatusEnum,
  economicSignalTypeEnum,
  foresightHorizonEnum,
  planetaryEventCategoryEnum,
} from './enums';
import {
  CivilizationHealthTier,
  FederationProtocol,
  AgentFederationStatus,
  PolicyStatus,
} from '@codeforge/shared';

// 1. Civilization Metrics Table
export const civilizationMetrics = pgTable(
  'civilization_metrics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    civilizationHealthScore: doublePrecision('civilization_health_score').notNull().default(100.0),
    healthTier: civilizationHealthTierEnum('health_tier').notNull().default(CivilizationHealthTier.PRISTINE),
    innovationIndex: doublePrecision('innovation_index').notNull().default(85.0),
    knowledgeGrowthIndex: doublePrecision('knowledge_growth_index').notNull().default(90.0),
    economicActivityIndex: doublePrecision('economic_activity_index').notNull().default(88.0),
    workforceReadinessIndex: doublePrecision('workforce_readiness_index').notNull().default(92.0),
    researchProductivityIndex: doublePrecision('research_productivity_index').notNull().default(87.0),
    recordedAt: timestamp('recorded_at').defaultNow().notNull(),
  },
  (table) => ({
    recordedAtIdx: index('civ_metrics_recorded_at_idx').on(table.recordedAt),
    healthTierIdx: index('civ_metrics_health_tier_idx').on(table.healthTier),
  })
);

// 2. Civilization Reports Table
export const civilizationReports = pgTable(
  'civilization_reports',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    summary: text('summary').notNull(),
    metricsSnapshot: jsonb('metrics_snapshot').notNull().default({}),
    growthForecasts: jsonb('growth_forecasts').notNull().default([]),
    opportunityMap: jsonb('opportunity_map').notNull().default([]),
    riskMap: jsonb('risk_map').notNull().default([]),
    generatedAt: timestamp('generated_at').defaultNow().notNull(),
  },
  (table) => ({
    generatedAtIdx: index('civ_reports_generated_at_idx').on(table.generatedAt),
  })
);

// 3. Planetary Digital Twins Table
export const planetaryTwins = pgTable(
  'planetary_twins',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    twinType: planetaryTwinTypeEnum('twin_type').notNull(),
    entityName: varchar('entity_name', { length: 255 }).notNull(),
    stateSnapshot: jsonb('state_snapshot').notNull().default({}),
    fidelityScore: doublePrecision('fidelity_score').notNull().default(95.0),
    lastSimulatedAt: timestamp('last_simulated_at'),
    syncFrequencySeconds: integer('sync_frequency_seconds').notNull().default(60),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    twinTypeIdx: index('planetary_twin_type_idx').on(table.twinType),
    entityNameIdx: index('planetary_twin_entity_idx').on(table.entityName),
  })
);

// 4. Innovation Records Table
export const innovationRecords = pgTable(
  'innovation_records',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    domain: innovationDomainEnum('domain').notNull(),
    inventorOrganizationId: varchar('inventor_organization_id', { length: 128 }).notNull(),
    patentStatus: varchar('patent_status', { length: 64 }).notNull().default('filed'),
    commercialReadinessScore: doublePrecision('commercial_readiness_score').notNull().default(75.0),
    adoptionForecastPercent: doublePrecision('adoption_forecast_percent').notNull().default(60.0),
    technologyMaturityLevel: integer('technology_maturity_level').notNull().default(5),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    domainIdx: index('innovation_domain_idx').on(table.domain),
    orgIdx: index('innovation_org_idx').on(table.inventorOrganizationId),
  })
);

// 5. Innovation Rankings Table
export const innovationRankings = pgTable(
  'innovation_rankings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    domain: innovationDomainEnum('domain').notNull(),
    velocityScore: doublePrecision('velocity_score').notNull().default(85.0),
    leadingRegion: varchar('leading_region', { length: 128 }).notNull().default('Global Mesh'),
    topInnovationsJson: jsonb('top_innovations_json').notNull().default([]),
    computedAt: timestamp('computed_at').defaultNow().notNull(),
  },
  (table) => ({
    rankingDomainIdx: index('innovation_rankings_domain_idx').on(table.domain),
  })
);

// 6. Research Federations Table
export const researchFederations = pgTable(
  'research_federations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    federationName: varchar('federation_name', { length: 255 }).notNull(),
    leadInstitutionId: varchar('lead_institution_id', { length: 128 }).notNull(),
    memberInstitutionIds: jsonb('member_institution_ids').notNull().default([]),
    focusArea: varchar('focus_area', { length: 255 }).notNull(),
    activeCollaborationsCount: integer('active_collaborations_count').notNull().default(0),
    sharedDatasetsCount: integer('shared_datasets_count').notNull().default(0),
    status: varchar('status', { length: 64 }).notNull().default('active'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    federationNameIdx: index('research_fed_name_idx').on(table.federationName),
    focusAreaIdx: index('research_fed_focus_idx').on(table.focusArea),
  })
);

// 7. Research Collaborations Table
export const researchCollaborations = pgTable(
  'research_collaborations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    federationId: uuid('federation_id')
      .notNull()
      .references(() => researchFederations.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 255 }).notNull(),
    principalInvestigator: varchar('principal_investigator', { length: 255 }).notNull(),
    milestones: jsonb('milestones').notNull().default([]),
    impactScore: doublePrecision('impact_score').notNull().default(90.0),
    validationProof: text('validation_proof').notNull().default(''),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    collabFedIdx: index('research_collab_fed_idx').on(table.federationId),
  })
);

// 8. Economic Signals Table
export const economicSignals = pgTable(
  'economic_signals',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    signalType: economicSignalTypeEnum('signal_type').notNull(),
    sector: varchar('sector', { length: 128 }).notNull(),
    intensityScore: doublePrecision('intensity_score').notNull().default(75.0),
    region: varchar('region', { length: 128 }).notNull().default('Global'),
    metadata: jsonb('metadata').notNull().default({}),
    detectedAt: timestamp('detected_at').defaultNow().notNull(),
  },
  (table) => ({
    signalTypeIdx: index('econ_signal_type_idx').on(table.signalType),
    signalSectorIdx: index('econ_signal_sector_idx').on(table.sector),
  })
);

// 9. Economic Forecasts Table
export const economicForecasts = pgTable(
  'economic_forecasts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    horizonMonths: integer('horizon_months').notNull().default(12),
    talentDemandGrowth: doublePrecision('talent_demand_growth').notNull().default(15.5),
    skillPremiumTrends: jsonb('skill_premium_trends').notNull().default([]),
    macroEconomicHealthScore: doublePrecision('macro_economic_health_score').notNull().default(88.0),
    forecastSummary: text('forecast_summary').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    forecastHorizonIdx: index('econ_forecast_horizon_idx').on(table.horizonMonths),
  })
);

// 10. Agent Federations Table
export const agentFederations = pgTable(
  'agent_federations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    federationName: varchar('federation_name', { length: 255 }).notNull(),
    organizationId: varchar('organization_id', { length: 128 }).notNull(),
    protocol: federationProtocolEnum('protocol').notNull().default(FederationProtocol.MULTI_AGENT_CONSENSUS),
    status: agentFederationStatusEnum('status').notNull().default(AgentFederationStatus.ONLINE),
    participatingAgentCount: integer('participating_agent_count').notNull().default(1),
    totalNegotiationsHandled: integer('total_negotiations_handled').notNull().default(0),
    cooperationIndex: doublePrecision('cooperation_index').notNull().default(98.5),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    agentFedOrgIdx: index('agent_fed_org_idx').on(table.organizationId),
    agentFedStatusIdx: index('agent_fed_status_idx').on(table.status),
  })
);

// 11. Agent Reputation Table
export const agentReputations = pgTable(
  'agent_reputation',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agentId: varchar('agent_id', { length: 128 }).notNull(),
    federationId: uuid('federation_id')
      .notNull()
      .references(() => agentFederations.id, { onDelete: 'cascade' }),
    trustScore: doublePrecision('trust_score').notNull().default(95.0),
    successfulDelegations: integer('successful_delegations').notNull().default(0),
    disputeRate: doublePrecision('dispute_rate').notNull().default(0.0),
    reputationBadge: varchar('reputation_badge', { length: 64 }).notNull().default('Trusted Agent'),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    agentRepIdIdx: index('agent_rep_id_idx').on(table.agentId),
    agentRepFedIdx: index('agent_rep_fed_idx').on(table.federationId),
  })
);

// 12. Governance Policies Table
export const governancePolicies = pgTable(
  'governance_policies',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    title: varchar('title', { length: 255 }).notNull(),
    councilType: governanceCouncilTypeEnum('council_type').notNull(),
    description: text('description').notNull(),
    rules: jsonb('rules').notNull().default([]),
    status: policyStatusEnum('status').notNull().default(PolicyStatus.ACTIVE),
    enactedBy: varchar('enacted_by', { length: 128 }).notNull(),
    complianceScore: doublePrecision('compliance_score').notNull().default(99.0),
    ethicalReviewNotes: text('ethical_review_notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    govCouncilIdx: index('gov_policy_council_idx').on(table.councilType),
    govStatusIdx: index('gov_policy_status_idx').on(table.status),
  })
);

// 13. Policy Simulations Table
export const policySimulations = pgTable(
  'policy_simulations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    policyId: uuid('policy_id')
      .notNull()
      .references(() => governancePolicies.id, { onDelete: 'cascade' }),
    simulationName: varchar('simulation_name', { length: 255 }).notNull(),
    complianceProjectedPercent: doublePrecision('compliance_projected_percent').notNull().default(95.0),
    economicFrictionScore: doublePrecision('economic_friction_score').notNull().default(5.0),
    ethicalAlignmentScore: doublePrecision('ethical_alignment_score').notNull().default(98.0),
    stakeholderImpacts: jsonb('stakeholder_impacts').notNull().default([]),
    forecastedOutcome: text('forecasted_outcome').notNull(),
    simulatedAt: timestamp('simulated_at').defaultNow().notNull(),
  },
  (table) => ({
    policySimPolicyIdx: index('policy_sim_policy_idx').on(table.policyId),
  })
);

// 14. Strategic Forecasts Table
export const strategicForecasts = pgTable(
  'strategic_forecasts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    horizon: foresightHorizonEnum('horizon').notNull(),
    domain: innovationDomainEnum('domain').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    forecastNarrative: text('forecast_narrative').notNull(),
    opportunityRank: integer('opportunity_rank').notNull().default(1),
    riskRank: integer('risk_rank').notNull().default(1),
    confidenceScore: doublePrecision('confidence_score').notNull().default(90.0),
    recommendedPlaybook: jsonb('recommended_playbook').notNull().default([]),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    stratHorizonIdx: index('strat_forecast_horizon_idx').on(table.horizon),
    stratDomainIdx: index('strat_forecast_domain_idx').on(table.domain),
  })
);

// 15. Planetary Events Table
export const planetaryEvents = pgTable(
  'planetary_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    eventCategory: planetaryEventCategoryEnum('event_category').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    entityId: varchar('entity_id', { length: 128 }).notNull(),
    payload: jsonb('payload').notNull().default({}),
    severity: varchar('severity', { length: 32 }).notNull().default('info'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    eventCategoryIdx: index('planetary_event_category_idx').on(table.eventCategory),
    eventEntityIdx: index('planetary_event_entity_idx').on(table.entityId),
  })
);

// Relations
export const researchFederationsRelations = relations(researchFederations, ({ many }) => ({
  collaborations: many(researchCollaborations),
}));

export const researchCollaborationsRelations = relations(researchCollaborations, ({ one }) => ({
  federation: one(researchFederations, {
    fields: [researchCollaborations.federationId],
    references: [researchFederations.id],
  }),
}));

export const agentFederationsRelations = relations(agentFederations, ({ many }) => ({
  reputations: many(agentReputations),
}));

export const agentReputationsRelations = relations(agentReputations, ({ one }) => ({
  federation: one(agentFederations, {
    fields: [agentReputations.federationId],
    references: [agentFederations.id],
  }),
}));

export const governancePoliciesRelations = relations(governancePolicies, ({ many }) => ({
  simulations: many(policySimulations),
}));

export const policySimulationsRelations = relations(policySimulations, ({ one }) => ({
  policy: one(governancePolicies, {
    fields: [policySimulations.policyId],
    references: [governancePolicies.id],
  }),
}));
