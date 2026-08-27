import { Router } from 'express';
import { GamificationController } from '../../controllers/gamification.controller';
import { GamificationRepository } from '../../repositories';
import { GamificationService } from '../../services';
import { authGuard, optionalAuthGuard } from '../../middleware/authMiddleware';

export const gamificationRouter = Router();

const gamificationRepo = new GamificationRepository();
const gamificationService = new GamificationService(gamificationRepo);
const gamificationController = new GamificationController(gamificationService);

gamificationRouter.get('/summary', authGuard, gamificationController.getSummary);
gamificationRouter.get('/leaderboard', optionalAuthGuard, gamificationController.getLeaderboard);
