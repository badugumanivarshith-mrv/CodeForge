import { Router } from 'express';
import { enterpriseController } from '../../controllers/enterprise.controller';

export const workforceIntelligenceRouter = Router();

workforceIntelligenceRouter.get('/forecast', (req, res, next) =>
  enterpriseController.getWorkforceIntelligence(req, res, next),
);
