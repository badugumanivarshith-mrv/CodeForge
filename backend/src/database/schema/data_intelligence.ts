import { pgTable, uuid, varchar, timestamp, integer, jsonb, doublePrecision, boolean } from 'drizzle-orm/pg-core';
import { dataSourceTypeEnum, analyticsJobStatusEnum, insightTypeEnum, qualityRatingEnum } from './enums';

export const dataSources = pgTable('data_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  sourceType: dataSourceTypeEnum('source_type').notNull(),
  connectionDetails: jsonb('connection_details').default({}).notNull(),
  rowCount: integer('row_count').default(0).notNull(),
  fileSizeKb: integer('file_size_kb').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const analyticsJobs = pgTable('analytics_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id').references(() => dataSources.id).notNull(),
  jobName: varchar('job_name', { length: 255 }).notNull(),
  status: analyticsJobStatusEnum('status').notNull(),
  executionTimeMs: integer('execution_time_ms').default(0).notNull(),
  processedRowsCount: integer('processed_rows_count').default(0).notNull(),
  outputDetails: jsonb('output_details').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dataInsights = pgTable('insights', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  summary: varchar('summary', { length: 1024 }).notNull(),
  insightType: insightTypeEnum('insight_type').notNull(),
  confidenceScore: doublePrecision('confidence_score').default(0.0).notNull(),
  anomalyDetected: boolean('anomaly_detected').default(false).notNull(),
  historicalTrendDetails: jsonb('historical_trend_details').default({}).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const dataQualityReports = pgTable('data_quality_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  sourceId: uuid('source_id').references(() => dataSources.id).notNull(),
  completenessPercentage: doublePrecision('completeness_percentage').default(100.0).notNull(),
  duplicateCount: integer('duplicate_count').default(0).notNull(),
  nullValueCount: integer('null_value_count').default(0).notNull(),
  rating: qualityRatingEnum('rating').notNull(),
  runAt: timestamp('run_at').defaultNow().notNull(),
});
