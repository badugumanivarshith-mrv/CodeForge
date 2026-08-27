import { apiClient } from './apiClient';
import {
  ApiResponse,
  CareerPathDetailDto,
  CareerGoalDto,
  CareerReadinessDto,
  SetCareerGoalDto,
  CareerRole,
} from '@codeforge/shared';

export const careerApi = {
  getPaths: async (): Promise<CareerPathDetailDto[]> => {
    const res = await apiClient.get<ApiResponse<CareerPathDetailDto[]>>('/career/paths');
    return res.data.data;
  },

  getCareerPaths: async (): Promise<CareerPathDetailDto[]> => {
    return careerApi.getPaths();
  },

  getPath: async (role: CareerRole): Promise<CareerPathDetailDto> => {
    const res = await apiClient.get<ApiResponse<CareerPathDetailDto>>(`/career/paths/${role}`);
    return res.data.data;
  },

  getMyGoal: async (): Promise<CareerGoalDto | null> => {
    const res = await apiClient.get<ApiResponse<CareerGoalDto | null>>('/career/goal');
    return res.data.data;
  },

  getGoal: async (): Promise<CareerGoalDto | null> => {
    return careerApi.getMyGoal();
  },

  setGoal: async (dto: SetCareerGoalDto): Promise<CareerGoalDto> => {
    const res = await apiClient.post<ApiResponse<CareerGoalDto>>('/career/goal', dto);
    return res.data.data;
  },

  getReadiness: async (targetRole?: CareerRole): Promise<CareerReadinessDto> => {
    const res = await apiClient.get<ApiResponse<CareerReadinessDto>>('/career/readiness', {
      params: targetRole ? { targetRole } : undefined,
    });
    return res.data.data;
  },
};
