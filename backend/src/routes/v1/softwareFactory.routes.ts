import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { softwareFactoryController as controller } from '../../controllers/softwareFactory.controller';

const router = Router();

// 1. Overview & Metrics
router.get('/overview', authGuard, (req, res) => controller.getOverview(req, res));
router.get('/metrics', authGuard, (req, res) => controller.getMetrics(req, res));

// 2. Projects & Blueprints
router.get('/projects', authGuard, (req, res) => controller.listProjects(req, res));
router.post('/generate', authGuard, (req, res) => controller.provisionProject(req, res));
router.post('/architecture', authGuard, (req, res) => controller.runBuildCycle(req, res));

export default router;
