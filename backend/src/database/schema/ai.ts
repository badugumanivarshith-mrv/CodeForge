import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  text,
  integer,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { aiInteractionTypeEnum, languageIdEnum, mistakeCategoryEnum } from './enums';
import { users } from './users';
import { topics, languages } from './curriculum';
import { problems } from './problems';

export const aiSessions = pgTable(
  'ai_sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    interactionType: aiInteractionTypeEnum('interaction_type').notNull(),
    contextType: varchar('context_type', { length: 30 }).notNull(), // 'lesson', 'problem', 'assignment'
    contextId: uuid('context_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
  },
  table => ({
    userIdx: index('idx_ai_sessions_user').on(table.userId),
  }),
);

export const aiMessages = pgTable(
  'ai_messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sessionId: uuid('session_id')
      .notNull()
      .references(() => aiSessions.id, { onDelete: 'cascade' }),
    sender: varchar('sender', { length: 20 }).notNull(), // 'user', 'assistant', 'system'
    messageText: text('message_text').notNull(),
    codeContext: text('code_context'),
    tokensUsed: integer('tokens_used').default(0).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    sessionIdx: index('idx_ai_messages_session').on(table.sessionId),
  }),
);

export const mistakeMemory = pgTable(
  'mistake_memory',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    languageId: languageIdEnum('language_id')
      .notNull()
      .references(() => languages.id, { onDelete: 'cascade' }),
    topicId: uuid('topic_id')
      .notNull()
      .references(() => topics.id, { onDelete: 'cascade' }),
    problemId: uuid('problem_id').references(() => problems.id, { onDelete: 'set null' }),
    mistakeCategory: mistakeCategoryEnum('mistake_category').notNull(),
    errorSignature: varchar('error_signature', { length: 255 }).notNull(),
    codeSnippet: text('code_snippet').notNull(),
    explanation: text('explanation').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  table => ({
    userTopicIdx: index('idx_mistake_memory_user_topic').on(table.userId, table.topicId),
  }),
);

export const aiFeedback = pgTable('ai_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  sessionId: uuid('session_id')
    .notNull()
    .references(() => aiSessions.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  helpfulnessRating: integer('helpfulness_rating').notNull(), // 1 to 5
  userComment: text('user_comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const aiSessionsRelations = relations(aiSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [aiSessions.userId],
    references: [users.id],
  }),
  messages: many(aiMessages),
  feedback: many(aiFeedback),
}));

export const aiMessagesRelations = relations(aiMessages, ({ one }) => ({
  session: one(aiSessions, {
    fields: [aiMessages.sessionId],
    references: [aiSessions.id],
  }),
}));
