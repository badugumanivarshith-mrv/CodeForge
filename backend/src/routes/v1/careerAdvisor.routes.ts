import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const careerAdvisorRouter = Router();
const controller = new PlacementController();

careerAdvisorRouter.get('/advice', authGuard, controller.getCareerAdvice);
