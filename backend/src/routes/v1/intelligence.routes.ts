import { Router } from 'express';
import { LearnerIntelligenceController } from '../../controllers/learnerIntelligence.controller';
import { LearnerIntelligenceService } from '../../services/learnerIntelligence.service';
import {
  LearnerIntelligenceRepository,
  CurriculumRepository,
  GamificationRepository,
} from '../../repositories';
import { authGuard } from '../../middleware/authMiddleware';

export const intelligenceRouter = Router();

const intelligenceRepo = new LearnerIntelligenceRepository();
const curriculumRepo = new CurriculumRepository();
const gamificationRepo = new GamificationRepository();

const intelligenceService = new LearnerIntelligenceService(
  intelligenceRepo,
  curriculumRepo,
  gamificationRepo,
);

const intelligenceController = new LearnerIntelligenceController(intelligenceService);

// All intelligence endpoints are user-specific and protected by authGuard
intelligenceRouter.use(authGuard);

intelligenceRouter.get('/profile', intelligenceController.getProfile);
intelligenceRouter.get('/mastery', intelligenceController.getMastery);
intelligenceRouter.get('/weaknesses', intelligenceController.getWeaknesses);
intelligenceRouter.get('/difficulty/:topicId', intelligenceController.getAdaptiveDifficulty);
intelligenceRouter.get('/learning-path', intelligenceController.getLearningPath);
intelligenceRouter.get('/recommendations', intelligenceController.getRecommendations);
intelligenceRouter.get('/analytics', intelligenceController.getAnalytics);
