import { Router } from 'express';
import { enterpriseController } from '../../controllers/enterprise.controller';

export const analyticsExecutiveRouter = Router();

analyticsExecutiveRouter.get('/dashboard', (req, res, next) =>
  enterpriseController.getExecutiveDashboard(req, res, next),
);
