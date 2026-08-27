import { Router } from 'express';
import { LeaderboardController } from '../../controllers/leaderboard.controller';
import { LeaderboardService } from '../../services/leaderboard.service';
import { RatingRepository, ContestRepository } from '../../repositories';

const ratingRepo = new RatingRepository();
const contestRepo = new ContestRepository();
const leaderboardService = new LeaderboardService(ratingRepo, contestRepo);
const controller = new LeaderboardController(leaderboardService);

export const leaderboardRouter = Router();

leaderboardRouter.get('/global', controller.getGlobalLeaderboard);
leaderboardRouter.get('/weekly', controller.getWeeklyLeaderboard);
leaderboardRouter.get('/monthly', controller.getMonthlyLeaderboard);
leaderboardRouter.get('/contest/:id', controller.getContestLeaderboard);
