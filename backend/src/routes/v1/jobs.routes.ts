import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const jobsRouter = Router();
const controller = new PlacementController();

jobsRouter.get('/', controller.listJobs);
jobsRouter.get('/recommended', authGuard, controller.getRecommendedJobs);
jobsRouter.post('/', authGuard, controller.createJob);
jobsRouter.get('/:idOrSlug', controller.getJob);
jobsRouter.put('/:id', authGuard, controller.updateJob);
jobsRouter.get('/:jobId/match', authGuard, controller.calculateJobMatch);
