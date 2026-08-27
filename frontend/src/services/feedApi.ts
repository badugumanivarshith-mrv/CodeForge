import { apiClient } from './apiClient';
import {
  ApiResponse,
  ActivityFeedEventDto,
} from '@codeforge/shared';

export const feedApi = {
  getPublicFeed: async (limit?: number, offset?: number): Promise<ActivityFeedEventDto[]> => {
    const res = await apiClient.get<ApiResponse<ActivityFeedEventDto[]>>('/feed/public', {
      params: { limit, offset },
    });
    return res.data.data;
  },

  getGlobalFeed: async (limit?: number, offset?: number): Promise<ActivityFeedEventDto[]> => {
    return feedApi.getPublicFeed(limit, offset);
  },

  getMyFeed: async (limit?: number, offset?: number): Promise<ActivityFeedEventDto[]> => {
    const res = await apiClient.get<ApiResponse<ActivityFeedEventDto[]>>('/feed/me', {
      params: { limit, offset },
    });
    return res.data.data;
  },
};
