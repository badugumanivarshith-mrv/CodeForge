import { Request, Response, NextFunction } from 'express';
import { PortfolioService } from '../services/portfolio.service';
import { ApiResponse } from '@codeforge/shared';
import { UnauthorizedError } from '../core/errors';

export class PortfolioController {
  private portfolioService: PortfolioService;

  constructor(portfolioService = new PortfolioService()) {
    this.portfolioService = portfolioService;
  }

  getMyPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const portfolio = await this.portfolioService.getMyPortfolio(req.user.userId);
      const response: ApiResponse<typeof portfolio> = {
        success: true,
        data: portfolio,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getPublicPortfolio = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.params;
      const portfolio = await this.portfolioService.getPublicPortfolioByUsername(username);
      const response: ApiResponse<typeof portfolio> = {
        success: true,
        data: portfolio,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const settings = await this.portfolioService.updatePortfolioSettings(req.user.userId, req.body);
      const response: ApiResponse<typeof settings> = {
        success: true,
        data: settings,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };


  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const project = await this.portfolioService.createProject(req.user.userId, req.body);
      const response: ApiResponse<typeof project> = {
        success: true,
        data: project,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const project = await this.portfolioService.updateProject(id, req.user.userId, req.body);
      const response: ApiResponse<typeof project> = {
        success: true,
        data: project,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      await this.portfolioService.deleteProject(id, req.user.userId);
      const response: ApiResponse<{ deleted: true }> = {
        success: true,
        data: { deleted: true },
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
