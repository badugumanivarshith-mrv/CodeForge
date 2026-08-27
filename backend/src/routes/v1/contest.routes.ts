import { Router } from 'express';
import { ContestController } from '../../controllers/contest.controller';
import { ContestService } from '../../services/contest.service';
import { RatingService } from '../../services/rating.service';
import {
  ContestRepository,
  ProblemRepository,
  SubmissionRepository,
  RatingRepository,
} from '../../repositories';
import { authGuard } from '../../middleware/authMiddleware';
import { requireRole } from '../../middleware/roleGuard';
import { UserRole } from '@codeforge/shared';

const contestRepo = new ContestRepository();
const problemRepo = new ProblemRepository();
const submissionRepo = new SubmissionRepository();
const ratingRepo = new RatingRepository();
const ratingService = new RatingService(ratingRepo);
const contestService = new ContestService(contestRepo, problemRepo, submissionRepo, ratingService);
const controller = new ContestController(contestService);

export const contestRouter = Router();

// Public listing
contestRouter.get('/', controller.listContests);
contestRouter.get('/:id', controller.getContest);

// Protected routes
contestRouter.post('/', authGuard, requireRole([UserRole.ADMIN, UserRole.EDUCATOR]), controller.createContest);


contestRouter.post('/:id/join', authGuard, controller.register);
contestRouter.post('/:id/start', authGuard, controller.start);
contestRouter.post('/:id/submit', authGuard, controller.submitProblem);
contestRouter.post('/:id/finish', authGuard, controller.finish);
