import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { platformIntegrationController } from '../../controllers/platformIntegration.controller';

const router = Router();

router.get('/overview', authGuard, platformIntegrationController.getOverview);
router.get('/search', authGuard, platformIntegrationController.search);
router.post('/workflow', authGuard, platformIntegrationController.triggerWorkflow);
router.get('/health', authGuard, platformIntegrationController.getHealth);

export default router;
