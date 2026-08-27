import { apiClient } from './apiClient';
import {
  ApiResponse,
  InterviewSessionDto,
  InterviewExchangeDto,
  InterviewFeedbackDto,
  StartInterviewDto,
  AnswerInterviewQuestionDto,
} from '@codeforge/shared';

export const interviewApi = {
  startInterview: async (dto: StartInterviewDto): Promise<{ session: InterviewSessionDto; firstQuestion: InterviewExchangeDto }> => {
    const res = await apiClient.post<ApiResponse<{ session: InterviewSessionDto; firstQuestion: InterviewExchangeDto }>>('/interviews', dto);
    return res.data.data;
  },

  answerQuestion: async (
    sessionId: string,
    dto: AnswerInterviewQuestionDto,
  ): Promise<{ answer: InterviewExchangeDto; nextQuestion?: InterviewExchangeDto; isComplete: boolean }> => {
    const res = await apiClient.post<ApiResponse<{ answer: InterviewExchangeDto; nextQuestion?: InterviewExchangeDto; isComplete: boolean }>>(
      `/interviews/${sessionId}/answer`,
      dto,
    );
    return res.data.data;
  },

  finishInterview: async (sessionId: string): Promise<InterviewFeedbackDto> => {
    const res = await apiClient.post<ApiResponse<InterviewFeedbackDto>>(`/interviews/${sessionId}/finish`);
    return res.data.data;
  },

  getFeedback: async (sessionId: string): Promise<InterviewFeedbackDto> => {
    const res = await apiClient.get<ApiResponse<InterviewFeedbackDto>>(`/interviews/${sessionId}/feedback`);
    return res.data.data;
  },

  getMyHistory: async (): Promise<InterviewSessionDto[]> => {
    const res = await apiClient.get<ApiResponse<InterviewSessionDto[]>>('/interviews/history/me');
    return res.data.data;
  },

  getMySessions: async (): Promise<InterviewSessionDto[]> => {
    return interviewApi.getMyHistory();
  },
};
