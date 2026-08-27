import { apiClient } from './apiClient';
import {
  ApiResponse,
  StudyGroupDto,
  StudyGroupMemberDto,
  StudyGroupDiscussionDto,
  StudyGroupGoalDto,
  CreateStudyGroupDto,
  CreateStudyDiscussionDto,
  CreateStudyGoalDto,
} from '@codeforge/shared';

export const groupApi = {
  listGroups: async (): Promise<StudyGroupDto[]> => {
    const res = await apiClient.get<ApiResponse<StudyGroupDto[]>>('/groups');
    return res.data.data;
  },

  getGroups: async (): Promise<StudyGroupDto[]> => {
    return groupApi.listGroups();
  },

  getGroup: async (idOrSlug: string): Promise<StudyGroupDto> => {
    const res = await apiClient.get<ApiResponse<StudyGroupDto>>(`/groups/${idOrSlug}`);
    return res.data.data;
  },

  createGroup: async (dto: CreateStudyGroupDto): Promise<StudyGroupDto> => {
    const res = await apiClient.post<ApiResponse<StudyGroupDto>>('/groups', dto);
    return res.data.data;
  },

  joinGroup: async (groupId: string): Promise<StudyGroupMemberDto> => {
    const res = await apiClient.post<ApiResponse<StudyGroupMemberDto>>(`/groups/${groupId}/join`);
    return res.data.data;
  },

  leaveGroup: async (groupId: string): Promise<{ success: boolean }> => {
    const res = await apiClient.post<ApiResponse<{ success: boolean }>>(`/groups/${groupId}/leave`);
    return res.data.data;
  },

  getMembers: async (groupId: string): Promise<StudyGroupMemberDto[]> => {
    const res = await apiClient.get<ApiResponse<StudyGroupMemberDto[]>>(`/groups/${groupId}/members`);
    return res.data.data;
  },

  getDiscussions: async (groupId: string): Promise<StudyGroupDiscussionDto[]> => {
    const res = await apiClient.get<ApiResponse<StudyGroupDiscussionDto[]>>(`/groups/${groupId}/discussions`);
    return res.data.data;
  },

  createDiscussion: async (groupId: string, dto: CreateStudyDiscussionDto): Promise<StudyGroupDiscussionDto> => {
    const res = await apiClient.post<ApiResponse<StudyGroupDiscussionDto>>(`/groups/${groupId}/discussions`, dto);
    return res.data.data;
  },

  getGoals: async (groupId: string): Promise<StudyGroupGoalDto[]> => {
    const res = await apiClient.get<ApiResponse<StudyGroupGoalDto[]>>(`/groups/${groupId}/goals`);
    return res.data.data;
  },

  createGoal: async (groupId: string, dto: CreateStudyGoalDto): Promise<StudyGroupGoalDto> => {
    const res = await apiClient.post<ApiResponse<StudyGroupGoalDto>>(`/groups/${groupId}/goals`, dto);
    return res.data.data;
  },

  getLeaderboard: async (groupId: string): Promise<{ userId: string; username: string; totalXp: number; solvedCount: number; rank: number }[]> => {
    const res = await apiClient.get<ApiResponse<{ userId: string; username: string; totalXp: number; solvedCount: number; rank: number }[]>>(`/groups/${groupId}/leaderboard`);
    return res.data.data;
  },
};
