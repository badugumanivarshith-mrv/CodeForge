import { Request, Response, NextFunction } from 'express';
import { ProgressService } from '../services';
import { ApiResponse } from '@codeforge/shared';

export class ProgressController {
  constructor(private progressService: ProgressService) {}

  public completeLesson = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { lessonId } = req.params;
      const userId = (req as any).user.id;

      const result = await this.progressService.completeLesson(userId, lessonId);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const dashboard = await this.progressService.getDashboard(userId);

      const response: ApiResponse<typeof dashboard> = {
        success: true,
        data: dashboard,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
