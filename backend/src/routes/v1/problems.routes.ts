import { Router } from 'express';
import { ProblemController } from '../../controllers/problem.controller';
import { ProblemRepository, CurriculumRepository } from '../../repositories';
import { ProblemService } from '../../services';
import { authGuard, optionalAuthGuard } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import {
  problemSlugParamSchema,
  problemHintParamSchema,
} from '../../validations/problem.validation';

export const problemsRouter = Router();

const problemRepo = new ProblemRepository();
const curriculumRepo = new CurriculumRepository();
const problemService = new ProblemService(problemRepo, curriculumRepo);
const problemController = new ProblemController(problemService);

problemsRouter.get('/', optionalAuthGuard, problemController.listProblems);

problemsRouter.get(
  '/:problemSlug',
  optionalAuthGuard,
  validateRequest(problemSlugParamSchema),
  problemController.getProblemDetail,
);

problemsRouter.get(
  '/:problemId/hints/:tier',
  authGuard,
  validateRequest(problemHintParamSchema),
  problemController.getProblemHints,
);
