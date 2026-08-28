import { Router } from 'express';
import { JudgeController } from '../../controllers/judge.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const submissionsRouter = Router();
const judgeController = new JudgeController();

// Execution & judging endpoints
submissionsRouter.post('/run', authGuard, judgeController.runCode);
submissionsRouter.post('/submit', authGuard, judgeController.submitSolution);
submissionsRouter.post('/', authGuard, judgeController.submitSolution);

// Analytics endpoint (before :submissionId to avoid param collision)
submissionsRouter.get('/analytics/me', authGuard, judgeController.getPerformanceAnalytics);
submissionsRouter.get('/me', authGuard, (req, res, next) => {
  req.query.userOnly = 'true';
  return judgeController.listSubmissions(req, res, next);
});

// Listing & lookups
submissionsRouter.get('/', authGuard, judgeController.listSubmissions);
submissionsRouter.get('/problem/:problemId', authGuard, judgeController.getProblemSubmissions);
submissionsRouter.get('/contest/:contestId', authGuard, judgeController.getContestSubmissions);

// Single submission & AI failure analysis
submissionsRouter.get('/:submissionId', authGuard, judgeController.getSubmission);
submissionsRouter.get('/:submissionId/analysis', authGuard, judgeController.getSubmissionAnalysis);
