import { apiClient } from './apiClient';
import { UserProfileDto, UserPreferencesDto, ApiResponse } from '@codeforge/shared';

export interface PublicProfileDto {
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  githubUsername: string | null;
  totalXp: number;
  currentLevel: number;
  streak: number;
  learningGoals: string[];
  joinedAt: string;
}

export const userApi = {
  getMyProfile: async (): Promise<UserProfileDto> => {
    const res = await apiClient.get<ApiResponse<UserProfileDto>>('/users/me');
    return res.data.data;
  },

  updateMyProfile: async (data: Partial<UserProfileDto>): Promise<UserProfileDto> => {
    const res = await apiClient.patch<ApiResponse<UserProfileDto>>('/users/me', data);
    return res.data.data;
  },

  getPublicProfile: async (username: string): Promise<PublicProfileDto> => {
    const res = await apiClient.get<ApiResponse<PublicProfileDto>>(`/users/${username}`);
    return res.data.data;
  },

  getMyPreferences: async (): Promise<UserPreferencesDto> => {
    const res = await apiClient.get<ApiResponse<UserPreferencesDto>>('/users/me/preferences');
    return res.data.data;
  },

  updateMyPreferences: async (
    data: Partial<UserPreferencesDto>,
  ): Promise<UserPreferencesDto> => {
    const res = await apiClient.patch<ApiResponse<UserPreferencesDto>>(
      '/users/me/preferences',
      data,
    );
    return res.data.data;
  },
};
