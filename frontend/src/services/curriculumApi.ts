import { apiClient } from './apiClient';
import {
  ApiResponse,
  LanguageDto,
  LanguageRoadmapDto,
  TopicDetailDto,
  LessonDetailDto,
} from '@codeforge/shared';

export const curriculumApi = {
  getLanguages: async (): Promise<LanguageDto[]> => {
    const res = await apiClient.get<ApiResponse<LanguageDto[]>>('/api/v1/curriculum/languages');
    return res.data.data;
  },

  getLanguageRoadmap: async (languageSlug: string): Promise<LanguageRoadmapDto> => {
    const res = await apiClient.get<ApiResponse<LanguageRoadmapDto>>(
      `/api/v1/curriculum/${languageSlug}`,
    );
    return res.data.data;
  },

  getTopicDetail: async (
    languageSlug: string,
    topicSlug: string,
  ): Promise<TopicDetailDto> => {
    const res = await apiClient.get<ApiResponse<TopicDetailDto>>(
      `/api/v1/curriculum/${languageSlug}/${topicSlug}`,
    );
    return res.data.data;
  },

  getLessonDetail: async (lessonId: string): Promise<LessonDetailDto> => {
    const res = await apiClient.get<ApiResponse<LessonDetailDto>>(
      `/api/v1/lessons/${lessonId}`,
    );
    return res.data.data;
  },

  completeLesson: async (
    lessonId: string,
  ): Promise<{ isFirstCompletion: boolean; xpAwarded: number }> => {
    const res = await apiClient.post<
      ApiResponse<{ isFirstCompletion: boolean; xpAwarded: number }>
    >(`/api/v1/lessons/${lessonId}/complete`);
    return res.data.data;
  },
};
