import { Request, Response } from 'express';
import { roboticsRepository } from '../repositories/RoboticsRepository';
import { RoboticsControlService } from '../modules/robotics/roboticsControlService';
import { MissionPlanningService } from '../modules/robotics/missionPlanningService';
import { EnvironmentMappingService } from '../modules/robotics/environmentMappingService';
import { SensorFusionService } from '../modules/robotics/sensorFusionService';

const controlService = new RoboticsControlService(roboticsRepository);
const missionService = new MissionPlanningService(roboticsRepository);
const mappingService = new EnvironmentMappingService(roboticsRepository);
const fusionService = new SensorFusionService(roboticsRepository);

export class RoboticsController {
  public async getRobots(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'test-user-id';
      const list = await controlService.listRobots(userId);
      res.status(200).json({ success: true, data: list });
    } catch (err: any) {
      res.status(550).json({ success: false, error: err.message });
    }
  }

  public async createMission(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'test-user-id';
      const mission = await missionService.planMission(userId, req.body);
      res.status(201).json({ success: true, data: mission });
    } catch (err: any) {
      res.status(550).json({ success: false, error: err.message });
    }
  }

  public async runSimulation(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'test-user-id';
      const run = await mappingService.runSimulation(userId, req.body);
      res.status(201).json({ success: true, data: run });
    } catch (err: any) {
      res.status(550).json({ success: false, error: err.message });
    }
  }

  public async getMetrics(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'test-user-id';
      const metrics = await roboticsRepository.getMetrics(userId);
      res.status(200).json({ success: true, data: metrics });
    } catch (err: any) {
      res.status(550).json({ success: false, error: err.message });
    }
  }

  public async getOverview(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'test-user-id';
      const overview = await roboticsRepository.getOverview(userId);
      res.status(200).json({ success: true, data: overview });
    } catch (err: any) {
      res.status(550).json({ success: false, error: err.message });
    }
  }

  public async registerRobot(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'test-user-id';
      const robot = await controlService.registerRobot(userId, req.body);
      res.status(201).json({ success: true, data: robot });
    } catch (err: any) {
      res.status(550).json({ success: false, error: err.message });
    }
  }

  public async logSensorData(req: Request, res: Response): Promise<void> {
    try {
      const stream = await fusionService.logTelemetry(req.body);
      res.status(201).json({ success: true, data: stream });
    } catch (err: any) {
      res.status(550).json({ success: false, error: err.message });
    }
  }
}
