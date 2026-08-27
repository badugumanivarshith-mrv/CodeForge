import { Router } from 'express';
import { AssessmentController } from '../../controllers/assessment.controller';
import { AssessmentService } from '../../services/assessment.service';
import { AdaptiveEngineService } from '../../services/adaptiveEngine.service';
import { RatingService } from '../../services/rating.service';
import { AssessmentRepository, RatingRepository } from '../../repositories';
import { authGuard } from '../../middleware/authMiddleware';

const assessmentRepo = new AssessmentRepository();
const ratingRepo = new RatingRepository();
const adaptiveEngine = new AdaptiveEngineService();
const ratingService = new RatingService(ratingRepo);
const assessmentService = new AssessmentService(assessmentRepo, adaptiveEngine, ratingService);
const controller = new AssessmentController(assessmentService);

export const assessmentRouter = Router();

// All assessment routes require authenticated user
assessmentRouter.use(authGuard);

assessmentRouter.post('/', controller.createSession);
assessmentRouter.get('/history/me', controller.getMyHistory);
assessmentRouter.get('/:id', controller.getSession);
assessmentRouter.post('/:id/answer', controller.submitAnswer);
assessmentRouter.post('/:id/complete', controller.completeSession);
assessmentRouter.get('/:id/result', controller.getResult);
assessmentRouter.get('/:id/analytics', controller.getAnalytics);
assessmentRouter.get('/:id/remediation', controller.getRemediation);
