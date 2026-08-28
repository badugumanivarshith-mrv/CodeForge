import { pgTable, uuid, varchar, text, timestamp, boolean, integer, jsonb, numeric } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import {
  orgMemberRoleEnum,
  orgPlanEnum,
  cohortStatusEnum,
  courseLevelEnum,
  courseStatusEnum,
  courseEnrollmentStatusEnum,
  mentorSessionStatusEnum,
  studentPlacementStatusEnum,
  certificationStatusEnum,
} from './enums';
import {
  OrgMemberRole,
  OrgPlan,
  CohortStatus,
  CourseLevel,
  CourseStatus,
  CourseEnrollmentStatus,
  MentorSessionStatus,
  StudentPlacementStatus,
  CertificationStatus,
} from '@codeforge/shared';

// ==========================================
// 1. Multi-Organization & Tenant Schema
// ==========================================

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logoUrl: text('logo_url'),
  domain: varchar('domain', { length: 255 }),
  themeConfig: jsonb('theme_config'),
  plan: orgPlanEnum('plan').notNull().default(OrgPlan.STARTER),
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: orgMemberRoleEnum('role').notNull().default(OrgMemberRole.MEMBER),
  department: varchar('department', { length: 255 }),
  title: varchar('title', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const departments = pgTable('departments', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  headUserId: uuid('head_user_id').references(() => users.id, { onDelete: 'set null' }),
  budget: integer('budget').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const teams = pgTable('teams', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  leadUserId: uuid('lead_user_id').references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const teamMembers = pgTable('team_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  teamId: uuid('team_id')
    .notNull()
    .references(() => teams.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
});

export const cohorts = pgTable('cohorts', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id')
    .notNull()
    .references(() => organizations.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 50 }).notNull(),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }).notNull(),
  capacity: integer('capacity').notNull().default(50),
  status: cohortStatusEnum('status').notNull().default(CohortStatus.UPCOMING),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ==========================================
// 2. University Management Schema
// ==========================================

export const universities = pgTable('universities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  logoUrl: text('logo_url'),
  website: varchar('website', { length: 500 }),
  state: varchar('state', { length: 100 }),
  country: varchar('country', { length: 100 }).default('USA'),
  accreditationGrade: varchar('accreditation_grade', { length: 20 }),
  ranking: integer('ranking'),
  isVerified: boolean('is_verified').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const batches = pgTable('batches', {
  id: uuid('id').defaultRandom().primaryKey(),
  universityId: uuid('university_id')
    .notNull()
    .references(() => universities.id, { onDelete: 'cascade' }),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 100 }).notNull(),
  graduationYear: integer('graduation_year').notNull(),
  totalStudents: integer('total_students').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const students = pgTable('students', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  universityId: uuid('university_id')
    .notNull()
    .references(() => universities.id, { onDelete: 'cascade' }),
  departmentId: uuid('department_id').references(() => departments.id, { onDelete: 'set null' }),
  batchId: uuid('batch_id').references(() => batches.id, { onDelete: 'set null' }),
  studentRollNumber: varchar('student_roll_number', { length: 100 }).notNull(),
  cgpa: numeric('cgpa', { precision: 4, scale: 2 }).notNull().default('0.00'),
  semester: integer('semester').notNull().default(1),
  placementStatus: studentPlacementStatusEnum('placement_status')
    .notNull()
    .default(StudentPlacementStatus.UNPLACED),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const academicRecords = pgTable('academic_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'cascade' }),
  semester: integer('semester').notNull(),
  sgpa: numeric('sgpa', { precision: 4, scale: 2 }).notNull(),
  creditsCompleted: integer('credits_completed').notNull().default(0),
  backlogCount: integer('backlog_count').notNull().default(0),
  termDate: timestamp('term_date', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const placementRecords = pgTable('placement_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'cascade' }),
  universityId: uuid('university_id')
    .notNull()
    .references(() => universities.id, { onDelete: 'cascade' }),
  companyName: varchar('company_name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  packageLpa: numeric('package_lpa', { precision: 6, scale: 2 }).notNull(),
  offerDate: timestamp('offer_date', { withTimezone: true }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('accepted'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ==========================================
// 3. Faculty & Mentor Ecosystem Schema
// ==========================================

export const mentors = pgTable('mentors', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' })
    .unique(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
  specialization: jsonb('specialization').$type<string[]>().notNull().default([]),
  bio: text('bio').notNull().default(''),
  hourlyRate: integer('hourly_rate').notNull().default(0),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('5.00'),
  totalSessions: integer('total_sessions').notNull().default(0),
  isAvailable: boolean('is_available').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const mentorSessions = pgTable('mentor_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  mentorId: uuid('mentor_id')
    .notNull()
    .references(() => mentors.id, { onDelete: 'cascade' }),
  menteeUserId: uuid('mentee_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  topic: varchar('topic', { length: 255 }).notNull(),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }).notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(45),
  meetingUrl: text('meeting_url'),
  status: mentorSessionStatusEnum('status').notNull().default(MentorSessionStatus.SCHEDULED),
  notes: text('notes'),
  rating: integer('rating'),
  feedback: text('feedback'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const studentMentorships = pgTable('student_mentorships', {
  id: uuid('id').defaultRandom().primaryKey(),
  mentorId: uuid('mentor_id')
    .notNull()
    .references(() => mentors.id, { onDelete: 'cascade' }),
  studentId: uuid('student_id')
    .notNull()
    .references(() => students.id, { onDelete: 'cascade' }),
  startDate: timestamp('start_date', { withTimezone: true }).notNull().defaultNow(),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  goals: jsonb('goals').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ==========================================
// 4. Enterprise LMS & Certification Schema
// ==========================================

export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull().default(''),
  level: courseLevelEnum('level').notNull().default(CourseLevel.BEGINNER),
  price: integer('price').notNull().default(0),
  status: courseStatusEnum('status').notNull().default(CourseStatus.PUBLISHED),
  thumbnailUrl: text('thumbnail_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const courseModules = pgTable('course_modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  sequence: integer('sequence').notNull().default(1),
  durationMinutes: integer('duration_minutes').notNull().default(60),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const courseEnrollments = pgTable('course_enrollments', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  cohortId: uuid('cohort_id').references(() => cohorts.id, { onDelete: 'set null' }),
  progressPercentage: integer('progress_percentage').notNull().default(0),
  status: courseEnrollmentStatusEnum('status').notNull().default(CourseEnrollmentStatus.ENROLLED),
  enrolledAt: timestamp('enrolled_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const learningPaths = pgTable('learning_paths', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull().default(''),
  targetRole: varchar('target_role', { length: 150 }).notNull(),
  courseIds: jsonb('course_ids').$type<string[]>().notNull().default([]),
  estimatedHours: integer('estimated_hours').notNull().default(40),
  status: varchar('status', { length: 50 }).notNull().default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const certificateTemplates = pgTable('certificate_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
  name: varchar('name', { length: 255 }).notNull(),
  templateHtml: text('template_html'),
  badgeImageUrl: text('badge_image_url'),
  issuerName: varchar('issuer_name', { length: 255 }).notNull().default('CodeForge University & Enterprise'),
  criteriaJson: jsonb('criteria_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const certifications = pgTable('certifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateNumber: varchar('certificate_number', { length: 100 }).notNull().unique(),
  recipientUserId: uuid('recipient_user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  organizationId: uuid('organization_id').references(() => organizations.id, { onDelete: 'set null' }),
  templateId: uuid('template_id').references(() => certificateTemplates.id, { onDelete: 'set null' }),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'set null' }),
  skillName: varchar('skill_name', { length: 255 }).notNull(),
  score: integer('score').notNull().default(100),
  issueDate: timestamp('issue_date', { withTimezone: true }).notNull().defaultNow(),
  expiryDate: timestamp('expiry_date', { withTimezone: true }),
  qrCodeUrl: text('qr_code_url').notNull(),
  verificationHash: varchar('verification_hash', { length: 255 }).notNull().unique(),
  isRevoked: boolean('is_revoked').notNull().default(false),
  status: certificationStatusEnum('status').notNull().default(CertificationStatus.ACTIVE),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const verificationLogs = pgTable('verification_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  certificateId: uuid('certificate_id')
    .notNull()
    .references(() => certifications.id, { onDelete: 'cascade' }),
  verifiedByIp: varchar('verified_by_ip', { length: 100 }),
  userAgent: text('user_agent'),
  verifiedAt: timestamp('verified_at', { withTimezone: true }).notNull().defaultNow(),
});

// ==========================================
// Table Relations
// ==========================================

export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(organizationMembers),
  departments: many(departments),
  teams: many(teams),
  cohorts: many(cohorts),
  courses: many(courses),
  learningPaths: many(learningPaths),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
}));

export const universitiesRelations = relations(universities, ({ many }) => ({
  batches: many(batches),
  students: many(students),
  placementRecords: many(placementRecords),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  user: one(users, {
    fields: [students.userId],
    references: [users.id],
  }),
  university: one(universities, {
    fields: [students.universityId],
    references: [universities.id],
  }),
  academicRecords: many(academicRecords),
  placementRecords: many(placementRecords),
}));

export const mentorsRelations = relations(mentors, ({ one, many }) => ({
  user: one(users, {
    fields: [mentors.userId],
    references: [users.id],
  }),
  sessions: many(mentorSessions),
  studentMentorships: many(studentMentorships),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(courseModules),
  enrollments: many(courseEnrollments),
}));

export const certificationsRelations = relations(certifications, ({ one, many }) => ({
  recipient: one(users, {
    fields: [certifications.recipientUserId],
    references: [users.id],
  }),
  template: one(certificateTemplates, {
    fields: [certifications.templateId],
    references: [certificateTemplates.id],
  }),
  course: one(courses, {
    fields: [certifications.courseId],
    references: [courses.id],
  }),
  logs: many(verificationLogs),
}));
