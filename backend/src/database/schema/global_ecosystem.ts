import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  doublePrecision,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { organizations } from './enterprise';
import {
  globalNodeTypeEnum,
  globalEdgeTypeEnum,
  verificationStatusEnum,
  publicationStatusEnum,
  digitalTwinTypeEnum,
  reputationTierEnum,
  ventureStageEnum,
  superintelligenceScopeEnum,
  trendCategoryEnum,
  ecosystemEventCategoryEnum,
} from './enums';
import {
  GlobalNodeType,
  GlobalEdgeType,
  VerificationStatus,
  PublicationStatus,
  DigitalTwinType,
  ReputationTier,
  VentureStage,
  SuperintelligenceScope,
  TrendCategory,
  EcosystemEventCategory,
} from '@codeforge/shared';

// ==========================================
// 1. GLOBAL NETWORK NODES
// ==========================================
export const globalNetworkNodes = pgTable(
  'global_network_nodes',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    entityId: varchar('entity_id', { length: 255 }).notNull(),
    nodeType: globalNodeTypeEnum('node_type').notNull(),
    label: varchar('label', { length: 255 }).notNull(),
    score: doublePrecision('score').default(0).notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}).notNull(),
    tenantId: uuid('tenant_id').references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    nodeTypeIdx: index('idx_global_network_nodes_type').on(table.nodeType),
    entityIdIdx: index('idx_global_network_nodes_entity').on(table.entityId),
    tenantIdIdx: index('idx_global_network_nodes_tenant').on(table.tenantId),
  })
);

// ==========================================
// 2. GLOBAL NETWORK EDGES
// ==========================================
export const globalNetworkEdges = pgTable(
  'global_network_edges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sourceNodeId: uuid('source_node_id').references(() => globalNetworkNodes.id, { onDelete: 'cascade' }).notNull(),
    targetNodeId: uuid('target_node_id').references(() => globalNetworkNodes.id, { onDelete: 'cascade' }).notNull(),
    edgeType: globalEdgeTypeEnum('edge_type').notNull(),
    weight: doublePrecision('weight').default(1.0).notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    sourceNodeIdx: index('idx_global_network_edges_source').on(table.sourceNodeId),
    targetNodeIdx: index('idx_global_network_edges_target').on(table.targetNodeId),
    edgeTypeIdx: index('idx_global_network_edges_type').on(table.edgeType),
  })
);

// ==========================================
// 3. TALENT PROFILES
// ==========================================
export const talentProfiles = pgTable(
  'talent_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    bio: text('bio').notNull(),
    hourlyRateUsd: doublePrecision('hourly_rate_usd').default(0).notNull(),
    availabilityStatus: varchar('availability_status', { length: 50 }).default('available').notNull(),
    globalRank: integer('global_rank').default(1000).notNull(),
    verifiedSkillsCount: integer('verified_skills_count').default(0).notNull(),
    reputationScore: doublePrecision('reputation_score').default(100).notNull(),
    reputationTier: reputationTierEnum('reputation_tier').default(ReputationTier.NOVICE).notNull(),
    portfolioScore: doublePrecision('portfolio_score').default(0).notNull(),
    location: varchar('location', { length: 255 }).default('Global').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_talent_profiles_user').on(table.userId),
    tierIdx: index('idx_talent_profiles_tier').on(table.reputationTier),
    rankIdx: index('idx_talent_profiles_rank').on(table.globalRank),
  })
);

// ==========================================
// 4. VERIFIED SKILLS
// ==========================================
export const verifiedSkills = pgTable(
  'verified_skills',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    talentProfileId: uuid('talent_profile_id').references(() => talentProfiles.id, { onDelete: 'cascade' }).notNull(),
    skillName: varchar('skill_name', { length: 255 }).notNull(),
    proficiencyLevel: varchar('proficiency_level', { length: 50 }).default('intermediate').notNull(),
    score: doublePrecision('score').default(80.0).notNull(),
    status: verificationStatusEnum('status').default(VerificationStatus.VERIFIED).notNull(),
    verifiedAt: timestamp('verified_at').defaultNow(),
    verifierBadge: varchar('verifier_badge', { length: 100 }).default('CodeForge AI Verified'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    talentProfileIdx: index('idx_verified_skills_profile').on(table.talentProfileId),
    skillNameIdx: index('idx_verified_skills_name').on(table.skillName),
  })
);

