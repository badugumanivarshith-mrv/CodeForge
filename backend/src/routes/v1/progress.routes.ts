import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const progressRouter = Router();

progressRouter.get('/summary', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Progress summary endpoint ready' });
});

progressRouter.get('/topics/:topicId', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { topicId: req.params.topicId, masteryScore: 0.0 });
});
