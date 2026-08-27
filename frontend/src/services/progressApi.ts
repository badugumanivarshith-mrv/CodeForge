import { apiClient } from './apiClient';
import {
  ApiResponse,
  ProgressDashboardDto,
  GamificationSummaryDto,
  LeaderboardEntryDto,
} from '@codeforge/shared';

export const progressApi = {
  getDashboard: async (): Promise<ProgressDashboardDto> => {
    const res = await apiClient.get<ApiResponse<ProgressDashboardDto>>(
      '/api/v1/progress/dashboard',
    );
    return res.data.data;
  },

  getGamificationSummary: async (): Promise<GamificationSummaryDto> => {
    const res = await apiClient.get<ApiResponse<GamificationSummaryDto>>(
      '/api/v1/gamification/summary',
    );
    return res.data.data;
  },

  getLeaderboard: async (limit = 20): Promise<LeaderboardEntryDto[]> => {
    const res = await apiClient.get<ApiResponse<LeaderboardEntryDto[]>>(
      '/api/v1/gamification/leaderboard',
      {
        params: { limit },
      },
    );
    return res.data.data;
  },
};
