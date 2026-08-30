import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { multimodalController } from '../../controllers/multimodal.controller';

const router = Router();

router.post('/analyze-image', authGuard, multimodalController.analyzeImage);
router.post('/analyze-document', authGuard, multimodalController.analyzeDocument);
router.post('/reason', authGuard, multimodalController.reason);
router.get('/metrics', authGuard, multimodalController.getMetrics);

export default router;
