import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { authGuard } from '../../middleware/authMiddleware';

export const quizzesRouter = Router();

quizzesRouter.get('/topic/:topicId', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { topicId: req.params.topicId, message: 'Quiz endpoint ready' });
});

quizzesRouter.post('/:quizId/submit', authGuard, (req: Request, res: Response) => {
  return sendSuccess(res, { quizId: req.params.quizId, score: 100 });
});
