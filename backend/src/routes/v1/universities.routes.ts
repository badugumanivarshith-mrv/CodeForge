import { Router } from 'express';
import { enterpriseController } from '../../controllers/enterprise.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const universitiesRouter = Router();

universitiesRouter.get('/', (req, res, next) => enterpriseController.listUniversities(req, res, next));
universitiesRouter.post('/', authGuard, (req, res, next) =>
  enterpriseController.createUniversity(req, res, next),
);
universitiesRouter.get('/:idOrSlug', (req, res, next) =>
  enterpriseController.getUniversity(req, res, next),
);
universitiesRouter.put('/:id', authGuard, (req, res, next) =>
  enterpriseController.updateUniversity(req, res, next),
);

// Batches
universitiesRouter.get('/:id/batches', (req, res, next) =>
  enterpriseController.listBatches(req, res, next),
);
universitiesRouter.post('/:id/batches', authGuard, (req, res, next) =>
  enterpriseController.createBatch(req, res, next),
);

// Students
universitiesRouter.get('/students/list', (req, res, next) =>
  enterpriseController.listStudents(req, res, next),
);
universitiesRouter.post('/students/register', authGuard, (req, res, next) =>
  enterpriseController.registerStudent(req, res, next),
);
universitiesRouter.get('/students/:id', (req, res, next) =>
  enterpriseController.getStudent(req, res, next),
);
universitiesRouter.post('/students/:id/academic-records', authGuard, (req, res, next) =>
  enterpriseController.addAcademicRecord(req, res, next),
);
universitiesRouter.get('/students/:id/academic-records', (req, res, next) =>
  enterpriseController.getAcademicRecords(req, res, next),
);

// Placements
universitiesRouter.get('/placements/list', (req, res, next) =>
  enterpriseController.listPlacements(req, res, next),
);
universitiesRouter.post('/placements/record', authGuard, (req, res, next) =>
  enterpriseController.recordPlacement(req, res, next),
);

// Analytics
universitiesRouter.get('/:id/analytics', (req, res, next) =>
  enterpriseController.getUniversityAnalytics(req, res, next),
);
