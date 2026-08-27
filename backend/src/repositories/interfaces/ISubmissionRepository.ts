import { SubmissionDto, SubmissionStatus, LanguageId } from '@codeforge/shared';

export interface ISubmissionRepository {
  create(data: {
    userId: string;
    problemId: string;
    languageId: LanguageId;
    sourceCode: string;
  }): Promise<SubmissionDto>;
  findById(id: string): Promise<SubmissionDto | null>;
  updateStatus(
    id: string,
    status: SubmissionStatus,
    metadata?: {
      executionTimeMs?: number;
      memoryUsedKb?: number;
      passedTestCases?: number;
      totalTestCases?: number;
      compileOutput?: string;
    },
  ): Promise<void>;
  getUserSubmissions(userId: string, problemId?: string): Promise<SubmissionDto[]>;
}
