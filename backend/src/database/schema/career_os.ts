import { pgTable, uuid, varchar, text, timestamp, boolean, integer, numeric, jsonb, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import {
  skillDemandCategoryEnum,
  forecastHorizonEnum,
  careerGoalTypeEnum,
  careerGoalStatusEnum,
  careerEventTypeEnum,
  networkRelationTypeEnum,
  coachingFrequencyEnum,
  careerRiskAlertLevelEnum,
} from './enums';
import { CareerGoalStatus, CoachingFrequency } from '@codeforge/shared';

// 1. Career Digital Twins
export const careerTwins = pgTable('career_twins', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  healthScore: numeric('health_score', { precision: 5, scale: 2 }).notNull().default('75.00'),
  learningVelocity: numeric('learning_velocity', { precision: 5, scale: 2 }).notNull().default('80.00'),
  careerMomentum: numeric('career_momentum', { precision: 5, scale: 2 }).notNull().default('78.00'),
  marketCompetitiveness: numeric('market_competitiveness', { precision: 5, scale: 2 }).notNull().default('82.00'),
  interviewReadiness: numeric('interview_readiness', { precision: 5, scale: 2 }).notNull().default('74.00'),
  salaryPositioning: numeric('salary_positioning', { precision: 5, scale: 2 }).notNull().default('76.00'),
  leadershipPotential: numeric('leadership_potential', { precision: 5, scale: 2 }).notNull().default('68.00'),
  currentRole: varchar('current_role', { length: 255 }).notNull().default('Software Engineer'),
  targetRole: varchar('target_role', { length: 255 }).notNull().default('Senior Distributed Systems Engineer'),
  currentLevel: varchar('current_level', { length: 100 }).notNull().default('L4 / Mid-Level'),
  targetLevel: varchar('target_level', { length: 100 }).notNull().default('L5 / Senior'),
  currentSalaryUsd: integer('current_salary_usd').default(120000),
  targetSalaryUsd: integer('target_salary_usd').default(185000),
  yearsOfExperience: numeric('years_of_experience', { precision: 4, scale: 1 }).notNull().default('3.0'),
  primarySkills: jsonb('primary_skills').$type<string[]>().notNull().default(['TypeScript', 'Node.js', 'PostgreSQL', 'Go', 'System Design']),
  topStrengths: jsonb('top_strengths').$type<string[]>().notNull().default(['Algorithmic Problem Solving', 'Backend Systems Architecture', 'Fast Learner']),
  growthAreas: jsonb('growth_areas').$type<string[]>().notNull().default(['Kubernetes Cluster Management', 'Cross-Functional Team Leadership', 'High-Scale Concurrency']),
  metadata: jsonb('metadata').$type<Record<string, any>>().notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_career_twins_user_id').on(table.userId),
}));

// 2. Career Snapshots (History & Trends)
export const careerSnapshots = pgTable('career_snapshots', {
  id: uuid('id').primaryKey().defaultRandom(),
  twinId: uuid('twin_id').references(() => careerTwins.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  healthScore: numeric('health_score', { precision: 5, scale: 2 }).notNull(),
  metrics: jsonb('metrics').$type<Record<string, number>>().notNull().default({}),
  snapshotDate: timestamp('snapshot_date').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_career_snapshots_user_id').on(table.userId),
  twinIdIdx: index('idx_career_snapshots_twin_id').on(table.twinId),
}));

// 3. Career Events (Promotions, Certifications, Job Changes)
export const careerEvents = pgTable('career_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  twinId: uuid('twin_id').references(() => careerTwins.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  eventType: careerEventTypeEnum('event_type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  company: varchar('company', { length: 255 }),
  role: varchar('role', { length: 255 }),
  salaryUsd: integer('salary_usd'),
  eventDate: timestamp('event_date').notNull().defaultNow(),
  isVerified: boolean('is_verified').notNull().default(false),
  metadata: jsonb('metadata').$type<Record<string, any>>().notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_career_events_user_id').on(table.userId),
  twinIdIdx: index('idx_career_events_twin_id').on(table.twinId),
}));

