import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const assignmentsRouter = Router();

assignmentsRouter.get('/topic/:topicId', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { topicId: req.params.topicId, message: 'Assignments for topic ready' });
});

assignmentsRouter.get('/:assignmentSlug', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { slug: req.params.assignmentSlug, message: 'Assignment details ready' });
});

assignmentsRouter.post('/:id/submit', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { assignmentId: req.params.id, status: 'submitted' });
});
