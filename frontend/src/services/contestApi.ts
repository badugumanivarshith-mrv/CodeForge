import { apiClient } from './apiClient';
import {
  ApiResponse,
  ContestDto,
  ContestParticipantDto,
  ContestSubmissionDto,
  ContestLeaderboardDto,
  GlobalLeaderboardDto,
  SkillRatingDto,
  SkillRatingHistoryDto,
  ContestState,
  LeaderboardTimeframe,
  CreateContestDto,
  SubmitContestProblemDto,
} from '@codeforge/shared';

export const contestApi = {
  listContests: async (status?: ContestState): Promise<ContestDto[]> => {
    const res = await apiClient.get<ApiResponse<ContestDto[]>>('/contests', {
      params: { status },
    });
    return res.data.data;
  },

  getContest: async (idOrSlug: string): Promise<ContestDto> => {
    const res = await apiClient.get<ApiResponse<ContestDto>>(`/contests/${idOrSlug}`);
    return res.data.data;
  },

  createContest: async (dto: CreateContestDto): Promise<ContestDto> => {
    const res = await apiClient.post<ApiResponse<ContestDto>>('/contests', dto);
    return res.data.data;
  },

  register: async (contestId: string): Promise<ContestParticipantDto> => {
    const res = await apiClient.post<ApiResponse<ContestParticipantDto>>(`/contests/${contestId}/join`);
    return res.data.data;
  },

  start: async (contestId: string): Promise<ContestParticipantDto> => {
    const res = await apiClient.post<ApiResponse<ContestParticipantDto>>(`/contests/${contestId}/start`);
    return res.data.data;
  },

  submitProblem: async (dto: SubmitContestProblemDto): Promise<ContestSubmissionDto> => {
    const res = await apiClient.post<ApiResponse<ContestSubmissionDto>>(`/contests/${dto.contestId}/submit`, dto);
    return res.data.data;
  },

  finish: async (contestId: string): Promise<ContestParticipantDto> => {
    const res = await apiClient.post<ApiResponse<ContestParticipantDto>>(`/contests/${contestId}/finish`);
    return res.data.data;
  },

  getLeaderboard: async (contestId: string): Promise<ContestLeaderboardDto> => {
    const res = await apiClient.get<ApiResponse<ContestLeaderboardDto>>(`/leaderboards/contest/${contestId}`);
    return res.data.data;
  },

  getGlobalLeaderboard: async (
    timeframe: LeaderboardTimeframe = LeaderboardTimeframe.GLOBAL,
    page: number = 1,
    limit: number = 50,
  ): Promise<GlobalLeaderboardDto> => {
    const endpoint = timeframe === LeaderboardTimeframe.WEEKLY ? '/weekly' : timeframe === LeaderboardTimeframe.MONTHLY ? '/monthly' : '/global';
    const res = await apiClient.get<ApiResponse<GlobalLeaderboardDto>>(`/leaderboards${endpoint}`, {
      params: { page, limit },
    });
    return res.data.data;
  },

  getMyRating: async (): Promise<SkillRatingDto> => {
    const res = await apiClient.get<ApiResponse<SkillRatingDto>>('/ratings/me');
    return res.data.data;
  },

  getMyRatingHistory: async (limit: number = 20): Promise<SkillRatingHistoryDto[]> => {
    const res = await apiClient.get<ApiResponse<SkillRatingHistoryDto[]>>('/ratings/history', {
      params: { limit },
    });
    return res.data.data;
  },
};

