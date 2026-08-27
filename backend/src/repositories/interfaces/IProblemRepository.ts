import { ProblemDto, TestCaseDto } from '@codeforge/shared';

export interface IProblemRepository {
  findById(id: string): Promise<ProblemDto | null>;
  findBySlug(slug: string): Promise<ProblemDto | null>;
  findByTopic(topicId: string): Promise<ProblemDto[]>;
  getTestCases(problemId: string, includeHidden?: boolean): Promise<TestCaseDto[]>;
}
