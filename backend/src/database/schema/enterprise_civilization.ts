import { pgTable, uuid, text, timestamp, doublePrecision, integer, jsonb, boolean, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import {
  organizationCivilizationTypeEnum,
  digitalEmployeeRoleEnum,
  employeeEmploymentStatusEnum,
  companyStageEnum,
  productLifecycleStageEnum,
  enterpriseFederationTypeEnum,
  investmentReadinessTierEnum,
  executionNetworkTaskPriorityEnum,
  executionNetworkTaskStatusEnum,
  economicSimulationScenarioEnum,
} from './enums';
import {
  EmployeeEmploymentStatus,
  ProductLifecycleStage,
  InvestmentReadinessTier,
  ExecutionNetworkTaskPriority,
  ExecutionNetworkTaskStatus,
  CompanyStage,
  EconomicSimulationScenario,
} from '@codeforge/shared';

// 1. Civilization Organizations
export const civilizationOrganizations = pgTable(
  'civilization_organizations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    creatorUserId: uuid('creator_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    organizationType: organizationCivilizationTypeEnum('organization_type').notNull(),
    missionStatement: text('mission_statement').notNull(),
    headquartersRegion: text('headquarters_region').notNull().default('Global-Autonomous-Mesh'),
    autonomousOperatingStatus: text('autonomous_operating_status').notNull().default('ACTIVE_OPTIMAL'),
    totalDepartmentsCount: integer('total_departments_count').notNull().default(0),
    totalWorkforceHeadcount: integer('total_workforce_headcount').notNull().default(0),
    organizationalEfficiencyScore: doublePrecision('organizational_efficiency_score').notNull().default(95.0),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    creatorIdx: index('civ_org_creator_idx').on(table.creatorUserId),
    slugIdx: index('civ_org_slug_idx').on(table.slug),
    typeIdx: index('civ_org_type_idx').on(table.organizationType),
  })
);

// 2. Civilization Departments
export const civilizationDepartments = pgTable(
  'civilization_departments',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    charter: text('charter').notNull(),
    leadEmployeeId: uuid('lead_employee_id'),
    allocatedBudgetTokens: integer('allocated_budget_tokens').notNull().default(1000000),
    efficiencyRating: doublePrecision('efficiency_rating').notNull().default(95.0),
    teamsCount: integer('teams_count').notNull().default(0),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_dept_org_idx').on(table.organizationId),
  })
);

// 3. Civilization Teams
export const civilizationTeams = pgTable(
  'civilization_teams',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    departmentId: uuid('department_id').references(() => civilizationDepartments.id, { onDelete: 'cascade' }).notNull(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    focusArea: text('focus_area').notNull(),
    leadEmployeeId: uuid('lead_employee_id'),
    memberCount: integer('member_count').notNull().default(0),
    activeProjectsCount: integer('active_projects_count').notNull().default(0),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    deptIdx: index('civ_team_dept_idx').on(table.departmentId),
    orgIdx: index('civ_team_org_idx').on(table.organizationId),
  })
);

// 4. Civilization Digital Employees
export const civilizationDigitalEmployees = pgTable(
  'civilization_digital_employees',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    departmentId: uuid('department_id').references(() => civilizationDepartments.id, { onDelete: 'set null' }),
    teamId: uuid('team_id').references(() => civilizationTeams.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    role: digitalEmployeeRoleEnum('role').notNull(),
    status: employeeEmploymentStatusEnum('status').notNull().default(EmployeeEmploymentStatus.ACTIVE),
    seniorityTier: text('seniority_tier').notNull().default('Principal Autonomous Agent'),
    capabilities: jsonb('capabilities').$type<string[]>().notNull().default([]),
    primarySpecialization: text('primary_specialization').notNull(),
    activeAssignedTaskId: uuid('active_assigned_task_id'),
    completedTasksCount: integer('completed_tasks_count').notNull().default(0),
    velocityScore: doublePrecision('velocity_score').notNull().default(98.5),
    accuracyScore: doublePrecision('accuracy_score').notNull().default(99.1),
    collaborationIndex: doublePrecision('collaboration_index').notNull().default(96.0),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_emp_org_idx').on(table.organizationId),
    roleIdx: index('civ_emp_role_idx').on(table.role),
    statusIdx: index('civ_emp_status_idx').on(table.status),
  })
);

// 5. Civilization Enterprise Projects
export const civilizationEnterpriseProjects = pgTable(
  'civilization_enterprise_projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    departmentId: uuid('department_id').references(() => civilizationDepartments.id, { onDelete: 'set null' }),
    teamId: uuid('team_id').references(() => civilizationTeams.id, { onDelete: 'set null' }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    status: text('status').notNull().default('IN_PROGRESS'),
    targetDeadline: timestamp('target_deadline', { withTimezone: true }),
    progressPercentage: doublePrecision('progress_percentage').notNull().default(0.0),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_proj_org_idx').on(table.organizationId),
  })
);

