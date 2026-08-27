import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const lessonsRouter = Router();

lessonsRouter.get('/:lessonId', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { lessonId: req.params.lessonId, message: 'Lesson content endpoint ready' });
});

lessonsRouter.post('/:lessonId/complete', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { lessonId: req.params.lessonId, completed: true });
});
