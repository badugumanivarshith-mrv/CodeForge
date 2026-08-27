import { eq, and, desc, asc } from 'drizzle-orm';
import { db } from '../database/connection';
import { aiSessions, aiMessages, mistakeMemory } from '../database/schema';
import { IMentorRepository } from './interfaces/IMentorRepository';
import {
  AIInteractionType,
  LanguageId,
  MistakeCategory,
  MentorSessionDto,
  MentorMessageDto,
  SocraticHintLevel,
} from '@codeforge/shared';

export class MentorRepository implements IMentorRepository {
  public async createSession(
    userId: string,
    interactionType: AIInteractionType,
    contextType: 'problem' | 'topic' | 'lesson' | 'general' | 'practice',
    contextId: string,
  ): Promise<MentorSessionDto> {
    const [session] = await db
      .insert(aiSessions)
      .values({
        userId,
        interactionType,
        contextType,
        contextId,
      })
      .returning();

    return {
      id: session.id,
      userId: session.userId,
      interactionType: session.interactionType,
      contextType: session.contextType as 'problem' | 'topic' | 'lesson' | 'general' | 'practice',
      contextId: session.contextId,
      currentHintLevel: 1 as SocraticHintLevel,
      createdAt: session.createdAt.toISOString(),
      endedAt: session.endedAt?.toISOString() || null,
      messages: [],
    };
  }

  public async getSessionById(sessionId: string, userId?: string): Promise<MentorSessionDto | null> {
    const conditions = [eq(aiSessions.id, sessionId)];
    if (userId) {
      conditions.push(eq(aiSessions.userId, userId));
    }

    const [session] = await db
      .select()
      .from(aiSessions)
      .where(and(...conditions))
      .limit(1);

    if (!session) return null;

    const messages = await this.getSessionMessages(sessionId);

    return {
      id: session.id,
      userId: session.userId,
      interactionType: session.interactionType,
      contextType: session.contextType as 'problem' | 'topic' | 'lesson' | 'general' | 'practice',
      contextId: session.contextId,
      currentHintLevel: 1 as SocraticHintLevel,
      createdAt: session.createdAt.toISOString(),
      endedAt: session.endedAt?.toISOString() || null,
      messages,
    };
  }

  public async getUserSessions(userId: string, limit = 20): Promise<MentorSessionDto[]> {
    const rows = await db
      .select()
      .from(aiSessions)
      .where(eq(aiSessions.userId, userId))
      .orderBy(desc(aiSessions.createdAt))
      .limit(limit);

    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      interactionType: r.interactionType,
      contextType: r.contextType as 'problem' | 'topic' | 'lesson' | 'general' | 'practice',
      contextId: r.contextId,
      currentHintLevel: 1 as SocraticHintLevel,
      createdAt: r.createdAt.toISOString(),
      endedAt: r.endedAt?.toISOString() || null,
    }));
  }

  public async addMessage(
    sessionId: string,
    sender: 'user' | 'assistant' | 'system',
    messageText: string,
    codeContext?: string,
    tokensUsed = 0,
  ): Promise<MentorMessageDto> {
    const [msg] = await db
      .insert(aiMessages)
      .values({
        sessionId,
        sender,
        messageText,
        codeContext: codeContext || null,
        tokensUsed,
      })
      .returning();

    return {
      id: msg.id,
      sessionId: msg.sessionId,
      role: msg.sender as 'user' | 'assistant' | 'system',
      content: msg.messageText,
      codeContext: msg.codeContext || undefined,
      createdAt: msg.createdAt.toISOString(),
    };
  }

  public async getSessionMessages(sessionId: string): Promise<MentorMessageDto[]> {
    const rows = await db
      .select()
      .from(aiMessages)
      .where(eq(aiMessages.sessionId, sessionId))
      .orderBy(asc(aiMessages.createdAt));

    return rows.map(r => ({
      id: r.id,
      sessionId: r.sessionId,
      role: r.sender as 'user' | 'assistant' | 'system',
      content: r.messageText,
      codeContext: r.codeContext || undefined,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  public async recordMistakeMemory(data: {
    userId: string;
    languageId: LanguageId;
    topicId: string;
    problemId?: string;
    mistakeCategory: MistakeCategory;
    errorSignature: string;
    codeSnippet: string;
    explanation: string;
  }): Promise<void> {
    await db.insert(mistakeMemory).values({
      userId: data.userId,
      languageId: data.languageId,
      topicId: data.topicId,
      problemId: data.problemId || null,
      mistakeCategory: data.mistakeCategory,
      errorSignature: data.errorSignature,
      codeSnippet: data.codeSnippet,
      explanation: data.explanation,
    });
  }

  public async getMistakeMemory(
    userId: string,
    topicId?: string,
    limit = 10,
  ): Promise<
    Array<{
      id: string;
      userId: string;
      languageId: LanguageId;
      topicId: string;
      problemId?: string | null;
      mistakeCategory: MistakeCategory;
      errorSignature: string;
      codeSnippet: string;
      explanation: string;
      createdAt: Date;
    }>
  > {
    const conditions = [eq(mistakeMemory.userId, userId)];
    if (topicId) {
      conditions.push(eq(mistakeMemory.topicId, topicId));
    }

    const rows = await db
      .select()
      .from(mistakeMemory)
      .where(and(...conditions))
      .orderBy(desc(mistakeMemory.createdAt))
      .limit(limit);

    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      languageId: r.languageId as LanguageId,
      topicId: r.topicId,
      problemId: r.problemId,
      mistakeCategory: r.mistakeCategory as MistakeCategory,
      errorSignature: r.errorSignature,
      codeSnippet: r.codeSnippet,
      explanation: r.explanation,
      createdAt: r.createdAt,
    }));
  }
}
