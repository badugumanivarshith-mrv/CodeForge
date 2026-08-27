import {
  ForumRepository,
  ActivityFeedRepository,
} from '../repositories';
import {
  ForumPostDto,
  ForumAnswerDto,
  ForumTagDto,
  CreateForumPostDto,
  CreateForumAnswerDto,
  VoteForumDto,
  ForumVoteType,
  ActivityType,
} from '@codeforge/shared';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '../core/errors';

export class ForumService {
  private forumRepo: ForumRepository;
  private feedRepo: ActivityFeedRepository;

  constructor(
    forumRepo = new ForumRepository(),
    feedRepo = new ActivityFeedRepository(),
  ) {
    this.forumRepo = forumRepo;
    this.feedRepo = feedRepo;
  }

  async listTags(): Promise<ForumTagDto[]> {
    return this.forumRepo.listTags();
  }

  async listPosts(
    tagSlug?: string,
    query?: string,
    currentUserId?: string,
    limit: number = 20,
    offset: number = 0,
  ): Promise<{ posts: ForumPostDto[]; total: number }> {
    const posts = await this.forumRepo.listPosts(
      tagSlug,
      query,
      currentUserId,
      limit,
      offset,
    );
    return { posts, total: posts.length };
  }

  async getPost(idOrSlug: string, currentUserId?: string): Promise<{ post: ForumPostDto; answers: ForumAnswerDto[] }> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const post = isUuid
      ? await this.forumRepo.getPostById(idOrSlug, currentUserId)
      : await this.forumRepo.getPostBySlug(idOrSlug, currentUserId);

    if (!post) {
      throw new NotFoundError('Forum question not found', 'POST_NOT_FOUND');
    }

    // Increment views asynchronously
    await this.forumRepo.incrementViews(post.id);

    const answers = await this.forumRepo.listAnswers(post.id, currentUserId);
    return { post, answers };
  }

  async createPost(userId: string, data: CreateForumPostDto): Promise<ForumPostDto> {
    if (!data.title || data.title.trim().length < 5) {
      throw new BadRequestError('Question title must be at least 5 characters', 'INVALID_TITLE');
    }
    if (!data.contentMdx || data.contentMdx.trim().length < 15) {
      throw new BadRequestError('Question description must be at least 15 characters', 'INVALID_CONTENT');
    }

    const post = await this.forumRepo.createPost(userId, data);
    return post;
  }

  async createAnswer(postId: string, userId: string, data: CreateForumAnswerDto): Promise<ForumAnswerDto> {
    if (!data.contentMdx || data.contentMdx.trim().length < 10) {
      throw new BadRequestError('Answer content must be at least 10 characters', 'INVALID_CONTENT');
    }

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
    const post = isUuid
      ? await this.forumRepo.getPostById(postId)
      : await this.forumRepo.getPostBySlug(postId);

    if (!post) {
      throw new NotFoundError('Forum question not found', 'POST_NOT_FOUND');
    }

    const answer = await this.forumRepo.createAnswer(post.id, userId, data.contentMdx);
    return answer;
  }

  async acceptAnswer(postId: string, answerId: string, currentUserId: string): Promise<boolean> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(postId);
    const post = isUuid
      ? await this.forumRepo.getPostById(postId)
      : await this.forumRepo.getPostBySlug(postId);

    if (!post) {
      throw new NotFoundError('Forum question not found', 'POST_NOT_FOUND');
    }

    if (post.userId !== currentUserId) {
      throw new ForbiddenError('Only the author of the question can accept an answer');
    }

    const answer = await this.forumRepo.getAnswerById(answerId);
    if (!answer || answer.postId !== post.id) {
      throw new NotFoundError('Answer not found for this question', 'ANSWER_NOT_FOUND');
    }

    const success = await this.forumRepo.acceptAnswer(post.id, answerId);
    return success;
  }

  async vote(userId: string, data: VoteForumDto): Promise<{ voteScore: number; userVote: ForumVoteType | null }> {
    const result = await this.forumRepo.castVote(
      userId,
      data.targetType,
      data.targetId,
      data.voteType,
    );
    return {
      voteScore: result.newScore,
      userVote: result.userVote,
    };
  }
}
