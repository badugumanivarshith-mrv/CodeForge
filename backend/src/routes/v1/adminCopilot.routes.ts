import { Router } from 'express';
import { enterpriseController } from '../../controllers/enterprise.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const adminCopilotRouter = Router();

adminCopilotRouter.get('/insights', authGuard, (req, res, next) =>
  enterpriseController.getAdminCopilotInsights(req, res, next),
);
