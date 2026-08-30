import { Router } from 'express';
import { authGuard } from '../../middleware/authMiddleware';
import { RoboticsController } from '../../controllers/robotics.controller';

const router = Router();
const controller = new RoboticsController();

router.get('/robots', authGuard, controller.getRobots.bind(controller));
router.post('/mission', authGuard, controller.createMission.bind(controller));
router.post('/simulation', authGuard, controller.runSimulation.bind(controller));
router.get('/metrics', authGuard, controller.getMetrics.bind(controller));
router.get('/overview', authGuard, controller.getOverview.bind(controller));
router.post('/robots/register', authGuard, controller.registerRobot.bind(controller));
router.post('/sensor-stream', authGuard, controller.logSensorData.bind(controller));

export default router;
