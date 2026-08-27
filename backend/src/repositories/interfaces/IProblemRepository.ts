import { ProblemDto, ProblemSummaryDto, TestCaseDto, ProblemExampleDto } from '@codeforge/shared';

export interface IProblemRepository {
  findById(id: string): Promise<ProblemDto | null>;
  findBySlug(slug: string): Promise<ProblemDto | null>;
  findByTopic(topicId: string): Promise<ProblemSummaryDto[]>;
  listProblems(filters?: { topicId?: string; difficulty?: string }): Promise<ProblemSummaryDto[]>;
  getTestCases(problemId: string, includeHidden?: boolean): Promise<TestCaseDto[]>;
  getExamples(problemId: string): Promise<ProblemExampleDto[]>;
  getConstraints(problemId: string): Promise<{ sequence: number; constraintText: string }[]>;
}
