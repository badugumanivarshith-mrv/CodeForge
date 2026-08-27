import { Request, Response, NextFunction } from 'express';
import { GamificationService } from '../services';
import { ApiResponse } from '@codeforge/shared';

export class GamificationController {
  constructor(private gamificationService: GamificationService) {}

  public getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const summary = await this.gamificationService.getSummary(userId);

      const response: ApiResponse<typeof summary> = {
        success: true,
        data: summary,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getLeaderboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const leaderboard = await this.gamificationService.getLeaderboard(limit);

      const response: ApiResponse<typeof leaderboard> = {
        success: true,
        data: leaderboard,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