// 4. Career Milestones
export const careerMilestones = pgTable('career_milestones', {
  id: uuid('id').primaryKey().defaultRandom(),
  twinId: uuid('twin_id').references(() => careerTwins.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  category: varchar('category', { length: 100 }).notNull().default('TECHNICAL'),
  isAchieved: boolean('is_achieved').notNull().default(false),
  targetDate: timestamp('target_date'),
  achievedDate: timestamp('achieved_date'),
  xpEarned: integer('xp_earned').notNull().default(100),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_career_milestones_user_id').on(table.userId),
  twinIdIdx: index('idx_career_milestones_twin_id').on(table.twinId),
}));

// 5. Career Goals & Roadmaps
export const careerOsGoals = pgTable('career_os_goals', {
  id: uuid('id').primaryKey().defaultRandom(),
  twinId: uuid('twin_id').references(() => careerTwins.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: careerGoalTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  targetRole: varchar('target_role', { length: 255 }),
  targetSalaryUsd: integer('target_salary_usd'),
  progressPercentage: numeric('progress_percentage', { precision: 5, scale: 2 }).notNull().default('0.00'),
  status: careerGoalStatusEnum('status').notNull().default(CareerGoalStatus.IN_PROGRESS),
  targetDate: timestamp('target_date'),
  achievedDate: timestamp('achieved_date'),
  milestones: jsonb('milestones').$type<{ title: string; completed: boolean; dueDate?: string }[]>().notNull().default([]),
  riskFactors: jsonb('risk_factors').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_career_os_goals_user_id').on(table.userId),
  twinIdIdx: index('idx_career_os_goals_twin_id').on(table.twinId),
}));

// 6. AI Career Coaching Reports
export const careerCoachingReports = pgTable('career_coaching_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  twinId: uuid('twin_id').references(() => careerTwins.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  frequency: coachingFrequencyEnum('frequency').notNull().default(CoachingFrequency.WEEKLY),
  summary: text('summary').notNull(),
  healthMetrics: jsonb('health_metrics').$type<Record<string, number>>().notNull().default({}),
  strengths: jsonb('strengths').$type<string[]>().notNull().default([]),
  riskAlerts: jsonb('risk_alerts').$type<any[]>().notNull().default([]),
  actionItems: jsonb('action_items').$type<{ priority: string; action: string; category: string }[]>().notNull().default([]),
  promotionReadiness: numeric('promotion_readiness', { precision: 5, scale: 2 }).notNull().default('72.00'),
  burnoutRiskScore: numeric('burnout_risk_score', { precision: 5, scale: 2 }).notNull().default('18.00'),
  promotionPlan: jsonb('promotion_plan').$type<Record<string, any>>(),
  jobSwitchPlan: jsonb('job_switch_plan').$type<Record<string, any>>(),
  generatedAt: timestamp('generated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_coaching_reports_user_id').on(table.userId),
  twinIdIdx: index('idx_coaching_reports_twin_id').on(table.twinId),
}));

// 7. Personal Brand Profiles
export const personalBrandProfiles = pgTable('personal_brand_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
  brandScore: numeric('brand_score', { precision: 5, scale: 2 }).notNull().default('68.00'),
  githubScore: numeric('github_score', { precision: 5, scale: 2 }).notNull().default('72.00'),
  portfolioScore: numeric('portfolio_score', { precision: 5, scale: 2 }).notNull().default('65.00'),
  linkedinScore: numeric('linkedin_score', { precision: 5, scale: 2 }).notNull().default('70.00'),
  contentScore: numeric('content_score', { precision: 5, scale: 2 }).notNull().default('55.00'),
  ossScore: numeric('oss_score', { precision: 5, scale: 2 }).notNull().default('60.00'),
  brandTier: varchar('brand_tier', { length: 50 }).notNull().default('STRONG'),
  recommendations: jsonb('recommendations').$type<string[]>().notNull().default([]),
  contentPlans: jsonb('content_plans').$type<any[]>().notNull().default([]),
  speakingOpportunities: jsonb('speaking_opportunities').$type<any[]>().notNull().default([]),
  openSourceRecommendations: jsonb('open_source_recommendations').$type<any[]>().notNull().default([]),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_personal_brand_user_id').on(table.userId),
}));

