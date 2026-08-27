import { Router } from 'express';
import { MentorController } from '../../controllers/mentor.controller';
import { MentorService } from '../../services/mentor.service';
import { MentorContextService } from '../../services/mentorContext.service';
import { LearnerIntelligenceService } from '../../services/learnerIntelligence.service';
import {
  MentorRepository,
  CurriculumRepository,
  ProblemRepository,
  SubmissionRepository,
  GamificationRepository,
  LearnerIntelligenceRepository,
} from '../../repositories';
import { authGuard } from '../../middleware/authMiddleware';

export const mentorRouter = Router();

const mentorRepo = new MentorRepository();
const curriculumRepo = new CurriculumRepository();
const problemRepo = new ProblemRepository();
const submissionRepo = new SubmissionRepository();
const gamificationRepo = new GamificationRepository();
const intelligenceRepo = new LearnerIntelligenceRepository();

const intelligenceService = new LearnerIntelligenceService(
  intelligenceRepo,
  curriculumRepo,
  gamificationRepo,
);

const contextService = new MentorContextService(
  intelligenceService,
  problemRepo,
  submissionRepo,
);

const mentorService = new MentorService(
  mentorRepo,
  contextService,
  problemRepo,
  submissionRepo,
);

const mentorController = new MentorController(mentorService);

// All mentor routes require authenticated user
mentorRouter.use(authGuard);

mentorRouter.post('/sessions', mentorController.createSession);
mentorRouter.get('/sessions', mentorController.getUserSessions);
mentorRouter.get('/sessions/:id', mentorController.getSession);
mentorRouter.post('/message', mentorController.sendMessage);
mentorRouter.post('/hint', mentorController.requestHint);
mentorRouter.post('/review-code', mentorController.requestCodeReview);
mentorRouter.post('/analyze-submission', mentorController.analyzeSubmission);
mentorRouter.post('/explain-concept', mentorController.explainConcept);
mentorRouter.post('/generate-practice', mentorController.generatePractice);
