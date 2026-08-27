import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const submissionsRouter = Router();

submissionsRouter.post('/run', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Code execution run queued' });
});

submissionsRouter.post('/submit', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Code submission queued for judging' });
});

submissionsRouter.get('/:submissionId', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { submissionId: req.params.submissionId, status: 'queued' });
});
