import { apiClient } from './apiClient';
import {
  ApiResponse,
  CareerTwinDto,
  UpdateCareerTwinDto,
  CareerSnapshotDto,
  CareerEventDto,
  CreateCareerEventDto,
  CareerCoachingReportDto,
  SkillMarketIntelligenceDto,
  SalaryIntelligenceReportDto,
  PersonalBrandProfileDto,
  NetworkIntelligenceDto,
  NetworkConnectionDto,
  CareerTimelineDto,
  CareerMilestoneDto,
  CareerPredictionReportDto,
  CareerOsGoalDto,
  CreateCareerOsGoalDto,
  UpdateCareerOsGoalDto,
  CareerOsRoadmapDto,
} from '@codeforge/shared';

export const careerOsApi = {
  // 1. Digital Twin
  getTwin: async (): Promise<ApiResponse<CareerTwinDto>> => {
    return apiClient.get('/career-os/twin');
  },

  updateTwin: async (data: UpdateCareerTwinDto): Promise<ApiResponse<CareerTwinDto>> => {
    return apiClient.put('/career-os/twin', data);
  },

  getSnapshots: async (limit = 12): Promise<ApiResponse<CareerSnapshotDto[]>> => {
    return apiClient.get(`/career-os/snapshots?limit=${limit}`);
  },

  recordEvent: async (data: CreateCareerEventDto): Promise<ApiResponse<CareerEventDto>> => {
    return apiClient.post('/career-os/events', data);
  },

  listEvents: async (): Promise<ApiResponse<CareerEventDto[]>> => {
    return apiClient.get('/career-os/events');
  },

  // 2. AI Career Coach
  generateCoachingReport: async (frequency = 'weekly'): Promise<ApiResponse<CareerCoachingReportDto>> => {
    return apiClient.post('/career-os/coach/report', { frequency });
  },

  getLatestCoachingReport: async (): Promise<ApiResponse<CareerCoachingReportDto>> => {
    return apiClient.get('/career-os/coach/latest');
  },

  listCoachingReports: async (): Promise<ApiResponse<CareerCoachingReportDto[]>> => {
    return apiClient.get('/career-os/coach/reports');
  },

  // 3. Skill Intelligence
  getSkillIntelligence: async (filter?: string): Promise<ApiResponse<SkillMarketIntelligenceDto>> => {
    const query = filter ? `?q=${encodeURIComponent(filter)}` : '';
    return apiClient.get(`/career-os/skills${query}`);
  },

  // 4. Salary Intelligence
  getSalaryIntelligence: async (role?: string, level?: string, salary?: number): Promise<ApiResponse<SalaryIntelligenceReportDto>> => {
    const params = new URLSearchParams();
    if (role) params.set('role', role);
    if (level) params.set('level', level);
    if (salary) params.set('salary', String(salary));
    const qs = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get(`/career-os/salary${qs}`);
  },

  // 5. Personal Brand
  getPersonalBrand: async (): Promise<ApiResponse<PersonalBrandProfileDto>> => {
    return apiClient.get('/career-os/brand');
  },

  updatePersonalBrand: async (data: Partial<PersonalBrandProfileDto>): Promise<ApiResponse<PersonalBrandProfileDto>> => {
    return apiClient.put('/career-os/brand', data);
  },

  // 6. Network Intelligence
  getNetworkIntelligence: async (): Promise<ApiResponse<NetworkIntelligenceDto>> => {
    return apiClient.get('/career-os/network');
  },

  addConnection: async (data: Omit<NetworkConnectionDto, 'id' | 'userId' | 'createdAt'>): Promise<ApiResponse<NetworkConnectionDto>> => {
    return apiClient.post('/career-os/network/connections', data);
  },

  listConnections: async (): Promise<ApiResponse<NetworkConnectionDto[]>> => {
    return apiClient.get('/career-os/network/connections');
  },

  deleteConnection: async (connectionId: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    return apiClient.delete(`/career-os/network/connections/${connectionId}`);
  },

  // 7. Timeline & Milestones
  getTimeline: async (): Promise<ApiResponse<CareerTimelineDto>> => {
    return apiClient.get('/career-os/timeline');
  },

  createMilestone: async (data: { title: string; description: string; category?: string; targetDate?: string }): Promise<ApiResponse<CareerMilestoneDto>> => {
    return apiClient.post('/career-os/milestones', data);
  },

  achieveMilestone: async (milestoneId: string): Promise<ApiResponse<CareerMilestoneDto>> => {
    return apiClient.put(`/career-os/milestones/${milestoneId}/achieve`, {});
  },

  // 8. Career Predictions
  getPredictions: async (): Promise<ApiResponse<CareerPredictionReportDto>> => {
    return apiClient.get('/career-os/predictions');
  },

  generatePredictions: async (): Promise<ApiResponse<CareerPredictionReportDto>> => {
    return apiClient.post('/career-os/predictions/generate', {});
  },

  // 9. Career Goals & Roadmap
  createGoal: async (data: CreateCareerOsGoalDto): Promise<ApiResponse<CareerOsGoalDto>> => {
    return apiClient.post('/career-os/goals', data);
  },

  listGoals: async (): Promise<ApiResponse<CareerOsGoalDto[]>> => {
    return apiClient.get('/career-os/goals');
  },

  updateGoal: async (goalId: string, data: UpdateCareerOsGoalDto): Promise<ApiResponse<CareerOsGoalDto>> => {
    return apiClient.put(`/career-os/goals/${goalId}`, data);
  },

  deleteGoal: async (goalId: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    return apiClient.delete(`/career-os/goals/${goalId}`);
  },

  getRoadmap: async (): Promise<ApiResponse<CareerOsRoadmapDto>> => {
    return apiClient.get('/career-os/roadmap');
  },
};
