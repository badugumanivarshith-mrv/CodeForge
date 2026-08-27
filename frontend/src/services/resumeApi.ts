import { apiClient } from './apiClient';
import {
  ApiResponse,
  ResumeDto,
  CreateResumeDto,
  UpdateResumeDto,
} from '@codeforge/shared';

export const resumeApi = {
  getMyResumes: async (): Promise<ResumeDto[]> => {
    const res = await apiClient.get<ApiResponse<ResumeDto[]>>('/resumes');
    return res.data.data;
  },

  getResume: async (id: string): Promise<ResumeDto> => {
    const res = await apiClient.get<ApiResponse<ResumeDto>>(`/resumes/${id}`);
    return res.data.data;
  },

  createResume: async (dto: CreateResumeDto): Promise<ResumeDto> => {
    const res = await apiClient.post<ApiResponse<ResumeDto>>('/resumes', dto);
    return res.data.data;
  },

  updateResume: async (id: string, dto: UpdateResumeDto): Promise<ResumeDto> => {
    const res = await apiClient.patch<ApiResponse<ResumeDto>>(`/resumes/${id}`, dto);
    return res.data.data;
  },

  deleteResume: async (id: string): Promise<{ success: boolean }> => {
    const res = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/resumes/${id}`);
    return res.data.data;
  },

  analyzeAts: async (
    id: string,
    jobDescription: string,
  ): Promise<{ atsScore: number; atsFeedback: string; matchedKeywords: string[]; missingKeywords: string[] }> => {
    const res = await apiClient.post<
      ApiResponse<{ atsScore: number; atsFeedback: string; matchedKeywords: string[]; missingKeywords: string[] }>
    >(`/resumes/${id}/analyze`, { jobDescription });
    return res.data.data;
  },
};
