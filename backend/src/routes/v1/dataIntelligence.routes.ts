import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { dataIntelligenceController } from '../../controllers/dataIntelligence.controller';

const router = Router();

router.post('/import', authGuard, dataIntelligenceController.importData);
router.get('/analytics', authGuard, dataIntelligenceController.listAnalytics);
router.get('/insights', authGuard, dataIntelligenceController.listInsights);
router.get('/metrics', authGuard, dataIntelligenceController.getMetrics);

export default router;
