import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { aiCloudController as controller } from '../../controllers/aiCloud.controller';

const router = Router();

// 1. Overview & Metrics
router.get('/overview', authGuard, (req, res) => controller.getOverview(req, res));
router.get('/metrics', authGuard, (req, res) => controller.getMetrics(req, res));

// 2. Clusters & Deployments
router.get('/clusters', authGuard, (req, res) => controller.listClusters(req, res));
router.post('/deploy', authGuard, (req, res) => controller.deployWorkload(req, res));
router.post('/inference', authGuard, (req, res) => controller.routeInference(req, res));

export default router;
