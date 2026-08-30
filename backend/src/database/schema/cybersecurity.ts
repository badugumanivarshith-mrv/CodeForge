import { pgTable, uuid, varchar, timestamp, doublePrecision, jsonb } from 'drizzle-orm/pg-core';
import { threatSeverityEnum, threatStatusEnum, vulnerabilityStatusEnum, incidentStatusEnum } from './enums';

export const securityEvents = pgTable('security_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventType: varchar('event_type', { length: 255 }).notNull(),
  sourceIp: varchar('source_ip', { length: 45 }).notNull(),
  severity: threatSeverityEnum('severity').notNull(),
  payload: jsonb('payload').default({}).notNull(),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

export const threats = pgTable('threats', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1024 }).notNull(),
  severity: threatSeverityEnum('severity').notNull(),
  status: threatStatusEnum('status').notNull(),
  affectedSystems: jsonb('affected_systems').$type<string[]>().default([]).notNull(),
  mitigationSteps: jsonb('mitigation_steps').$type<string[]>().default([]).notNull(),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
});

export const vulnerabilities = pgTable('vulnerabilities', {
  id: uuid('id').defaultRandom().primaryKey(),
  cveId: varchar('cve_id', { length: 30 }).notNull(),
  packageName: varchar('package_name', { length: 255 }).notNull(),
  severity: threatSeverityEnum('severity').notNull(),
  status: vulnerabilityStatusEnum('status').notNull(),
  cvssScore: doublePrecision('cvss_score').notNull().default(0.0),
  description: varchar('description', { length: 1024 }).notNull(),
  remediationPlan: varchar('remediation_plan', { length: 1024 }).notNull(),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
});

export const incidents = pgTable('incidents', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: varchar('description', { length: 1024 }).notNull(),
  severity: threatSeverityEnum('severity').notNull(),
  status: incidentStatusEnum('status').notNull(),
  assignedTeam: varchar('assigned_team', { length: 255 }).notNull(),
  containmentAction: varchar('containment_action', { length: 1024 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
