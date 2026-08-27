import { apiClient } from './apiClient';
import {
  ApiResponse,
  AssessmentSessionDto,
  AssessmentResultDto,
  AssessmentAnalyticsDto,
  RemediationPlanDto,
  CreateAssessmentSessionDto,
  SubmitAssessmentAnswerDto,
} from '@codeforge/shared';

export const assessmentApi = {
  createSession: async (dto: CreateAssessmentSessionDto): Promise<AssessmentSessionDto> => {
    const res = await apiClient.post<ApiResponse<AssessmentSessionDto>>('/assessments', dto);
    return res.data.data;
  },

  getSession: async (id: string): Promise<AssessmentSessionDto> => {
    const res = await apiClient.get<ApiResponse<AssessmentSessionDto>>(`/assessments/${id}`);
    return res.data.data;
  },

  submitAnswer: async (dto: SubmitAssessmentAnswerDto): Promise<AssessmentSessionDto> => {
    const res = await apiClient.post<ApiResponse<AssessmentSessionDto>>(`/assessments/${dto.sessionId}/answer`, dto);
    return res.data.data;
  },

  completeSession: async (id: string): Promise<AssessmentResultDto> => {
    const res = await apiClient.post<ApiResponse<AssessmentResultDto>>(`/assessments/${id}/complete`);
    return res.data.data;
  },

  getResult: async (id: string): Promise<AssessmentResultDto> => {
    const res = await apiClient.get<ApiResponse<AssessmentResultDto>>(`/assessments/${id}/result`);
    return res.data.data;
  },

  getAnalytics: async (id: string): Promise<AssessmentAnalyticsDto> => {
    const res = await apiClient.get<ApiResponse<AssessmentAnalyticsDto>>(`/assessments/${id}/analytics`);
    return res.data.data;
  },

  getRemediation: async (id: string): Promise<RemediationPlanDto> => {
    const res = await apiClient.get<ApiResponse<RemediationPlanDto>>(`/assessments/${id}/remediation`);
    return res.data.data;
  },

  getMyHistory: async (): Promise<AssessmentResultDto[]> => {
    const res = await apiClient.get<ApiResponse<AssessmentResultDto[]>>('/assessments/history/me');
    return res.data.data;
  },
};

