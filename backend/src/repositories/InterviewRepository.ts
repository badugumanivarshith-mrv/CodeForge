import { eq, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  interviewSessions,
  interviewExchanges,
} from '../database/schema';

import { IInterviewRepository } from './interfaces/IInterviewRepository';
import {
  InterviewSessionDto,
  InterviewExchangeDto,
  StartInterviewDto,
  InterviewType,
  InterviewStatus,
  ProblemDifficulty,
} from '@codeforge/shared';

export class InterviewRepository implements IInterviewRepository {
  async createSession(userId: string, data: StartInterviewDto): Promise<InterviewSessionDto> {
    const [inserted] = await db
      .insert(interviewSessions)
      .values({
        userId,
        interviewType: data.interviewType,
        roleTitle: data.roleTitle,
        difficulty: data.difficulty as ProblemDifficulty,
        status: InterviewStatus.IN_PROGRESS,
        startedAt: new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      userId: inserted.userId,
      interviewType: inserted.interviewType as InterviewType,
      roleTitle: inserted.roleTitle,
      difficulty: inserted.difficulty as ProblemDifficulty,
      status: inserted.status as InterviewStatus,
      currentQuestionIndex: 0,
      totalQuestions: 5,
      startedAt: inserted.startedAt.toISOString(),
    };
  }

  async getSessionById(id: string): Promise<InterviewSessionDto | null> {
    const rows = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    const exchanges = await this.getExchanges(id);

    return {
      id: r.id,
      userId: r.userId,
      interviewType: r.interviewType as InterviewType,
      roleTitle: r.roleTitle,
      difficulty: r.difficulty as ProblemDifficulty,
      status: r.status as InterviewStatus,
      currentQuestionIndex: exchanges.filter(e => e.userAnswerText !== undefined && e.userAnswerText !== null).length,
      totalQuestions: Math.max(5, exchanges.length),
      overallScore: r.overallScore || undefined,
      communicationScore: r.communicationScore || undefined,
      technicalScore: r.technicalScore || undefined,
      confidenceScore: r.confidenceScore || undefined,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt ? r.completedAt.toISOString() : undefined,
    };
  }

  async getUserSessions(userId: string): Promise<InterviewSessionDto[]> {
    const rows = await db
      .select()
      .from(interviewSessions)
      .where(eq(interviewSessions.userId, userId))
      .orderBy(desc(interviewSessions.startedAt));

    return rows.map(r => ({
      id: r.id,
      userId: r.userId,
      interviewType: r.interviewType as InterviewType,
      roleTitle: r.roleTitle,
      difficulty: r.difficulty as ProblemDifficulty,
      status: r.status as InterviewStatus,
      currentQuestionIndex: 0,
      totalQuestions: 5,
      overallScore: r.overallScore || undefined,
      communicationScore: r.communicationScore || undefined,
      technicalScore: r.technicalScore || undefined,
      confidenceScore: r.confidenceScore || undefined,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt ? r.completedAt.toISOString() : undefined,
    }));
  }

  async createExchange(sessionId: string, questionOrder: number, questionText: string): Promise<InterviewExchangeDto> {
    const [inserted] = await db
      .insert(interviewExchanges)
      .values({
        sessionId,
        questionOrder,
        questionText,
        timeSpentSeconds: 0,
        createdAt: new Date(),
      })
      .returning();

    return {
      id: inserted.id,
      sessionId: inserted.sessionId,
      questionOrder: inserted.questionOrder,
      questionText: inserted.questionText,
      createdAt: inserted.createdAt.toISOString(),
    };
  }

  async getExchangeById(id: string): Promise<InterviewExchangeDto | null> {
    const rows = await db
      .select()
      .from(interviewExchanges)
      .where(eq(interviewExchanges.id, id))
      .limit(1);

    if (rows.length === 0) return null;
    const r = rows[0];

    return {
      id: r.id,
      sessionId: r.sessionId,
      questionOrder: r.questionOrder,
      questionText: r.questionText,
      userAnswerText: r.userAnswerText || undefined,
      evaluationFeedback: r.evaluationFeedback || undefined,
      score: r.score || undefined,
      timeSpentSeconds: r.timeSpentSeconds,
      createdAt: r.createdAt.toISOString(),
    };
  }

  async getExchanges(sessionId: string): Promise<InterviewExchangeDto[]> {
    const rows = await db
      .select()
      .from(interviewExchanges)
      .where(eq(interviewExchanges.sessionId, sessionId))
      .orderBy(interviewExchanges.questionOrder);

    return rows.map(r => ({
      id: r.id,
      sessionId: r.sessionId,
      questionOrder: r.questionOrder,
      questionText: r.questionText,
      userAnswerText: r.userAnswerText || undefined,
      evaluationFeedback: r.evaluationFeedback || undefined,
      score: r.score || undefined,
      timeSpentSeconds: r.timeSpentSeconds,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  async recordAnswer(
    exchangeId: string,
    userAnswerText: string,
    evaluationFeedback: string,
    score: number,
    timeSpentSeconds: number = 0,
  ): Promise<InterviewExchangeDto> {
    const [updated] = await db
      .update(interviewExchanges)
      .set({
        userAnswerText,
        evaluationFeedback,
        score,
        timeSpentSeconds,
      })
      .where(eq(interviewExchanges.id, exchangeId))
      .returning();

    return {
      id: updated.id,
      sessionId: updated.sessionId,
      questionOrder: updated.questionOrder,
      questionText: updated.questionText,
      userAnswerText: updated.userAnswerText || undefined,
      evaluationFeedback: updated.evaluationFeedback || undefined,
      score: updated.score || undefined,
      timeSpentSeconds: updated.timeSpentSeconds,
      createdAt: updated.createdAt.toISOString(),
    };
  }

  async completeSession(
    sessionId: string,
    overallScore: number,
    communicationScore: number,
    technicalScore: number,
    confidenceScore: number,
    feedbackSummaryMdx: string,
    improvements: string[],
  ): Promise<InterviewSessionDto> {
    const [updated] = await db
      .update(interviewSessions)
      .set({
        status: InterviewStatus.COMPLETED,
        overallScore,
        communicationScore,
        technicalScore,
        confidenceScore,
        feedbackSummaryMdx,
        improvementsJson: improvements,
        completedAt: new Date(),
      })
      .where(eq(interviewSessions.id, sessionId))
      .returning();

    return {
      id: updated.id,
      userId: updated.userId,
      interviewType: updated.interviewType as InterviewType,
      roleTitle: updated.roleTitle,
      difficulty: updated.difficulty as ProblemDifficulty,
      status: updated.status as InterviewStatus,
      currentQuestionIndex: 5,
      totalQuestions: 5,
      overallScore: updated.overallScore || undefined,
      communicationScore: updated.communicationScore || undefined,
      technicalScore: updated.technicalScore || undefined,
      confidenceScore: updated.confidenceScore || undefined,
      startedAt: updated.startedAt.toISOString(),
      completedAt: updated.completedAt ? updated.completedAt.toISOString() : undefined,
    };
  }
}
