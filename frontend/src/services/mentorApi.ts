import { apiClient } from './apiClient';
import {
  ApiResponse,
  MentorSessionDto,
  MentorMessageDto,
  SocraticHintResultDto,
  CodeReviewResultDto,
  SubmissionAnalysisResultDto,
  ConceptExplanationDto,
  TargetedPracticeDto,
  CreateMentorSessionDto,
  SendMentorMessageDto,
  RequestHintDto,
  RequestCodeReviewDto,
  AnalyzeSubmissionDto,
  ExplainConceptDto,
  GeneratePracticeDto,
} from '@codeforge/shared';

export const mentorApi = {
  createSession: async (data: CreateMentorSessionDto): Promise<MentorSessionDto> => {
    const res = await apiClient.post<ApiResponse<MentorSessionDto>>('/api/v1/mentor/sessions', data);
    return res.data.data;
  },

  getSession: async (sessionId: string): Promise<MentorSessionDto> => {
    const res = await apiClient.get<ApiResponse<MentorSessionDto>>(`/api/v1/mentor/sessions/${sessionId}`);
    return res.data.data;
  },

  getUserSessions: async (limit = 20): Promise<MentorSessionDto[]> => {
    const res = await apiClient.get<ApiResponse<MentorSessionDto[]>>(`/api/v1/mentor/sessions?limit=${limit}`);
    return res.data.data;
  },

  sendMessage: async (
    data: SendMentorMessageDto,
  ): Promise<{ userMessage: MentorMessageDto; assistantMessage: MentorMessageDto }> => {
    const res = await apiClient.post<
      ApiResponse<{ userMessage: MentorMessageDto; assistantMessage: MentorMessageDto }>
    >('/api/v1/mentor/message', data);
    return res.data.data;
  },

  requestHint: async (data: RequestHintDto): Promise<SocraticHintResultDto> => {
    const res = await apiClient.post<ApiResponse<SocraticHintResultDto>>('/api/v1/mentor/hint', data);
    return res.data.data;
  },

  requestCodeReview: async (data: RequestCodeReviewDto): Promise<CodeReviewResultDto> => {
    const res = await apiClient.post<ApiResponse<CodeReviewResultDto>>('/api/v1/mentor/review-code', data);
    return res.data.data;
  },

  analyzeSubmission: async (data: AnalyzeSubmissionDto): Promise<SubmissionAnalysisResultDto> => {
    const res = await apiClient.post<ApiResponse<SubmissionAnalysisResultDto>>(
      '/api/v1/mentor/analyze-submission',
      data,
    );
    return res.data.data;
  },

  explainConcept: async (data: ExplainConceptDto): Promise<ConceptExplanationDto> => {
    const res = await apiClient.post<ApiResponse<ConceptExplanationDto>>('/api/v1/mentor/explain-concept', data);
    return res.data.data;
  },

  generatePractice: async (data: GeneratePracticeDto): Promise<TargetedPracticeDto> => {
    const res = await apiClient.post<ApiResponse<TargetedPracticeDto>>('/api/v1/mentor/generate-practice', data);
    return res.data.data;
  },
};
