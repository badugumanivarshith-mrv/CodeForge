import { Request, Response, NextFunction } from 'express';
import { RatingService } from '../services/rating.service';
import { sendSuccess } from '../core/utils/response';
import { UnauthorizedError } from '../core/errors';

export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  public getMyRating = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const rating = await this.ratingService.getUserRating(userId);
      sendSuccess(res, rating, 200);
    } catch (error) {
      next(error);
    }
  };

  public getMyRatingHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const limit = parseInt(req.query.limit as string) || 20;
      const history = await this.ratingService.getUserRatingHistory(userId, limit);
      sendSuccess(res, history, 200);
    } catch (error) {
      next(error);
    }
  };
}
