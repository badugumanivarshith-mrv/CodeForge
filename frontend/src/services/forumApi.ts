import { apiClient } from './apiClient';
import {
  ApiResponse,
  ForumPostDto,
  ForumPostDetailDto,
  ForumTagDto,
  CreateForumPostDto,
  CreateForumAnswerDto,
  VoteForumDto,
} from '@codeforge/shared';

export const forumApi = {
  getTags: async (): Promise<ForumTagDto[]> => {
    const res = await apiClient.get<ApiResponse<ForumTagDto[]>>('/forum/tags');
    return res.data.data;
  },

  getPosts: async (params?: { tag?: string; search?: string; limit?: number; offset?: number }): Promise<ForumPostDto[]> => {
    const res = await apiClient.get<ApiResponse<ForumPostDto[]>>('/forum/posts', { params });
    return res.data.data;
  },

  listPosts: async (params?: { tag?: string; query?: string; search?: string; limit?: number; offset?: number }): Promise<{ posts: ForumPostDto[]; total: number }> => {
    const search = params?.query || params?.search;
    const posts = await forumApi.getPosts({ tag: params?.tag, search, limit: params?.limit, offset: params?.offset });
    return { posts, total: posts.length };
  },

  getPost: async (idOrSlug: string): Promise<ForumPostDetailDto> => {
    const res = await apiClient.get<ApiResponse<ForumPostDetailDto>>(`/forum/posts/${idOrSlug}`);
    return res.data.data;
  },

  createPost: async (dto: CreateForumPostDto): Promise<ForumPostDto> => {
    const res = await apiClient.post<ApiResponse<ForumPostDto>>('/forum/posts', dto);
    return res.data.data;
  },

  createAnswer: async (postId: string, dto: CreateForumAnswerDto): Promise<ForumPostDetailDto['answers'][0]> => {
    const res = await apiClient.post<ApiResponse<ForumPostDetailDto['answers'][0]>>(`/forum/posts/${postId}/answers`, dto);
    return res.data.data;
  },

  vote: async (dto: VoteForumDto): Promise<{ score: number; userVote: string }> => {
    const res = await apiClient.post<ApiResponse<{ score: number; userVote: string }>>('/forum/vote', dto);
    return res.data.data;
  },

  acceptAnswer: async (postId: string, answerId: string): Promise<{ success: boolean }> => {
    const res = await apiClient.post<ApiResponse<{ success: boolean }>>(`/forum/posts/${postId}/answers/${answerId}/accept`);
    return res.data.data;
  },
};
