import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const hiringChallengesRouter = Router();
const controller = new PlacementController();

hiringChallengesRouter.get('/', controller.listChallenges);
hiringChallengesRouter.post('/', authGuard, controller.createChallenge);
hiringChallengesRouter.get('/:id', controller.getChallenge);
hiringChallengesRouter.get('/:id/standings', controller.getChallengeStandings);
