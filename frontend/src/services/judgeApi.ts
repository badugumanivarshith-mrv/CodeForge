import { apiClient } from './apiClient';
import {
  ApiResponse,
  RunCodeDto,
  SubmitSolutionDto,
  JudgeRunResultDto,
  SubmissionDetailDto,
  LanguageRuntimeDto,
  SubmissionAnalysisDto,
  PerformanceAnalyticsDto,
  SubmissionDto,
  SubmissionFilterQueryDto,
} from '@codeforge/shared';

export const judgeApi = {
  /**
   * Run solution against sample test cases
   */
  async runSample(data: RunCodeDto): Promise<JudgeRunResultDto> {
    const response = await apiClient.post<ApiResponse<JudgeRunResultDto>>('/judge/run', data);
    return response.data.data;
  },

  /**
   * Submit solution for full evaluation
   */
  async submitSolution(data: SubmitSolutionDto): Promise<SubmissionDetailDto> {
    const response = await apiClient.post<ApiResponse<SubmissionDetailDto>>('/judge/submit', data);
    return response.data.data;
  },

  /**
   * Get submission detail
   */
  async getSubmission(id: string): Promise<SubmissionDetailDto> {
    const response = await apiClient.get<ApiResponse<SubmissionDetailDto>>(`/submissions/${id}`);
    return response.data.data;
  },

  /**
   * Get AI submission root cause analysis
   */
  async getSubmissionAnalysis(id: string): Promise<SubmissionAnalysisDto> {
    const response = await apiClient.get<ApiResponse<SubmissionAnalysisDto>>(`/submissions/${id}/analysis`);
    return response.data.data;
  },

  /**
   * List submissions with filters
   */
  async listSubmissions(params?: SubmissionFilterQueryDto): Promise<{ submissions: SubmissionDto[]; total: number }> {
    const response = await apiClient.get<ApiResponse<SubmissionDto[]>>('/submissions', { params });
    return {
      submissions: response.data.data,
      total: (response.data.meta as any)?.pagination?.total ?? response.data.data.length,
    };
  },

  /**
   * Get current user submissions
   */
  async getMySubmissions(problemId?: string): Promise<SubmissionDto[]> {
    const response = await apiClient.get<ApiResponse<SubmissionDto[]>>('/submissions/me', {
      params: { problemId },
    });
    return response.data.data;
  },

  /**
   * Get user performance analytics
   */
  async getPerformanceAnalytics(): Promise<PerformanceAnalyticsDto> {
    const response = await apiClient.get<ApiResponse<PerformanceAnalyticsDto>>('/submissions/analytics/me');
    return response.data.data;
  },

  /**
   * Get available language runtimes
   */
  async getLanguageRuntimes(): Promise<LanguageRuntimeDto[]> {
    const response = await apiClient.get<ApiResponse<LanguageRuntimeDto[]>>('/judge/runtimes');
    return response.data.data;
  },
};
