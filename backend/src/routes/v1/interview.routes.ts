import { Router } from 'express';
import { InterviewController } from '../../controllers/interview.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const interviewRouter = Router();
const controller = new InterviewController();

interviewRouter.post('/start', authGuard, controller.start);
interviewRouter.post('/:id/answer', authGuard, controller.answer);
interviewRouter.post('/:id/finish', authGuard, controller.finish);
interviewRouter.get('/:id/feedback', authGuard, controller.getFeedback);
interviewRouter.get('/history/me', authGuard, controller.getHistory);
