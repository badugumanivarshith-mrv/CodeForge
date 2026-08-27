import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const gamificationRouter = Router();

gamificationRouter.get('/summary', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, {
    totalXp: 0,
    currentLevel: 1,
    nextLevelXp: 100,
    levelProgressPercentage: 0,
    currentStreak: 0,
    longestStreak: 0,
    freezeTokensAvailable: 1,
  });
});

gamificationRouter.get('/leaderboard', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { rankings: [] });
});

gamificationRouter.get('/achievements', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { achievements: [] });
});
