import { Request, Response, NextFunction } from 'express';
import { LeaderboardService } from '../services/leaderboard.service';
import { sendSuccess } from '../core/utils/response';
import { ValidationError } from '../core/errors';
import { LeaderboardTimeframe } from '@codeforge/shared';

export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  public getGlobalLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await this.leaderboardService.getGlobalLeaderboard(LeaderboardTimeframe.GLOBAL, page, limit);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  };

  public getWeeklyLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await this.leaderboardService.getGlobalLeaderboard(LeaderboardTimeframe.WEEKLY, page, limit);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  };

  public getMonthlyLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const result = await this.leaderboardService.getGlobalLeaderboard(LeaderboardTimeframe.MONTHLY, page, limit);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  };

  public getContestLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) throw new ValidationError('Contest ID is required');

      const result = await this.leaderboardService.getContestLeaderboard(id);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  };
}
