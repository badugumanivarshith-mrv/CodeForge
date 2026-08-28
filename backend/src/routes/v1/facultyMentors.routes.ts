import { Router } from 'express';
import { enterpriseController } from '../../controllers/enterprise.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const facultyMentorsRouter = Router();

facultyMentorsRouter.get('/', (req, res, next) => enterpriseController.listMentors(req, res, next));
facultyMentorsRouter.post('/register', authGuard, (req, res, next) =>
  enterpriseController.registerMentor(req, res, next),
);
facultyMentorsRouter.get('/:id', (req, res, next) => enterpriseController.getMentor(req, res, next));

// Sessions
facultyMentorsRouter.get('/sessions/list', (req, res, next) =>
  enterpriseController.listMentorSessions(req, res, next),
);
facultyMentorsRouter.post('/sessions/book', authGuard, (req, res, next) =>
  enterpriseController.bookMentorSession(req, res, next),
);
facultyMentorsRouter.post('/sessions/:id/feedback', authGuard, (req, res, next) =>
  enterpriseController.submitSessionFeedback(req, res, next),
);

// Long term student mentorships
facultyMentorsRouter.get('/mentorships/list', (req, res, next) =>
  enterpriseController.listStudentMentorships(req, res, next),
);
facultyMentorsRouter.post('/mentorships/create', authGuard, (req, res, next) =>
  enterpriseController.createStudentMentorship(req, res, next),
);
