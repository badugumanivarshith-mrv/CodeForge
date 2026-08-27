import { Router, Request, Response } from 'express';
import { UserRole } from '@codeforge/shared';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';
import { requireRole } from '../../middleware/roleGuard';

export const analyticsRouter = Router();

analyticsRouter.post('/events', authGuard, (_req: Request, res: Response) => {
  return sendSuccess(res, { recorded: true });
});

analyticsRouter.get('/admin/overview', authGuard, requireRole(UserRole.ADMIN), (_req: Request, res: Response) => {
  return sendSuccess(res, {
    totalStudents: 0,
    activeLearnersToday: 0,
    submissionsTotal: 0,
    passRateAverage: 0.0,
  });
});
