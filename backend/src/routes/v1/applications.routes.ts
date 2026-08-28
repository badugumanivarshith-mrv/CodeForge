import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const applicationsRouter = Router();
const controller = new PlacementController();

applicationsRouter.get('/my', authGuard, controller.listCandidateApplications);
applicationsRouter.post('/', authGuard, controller.applyForJob);
applicationsRouter.get('/job/:jobId', authGuard, controller.listJobApplications);
applicationsRouter.get('/company/:companyId', authGuard, controller.listCompanyApplications);
applicationsRouter.get('/:id', authGuard, controller.getApplication);
applicationsRouter.put('/:id/stage', authGuard, controller.updateStage);
applicationsRouter.get('/:id/timeline', authGuard, controller.getTimeline);
