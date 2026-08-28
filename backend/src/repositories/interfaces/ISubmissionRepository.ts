import {
  SubmissionDto,
  SubmissionStatus,
  LanguageId,
  JudgeVerdict,
  SubmissionFilterQueryDto,
} from '@codeforge/shared';

export interface ISubmissionRepository {
  create(data: {
    userId: string;
    problemId: string;
    languageId: LanguageId;
    sourceCode: string;
    contestId?: string;
  }): Promise<SubmissionDto>;
  findById(id: string): Promise<SubmissionDto | null>;
  updateStatus(
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
  ): Promise<void>;
  getUserSubmissions(userId: string, problemId?: string): Promise<SubmissionDto[]>;
  listSubmissions(filter: SubmissionFilterQueryDto): Promise<{ submissions: SubmissionDto[]; total: number }>;
  getByProblem(problemId: string, limit?: number): Promise<SubmissionDto[]>;
  getByContest(contestId: string, limit?: number): Promise<SubmissionDto[]>;
}
