import { apiClient } from './apiClient';
import {
  ApiResponse,
  ProblemSummaryDto,
  ProblemDetailDto,
  LanguageId,
} from '@codeforge/shared';

export const problemApi = {
  listProblems: async (params?: {
    topicId?: string;
    difficulty?: string;
  }): Promise<ProblemSummaryDto[]> => {
    const res = await apiClient.get<ApiResponse<ProblemSummaryDto[]>>('/api/v1/problems', {
      params,
    });
    return res.data.data;
  },

  getProblemDetail: async (
    slug: string,
    lang?: LanguageId,
  ): Promise<ProblemDetailDto> => {
    const res = await apiClient.get<ApiResponse<ProblemDetailDto>>(
      `/api/v1/problems/${slug}`,
      {
        params: { lang },
      },
    );
    return res.data.data;
  },

  getProblemHints: async (
    problemId: string,
    tier: number,
  ): Promise<{ tier: number; hint: string }> => {
    const res = await apiClient.get<ApiResponse<{ tier: number; hint: string }>>(
      `/api/v1/problems/${problemId}/hints/${tier}`,
    );
    return res.data.data;
  },
};
