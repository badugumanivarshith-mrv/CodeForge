import { Request, Response, NextFunction } from 'express';
import { CurriculumService } from '../services';
import { ApiResponse } from '@codeforge/shared';

export class CurriculumController {
  constructor(private curriculumService: CurriculumService) {}

  public getLanguages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const languages = await this.curriculumService.getAllLanguages();
      const response: ApiResponse<typeof languages> = {
        success: true,
        data: languages,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getLanguageRoadmap = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { languageSlug } = req.params;
      const userId = (req as any).user?.id;
      const roadmap = await this.curriculumService.getLanguageRoadmap(languageSlug, userId);
      const response: ApiResponse<typeof roadmap> = {
        success: true,
        data: roadmap,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getTopicDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { languageSlug, topicSlug } = req.params;
      const userId = (req as any).user?.id;
      const detail = await this.curriculumService.getTopicDetail(languageSlug, topicSlug, userId);
      const response: ApiResponse<typeof detail> = {
        success: true,
        data: detail,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getLessonDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { lessonId } = req.params;
      const userId = (req as any).user?.id;
      const detail = await this.curriculumService.getLessonDetail(lessonId, userId);
      const response: ApiResponse<typeof detail> = {
        success: true,
        data: detail,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