// 6. Civilization Product Portfolios
export const civilizationProductPortfolios = pgTable(
  'civilization_product_portfolios',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    productName: text('product_name').notNull(),
    lifecycleStage: productLifecycleStageEnum('lifecycle_stage').notNull().default(ProductLifecycleStage.DISCOVERY),
    targetPersona: text('target_persona').notNull(),
    coreDifferentiator: text('core_differentiator').notNull(),
    monthlyActiveUsersEstimate: integer('monthly_active_users_estimate').notNull().default(0),
    productHealthScore: doublePrecision('product_health_score').notNull().default(95.0),
    featuresRoadmap: jsonb('features_roadmap').$type<Array<{ title: string; releaseTarget: string; status: string }>>().notNull().default([]),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_prod_org_idx').on(table.organizationId),
    stageIdx: index('civ_prod_stage_idx').on(table.lifecycleStage),
  })
);

// 7. Civilization Investment Records
export const civilizationInvestmentRecords = pgTable(
  'civilization_investment_records',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    companyBlueprintId: uuid('company_blueprint_id').notNull(),
    fundingRound: text('funding_round').notNull(),
    targetAmountUsd: doublePrecision('target_amount_usd').notNull(),
    committedAmountUsd: doublePrecision('committed_amount_usd').notNull().default(0),
    preMoneyValuationUsd: doublePrecision('pre_money_valuation_usd').notNull(),
    leadInvestorEntity: text('lead_investor_entity').notNull(),
    investorPitchDeckSummary: text('investor_pitch_deck_summary').notNull(),
    readinessTier: investmentReadinessTierEnum('readiness_tier').notNull().default(InvestmentReadinessTier.TIER_2_INVESTABLE),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    blueprintIdx: index('civ_inv_blueprint_idx').on(table.companyBlueprintId),
    tierIdx: index('civ_inv_tier_idx').on(table.readinessTier),
  })
);

// 8. Civilization Enterprise Forecasts
export const civilizationEnterpriseForecasts = pgTable(
  'civilization_enterprise_forecasts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    forecastPeriod: text('forecast_period').notNull(),
    projectedRevenueUsd: doublePrecision('projected_revenue_usd').notNull(),
    projectedCostsUsd: doublePrecision('projected_costs_usd').notNull(),
    headcountTrend: text('headcount_trend').notNull().default('+15% / Qtr'),
    confidenceIntervalPercent: doublePrecision('confidence_interval_percent').notNull().default(92.5),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_forecast_org_idx').on(table.organizationId),
  })
);

// 9. Civilization Workforce Metrics
export const civilizationWorkforceMetrics = pgTable(
  'civilization_workforce_metrics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    activeHeadcount: integer('active_headcount').notNull(),
    utilizationRate: doublePrecision('utilization_rate').notNull(),
    velocityAverage: doublePrecision('velocity_average').notNull(),
    accuracyAverage: doublePrecision('accuracy_average').notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_metrics_org_idx').on(table.organizationId),
  })
);

// 10. Civilization Execution Networks
export const civilizationExecutionNetworks = pgTable(
  'civilization_execution_networks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    projectId: uuid('project_id'),
    taskTitle: text('task_title').notNull(),
    assignedEmployeeId: uuid('assigned_employee_id').references(() => civilizationDigitalEmployees.id, { onDelete: 'set null' }),
    priority: executionNetworkTaskPriorityEnum('priority').notNull().default(ExecutionNetworkTaskPriority.NORMAL),
    status: executionNetworkTaskStatusEnum('status').notNull().default(ExecutionNetworkTaskStatus.QUEUED),
    dependencyTaskIds: jsonb('dependency_task_ids').$type<string[]>().notNull().default([]),
    payloadSpec: jsonb('payload_spec').$type<Record<string, any>>().notNull().default({}),
    verificationProofHash: text('verification_proof_hash'),
    executionDurationMs: integer('execution_duration_ms'),
    retryCount: integer('retry_count').notNull().default(0),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_exec_org_idx').on(table.organizationId),
    statusIdx: index('civ_exec_status_idx').on(table.status),
    priorityIdx: index('civ_exec_priority_idx').on(table.priority),
  })
);

// 11. Civilization Enterprise Events
export const civilizationEnterpriseEvents = pgTable(
  'civilization_enterprise_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    eventType: text('event_type').notNull(),
    severity: text('severity').notNull().default('INFO'),
    title: text('title').notNull(),
    description: text('description').notNull(),
    actorId: text('actor_id').notNull().default('system-autonomous-orchestrator'),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_event_org_idx').on(table.organizationId),
  })
);

