import { Router, Request, Response } from 'express';
import { UserRole } from '@codeforge/shared';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';
import { requireRole } from '../../middleware/roleGuard';

export const adminRouter = Router();

// Protect all admin routes with authGuard + requireRole(ADMIN)
adminRouter.use(authGuard, requireRole(UserRole.ADMIN));

adminRouter.get('/overview', (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Admin Studio Overview ready' });
});

adminRouter.post('/languages', (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Admin create language ready' });
});

adminRouter.post('/topics', (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Admin create topic ready' });
});

adminRouter.post('/lessons', (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Admin create lesson ready' });
});

adminRouter.post('/problems', (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Admin create problem ready' });
});

adminRouter.post('/assignments', (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Admin create assignment ready' });
});
