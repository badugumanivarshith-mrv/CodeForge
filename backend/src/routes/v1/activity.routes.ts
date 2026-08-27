import { Router } from 'express';
import { ActivityFeedController } from '../../controllers/activity.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const activityRouter = Router();
const controller = new ActivityFeedController();

activityRouter.get('/public', controller.getPublicFeed);
activityRouter.get('/me', authGuard, controller.getUserFeed);
