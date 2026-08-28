import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const interviewsPipelineRouter = Router();
const controller = new PlacementController();

interviewsPipelineRouter.post('/schedule', authGuard, controller.scheduleInterview);
interviewsPipelineRouter.get('/company/:companyId', authGuard, controller.listCompanyInterviews);
interviewsPipelineRouter.get('/application/:applicationId', authGuard, controller.listApplicationInterviews);
interviewsPipelineRouter.get('/:id', authGuard, controller.getInterview);
interviewsPipelineRouter.post('/:id/feedback', authGuard, controller.submitInterviewFeedback);
