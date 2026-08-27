import { Router } from 'express';
import { ProgressController } from '../../controllers/progress.controller';
import {
  ProgressRepository,
  GamificationRepository,
  CurriculumRepository,
  UserRepository,
} from '../../repositories';
import { ProgressService } from '../../services';
import { authGuard } from '../../middleware/authMiddleware';

export const progressRouter = Router();

const progressRepo = new ProgressRepository();
const gamificationRepo = new GamificationRepository();
const curriculumRepo = new CurriculumRepository();
const userRepo = new UserRepository();

const progressService = new ProgressService(
  progressRepo,
  gamificationRepo,
  curriculumRepo,
  userRepo,
);
const progressController = new ProgressController(progressService);

progressRouter.get('/dashboard', authGuard, progressController.getDashboard);
