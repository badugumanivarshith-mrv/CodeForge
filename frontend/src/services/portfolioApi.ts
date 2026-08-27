import { apiClient } from './apiClient';
import {
  ApiResponse,
  PortfolioDto,
  PortfolioProjectDto,
  PortfolioSettingsDto,
  CreatePortfolioProjectDto,
  UpdatePortfolioProjectDto,
  UpdatePortfolioSettingsDto,
} from '@codeforge/shared';

export const portfolioApi = {
  getMyPortfolio: async (): Promise<PortfolioDto> => {
    const res = await apiClient.get<ApiResponse<PortfolioDto>>('/portfolio/me');
    return res.data.data;
  },

  getPublicPortfolio: async (username: string): Promise<PortfolioDto> => {
    const res = await apiClient.get<ApiResponse<PortfolioDto>>(`/portfolio/${username}`);
    return res.data.data;
  },

  updateSettings: async (dto: UpdatePortfolioSettingsDto): Promise<PortfolioSettingsDto> => {
    const res = await apiClient.patch<ApiResponse<PortfolioSettingsDto>>('/portfolio/settings', dto);
    return res.data.data;
  },

  createProject: async (dto: CreatePortfolioProjectDto): Promise<PortfolioProjectDto> => {
    const res = await apiClient.post<ApiResponse<PortfolioProjectDto>>('/portfolio/projects', dto);
    return res.data.data;
  },

  updateProject: async (id: string, dto: UpdatePortfolioProjectDto): Promise<PortfolioProjectDto> => {
    const res = await apiClient.patch<ApiResponse<PortfolioProjectDto>>(`/portfolio/projects/${id}`, dto);
    return res.data.data;
  },

  deleteProject: async (id: string): Promise<{ success: boolean }> => {
    const res = await apiClient.delete<ApiResponse<{ success: boolean }>>(`/portfolio/projects/${id}`);
    return res.data.data;
  },
};
