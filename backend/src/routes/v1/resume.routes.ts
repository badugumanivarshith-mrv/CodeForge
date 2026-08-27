import { Router } from 'express';
import { ResumeController } from '../../controllers/resume.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const resumeRouter = Router();
const controller = new ResumeController();

resumeRouter.post('/', authGuard, controller.createResume);
resumeRouter.get('/me', authGuard, controller.getMyResumes);
resumeRouter.get('/:id', authGuard, controller.getResume);
resumeRouter.patch('/:id', authGuard, controller.updateResume);
resumeRouter.delete('/:id', authGuard, controller.deleteResume);
resumeRouter.post('/:id/ats-score', authGuard, controller.analyzeAts);
