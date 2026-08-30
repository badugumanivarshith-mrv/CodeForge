import { pgTable, text, timestamp, uuid, integer, doublePrecision, boolean, jsonb } from 'drizzle-orm/pg-core';
import {
  SoftwareProjectType,
  SoftwareProjectStatus,
  EngineeringTaskType,
  EngineeringTaskStatus,
  ArtifactType,
  BlueprintComplexity,
} from '@codeforge/shared';
import {
  softwareProjectTypeEnum,
  softwareProjectStatusEnum,
  engineeringTaskTypeEnum,
  engineeringTaskStatusEnum,
  artifactTypeEnum,
  blueprintComplexityEnum,
} from './enums';

// 1. Software Projects Table
export const softwareProjects = pgTable('software_projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  projectType: softwareProjectTypeEnum('project_type').notNull(),
  status: softwareProjectStatusEnum('status').default(SoftwareProjectStatus.PLANNING).notNull(),
  complexity: blueprintComplexityEnum('complexity').default(BlueprintComplexity.MEDIUM).notNull(),
  targetPlatform: text('target_platform').notNull(),
  frameworks: jsonb('frameworks').$type<string[]>().default([]).notNull(),
  dependencies: jsonb('dependencies').$type<string[]>().default([]).notNull(),
  linesOfCodeGenerated: integer('lines_of_code_generated').default(0).notNull(),
  buildStatus: text('build_status').$type<'SUCCESS' | 'FAILED' | 'PENDING'>().default('PENDING').notNull(),
  deploymentUrl: text('deployment_url'),
  repositoryUrl: text('repository_url'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 2. Engineering Tasks Table
export const engineeringTasks = pgTable('engineering_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => softwareProjects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  taskType: engineeringTaskTypeEnum('task_type').notNull(),
  status: engineeringTaskStatusEnum('status').default(EngineeringTaskStatus.BACKLOG).notNull(),
  assignedAgent: text('assigned_agent').notNull(),
  estimatedHours: doublePrecision('estimated_hours').default(0).notNull(),
  actualHoursSpent: doublePrecision('actual_hours_spent').default(0).notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 3. Generated Artifacts Table
export const generatedArtifacts = pgTable('generated_artifacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => softwareProjects.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id')
    .references(() => engineeringTasks.id, { onDelete: 'set null' }),
  filePath: text('file_path').notNull(),
  artifactType: artifactTypeEnum('artifact_type').notNull(),
  fileContent: text('file_content').notNull(),
  fileSizeCharacters: integer('file_size_characters').default(0).notNull(),
  checksum: text('checksum').notNull(),
  generatedAt: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. Architecture Blueprints Table
export const architectureBlueprints = pgTable('architecture_blueprints', {
  id: uuid('id').defaultRandom().primaryKey(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => softwareProjects.id, { onDelete: 'cascade' }),
  diagramMermaid: text('diagram_mermaid').notNull(),
  componentLayout: jsonb('component_layout').default({}).notNull(),
  apiGateways: jsonb('api_gateways').default([]).notNull(),
  databaseSchemas: jsonb('database_schemas').default({}).notNull(),
  deploymentSpecs: jsonb('deployment_specs').default({}).notNull(),
  designedAt: timestamp('designed_at', { withTimezone: true }).defaultNow().notNull(),
});
