import { apiClient } from './apiClient';
import {
  ApiResponse,
  QuizDto,
  QuizSubmitRequestDto,
  QuizSubmitResultDto,
} from '@codeforge/shared';

export const quizApi = {
  getQuizByTopic: async (topicId: string): Promise<QuizDto> => {
    const res = await apiClient.get<ApiResponse<QuizDto>>(
      `/api/v1/quizzes/topic/${topicId}`,
    );
    return res.data.data;
  },

  submitQuiz: async (
    quizId: string,
    payload: QuizSubmitRequestDto,
  ): Promise<QuizSubmitResultDto> => {
    const res = await apiClient.post<ApiResponse<QuizSubmitResultDto>>(
      `/api/v1/quizzes/${quizId}/submit`,
      payload,
    );
    return res.data.data;
  },
};
