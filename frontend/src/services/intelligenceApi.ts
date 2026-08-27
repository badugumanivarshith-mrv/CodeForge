import { apiClient } from './apiClient';
import {
  ApiResponse,
  LearnerIntelligenceProfileDto,
  TopicMasteryDetailDto,
  WeaknessItemDto,
  AdaptiveDifficultyDto,
  LearningPathItemDto,
  RecommendationDto,
  LearningAnalyticsDto,
  LanguageId,
} from '@codeforge/shared';

export const intelligenceApi = {
  getProfile: async (lang?: LanguageId): Promise<LearnerIntelligenceProfileDto> => {
    const res = await apiClient.get<ApiResponse<LearnerIntelligenceProfileDto>>(
      '/api/v1/intelligence/profile',
      { params: { lang } },
    );
    return res.data.data;
  },

  getMastery: async (lang?: LanguageId): Promise<TopicMasteryDetailDto[]> => {
    const res = await apiClient.get<ApiResponse<TopicMasteryDetailDto[]>>(
      '/api/v1/intelligence/mastery',
      { params: { lang } },
    );
    return res.data.data;
  },

  getWeaknesses: async (lang?: LanguageId): Promise<WeaknessItemDto[]> => {
    const res = await apiClient.get<ApiResponse<WeaknessItemDto[]>>(
      '/api/v1/intelligence/weaknesses',
      { params: { lang } },
    );
    return res.data.data;
  },

  getAdaptiveDifficulty: async (topicId: string): Promise<AdaptiveDifficultyDto> => {
    const res = await apiClient.get<ApiResponse<AdaptiveDifficultyDto>>(
      `/api/v1/intelligence/difficulty/${topicId}`,
    );
    return res.data.data;
  },

  getLearningPath: async (lang?: LanguageId): Promise<LearningPathItemDto[]> => {
    const res = await apiClient.get<ApiResponse<LearningPathItemDto[]>>(
      '/api/v1/intelligence/learning-path',
      { params: { lang } },
    );
    return res.data.data;
  },

  getRecommendations: async (lang?: LanguageId): Promise<RecommendationDto[]> => {
    const res = await apiClient.get<ApiResponse<RecommendationDto[]>>(
      '/api/v1/intelligence/recommendations',
      { params: { lang } },
    );
    return res.data.data;
  },

  getAnalytics: async (lang?: LanguageId): Promise<LearningAnalyticsDto> => {
    const res = await apiClient.get<ApiResponse<LearningAnalyticsDto>>(
      '/api/v1/intelligence/analytics',
      { params: { lang } },
    );
    return res.data.data;
  },
};