// 8. Network Connections (Professional Graph)
export const networkConnections = pgTable('network_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  connectedUserId: uuid('connected_user_id').references(() => users.id, { onDelete: 'set null' }),
  contactName: varchar('contact_name', { length: 255 }).notNull(),
  contactRole: varchar('contact_role', { length: 255 }).notNull(),
  contactCompany: varchar('contact_company', { length: 255 }).notNull(),
  relationType: networkRelationTypeEnum('relation_type').notNull(),
  strengthScore: numeric('strength_score', { precision: 5, scale: 2 }).notNull().default('75.00'),
  notes: text('notes'),
  lastInteractionAt: timestamp('last_interaction_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_network_connections_user_id').on(table.userId),
}));

// 9. AI Career Predictions
export const careerPredictions = pgTable('career_predictions', {
  id: uuid('id').primaryKey().defaultRandom(),
  twinId: uuid('twin_id').references(() => careerTwins.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  horizon: forecastHorizonEnum('horizon').notNull(),
  promotionProbability: numeric('promotion_probability', { precision: 5, scale: 2 }).notNull(),
  salaryGrowthProbability: numeric('salary_growth_probability', { precision: 5, scale: 2 }).notNull(),
  jobSwitchProbability: numeric('job_switch_probability', { precision: 5, scale: 2 }).notNull(),
  leadershipReadiness: numeric('leadership_readiness', { precision: 5, scale: 2 }).notNull(),
  skillRelevanceScore: numeric('skill_relevance_score', { precision: 5, scale: 2 }).notNull(),
  careerRiskScore: numeric('career_risk_score', { precision: 5, scale: 2 }).notNull(),
  confidenceScore: numeric('confidence_score', { precision: 5, scale: 2 }).notNull(),
  predictedRoles: jsonb('predicted_roles').$type<string[]>().notNull().default([]),
  growthDrivers: jsonb('growth_drivers').$type<string[]>().notNull().default([]),
  riskFactors: jsonb('risk_factors').$type<string[]>().notNull().default([]),
  generatedAt: timestamp('generated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('idx_career_predictions_user_id').on(table.userId),
  twinIdIdx: index('idx_career_predictions_twin_id').on(table.twinId),
}));

// Relational Definitions
export const careerTwinsRelations = relations(careerTwins, ({ one, many }) => ({
  user: one(users, {
    fields: [careerTwins.userId],
    references: [users.id],
  }),
  snapshots: many(careerSnapshots),
  events: many(careerEvents),
  milestones: many(careerMilestones),
  goals: many(careerOsGoals),
  coachingReports: many(careerCoachingReports),
  predictions: many(careerPredictions),
}));

export const careerEventsRelations = relations(careerEvents, ({ one }) => ({
  twin: one(careerTwins, {
    fields: [careerEvents.twinId],
    references: [careerTwins.id],
  }),
  user: one(users, {
    fields: [careerEvents.userId],
    references: [users.id],
  }),
}));

export const careerMilestonesRelations = relations(careerMilestones, ({ one }) => ({
  twin: one(careerTwins, {
    fields: [careerMilestones.twinId],
    references: [careerTwins.id],
  }),
  user: one(users, {
    fields: [careerMilestones.userId],
    references: [users.id],
  }),
}));

export const careerOsGoalsRelations = relations(careerOsGoals, ({ one }) => ({
  twin: one(careerTwins, {
    fields: [careerOsGoals.twinId],
    references: [careerTwins.id],
  }),
  user: one(users, {
    fields: [careerOsGoals.userId],
    references: [users.id],
  }),
}));

export const personalBrandProfilesRelations = relations(personalBrandProfiles, ({ one }) => ({
  user: one(users, {
    fields: [personalBrandProfiles.userId],
    references: [users.id],
  }),
}));

export const networkConnectionsRelations = relations(networkConnections, ({ one }) => ({
  user: one(users, {
    fields: [networkConnections.userId],
    references: [users.id],
  }),
  connectedUser: one(users, {
    fields: [networkConnections.connectedUserId],
    references: [users.id],
  }),
}));
