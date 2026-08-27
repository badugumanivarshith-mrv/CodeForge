import {
  ForumPostDto,
  ForumAnswerDto,
  ForumTagDto,
  CreateForumPostDto,
  ForumTargetType,
  ForumVoteType,
} from '@codeforge/shared';

export interface IForumRepository {
  listTags(): Promise<ForumTagDto[]>;
  getTagBySlug(slug: string): Promise<ForumTagDto | null>;
  createTag(name: string, slug: string, description?: string): Promise<ForumTagDto>;
  listPosts(tagSlug?: string, searchQuery?: string, currentUserId?: string, limit?: number, offset?: number): Promise<ForumPostDto[]>;
  getPostById(id: string, currentUserId?: string): Promise<ForumPostDto | null>;
  getPostBySlug(slug: string, currentUserId?: string): Promise<ForumPostDto | null>;
  createPost(userId: string, data: CreateForumPostDto): Promise<ForumPostDto>;
  incrementViews(postId: string): Promise<void>;
  listAnswers(postId: string, currentUserId?: string): Promise<ForumAnswerDto[]>;
  getAnswerById(id: string): Promise<ForumAnswerDto | null>;
  createAnswer(postId: string, userId: string, contentMdx: string): Promise<ForumAnswerDto>;
  acceptAnswer(postId: string, answerId: string): Promise<boolean>;
  getVote(userId: string, targetType: ForumTargetType, targetId: string): Promise<ForumVoteType | null>;
  castVote(userId: string, targetType: ForumTargetType, targetId: string, voteType: ForumVoteType): Promise<{ newScore: number; userVote: ForumVoteType }>;
  addReputation(userId: string, pointsDelta: number, reason: string, referenceId?: string): Promise<number>;
  getUserReputation(userId: string): Promise<number>;
}
