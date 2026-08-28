import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { contests } from './contests';
import { resumes } from './resumes';
import {
  jobTypeEnum,
  workplaceTypeEnum,
  jobStatusEnum,
  applicationStageEnum,
  matchCategoryEnum,
  referralStatusEnum,
  hiringInterviewTypeEnum,
  hiringInterviewStatusEnum,
  offerRecommendationEnum,
} from './enums';
import {
  JobType,
  WorkplaceType,
  JobStatus,
  ApplicationStage,
  MatchCategory,
  ReferralStatus,
  HiringInterviewType,
  HiringInterviewStatus,
} from '@codeforge/shared';

// 1. Companies Table
export const companies = pgTable('companies', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  website: varchar('website', { length: 500 }),
  logoUrl: text('logo_url'),
  description: text('description'),
  industry: varchar('industry', { length: 100 }),
  size: varchar('size', { length: 50 }), // e.g. "1-10", "50-200", "1000+"
  location: varchar('location', { length: 255 }),
  isVerified: boolean('is_verified').notNull().default(false),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 2. Recruiters Table
export const recruiters = pgTable('recruiters', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 150 }).notNull(),
  department: varchar('department', { length: 100 }),
  linkedinUrl: varchar('linkedin_url', { length: 500 }),
  isPrimary: boolean('is_primary').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 3. Job Postings Table
