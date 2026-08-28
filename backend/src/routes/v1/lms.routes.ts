import { Router } from 'express';
import { enterpriseController } from '../../controllers/enterprise.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const lmsRouter = Router();

// Courses
lmsRouter.get('/courses', (req, res, next) => enterpriseController.listCourses(req, res, next));
lmsRouter.post('/courses', authGuard, (req, res, next) =>
  enterpriseController.createCourse(req, res, next),
);
lmsRouter.get('/courses/:idOrSlug', (req, res, next) => enterpriseController.getCourse(req, res, next));
lmsRouter.put('/courses/:id', authGuard, (req, res, next) =>
  enterpriseController.updateCourse(req, res, next),
);

// Course Modules
lmsRouter.get('/courses/:id/modules', (req, res, next) =>
  enterpriseController.listCourseModules(req, res, next),
);
lmsRouter.post('/courses/:id/modules', authGuard, (req, res, next) =>
  enterpriseController.addCourseModule(req, res, next),
);

// Enrollments
lmsRouter.post('/enroll', authGuard, (req, res, next) =>
  enterpriseController.enrollCourse(req, res, next),
);
lmsRouter.get('/enrollments/user/:userId', authGuard, (req, res, next) =>
  enterpriseController.getUserEnrollments(req, res, next),
);
lmsRouter.put('/enrollments/:id/progress', authGuard, (req, res, next) =>
  enterpriseController.updateEnrollmentProgress(req, res, next),
);

// Learning Paths
lmsRouter.get('/learning-paths', (req, res, next) => enterpriseController.listLearningPaths(req, res, next));
lmsRouter.post('/learning-paths', authGuard, (req, res, next) =>
  enterpriseController.createLearningPath(req, res, next),
);