// ==========================================
// 5. SKILL VERIFICATIONS (Requests & Audits)
// ==========================================
export const skillVerifications = pgTable(
  'skill_verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    talentProfileId: uuid('talent_profile_id').references(() => talentProfiles.id, { onDelete: 'cascade' }).notNull(),
    skillName: varchar('skill_name', { length: 255 }).notNull(),
    evidenceLinks: jsonb('evidence_links').$type<string[]>().default([]).notNull(),
    assessmentScore: doublePrecision('assessment_score').default(0),
    status: verificationStatusEnum('status').default(VerificationStatus.PENDING).notNull(),
    reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
    reviewNotes: text('review_notes'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    profileIdx: index('idx_skill_verifications_profile').on(table.talentProfileId),
    statusIdx: index('idx_skill_verifications_status').on(table.status),
  })
);

// ==========================================
// 6. RESEARCH PUBLICATIONS
// ==========================================
export const researchPublications = pgTable(
  'research_publications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    authorUserId: uuid('author_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
    title: varchar('title', { length: 500 }).notNull(),
    abstract: text('abstract').notNull(),
    domain: varchar('domain', { length: 100 }).default('Computer Science').notNull(),
    status: publicationStatusEnum('status').default(PublicationStatus.PUBLISHED).notNull(),
    peerReviewScore: doublePrecision('peer_review_score').default(85.0).notNull(),
    citationsCount: integer('citations_count').default(0).notNull(),
    downloadCount: integer('download_count').default(0).notNull(),
    fullTextUrl: text('full_text_url'),
    publishedAt: timestamp('published_at').defaultNow().notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    authorIdx: index('idx_research_pub_author').on(table.authorUserId),
    domainIdx: index('idx_research_pub_domain').on(table.domain),
    statusIdx: index('idx_research_pub_status').on(table.status),
  })
);

// ==========================================
// 7. RESEARCH CITATIONS
// ==========================================
export const researchCitations = pgTable(
  'research_citations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sourcePublicationId: uuid('source_publication_id').references(() => researchPublications.id, { onDelete: 'cascade' }).notNull(),
    targetPublicationId: uuid('target_publication_id').references(() => researchPublications.id, { onDelete: 'cascade' }).notNull(),
    contextSnippet: text('context_snippet').default('').notNull(),
    citationWeight: doublePrecision('citation_weight').default(1.0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    sourceIdx: index('idx_research_cit_source').on(table.sourcePublicationId),
    targetIdx: index('idx_research_cit_target').on(table.targetPublicationId),
  })
);

// ==========================================
// 8. STARTUP PROFILES
// ==========================================
export const startupProfiles = pgTable(
  'startup_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    founderUserId: uuid('founder_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    tagline: varchar('tagline', { length: 500 }).notNull(),
    description: text('description').notNull(),
    stage: ventureStageEnum('stage').default(VentureStage.IDEA).notNull(),
    industry: varchar('industry', { length: 100 }).notNull(),
    targetMarket: varchar('target_market', { length: 255 }).notNull(),
    businessModel: varchar('business_model', { length: 255 }).notNull(),
    fundingGoalUsd: doublePrecision('funding_goal_usd').default(100000).notNull(),
    raisedAmountUsd: doublePrecision('raised_amount_usd').default(0).notNull(),
    teamMemberUserIds: jsonb('team_member_user_ids').$type<string[]>().default([]).notNull(),
    marketValidationScore: doublePrecision('market_validation_score').default(75.0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    founderIdx: index('idx_startup_profiles_founder').on(table.founderUserId),
    stageIdx: index('idx_startup_profiles_stage').on(table.stage),
    industryIdx: index('idx_startup_profiles_industry').on(table.industry),
  })
);

