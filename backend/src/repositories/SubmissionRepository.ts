import { eq, and, desc, asc, sql } from 'drizzle-orm';
import { db } from '../database/connection';
import { submissions, users, problems } from '../database/schema';
import { ISubmissionRepository } from './interfaces/ISubmissionRepository';
import {
  SubmissionDto,
  SubmissionStatus,
  LanguageId,
  JudgeVerdict,
  SubmissionFilterQueryDto,
} from '@codeforge/shared';

export class SubmissionRepository implements ISubmissionRepository {
  public async create(data: {
    userId: string;
    problemId: string;
    languageId: LanguageId;
    sourceCode: string;
    contestId?: string;
  }): Promise<SubmissionDto> {
    const [row] = await db
      .insert(submissions)
      .values({
        userId: data.userId,
        problemId: data.problemId,
        contestId: data.contestId || null,
        languageId: data.languageId,
        sourceCode: data.sourceCode,
        status: SubmissionStatus.QUEUED,
      })
      .returning();

    return this.mapToDto(row);
  }

  public async findById(id: string): Promise<SubmissionDto | null> {
    const [row] = await db
      .select({
        submission: submissions,
        user: { username: users.username },
        problem: { title: problems.title, slug: problems.slug },
      })
      .from(submissions)
      .leftJoin(users, eq(submissions.userId, users.id))
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.id, id))
      .limit(1);

    if (!row) return null;
    return this.mapToJoinedDto(row);
  }

  public async updateStatus(
    id: string,
    status: SubmissionStatus,
    metadata?: {
      verdict?: JudgeVerdict;
      executionTimeMs?: number;
      memoryUsedKb?: number;
      passedTestCases?: number;
      totalTestCases?: number;
      compileOutput?: string;
    },
  ): Promise<void> {
    await db
      .update(submissions)
      .set({
        status,
        verdict: metadata?.verdict,
        executionTimeMs: metadata?.executionTimeMs,
        memoryUsedKb: metadata?.memoryUsedKb,
        passedTestCases: metadata?.passedTestCases,
        totalTestCases: metadata?.totalTestCases,
        compileOutput: metadata?.compileOutput,
        judgedAt: new Date(),
      })
      .where(eq(submissions.id, id));
  }

  public async getUserSubmissions(userId: string, problemId?: string): Promise<SubmissionDto[]> {
    const conditions = [eq(submissions.userId, userId)];
    if (problemId) {
      conditions.push(eq(submissions.problemId, problemId));
    }

    const rows = await db
      .select({
        submission: submissions,
        user: { username: users.username },
        problem: { title: problems.title, slug: problems.slug },
      })
      .from(submissions)
      .leftJoin(users, eq(submissions.userId, users.id))
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(and(...conditions))
      .orderBy(desc(submissions.createdAt));

    return rows.map(r => this.mapToJoinedDto(r));
  }

  public async listSubmissions(filter: SubmissionFilterQueryDto): Promise<{ submissions: SubmissionDto[]; total: number }> {
    const conditions = [];

    if (filter.userId) {
      conditions.push(eq(submissions.userId, filter.userId));
    }
    if (filter.problemId) {
      conditions.push(eq(submissions.problemId, filter.problemId));
    }
    if (filter.contestId) {
      conditions.push(eq(submissions.contestId, filter.contestId));
    }
    if (filter.languageId) {
      conditions.push(eq(submissions.languageId, filter.languageId));
    }
    if (filter.status) {
      conditions.push(eq(submissions.status, filter.status as SubmissionStatus));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const limit = filter.limit || 20;
    const offset = filter.offset || 0;

    let orderColumn = desc(submissions.createdAt);
    if (filter.sortBy === 'runtime') {
      orderColumn = filter.sortOrder === 'asc' ? asc(submissions.executionTimeMs) : desc(submissions.executionTimeMs);
    } else if (filter.sortBy === 'memory') {
      orderColumn = filter.sortOrder === 'asc' ? asc(submissions.memoryUsedKb) : desc(submissions.memoryUsedKb);
    } else if (filter.sortOrder === 'asc') {
      orderColumn = asc(submissions.createdAt);
    }

    const rows = await db
      .select({
        submission: submissions,
        user: { username: users.username },
        problem: { title: problems.title, slug: problems.slug },
      })
      .from(submissions)
      .leftJoin(users, eq(submissions.userId, users.id))
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(whereClause)
      .orderBy(orderColumn)
      .limit(limit)
      .offset(offset);

    const [totalRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(submissions)
      .where(whereClause);

    return {
      submissions: rows.map(r => this.mapToJoinedDto(r)),
      total: totalRow?.count || 0,
    };
  }

  public async getByProblem(problemId: string, limit = 50): Promise<SubmissionDto[]> {
    const rows = await db
      .select({
        submission: submissions,
        user: { username: users.username },
        problem: { title: problems.title, slug: problems.slug },
      })
      .from(submissions)
      .leftJoin(users, eq(submissions.userId, users.id))
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.problemId, problemId))
      .orderBy(desc(submissions.createdAt))
      .limit(limit);

    return rows.map(r => this.mapToJoinedDto(r));
  }

  public async getByContest(contestId: string, limit = 50): Promise<SubmissionDto[]> {
    const rows = await db
      .select({
        submission: submissions,
        user: { username: users.username },
        problem: { title: problems.title, slug: problems.slug },
      })
      .from(submissions)
      .leftJoin(users, eq(submissions.userId, users.id))
      .leftJoin(problems, eq(submissions.problemId, problems.id))
      .where(eq(submissions.contestId, contestId))
      .orderBy(desc(submissions.createdAt))
      .limit(limit);

    return rows.map(r => this.mapToJoinedDto(r));
  }

  private mapToDto(row: typeof submissions.$inferSelect): SubmissionDto {
    return {
      id: row.id,
      userId: row.userId,
      problemId: row.problemId,
      contestId: row.contestId || undefined,
      languageId: row.languageId as LanguageId,
      sourceCode: row.sourceCode,
      status: row.status as SubmissionStatus,
      verdict: row.verdict as JudgeVerdict | undefined,
      executionTimeMs: row.executionTimeMs,
      memoryUsedKb: row.memoryUsedKb,
      passedTestCases: row.passedTestCases,
      totalTestCases: row.totalTestCases,
      compileOutput: row.compileOutput,
      createdAt: row.createdAt.toISOString(),
      judgedAt: row.judgedAt ? row.judgedAt.toISOString() : null,
    };
  }

  private mapToJoinedDto(row: {
    submission: typeof submissions.$inferSelect;
    user: { username: string | null } | null;
    problem: { title: string | null; slug: string | null } | null;
  }): SubmissionDto {
    return {
      id: row.submission.id,
      userId: row.submission.userId,
      username: row.user?.username || 'Unknown',
      problemId: row.submission.problemId,
      problemTitle: row.problem?.title || 'Unknown Problem',
      problemSlug: row.problem?.slug || '',
      contestId: row.submission.contestId || undefined,
      languageId: row.submission.languageId as LanguageId,
      sourceCode: row.submission.sourceCode,
      status: row.submission.status as SubmissionStatus,
      verdict: row.submission.verdict as JudgeVerdict | undefined,
      executionTimeMs: row.submission.executionTimeMs,
      memoryUsedKb: row.submission.memoryUsedKb,
      passedTestCases: row.submission.passedTestCases,
      totalTestCases: row.submission.totalTestCases,
      compileOutput: row.submission.compileOutput,
      createdAt: row.submission.createdAt.toISOString(),
      judgedAt: row.submission.judgedAt ? row.submission.judgedAt.toISOString() : null,
    };
  }
}
