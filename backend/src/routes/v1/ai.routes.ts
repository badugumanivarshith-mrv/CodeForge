import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const aiRouter = Router();

aiRouter.post('/tutor/chat', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'AI Tutor chat endpoint ready (SSE streaming in Phase 4)' });
});

aiRouter.post('/debugger/analyze', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'AI Debugger analysis endpoint ready' });
});

aiRouter.post('/review/code', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'AI Code Review endpoint ready' });
});

aiRouter.get('/coach/insights', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'AI Learning Coach insights endpoint ready' });
});
