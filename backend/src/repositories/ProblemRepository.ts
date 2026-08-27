import { eq, and, asc } from 'drizzle-orm';
import { db } from '../database/connection';
import {
  problems,
  problemExamples,
  problemConstraints,
  testCases,
  topics,
} from '../database/schema';
import { IProblemRepository } from './interfaces/IProblemRepository';
import {
  ProblemDto,
  ProblemSummaryDto,
  TestCaseDto,
  ProblemExampleDto,
  ProblemDifficulty,
} from '@codeforge/shared';

export class ProblemRepository implements IProblemRepository {
  public async findById(id: string): Promise<ProblemDto | null> {
    const [row] = await db
      .select()
      .from(problems)
      .where(and(eq(problems.id, id), eq(problems.isPublished, true)))
      .limit(1);

    if (!row) return null;
    return this.mapToProblemDto(row);
  }

  public async findBySlug(slug: string): Promise<ProblemDto | null> {
    const normalizedSlug = slug.toLowerCase().trim();
    const [row] = await db
      .select()
      .from(problems)
      .where(and(eq(problems.slug, normalizedSlug), eq(problems.isPublished, true)))
      .limit(1);

    if (!row) return null;
    return this.mapToProblemDto(row);
  }

  public async findByTopic(topicId: string): Promise<ProblemSummaryDto[]> {
    const rows = await db
      .select({
        id: problems.id,
        topicId: problems.topicId,
        slug: problems.slug,
        title: problems.title,
        difficulty: problems.difficulty,
      })
      .from(problems)
      .where(and(eq(problems.topicId, topicId), eq(problems.isPublished, true)))
      .orderBy(asc(problems.title));

    return rows.map(r => ({
      id: r.id,
      topicId: r.topicId,
      slug: r.slug,
      title: r.title,
      difficulty: r.difficulty as ProblemDifficulty,
    }));
  }

  public async listProblems(filters?: { topicId?: string; difficulty?: string }): Promise<ProblemSummaryDto[]> {
    let query = db
      .select({
        id: problems.id,
        topicId: problems.topicId,
        topicTitle: topics.title,
        slug: problems.slug,
        title: problems.title,
        difficulty: problems.difficulty,
      })
      .from(problems)
      .leftJoin(topics, eq(problems.topicId, topics.id))
      .where(eq(problems.isPublished, true));

    const rows = await query;
    let filtered = rows;

    if (filters?.topicId) {
      filtered = filtered.filter(r => r.topicId === filters.topicId);
    }
    if (filters?.difficulty) {
      filtered = filtered.filter(r => r.difficulty === filters.difficulty);
    }

    return filtered.map(r => ({
      id: r.id,
      topicId: r.topicId,
      topicTitle: r.topicTitle || undefined,
      slug: r.slug,
      title: r.title,
      difficulty: r.difficulty as ProblemDifficulty,
    }));
  }

  public async getTestCases(problemId: string, includeHidden = false): Promise<TestCaseDto[]> {
    const query = db
      .select()
      .from(testCases)
      .where(
        includeHidden
          ? eq(testCases.problemId, problemId)
          : and(eq(testCases.problemId, problemId), eq(testCases.isHidden, false)),
      )
      .orderBy(asc(testCases.sequence));

    const rows = await query;
    return rows.map(r => ({
      id: r.id,
      problemId: r.problemId,
      sequence: r.sequence,
      inputData: r.inputData,
      expectedOutput: r.expectedOutput,
      isHidden: r.isHidden,
      isSample: r.isSample,
      isEdgeCase: r.isEdgeCase,
      weight: r.weight,
    }));
  }

  public async getExamples(problemId: string): Promise<ProblemExampleDto[]> {
    const rows = await db
      .select()
      .from(problemExamples)
      .where(eq(problemExamples.problemId, problemId))
      .orderBy(asc(problemExamples.sequence));

    return rows.map(r => ({
      id: r.id,
      problemId: r.problemId,
      sequence: r.sequence,
      inputData: r.inputData,
      expectedOutput: r.expectedOutput,
      explanationMdx: r.explanationMdx,
    }));
  }

  public async getConstraints(problemId: string): Promise<{ sequence: number; constraintText: string }[]> {
    const rows = await db
      .select({
        sequence: problemConstraints.sequence,
        constraintText: problemConstraints.constraintText,
      })
      .from(problemConstraints)
      .where(eq(problemConstraints.problemId, problemId))
      .orderBy(asc(problemConstraints.sequence));

    return rows;
  }

  private mapToProblemDto(row: typeof problems.$inferSelect): ProblemDto {
    return {
      id: row.id,
      topicId: row.topicId,
      slug: row.slug,
      title: row.title,
      difficulty: row.difficulty as ProblemDifficulty,
      promptMdx: row.promptMdx,
      starterCode: (row.starterCode as Record<string, string>) || {},
      boilerplateCode: (row.boilerplateCode as Record<string, string>) || {},
      solutionCode: (row.solutionCode as Record<string, string>) || undefined,
      memoryLimitMb: row.memoryLimitMb,
      timeLimitMs: row.timeLimitMs,
      isPublished: row.isPublished,
    };
  }
}
