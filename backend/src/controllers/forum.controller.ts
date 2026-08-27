import { Request, Response, NextFunction } from 'express';
import { ForumService } from '../services/forum.service';
import { ApiResponse } from '@codeforge/shared';
import { UnauthorizedError } from '../core/errors';

export class ForumController {
  private forumService: ForumService;

  constructor(forumService = new ForumService()) {
    this.forumService = forumService;
  }

  listTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tags = await this.forumService.listTags();
      const response: ApiResponse<typeof tags> = {
        success: true,
        data: tags,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  listPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tag, q, limit, offset } = req.query;
      const posts = await this.forumService.listPosts(
        tag as string | undefined,
        q as string | undefined,
        req.user?.userId,
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined,
      );
      const response: ApiResponse<typeof posts> = {
        success: true,
        data: posts,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { idOrSlug } = req.params;
      const result = await this.forumService.getPost(idOrSlug, req.user?.userId);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const post = await this.forumService.createPost(req.user.userId, req.body);
      const response: ApiResponse<typeof post> = {
        success: true,
        data: post,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  createAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { postId } = req.params;
      const answer = await this.forumService.createAnswer(postId, req.user.userId, req.body);
      const response: ApiResponse<typeof answer> = {
        success: true,
        data: answer,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  acceptAnswer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { postId, answerId } = req.params;
      const success = await this.forumService.acceptAnswer(postId, answerId, req.user.userId);
      const response: ApiResponse<{ accepted: boolean }> = {
        success: true,
        data: { accepted: success },
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  vote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const result = await this.forumService.vote(req.user.userId, req.body);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
