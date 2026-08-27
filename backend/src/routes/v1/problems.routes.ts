import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const problemsRouter = Router();

problemsRouter.get('/', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Problems list endpoint ready' });
});

problemsRouter.get('/:problemSlug', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { slug: req.params.problemSlug, message: 'Problem details endpoint ready' });
});

problemsRouter.get('/:problemId/hints/:tier', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { problemId: req.params.problemId, tier: req.params.tier });
});