export const jobPostings = pgTable('job_postings', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  recruiterId: uuid('recruiter_id')
    .notNull()
    .references(() => recruiters.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  requirements: text('requirements').notNull(),
  skillsRequired: jsonb('skills_required').notNull().$type<string[]>(), // e.g. ["Python", "Algorithms", "PostgreSQL"]
  minRatingRequired: integer('min_rating_required').notNull().default(1200),
  minAssessmentScore: integer('min_assessment_score').notNull().default(0),
  jobType: jobTypeEnum('job_type').notNull().default(JobType.FULL_TIME),
  workplaceType: workplaceTypeEnum('workplace_type').notNull().default(WorkplaceType.REMOTE),
  location: varchar('location', { length: 255 }).notNull().default('Remote'),
  minSalary: integer('min_salary'),
  maxSalary: integer('max_salary'),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  experienceLevel: varchar('experience_level', { length: 50 }).notNull().default('Mid-Level'),
  status: jobStatusEnum('status').notNull().default(JobStatus.ACTIVE),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 4. Job Applications Table
export const jobApplications = pgTable('job_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobPostings.id, { onDelete: 'cascade' }),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  resumeId: uuid('resume_id').references(() => resumes.id, { onDelete: 'set null' }),
  portfolioId: uuid('portfolio_id'),
  stage: applicationStageEnum('stage').notNull().default(ApplicationStage.APPLIED),
  matchScore: integer('match_score').notNull().default(0), // 0 to 100
  matchCategory: matchCategoryEnum('match_category').notNull().default(MatchCategory.PARTIAL_MATCH),
  coverLetter: text('cover_letter'),
  recruiterNotes: text('recruiter_notes'),
  rejectionReason: text('rejection_reason'),
  appliedAt: timestamp('applied_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 5. Application Stage History
export const applicationStageHistory = pgTable('application_stage_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationId: uuid('application_id')
    .notNull()
    .references(() => jobApplications.id, { onDelete: 'cascade' }),
  fromStage: applicationStageEnum('from_stage'),
  toStage: applicationStageEnum('to_stage').notNull(),
  notes: text('notes'),
  changedByUserId: uuid('changed_by_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  changedAt: timestamp('changed_at', { withTimezone: true }).notNull().defaultNow(),
});

// 6. Candidate Shortlists
export const candidateShortlists = pgTable('candidate_shortlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  recruiterId: uuid('recruiter_id')
    .notNull()
    .references(() => recruiters.id, { onDelete: 'cascade' }),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id').references(() => jobPostings.id, { onDelete: 'set null' }),
  notes: text('notes'),
  tags: jsonb('tags').$type<string[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 7. Employee Referrals
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  referrerId: uuid('referrer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id').references(() => jobPostings.id, { onDelete: 'set null' }),
  status: referralStatusEnum('status').notNull().default(ReferralStatus.PENDING),
  notes: text('notes'),
  bonusAmount: integer('bonus_amount').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 8. Referral Requests (by Candidates)
export const referralRequests = pgTable('referral_requests', {
  id: uuid('id').defaultRandom().primaryKey(),
  candidateId: uuid('candidate_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  jobId: uuid('job_id')
    .notNull()
    .references(() => jobPostings.id, { onDelete: 'cascade' }),
  targetCompanyId: uuid('target_company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  message: text('message').notNull(),
  status: referralStatusEnum('status').notNull().default(ReferralStatus.PENDING),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// 9. Company Hiring Challenges (Contests)
export const hiringChallenges = pgTable('hiring_challenges', {
  id: uuid('id').defaultRandom().primaryKey(),
  companyId: uuid('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  recruiterId: uuid('recruiter_id')
    .notNull()
    .references(() => recruiters.id, { onDelete: 'cascade' }),
  contestId: uuid('contest_id')
    .notNull()
    .references(() => contests.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  minScoreThreshold: integer('min_score_threshold').notNull().default(100),
  autoShortlist: boolean('auto_shortlist').notNull().default(true),
  targetRole: varchar('target_role', { length: 150 }).notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// 10. Hiring Interviews (Interview Pipeline)
export const hiringInterviews = pgTable('hiring_interviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicationId: uuid('application_id')
    .notNull()
    .references(() => jobApplications.id, { onDelete: 'cascade' }),
  interviewerId: uuid('interviewer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  interviewType: hiringInterviewTypeEnum('interview_type').notNull().default(HiringInterviewType.TECHNICAL),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(45),
  meetingUrl: varchar('meeting_url', { length: 500 }),
  status: hiringInterviewStatusEnum('status').notNull().default(HiringInterviewStatus.SCHEDULED),
  feedbackNotes: text('feedback_notes'),
  technicalScore: integer('technical_score'), // 1 to 5
  communicationScore: integer('communication_score'), // 1 to 5
  problemSolvingScore: integer('problem_solving_score'), // 1 to 5
  recommendation: offerRecommendationEnum('recommendation'),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// Relations
export const companiesRelations = relations(companies, ({ many }) => ({
  recruiters: many(recruiters),
  jobPostings: many(jobPostings),
  referrals: many(referrals),
  referralRequests: many(referralRequests),
  hiringChallenges: many(hiringChallenges),
}));

export const recruitersRelations = relations(recruiters, ({ one, many }) => ({
  company: one(companies, {
    fields: [recruiters.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [recruiters.userId],
    references: [users.id],
  }),
  jobPostings: many(jobPostings),
  candidateShortlists: many(candidateShortlists),
  hiringChallenges: many(hiringChallenges),
}));

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobPostings.companyId],
    references: [companies.id],
  }),
  recruiter: one(recruiters, {
    fields: [jobPostings.recruiterId],
    references: [recruiters.id],
  }),
  applications: many(jobApplications),
  candidateShortlists: many(candidateShortlists),
  referrals: many(referrals),
  referralRequests: many(referralRequests),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one, many }) => ({
  job: one(jobPostings, {
    fields: [jobApplications.jobId],
    references: [jobPostings.id],
  }),
  candidate: one(users, {
    fields: [jobApplications.candidateId],
    references: [users.id],
  }),
  resume: one(resumes, {
    fields: [jobApplications.resumeId],
    references: [resumes.id],
  }),
  stageHistory: many(applicationStageHistory),
  interviews: many(hiringInterviews),
}));

export const applicationStageHistoryRelations = relations(applicationStageHistory, ({ one }) => ({
  application: one(jobApplications, {
    fields: [applicationStageHistory.applicationId],
    references: [jobApplications.id],
  }),
  changedByUser: one(users, {
    fields: [applicationStageHistory.changedByUserId],
    references: [users.id],
  }),
}));

export const candidateShortlistsRelations = relations(candidateShortlists, ({ one }) => ({
  company: one(companies, {
    fields: [candidateShortlists.companyId],
    references: [companies.id],
  }),
  recruiter: one(recruiters, {
    fields: [candidateShortlists.recruiterId],
    references: [recruiters.id],
  }),
  candidate: one(users, {
    fields: [candidateShortlists.candidateId],
    references: [users.id],
  }),
  job: one(jobPostings, {
    fields: [candidateShortlists.jobId],
    references: [jobPostings.id],
  }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  company: one(companies, {
    fields: [referrals.companyId],
    references: [companies.id],
  }),
  referrer: one(users, {
    fields: [referrals.referrerId],
    references: [users.id],
  }),
  candidate: one(users, {
    fields: [referrals.candidateId],
    references: [users.id],
  }),
  job: one(jobPostings, {
    fields: [referrals.jobId],
    references: [jobPostings.id],
  }),
}));

export const referralRequestsRelations = relations(referralRequests, ({ one }) => ({
  candidate: one(users, {
    fields: [referralRequests.candidateId],
    references: [users.id],
  }),
  job: one(jobPostings, {
    fields: [referralRequests.jobId],
    references: [jobPostings.id],
  }),
  targetCompany: one(companies, {
    fields: [referralRequests.targetCompanyId],
    references: [companies.id],
  }),
}));

export const hiringChallengesRelations = relations(hiringChallenges, ({ one }) => ({
  company: one(companies, {
    fields: [hiringChallenges.companyId],
    references: [companies.id],
  }),
  recruiter: one(recruiters, {
    fields: [hiringChallenges.recruiterId],
    references: [recruiters.id],
  }),
  contest: one(contests, {
    fields: [hiringChallenges.contestId],
    references: [contests.id],
  }),
}));

export const hiringInterviewsRelations = relations(hiringInterviews, ({ one }) => ({
  application: one(jobApplications, {
    fields: [hiringInterviews.applicationId],
    references: [jobApplications.id],
  }),
  interviewer: one(users, {
    fields: [hiringInterviews.interviewerId],
    references: [users.id],
  }),
}));
