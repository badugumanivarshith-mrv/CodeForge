import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const companiesRouter = Router();
const controller = new PlacementController();

companiesRouter.get('/', controller.listCompanies);
companiesRouter.post('/', authGuard, controller.createCompany);
companiesRouter.get('/recruiter/me', authGuard, controller.getRecruiterProfile);
companiesRouter.post('/recruiter/register', authGuard, controller.registerRecruiter);
companiesRouter.get('/:idOrSlug', controller.getCompany);
companiesRouter.put('/:id', authGuard, controller.updateCompany);
companiesRouter.get('/:companyId/analytics', authGuard, controller.getTalentAnalytics);
