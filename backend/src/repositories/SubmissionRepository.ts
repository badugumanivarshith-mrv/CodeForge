import { eq, and, desc } from 'drizzle-orm';
import { db } from '../database/connection';
import { submissions } from '../database/schema';
import { ISubmissionRepository } from './interfaces/ISubmissionRepository';
import { SubmissionDto, SubmissionStatus, LanguageId } from '@codeforge/shared';

export class SubmissionRepository implements ISubmissionRepository {
  public async create(data: {
    userId: string;
    problemId: string;
    languageId: LanguageId;
    sourceCode: string;
  }): Promise<SubmissionDto> {
    const [row] = await db
      .insert(submissions)
      .values({
        userId: data.userId,
        problemId: data.problemId,
        languageId: data.languageId,
        sourceCode: data.sourceCode,
        status: SubmissionStatus.QUEUED,
      })
      .returning();

    return this.mapToDto(row);
  }

  public async findById(id: string): Promise<SubmissionDto | null> {
    const [row] = await db
      .select()
      .from(submissions)
      .where(eq(submissions.id, id))
      .limit(1);

    if (!row) return null;
    return this.mapToDto(row);
  }

  public async updateStatus(
    id: string,
    status: SubmissionStatus,
    metadata?: {
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
        executionTimeMs: metadata?.executionTimeMs,
        memoryUsedKb: metadata?.memoryUsedKb,
        passedTestCases: metadata?.passedTestCases,
        totalTestCases: metadata?.totalTestCases,
        compileOutput: metadata?.compileOutput,
      })
      .where(eq(submissions.id, id));
  }

  public async getUserSubmissions(userId: string, problemId?: string): Promise<SubmissionDto[]> {
    const conditions = [eq(submissions.userId, userId)];
    if (problemId) {
      conditions.push(eq(submissions.problemId, problemId));
    }

    const rows = await db
      .select()
      .from(submissions)
      .where(and(...conditions))
      .orderBy(desc(submissions.createdAt));

    return rows.map(r => this.mapToDto(r));
  }

  private mapToDto(row: typeof submissions.$inferSelect): SubmissionDto {
    return {
      id: row.id,
      userId: row.userId,
      problemId: row.problemId,
      languageId: row.languageId as LanguageId,
      sourceCode: row.sourceCode,
      status: row.status as SubmissionStatus,
      executionTimeMs: row.executionTimeMs,
      memoryUsedKb: row.memoryUsedKb,
      passedTestCases: row.passedTestCases,
      totalTestCases: row.totalTestCases,
      compileOutput: row.compileOutput,
      createdAt: row.createdAt.toISOString(),
    };
  }
}

