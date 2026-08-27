import { Router } from 'express';
import { RatingController } from '../../controllers/rating.controller';
import { RatingService } from '../../services/rating.service';
import { RatingRepository } from '../../repositories';
import { authGuard } from '../../middleware/authMiddleware';

const ratingRepo = new RatingRepository();
const ratingService = new RatingService(ratingRepo);
const controller = new RatingController(ratingService);

export const ratingRouter = Router();

ratingRouter.use(authGuard);

ratingRouter.get('/me', controller.getMyRating);
ratingRouter.get('/history', controller.getMyRatingHistory);
