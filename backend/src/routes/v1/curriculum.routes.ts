import { Router } from 'express';
import { CurriculumController } from '../../controllers/curriculum.controller';
import {
  CurriculumRepository,
  ProblemRepository,
  QuizRepository,
  ProgressRepository,
} from '../../repositories';
import { CurriculumService } from '../../services';
import { optionalAuthGuard } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import {
  languageSlugParamSchema,
  topicSlugParamsSchema,
} from '../../validations/curriculum.validation';

export const curriculumRouter = Router();

const curriculumRepo = new CurriculumRepository();
const problemRepo = new ProblemRepository();
const quizRepo = new QuizRepository();
const progressRepo = new ProgressRepository();

const curriculumService = new CurriculumService(
  curriculumRepo,
  problemRepo,
  quizRepo,
  progressRepo,
);
const curriculumController = new CurriculumController(curriculumService);

curriculumRouter.get('/languages', curriculumController.getLanguages);

curriculumRouter.get(
  '/:languageSlug',
  optionalAuthGuard,
  validateRequest(languageSlugParamSchema),
  curriculumController.getLanguageRoadmap,
);

curriculumRouter.get(
  '/:languageSlug/:topicSlug',
  optionalAuthGuard,
  validateRequest(topicSlugParamsSchema),
  curriculumController.getTopicDetail,
);
