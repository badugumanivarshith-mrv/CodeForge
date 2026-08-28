import { Request, Response, NextFunction } from 'express';
import {
  careerTwinService,
  careerCoachService,
  skillIntelligenceService,
  salaryIntelligenceService,
  personalBrandService,
  networkIntelligenceService,
  careerTimelineService,
  careerPredictionService,
  careerGoalsService,
} from '../modules/career-os';
import { ApiResponse } from '@codeforge/shared';

export class CareerOsController {
  // 1. Digital Twin
  async getTwin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const twin = await careerTwinService.getOrCreateTwin(userId);
      const response: ApiResponse = { success: true, data: twin };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateTwin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const updated = await careerTwinService.updateTwin(userId, req.body);
      const response: ApiResponse = { success: true, data: updated };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSnapshots(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 12;
      const snapshots = await careerTwinService.getSnapshots(userId, limit);
      const response: ApiResponse = { success: true, data: snapshots };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async recordEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const event = await careerTwinService.recordCareerEvent(userId, req.body);
      const response: ApiResponse = { success: true, data: event };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listEvents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const events = await careerTwinService.listEvents(userId);
      const response: ApiResponse = { success: true, data: events };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 2. AI Career Coach
  async generateCoachingReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const frequency = req.body?.frequency;
      const report = await careerCoachService.generateCoachingReport(userId, frequency);
      const response: ApiResponse = { success: true, data: report };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getLatestCoachingReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      let report = await careerCoachService.getLatestReport(userId);
      if (!report) {
        report = await careerCoachService.generateCoachingReport(userId);
      }
      const response: ApiResponse = { success: true, data: report };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async listCoachingReports(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const reports = await careerCoachService.listReports(userId);
      const response: ApiResponse = { success: true, data: reports };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 3. Skill Intelligence
  async getSkillIntelligence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skillFilter = req.query.q as string | undefined;
      if (skillFilter) {
        const forecasts = skillIntelligenceService.forecastSkillDemand(skillFilter);
        res.json({ success: true, data: forecasts });
        return;
      }
      const intel = skillIntelligenceService.getMarketSkillIntelligence();
      const response: ApiResponse = { success: true, data: intel };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 4. Salary Intelligence
  async getSalaryIntelligence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const twin = await careerTwinService.getOrCreateTwin(userId);
      const role = (req.query.role as string) || twin.currentRole;
      const level = (req.query.level as string) || twin.currentLevel;
      const salary = req.query.salary ? parseInt(req.query.salary as string, 10) : (twin.currentSalaryUsd || 125000);

      const report = salaryIntelligenceService.getSalaryIntelligenceReport(role, level, salary);
      const response: ApiResponse = { success: true, data: report };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 5. Personal Brand
  async getPersonalBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const profile = await personalBrandService.getPersonalBrandProfile(userId);
      const response: ApiResponse = { success: true, data: profile };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updatePersonalBrand(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const profile = await personalBrandService.updateBrandProfile(userId, req.body);
      const response: ApiResponse = { success: true, data: profile };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 6. Network Intelligence
  async getNetworkIntelligence(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const intel = await networkIntelligenceService.getNetworkIntelligence(userId);
      const response: ApiResponse = { success: true, data: intel };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async addConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const connection = await networkIntelligenceService.addConnection(userId, req.body);
      const response: ApiResponse = { success: true, data: connection };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listConnections(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const connections = await networkIntelligenceService.listConnections(userId);
      const response: ApiResponse = { success: true, data: connections };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteConnection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const connectionId = req.params.connectionId;
      const deleted = await networkIntelligenceService.deleteConnection(connectionId, userId);
      const response: ApiResponse = { success: true, data: { deleted } };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 7. Career Timeline
  async getTimeline(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const timeline = await careerTimelineService.getCareerTimeline(userId);
      const response: ApiResponse = { success: true, data: timeline };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async createMilestone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const { title, description, category, targetDate } = req.body;
      const milestone = await careerTimelineService.createMilestone(userId, title, description, category, targetDate);
      const response: ApiResponse = { success: true, data: milestone };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async achieveMilestone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const milestoneId = req.params.milestoneId;
      const milestone = await careerTimelineService.markMilestoneAchieved(userId, milestoneId);
      const response: ApiResponse = { success: true, data: milestone };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 8. AI Career Predictions
  async getPredictions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const report = await careerPredictionService.getLatestPredictions(userId);
      const response: ApiResponse = { success: true, data: report };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async generatePredictions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const report = await careerPredictionService.generatePredictions(userId);
      const response: ApiResponse = { success: true, data: report };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  // 9. Career Goals & Roadmap
  async createGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const goal = await careerGoalsService.createGoal(userId, req.body);
      const response: ApiResponse = { success: true, data: goal };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async listGoals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const goals = await careerGoalsService.listGoals(userId);
      const response: ApiResponse = { success: true, data: goals };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const goalId = req.params.goalId;
      const updated = await careerGoalsService.updateGoal(userId, goalId, req.body);
      const response: ApiResponse = { success: true, data: updated };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteGoal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const goalId = req.params.goalId;
      const deleted = await careerGoalsService.deleteGoal(userId, goalId);
      const response: ApiResponse = { success: true, data: { deleted } };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async getRoadmap(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId || (req.user as any)?.id;
      const roadmap = await careerGoalsService.generateRoadmap(userId);
      const response: ApiResponse = { success: true, data: roadmap };
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const careerOsController = new CareerOsController();
