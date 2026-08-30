import { pgTable, uuid, varchar, integer, timestamp, doublePrecision, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { assetTypeEnum, analysisStatusEnum, reasoningComplexityEnum } from './enums';

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  storageUrl: varchar('storage_url', { length: 1024 }).notNull(),
  assetType: assetTypeEnum('asset_type').notNull(),
  fileSizeCharacters: integer('file_size_characters').notNull().default(0),
  checksum: varchar('checksum', { length: 64 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const analysisResults = pgTable('analysis_results', {
  id: uuid('id').defaultRandom().primaryKey(),
  assetId: uuid('asset_id')
    .references(() => mediaAssets.id, { onDelete: 'cascade' })
    .notNull(),
  status: analysisStatusEnum('status').notNull(),
  detectedTags: jsonb('detected_tags').$type<string[]>().default([]).notNull(),
  ocrText: varchar('ocr_text', { length: 4096 }),
  confidenceScore: doublePrecision('confidence_score').notNull().default(1.0),
  metadata: jsonb('metadata').default({}).notNull(),
  analyzedAt: timestamp('analyzed_at').defaultNow().notNull(),
});

export const reasoningSessions = pgTable('reasoning_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionName: varchar('session_name', { length: 255 }).notNull(),
  complexity: reasoningComplexityEnum('complexity').notNull(),
  promptQuery: varchar('prompt_query', { length: 1024 }).notNull(),
  reasoningSteps: jsonb('reasoning_steps').$type<string[]>().default([]).notNull(),
  cognitiveOutput: varchar('cognitive_output', { length: 4096 }).notNull(),
  confidenceScore: doublePrecision('confidence_score').notNull().default(1.0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const multimodalKnowledge = pgTable('multimodal_knowledge', {
  id: uuid('id').defaultRandom().primaryKey(),
  conceptName: varchar('concept_name', { length: 255 }).notNull(),
  associatedTags: jsonb('associated_tags').$type<string[]>().default([]).notNull(),
  crossMediaSummary: varchar('cross_media_summary', { length: 4096 }).notNull(),
  extractedRelations: jsonb('extracted_relations')
    .$type<Array<{ targetConcept: string; predicate: string }>>()
    .default([])
    .notNull(),
  verifiedAt: timestamp('verified_at').defaultNow().notNull(),
});

// Setup relations
export const mediaAssetsRelations = relations(mediaAssets, ({ many }) => ({
  analysisResults: many(analysisResults),
}));

export const analysisResultsRelations = relations(analysisResults, ({ one }) => ({
  mediaAsset: one(mediaAssets, {
    fields: [analysisResults.assetId],
    references: [mediaAssets.id],
  }),
}));
