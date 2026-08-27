import { db } from '../database/connection';
import {
  contests,
  contestProblems,
  contestParticipants,
  contestSubmissions,
  problems,
  users,
  userProfiles,
} from '../database/schema';
import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { IContestRepository } from './interfaces/IContestRepository';
import { ContestState } from '@codeforge/shared';

export class ContestRepository implements IContestRepository {
  async listContests(status?: ContestState): Promise<any[]> {
    const query = db
      .select({
        id: contests.id,
        slug: contests.slug,
        title: contests.title,
        descriptionMdx: contests.descriptionMdx,
        status: contests.status,
        startAt: contests.startAt,
        endAt: contests.endAt,
        durationMinutes: contests.durationMinutes,
        createdBy: contests.createdBy,
        participantCount: contests.participantCount,
        totalPoints: contests.totalPoints,
        rulesJson: contests.rulesJson,
        scoringFormula: contests.scoringFormula,
        createdAt: contests.createdAt,
      })
      .from(contests);

    if (status) {
      query.where(eq(contests.status, status));
    }

    return await query.orderBy(asc(contests.startAt));
  }

  async getContestById(id: string): Promise<any | null> {
    const [c] = await db
      .select()
      .from(contests)
      .where(eq(contests.id, id))
      .limit(1);

    return c || null;
  }

  async getContestBySlug(slug: string): Promise<any | null> {
    const [c] = await db
      .select()
      .from(contests)
      .where(eq(contests.slug, slug))
      .limit(1);

    return c || null;
  }

  async createContest(data: {
    slug: string;
    title: string;
    descriptionMdx: string;
    status: ContestState;
    startAt: Date;
    endAt: Date;
    durationMinutes: number;
    createdBy?: string;
    totalPoints: number;
    rulesJson?: Record<string, unknown>;
    scoringFormula?: string;
  }): Promise<any> {
    const [c] = await db
      .insert(contests)
      .values({
        slug: data.slug,
        title: data.title,
        descriptionMdx: data.descriptionMdx,
        status: data.status,
        startAt: data.startAt,
        endAt: data.endAt,
        durationMinutes: data.durationMinutes,
        createdBy: data.createdBy,
        totalPoints: data.totalPoints,
        rulesJson: data.rulesJson || {},
        scoringFormula: data.scoringFormula || 'standard_icpc',
      })
      .returning();

    return c;
  }

  async addContestProblem(data: {
    contestId: string;
    problemId: string;
    sequence: number;
    points: number;
    penaltyMinutes: number;
  }): Promise<any> {
    const [cp] = await db
      .insert(contestProblems)
      .values({
        contestId: data.contestId,
        problemId: data.problemId,
        sequence: data.sequence,
        points: data.points,
        penaltyMinutes: data.penaltyMinutes,
      })
      .returning();

    return cp;
  }

  async getContestProblems(contestId: string): Promise<any[]> {
    return await db
      .select({
        id: contestProblems.id,
        contestId: contestProblems.contestId,
        problemId: contestProblems.problemId,
        sequence: contestProblems.sequence,
        points: contestProblems.points,
        penaltyMinutes: contestProblems.penaltyMinutes,
        title: problems.title,
        difficulty: problems.difficulty,
        slug: problems.slug,
        promptMdx: problems.promptMdx,
        starterCode: problems.starterCode,
      })
      .from(contestProblems)
      .innerJoin(problems, eq(contestProblems.problemId, problems.id))
      .where(eq(contestProblems.contestId, contestId))
      .orderBy(asc(contestProblems.sequence));
  }

  async getParticipant(contestId: string, userId: string): Promise<any | null> {
    const [p] = await db
      .select()
      .from(contestParticipants)
      .where(
        and(
          eq(contestParticipants.contestId, contestId),
          eq(contestParticipants.userId, userId),
        ),
      )
      .limit(1);

    return p || null;
  }

  async registerParticipant(contestId: string, userId: string): Promise<any> {
    const [p] = await db
      .insert(contestParticipants)
      .values({
        contestId,
        userId,
        status: 'registered',
      })
      .returning();

    await db
      .update(contests)
      .set({
        participantCount: sql`${contests.participantCount} + 1`,
      })
      .where(eq(contests.id, contestId));

    return p;
  }

  async updateParticipant(
    id: string,
    data: {
      startedAt?: Date;
      finishedAt?: Date;
      score?: number;
      penaltyTimeMinutes?: number;
      rank?: number;
      finalRatingChange?: number;
      status?: string;
    },
  ): Promise<any> {
    const updateData: any = {};
    if (data.startedAt !== undefined) updateData.startedAt = data.startedAt;
    if (data.finishedAt !== undefined) updateData.finishedAt = data.finishedAt;
    if (data.score !== undefined) updateData.score = data.score;
    if (data.penaltyTimeMinutes !== undefined) updateData.penaltyTimeMinutes = data.penaltyTimeMinutes;
    if (data.rank !== undefined) updateData.rank = data.rank;
    if (data.finalRatingChange !== undefined) updateData.finalRatingChange = data.finalRatingChange;
    if (data.status !== undefined) updateData.status = data.status;

    const [updated] = await db
      .update(contestParticipants)
      .set(updateData)
      .where(eq(contestParticipants.id, id))
      .returning();

    return updated;
  }

  async listParticipants(contestId: string): Promise<any[]> {
    return await db
      .select({
        id: contestParticipants.id,
        contestId: contestParticipants.contestId,
        userId: contestParticipants.userId,
        username: users.username,
        displayName: userProfiles.fullName,
        avatarUrl: userProfiles.avatarUrl,

        registeredAt: contestParticipants.registeredAt,
        startedAt: contestParticipants.startedAt,
        finishedAt: contestParticipants.finishedAt,
        score: contestParticipants.score,
        penaltyTimeMinutes: contestParticipants.penaltyTimeMinutes,
        rank: contestParticipants.rank,
        finalRatingChange: contestParticipants.finalRatingChange,
        status: contestParticipants.status,
      })
      .from(contestParticipants)
      .innerJoin(users, eq(contestParticipants.userId, users.id))
      .leftJoin(userProfiles, eq(users.id, userProfiles.userId))
      .where(eq(contestParticipants.contestId, contestId))
      .orderBy(desc(contestParticipants.score), asc(contestParticipants.penaltyTimeMinutes));
  }

  async recordContestSubmission(data: {
    contestId: string;
    participantId: string;
    problemId: string;
    submissionId: string;
    scoreEarned: number;
    isPassed: boolean;
    penaltyAppliedMinutes: number;
  }): Promise<any> {
    const [sub] = await db
      .insert(contestSubmissions)
      .values({
        contestId: data.contestId,
        participantId: data.participantId,
        problemId: data.problemId,
        submissionId: data.submissionId,
        scoreEarned: data.scoreEarned,
        isPassed: data.isPassed,
        penaltyAppliedMinutes: data.penaltyAppliedMinutes,
      })
      .returning();

    return sub;
  }

  async getContestSubmissions(contestId: string, participantId?: string): Promise<any[]> {
    const conditions = [eq(contestSubmissions.contestId, contestId)];
    if (participantId) {
      conditions.push(eq(contestSubmissions.participantId, participantId));
    }

    return await db
      .select()
      .from(contestSubmissions)
      .where(and(...conditions))
      .orderBy(asc(contestSubmissions.submittedAt));
  }
}
