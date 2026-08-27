import { Router } from 'express';
import { CurriculumController } from '../../controllers/curriculum.controller';
import { ProgressController } from '../../controllers/progress.controller';
import {
  CurriculumRepository,
  ProblemRepository,
  QuizRepository,
  ProgressRepository,
  GamificationRepository,
  UserRepository,
} from '../../repositories';
import { CurriculumService, ProgressService } from '../../services';
import { authGuard, optionalAuthGuard } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import { lessonIdParamSchema } from '../../validations/curriculum.validation';

export const lessonsRouter = Router();

const curriculumRepo = new CurriculumRepository();
const problemRepo = new ProblemRepository();
const quizRepo = new QuizRepository();
const progressRepo = new ProgressRepository();
const gamificationRepo = new GamificationRepository();
const userRepo = new UserRepository();

const curriculumService = new CurriculumService(
  curriculumRepo,
  problemRepo,
  quizRepo,
  progressRepo,
);
const progressService = new ProgressService(
  progressRepo,
  gamificationRepo,
  curriculumRepo,
  userRepo,
);

const curriculumController = new CurriculumController(curriculumService);
const progressController = new ProgressController(progressService);

lessonsRouter.get(
  '/:lessonId',
  optionalAuthGuard,
  validateRequest(lessonIdParamSchema),
  curriculumController.getLessonDetail,
);

lessonsRouter.post(
  '/:lessonId/complete',
  authGuard,
  validateRequest(lessonIdParamSchema),
  progressController.completeLesson,
);
