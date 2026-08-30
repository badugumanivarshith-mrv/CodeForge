import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { cybersecurityController } from '../../controllers/cybersecurity.controller';

const router = Router();

router.get('/threats', authGuard, cybersecurityController.listThreats);
router.get('/vulnerabilities', authGuard, cybersecurityController.listVulnerabilities);
router.post('/incidents', authGuard, cybersecurityController.declareIncident);
router.get('/metrics', authGuard, cybersecurityController.getMetrics);

export default router;
