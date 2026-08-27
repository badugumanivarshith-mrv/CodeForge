import { Router } from 'express';
import { CareerController } from '../../controllers/career.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const careerRouter = Router();
const controller = new CareerController();

careerRouter.get('/paths', controller.getCareerPaths);
careerRouter.get('/paths/:role', controller.getCareerPath);
careerRouter.get('/goal', authGuard, controller.getUserGoal);
careerRouter.post('/target', authGuard, controller.setUserGoal);
careerRouter.get('/readiness', authGuard, controller.getReadiness);
