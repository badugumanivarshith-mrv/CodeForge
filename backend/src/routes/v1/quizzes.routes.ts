import { Router } from 'express';
import { QuizController } from '../../controllers/quiz.controller';
import {
  QuizRepository,
  GamificationRepository,
  ProgressRepository,
} from '../../repositories';
import { QuizService } from '../../services';
import { authGuard, optionalAuthGuard } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import {
  topicIdParamSchema,
  quizSubmitBodySchema,
} from '../../validations/quiz.validation';

export const quizzesRouter = Router();

const quizRepo = new QuizRepository();
const gamificationRepo = new GamificationRepository();
const progressRepo = new ProgressRepository();

const quizService = new QuizService(quizRepo, gamificationRepo, progressRepo);
const quizController = new QuizController(quizService);

quizzesRouter.get(
  '/topic/:topicId',
  optionalAuthGuard,
  validateRequest(topicIdParamSchema),
  quizController.getQuizByTopic,
);

quizzesRouter.post(
  '/:quizId/submit',
  authGuard,
  validateRequest(quizSubmitBodySchema),
  quizController.submitQuiz,
);
