import { Router } from 'express';
import { PlacementController } from '../../controllers/placement.controller';
import { authGuard } from '../../middleware/authMiddleware';

export const referralRouter = Router();
const controller = new PlacementController();

referralRouter.post('/', authGuard, controller.createReferral);
referralRouter.get('/my', authGuard, controller.listMyReferrals);
referralRouter.get('/company/:companyId', authGuard, controller.listCompanyReferrals);
referralRouter.put('/:id/status', authGuard, controller.updateReferralStatus);

referralRouter.post('/requests', authGuard, controller.requestReferral);
referralRouter.get('/requests/my', authGuard, controller.listMyReferralRequests);
referralRouter.get('/requests/company/:companyId', authGuard, controller.listCompanyReferralRequests);
referralRouter.put('/requests/:id/status', authGuard, controller.updateReferralRequestStatus);