// 12. Civilization Enterprise Federations
export const civilizationEnterpriseFederations = pgTable(
  'civilization_enterprise_federations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    initiatorOrgId: uuid('initiator_org_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    partnerOrgId: uuid('partner_org_id').references(() => civilizationOrganizations.id, { onDelete: 'cascade' }).notNull(),
    federationType: enterpriseFederationTypeEnum('federation_type').notNull(),
    treatyTitle: text('treaty_title').notNull(),
    sharedResourcesDescription: text('shared_resources_description').notNull(),
    governanceTerms: text('governance_terms').notNull(),
    activeStatus: boolean('active_status').notNull().default(true),
    jointProjectsCount: integer('joint_projects_count').notNull().default(0),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    initIdx: index('civ_fed_init_idx').on(table.initiatorOrgId),
    partnerIdx: index('civ_fed_partner_idx').on(table.partnerOrgId),
  })
);

// 13. Civilization Company Blueprints
export const civilizationCompanyBlueprints = pgTable(
  'civilization_company_blueprints',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    creatorUserId: uuid('creator_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    companyName: text('company_name').notNull(),
    tagline: text('tagline').notNull(),
    stage: companyStageEnum('stage').notNull().default(CompanyStage.IDEATION),
    targetMarket: text('target_market').notNull(),
    valueProposition: text('value_proposition').notNull(),
    businessModelCanvas: jsonb('business_model_canvas').$type<{
      keyPartners: string[];
      keyActivities: string[];
      valuePropositions: string[];
      customerRelationships: string[];
      customerSegments: string[];
      costStructure: string[];
      revenueStreams: string[];
    }>().notNull(),
    projectedAnnualRunRateUsd: doublePrecision('projected_annual_run_rate_usd').notNull().default(1000000),
    breakEvenTimelineMonths: integer('break_even_timeline_months').notNull().default(14),
    readinessTier: investmentReadinessTierEnum('readiness_tier').notNull().default(InvestmentReadinessTier.TIER_2_INVESTABLE),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    creatorIdx: index('civ_blueprint_creator_idx').on(table.creatorUserId),
    stageIdx: index('civ_blueprint_stage_idx').on(table.stage),
  })
);

// 14. Civilization Economic Simulations
export const civilizationEconomicSimulations = pgTable(
  'civilization_economic_simulations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    organizationId: uuid('organization_id').references(() => civilizationOrganizations.id, { onDelete: 'set null' }),
    scenario: economicSimulationScenarioEnum('scenario').notNull().default(EconomicSimulationScenario.EQUILIBRIUM),
    inflationPressureIndex: doublePrecision('inflation_pressure_index').notNull().default(2.5),
    talentMarketTightnessIndex: doublePrecision('talent_market_tightness_index').notNull().default(7.8),
    liquidityAvailabilityIndex: doublePrecision('liquidity_availability_index').notNull().default(8.5),
    projectedMarketGrowthRate: doublePrecision('projected_market_growth_rate').notNull().default(18.5),
    simulatedShockImpactSummary: text('simulated_shock_impact_summary').notNull(),
    stressTestScore: doublePrecision('stress_test_score').notNull().default(94.2),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    orgIdx: index('civ_econ_org_idx').on(table.organizationId),
    scenarioIdx: index('civ_econ_scenario_idx').on(table.scenario),
  })
);

// Relations
export const civilizationOrganizationsRelations = relations(civilizationOrganizations, ({ one, many }) => ({
  creator: one(users, {
    fields: [civilizationOrganizations.creatorUserId],
    references: [users.id],
  }),
  departments: many(civilizationDepartments),
  teams: many(civilizationTeams),
  digitalEmployees: many(civilizationDigitalEmployees),
  projects: many(civilizationEnterpriseProjects),
  productPortfolios: many(civilizationProductPortfolios),
  forecasts: many(civilizationEnterpriseForecasts),
  workforceMetrics: many(civilizationWorkforceMetrics),
  executionNetworks: many(civilizationExecutionNetworks),
  events: many(civilizationEnterpriseEvents),
  economicSimulations: many(civilizationEconomicSimulations),
}));

export const civilizationDepartmentsRelations = relations(civilizationDepartments, ({ one, many }) => ({
  organization: one(civilizationOrganizations, {
    fields: [civilizationDepartments.organizationId],
    references: [civilizationOrganizations.id],
  }),
  teams: many(civilizationTeams),
  digitalEmployees: many(civilizationDigitalEmployees),
}));

export const civilizationTeamsRelations = relations(civilizationTeams, ({ one, many }) => ({
  department: one(civilizationDepartments, {
    fields: [civilizationTeams.departmentId],
    references: [civilizationDepartments.id],
  }),
  organization: one(civilizationOrganizations, {
    fields: [civilizationTeams.organizationId],
    references: [civilizationOrganizations.id],
  }),
  digitalEmployees: many(civilizationDigitalEmployees),
}));
