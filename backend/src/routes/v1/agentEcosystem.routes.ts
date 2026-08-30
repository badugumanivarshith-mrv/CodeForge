import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { agentEcosystemController } from '../../controllers/agentEcosystem.controller';

const router = Router();

router.get('/', authGuard, agentEcosystemController.listAgents);
router.post('/register', authGuard, agentEcosystemController.registerAgent);
router.post('/delegate', authGuard, agentEcosystemController.delegateTask);
router.get('/metrics', authGuard, agentEcosystemController.getMetrics);

export default router;