// ==========================================
// 9. FOUNDER MATCHES
// ==========================================
export const founderMatches = pgTable(
  'founder_matches',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    startupId: uuid('startup_id').references(() => startupProfiles.id, { onDelete: 'cascade' }).notNull(),
    matchedUserId: uuid('matched_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    matchScore: doublePrecision('match_score').default(85.0).notNull(),
    complementarySkills: jsonb('complementary_skills').$type<string[]>().default([]).notNull(),
    roleFit: varchar('role_fit', { length: 100 }).default('Technical Co-Founder').notNull(),
    status: varchar('status', { length: 50 }).default('suggested').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    startupIdx: index('idx_founder_matches_startup').on(table.startupId),
    userIdx: index('idx_founder_matches_user').on(table.matchedUserId),
  })
);

// ==========================================
// 10. DIGITAL TWINS
// ==========================================
export const digitalTwins = pgTable(
  'digital_twins',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    entityId: varchar('entity_id', { length: 255 }).notNull(),
    twinType: digitalTwinTypeEnum('twin_type').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    stateSnapshot: jsonb('state_snapshot').$type<Record<string, any>>().default({}).notNull(),
    behavioralModel: jsonb('behavioral_model').$type<Record<string, any>>().default({}).notNull(),
    accuracyRating: doublePrecision('accuracy_rating').default(90.0).notNull(),
    lastSimulatedAt: timestamp('last_simulated_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    entityIdx: index('idx_digital_twins_entity').on(table.entityId),
    twinTypeIdx: index('idx_digital_twins_type').on(table.twinType),
  })
);

// ==========================================
// 11. ECOSYSTEM REPUTATION
// ==========================================
export const ecosystemReputation = pgTable(
  'ecosystem_reputation',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
    score: doublePrecision('score').default(100.0).notNull(),
    tier: reputationTierEnum('tier').default(ReputationTier.NOVICE).notNull(),
    totalContributions: integer('total_contributions').default(0).notNull(),
    upvotesReceived: integer('upvotes_received').default(0).notNull(),
    skillCreditsBalance: integer('skill_credits_balance').default(50).notNull(),
    badgesEarned: jsonb('badges_earned').$type<string[]>().default([]).notNull(),
    rankPercentile: doublePrecision('rank_percentile').default(50.0).notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('idx_ecosystem_rep_user').on(table.userId),
    tierIdx: index('idx_ecosystem_rep_tier').on(table.tier),
  })
);

// ==========================================
// 12. ECOSYSTEM REWARDS
// ==========================================
export const ecosystemRewards = pgTable(
  'ecosystem_rewards',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    rewardType: varchar('reward_type', { length: 100 }).notNull(),
    skillCreditsAwarded: integer('skill_credits_awarded').default(10).notNull(),
    reason: text('reason').notNull(),
    transactionReference: varchar('transaction_reference', { length: 255 }).notNull(),
    awardedAt: timestamp('awarded_at').defaultNow().notNull(),
  },
  (table) => ({
    userRewardIdx: index('idx_ecosystem_rewards_user').on(table.userId),
    rewardTypeIdx: index('idx_ecosystem_rewards_type').on(table.rewardType),
  })
);

// ==========================================
// 13. ECOSYSTEM METRICS
// ==========================================
export const ecosystemMetrics = pgTable(
  'ecosystem_metrics',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    metricName: varchar('metric_name', { length: 100 }).notNull(),
    category: varchar('category', { length: 100 }).default('global').notNull(),
    numericValue: doublePrecision('numeric_value').notNull(),
    metadata: jsonb('metadata').$type<Record<string, any>>().default({}).notNull(),
    recordedAt: timestamp('recorded_at').defaultNow().notNull(),
  },
  (table) => ({
    metricNameIdx: index('idx_ecosystem_metrics_name').on(table.metricName),
    categoryIdx: index('idx_ecosystem_metrics_category').on(table.category),
    recordedAtIdx: index('idx_ecosystem_metrics_recorded').on(table.recordedAt),
  })
);

