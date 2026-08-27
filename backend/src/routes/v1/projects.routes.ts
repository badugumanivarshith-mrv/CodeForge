import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const projectsRouter = Router();

projectsRouter.get('/', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { projects: [], message: 'Projects extension endpoint ready' });
});
