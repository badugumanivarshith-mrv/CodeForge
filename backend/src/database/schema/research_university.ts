import { pgTable, text, timestamp, uuid, integer, doublePrecision, boolean, jsonb } from 'drizzle-orm/pg-core';
import {
  AcademicDepartment,
  ResearchProgramStatus,
  LabType,
  LabStatus,
  ExperimentStatus,
  HypothesisStatus,
  DiscoverySignificance,
  PublicationType,
  PublicationStatus,
  PeerReviewRole,
  PeerReviewVerdict,
  GrantType,
  GrantStatus,
  KnowledgeNodeType,
} from '@codeforge/shared';
import {
  academicDepartmentEnum,
  researchProgramStatusEnum,
  labTypeEnum,
  labStatusEnum,
  experimentStatusEnum,
  hypothesisStatusEnum,
  discoverySignificanceEnum,
  publicationTypeEnum,
  publicationStatusEnum,
  peerReviewRoleEnum,
  peerReviewVerdictEnum,
  grantTypeEnum,
  grantStatusEnum,
  knowledgeNodeTypeEnum,
} from './enums';

// 1. Research Programs Table
export const researchPrograms = pgTable('research_programs', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  department: academicDepartmentEnum('department').notNull(),
  leadFacultyAgent: text('lead_faculty_agent').notNull(),
  description: text('description').notNull(),
  status: researchProgramStatusEnum('status').default(ResearchProgramStatus.PROPOSED).notNull(),
  primaryHypothesis: text('primary_hypothesis'),
  targetMilestones: jsonb('target_milestones').$type<string[]>().default([]).notNull(),
  allocatedBudgetUsd: doublePrecision('allocated_budget_usd').default(0).notNull(),
  activeResearchersCount: integer('active_researchers_count').default(1).notNull(),
  publicationsCount: integer('publications_count').default(0).notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Research Projects Table
export const researchProjects = pgTable('research_projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  programId: uuid('program_id').references(() => researchPrograms.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  abstract: text('abstract').notNull(),
  department: academicDepartmentEnum('department').notNull(),
  principalInvestigator: text('principal_investigator').notNull(),
  status: researchProgramStatusEnum('status').default(ResearchProgramStatus.PROPOSED).notNull(),
  startDate: timestamp('start_date').defaultNow().notNull(),
  targetCompletionDate: timestamp('target_completion_date').notNull(),
  metadata: jsonb('metadata').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Digital Research Laboratories Table
export const laboratories = pgTable('laboratories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  labType: labTypeEnum('lab_type').notNull(),
  department: academicDepartmentEnum('department').notNull(),
  status: labStatusEnum('status').default(LabStatus.OPERATIONAL).notNull(),
  computeCapacityTeraflops: doublePrecision('compute_capacity_teraflops').default(100.0).notNull(),
  activeSimulationsCount: integer('active_simulations_count').default(0).notNull(),
  datasetsMountedCount: integer('datasets_mounted_count').default(0).notNull(),
  directorAgent: text('director_agent').notNull(),
  configuration: jsonb('configuration').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Experiments Table
export const experiments = pgTable('experiments', {
  id: uuid('id').defaultRandom().primaryKey(),
  labId: uuid('lab_id').references(() => laboratories.id, { onDelete: 'cascade' }).notNull(),
  hypothesisId: uuid('hypothesis_id'),
  title: text('title').notNull(),
  parameters: jsonb('parameters').default({}).notNull(),
  datasetRef: text('dataset_ref').notNull(),
  status: experimentStatusEnum('status').default(ExperimentStatus.QUEUED).notNull(),
  executionDurationMs: integer('execution_duration_ms').default(0).notNull(),
  reproducibilityScore: doublePrecision('reproducibility_score').default(0).notNull(),
  resultsSummary: text('results_summary'),
  logs: jsonb('logs').$type<string[]>().default([]).notNull(),
  executedAt: timestamp('executed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Hypotheses Table
export const hypotheses = pgTable('hypotheses', {
  id: uuid('id').defaultRandom().primaryKey(),
  programId: uuid('program_id').references(() => researchPrograms.id, { onDelete: 'cascade' }).notNull(),
  statement: text('statement').notNull(),
  rationale: text('rationale').notNull(),
  department: academicDepartmentEnum('department').notNull(),
  noveltyScore: doublePrecision('novelty_score').default(0).notNull(),
  feasibilityScore: doublePrecision('feasibility_score').default(0).notNull(),
  testPlan: jsonb('test_plan').$type<string[]>().default([]).notNull(),
  status: hypothesisStatusEnum('status').default(HypothesisStatus.FORMULATED).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. Scientific Discoveries Table
export const discoveries = pgTable('discoveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  hypothesisId: uuid('hypothesis_id').references(() => hypotheses.id, { onDelete: 'cascade' }).notNull(),
  programId: uuid('program_id').references(() => researchPrograms.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  significance: discoverySignificanceEnum('significance').notNull(),
  summary: text('summary').notNull(),
  empiricalEvidence: jsonb('empirical_evidence').$type<string[]>().default([]).notNull(),
  noveltyScore: doublePrecision('novelty_score').default(0).notNull(),
  reproducibilityIndex: doublePrecision('reproducibility_index').default(0).notNull(),
  confirmedAt: timestamp('confirmed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. Academic Publications Table
export const publications = pgTable('publications', {
  id: uuid('id').defaultRandom().primaryKey(),
  programId: uuid('program_id').references(() => researchPrograms.id, { onDelete: 'cascade' }).notNull(),
  title: text('title').notNull(),
  abstract: text('abstract').notNull(),
  authors: jsonb('authors').$type<string[]>().default([]).notNull(),
  publicationType: publicationTypeEnum('publication_type').notNull(),
  status: publicationStatusEnum('status').default(PublicationStatus.DRAFT).notNull(),
  department: academicDepartmentEnum('department').notNull(),
  doi: text('doi'),
  fullMarkdownContent: text('full_markdown_content').notNull(),
  citationCount: integer('citation_count').default(0).notNull(),
  readinessScore: doublePrecision('readiness_score').default(0).notNull(),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 8. Citations Table
export const citations = pgTable('citations', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourcePublicationId: uuid('source_publication_id').references(() => publications.id, { onDelete: 'cascade' }).notNull(),
  targetPublicationId: uuid('target_publication_id').references(() => publications.id, { onDelete: 'cascade' }).notNull(),
  citationContext: text('citation_context').notNull(),
  semanticSimilarity: doublePrecision('semantic_similarity').default(0).notNull(),
  citedAt: timestamp('cited_at').defaultNow().notNull(),
});

// 9. Peer Reviews Table
export const peerReviews = pgTable('peer_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  publicationId: uuid('publication_id').references(() => publications.id, { onDelete: 'cascade' }).notNull(),
  reviewerRole: peerReviewRoleEnum('reviewer_role').notNull(),
  reviewerAgentName: text('reviewer_agent_name').notNull(),
  verdict: peerReviewVerdictEnum('verdict').notNull(),
  overallScore: doublePrecision('overall_score').notNull(),
  methodologyScore: doublePrecision('methodology_score').default(0).notNull(),
  soundnessScore: doublePrecision('soundness_score').default(0).notNull(),
  noveltyScore: doublePrecision('novelty_score').default(0).notNull(),
  clarityScore: doublePrecision('clarity_score').default(0).notNull(),
  reproducibilityScore: doublePrecision('reproducibility_score').default(0).notNull(),
  comments: text('comments').notNull(),
  strengths: jsonb('strengths').$type<string[]>().default([]).notNull(),
  weaknesses: jsonb('weaknesses').$type<string[]>().default([]).notNull(),
  reviewedAt: timestamp('reviewed_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. Research Grants Table
export const grants = pgTable('grants', {
  id: uuid('id').defaultRandom().primaryKey(),
  grantTitle: text('grant_title').notNull(),
  grantType: grantTypeEnum('grant_type').notNull(),
  fundingAgency: text('funding_agency').notNull(),
  totalPoolUsd: doublePrecision('total_pool_usd').notNull(),
  maximumAwardUsd: doublePrecision('maximum_award_usd').notNull(),
  eligibilityCriteria: jsonb('eligibility_criteria').$type<string[]>().default([]).notNull(),
  matchingDepartments: jsonb('matching_departments').default([]).notNull(),
  status: grantStatusEnum('status').default(GrantStatus.OPEN).notNull(),
  applicationDeadline: timestamp('application_deadline').notNull(),
  awardedAmountUsd: doublePrecision('awarded_amount_usd'),
  fundedProgramId: uuid('funded_program_id').references(() => researchPrograms.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 11. Collaborators Table
export const collaborators = pgTable('collaborators', {
  id: uuid('id').defaultRandom().primaryKey(),
  institutionName: text('institution_name').notNull(),
  primaryDepartment: academicDepartmentEnum('primary_department').notNull(),
  country: text('country').notNull(),
  leadInvestigator: text('lead_investigator').notNull(),
  reputationScore: doublePrecision('reputation_score').default(80.0).notNull(),
  activeSharedProjects: jsonb('active_shared_projects').$type<string[]>().default([]).notNull(),
  coAuthoredPublicationsCount: integer('co_authored_publications_count').default(0).notNull(),
  cooperationStatus: text('cooperation_status').default('ACTIVE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 12. Academic Knowledge Nodes Table
export const academicKnowledgeNodes = pgTable('academic_knowledge_nodes', {
  id: uuid('id').defaultRandom().primaryKey(),
  nodeType: knowledgeNodeTypeEnum('node_type').notNull(),
  canonicalName: text('canonical_name').notNull(),
  domain: academicDepartmentEnum('domain').notNull(),
  definition: text('definition').notNull(),
  confidenceScore: doublePrecision('confidence_score').default(90.0).notNull(),
  incomingCitations: integer('incoming_citations').default(0).notNull(),
  outgoingConnections: jsonb('outgoing_connections').$type<string[]>().default([]).notNull(),
  evolutionLineage: jsonb('evolution_lineage').$type<string[]>().default([]).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 13. Research Metrics Table
export const researchMetrics = pgTable('research_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  universityId: text('university_id').notNull(),
  totalPrograms: integer('total_programs').default(0).notNull(),
  activeLabsCount: integer('active_labs_count').default(0).notNull(),
  experimentsExecutedCount: integer('experiments_executed_count').default(0).notNull(),
  discoveriesLoggedCount: integer('discoveries_logged_count').default(0).notNull(),
  publicationsCount: integer('publications_count').default(0).notNull(),
  totalCitationsCount: integer('total_citations_count').default(0).notNull(),
  hIndexEstimated: integer('h_index_estimated').default(0).notNull(),
  totalGrantsSecuredUsd: doublePrecision('total_grants_secured_usd').default(0).notNull(),
  globalKnowledgeGraphDensity: doublePrecision('global_knowledge_graph_density').default(0).notNull(),
  averageReproducibilityRate: doublePrecision('average_reproducibility_rate').default(0).notNull(),
  computedAt: timestamp('computed_at').defaultNow().notNull(),
});