// ==========================================
// 14. GLOBAL TRENDS
// ==========================================
export const globalTrends = pgTable(
  'global_trends',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    trendName: varchar('trend_name', { length: 255 }).notNull(),
    category: trendCategoryEnum('category').notNull(),
    momentumScore: doublePrecision('momentum_score').default(80.0).notNull(),
    growthRatePercent: doublePrecision('growth_rate_percent').default(15.0).notNull(),
    demandScore: doublePrecision('demand_score').default(90.0).notNull(),
    occurrences: integer('occurrences').default(100).notNull(),
    recordedAt: timestamp('recorded_at').defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index('idx_global_trends_category').on(table.category),
    momentumIdx: index('idx_global_trends_momentum').on(table.momentumScore),
  })
);

// ==========================================
// 15. ECOSYSTEM EVENTS
// ==========================================
export const ecosystemEvents = pgTable(
  'ecosystem_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    category: ecosystemEventCategoryEnum('category').notNull(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    payload: jsonb('payload').$type<Record<string, any>>().default({}).notNull(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index('idx_ecosystem_events_category').on(table.category),
    actorIdx: index('idx_ecosystem_events_actor').on(table.actorUserId),
    createdIdx: index('idx_ecosystem_events_created').on(table.createdAt),
  })
);

// ==========================================
// RELATIONS
// ==========================================
export const globalNetworkNodesRelations = relations(globalNetworkNodes, ({ one, many }) => ({
  tenant: one(users, {
    fields: [globalNetworkNodes.tenantId],
    references: [users.id],
  }),
  outgoingEdges: many(globalNetworkEdges, { relationName: 'outgoing_edges' }),
  incomingEdges: many(globalNetworkEdges, { relationName: 'incoming_edges' }),
}));

export const globalNetworkEdgesRelations = relations(globalNetworkEdges, ({ one }) => ({
  sourceNode: one(globalNetworkNodes, {
    fields: [globalNetworkEdges.sourceNodeId],
    references: [globalNetworkNodes.id],
    relationName: 'outgoing_edges',
  }),
  targetNode: one(globalNetworkNodes, {
    fields: [globalNetworkEdges.targetNodeId],
    references: [globalNetworkNodes.id],
    relationName: 'incoming_edges',
  }),
}));

export const talentProfilesRelations = relations(talentProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [talentProfiles.userId],
    references: [users.id],
  }),
  verifiedSkills: many(verifiedSkills),
  skillVerifications: many(skillVerifications),
}));

export const verifiedSkillsRelations = relations(verifiedSkills, ({ one }) => ({
  talentProfile: one(talentProfiles, {
    fields: [verifiedSkills.talentProfileId],
    references: [talentProfiles.id],
  }),
}));

export const researchPublicationsRelations = relations(researchPublications, ({ one, many }) => ({
  author: one(users, {
    fields: [researchPublications.authorUserId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [researchPublications.organizationId],
    references: [organizations.id],
  }),
  citationsTo: many(researchCitations, { relationName: 'citations_to' }),
  citationsFrom: many(researchCitations, { relationName: 'citations_from' }),
}));

export const researchCitationsRelations = relations(researchCitations, ({ one }) => ({
  sourcePublication: one(researchPublications, {
    fields: [researchCitations.sourcePublicationId],
    references: [researchPublications.id],
    relationName: 'citations_from',
  }),
  targetPublication: one(researchPublications, {
    fields: [researchCitations.targetPublicationId],
    references: [researchPublications.id],
    relationName: 'citations_to',
  }),
}));

export const startupProfilesRelations = relations(startupProfiles, ({ one, many }) => ({
  founder: one(users, {
    fields: [startupProfiles.founderUserId],
    references: [users.id],
  }),
  founderMatches: many(founderMatches),
}));

export const founderMatchesRelations = relations(founderMatches, ({ one }) => ({
  startup: one(startupProfiles, {
    fields: [founderMatches.startupId],
    references: [startupProfiles.id],
  }),
  matchedUser: one(users, {
    fields: [founderMatches.matchedUserId],
    references: [users.id],
  }),
}));

export const ecosystemReputationRelations = relations(ecosystemReputation, ({ one }) => ({
  user: one(users, {
    fields: [ecosystemReputation.userId],
    references: [users.id],
  }),
}));

export const ecosystemRewardsRelations = relations(ecosystemRewards, ({ one }) => ({
  user: one(users, {
    fields: [ecosystemRewards.userId],
    references: [users.id],
  }),
}));
