import { Request, Response, NextFunction } from 'express';
import { ResumeService } from '../services/resume.service';
import { ApiResponse } from '@codeforge/shared';
import { UnauthorizedError } from '../core/errors';

export class ResumeController {
  private resumeService: ResumeService;

  constructor(resumeService = new ResumeService()) {
    this.resumeService = resumeService;
  }

  createResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const resume = await this.resumeService.createResume(req.user.userId, req.body);
      const response: ApiResponse<typeof resume> = {
        success: true,
        data: resume,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  getMyResumes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const resumes = await this.resumeService.getUserResumes(req.user.userId);
      const response: ApiResponse<typeof resumes> = {
        success: true,
        data: resumes,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const resume = await this.resumeService.getResume(id, req.user.userId);
      const response: ApiResponse<typeof resume> = {
        success: true,
        data: resume,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  updateResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const resume = await this.resumeService.updateResume(id, req.user.userId, req.body);
      const response: ApiResponse<typeof resume> = {
        success: true,
        data: resume,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  deleteResume = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      await this.resumeService.deleteResume(id, req.user.userId);
      const response: ApiResponse<{ deleted: true }> = {
        success: true,
        data: { deleted: true },
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  analyzeAts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const analysis = await this.resumeService.analyzeAtsScore(id, req.user.userId);
      const response: ApiResponse<typeof analysis> = {
        success: true,
        data: analysis,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
