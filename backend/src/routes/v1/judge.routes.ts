import { Router } from 'express';
import { JudgeController } from '../../controllers/judge.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const judgeRouter = Router();
const judgeController = new JudgeController();

judgeRouter.get('/runtimes', judgeController.getLanguageRuntimes);
judgeRouter.post('/run', authGuard, judgeController.runCode);
judgeRouter.post('/submit', authGuard, judgeController.submitSolution);
judgeRouter.get('/submissions/:submissionId', authGuard, judgeController.getSubmission);
judgeRouter.get('/analytics/me', authGuard, judgeController.getPerformanceAnalytics);
