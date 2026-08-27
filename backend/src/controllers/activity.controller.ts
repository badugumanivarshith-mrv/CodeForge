import { Request, Response, NextFunction } from 'express';
import { ActivityFeedService } from '../services/activityFeed.service';
import { ApiResponse } from '@codeforge/shared';
import { UnauthorizedError } from '../core/errors';


export class ActivityFeedController {
  private feedService: ActivityFeedService;

  constructor(feedService = new ActivityFeedService()) {
    this.feedService = feedService;
  }

  getPublicFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, offset } = req.query;
      const feed = await this.feedService.getPublicFeed(
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined,
      );
      const response: ApiResponse<typeof feed> = {
        success: true,
        data: feed,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getUserFeed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }

      const { limit, offset } = req.query;
      const feed = await this.feedService.getUserFeed(
        req.user.userId,
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined,
      );
      const response: ApiResponse<typeof feed> = {
        success: true,
        data: feed,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
