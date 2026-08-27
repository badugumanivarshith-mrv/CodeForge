import { Request, Response, NextFunction } from 'express';
import { CareerIntelligenceService } from '../services/careerIntelligence.service';
import { ApiResponse, CareerRole } from '@codeforge/shared';
import { UnauthorizedError } from '../core/errors';

export class CareerController {
  private careerService: CareerIntelligenceService;

  constructor(careerService = new CareerIntelligenceService()) {
    this.careerService = careerService;
  }

  getCareerPaths = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paths = this.careerService.getCareerPaths();
      const response: ApiResponse<typeof paths> = {
        success: true,
        data: paths,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getCareerPath = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { role } = req.params;
      const path = this.careerService.getCareerPath(role as CareerRole);
      const response: ApiResponse<typeof path> = {
        success: true,
        data: path,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getUserGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const goal = await this.careerService.getUserGoal(req.user.userId);
      const response: ApiResponse<typeof goal> = {
        success: true,
        data: goal,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  setUserGoal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const goal = await this.careerService.setUserGoal(req.user.userId, req.body);
      const response: ApiResponse<typeof goal> = {
        success: true,
        data: goal,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getReadiness = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { role } = req.query;
      const readiness = await this.careerService.calculateReadiness(
        req.user.userId,
        role as CareerRole | undefined,
      );
      const response: ApiResponse<typeof readiness> = {
        success: true,
        data: readiness,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
