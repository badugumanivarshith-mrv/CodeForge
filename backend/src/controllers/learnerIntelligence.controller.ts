import { Request, Response, NextFunction } from 'express';
import { LearnerIntelligenceService } from '../services/learnerIntelligence.service';
import { ApiResponse, LanguageId } from '@codeforge/shared';
import { UnauthorizedError } from '../core/errors';

export class LearnerIntelligenceController {
  constructor(private readonly intelligenceService: LearnerIntelligenceService) {}

  public getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError('Authentication required');

      const languageId = req.query.lang as LanguageId | undefined;
      const profile = await this.intelligenceService.getLearnerProfile(userId, languageId);

      const response: ApiResponse<typeof profile> = {
        success: true,
        data: profile,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public getMastery = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError('Authentication required');

      const languageId = req.query.lang as LanguageId | undefined;
      const masteries = await this.intelligenceService.getTopicMasteries(userId, languageId);

      const response: ApiResponse<typeof masteries> = {
        success: true,
        data: masteries,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public getWeaknesses = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError('Authentication required');

      const languageId = req.query.lang as LanguageId | undefined;
      const weaknesses = await this.intelligenceService.getWeaknesses(userId, languageId);

      const response: ApiResponse<typeof weaknesses> = {
        success: true,
        data: weaknesses,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public getAdaptiveDifficulty = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError('Authentication required');

      const { topicId } = req.params;
      const result = await this.intelligenceService.getAdaptiveDifficulty(userId, topicId);

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public getLearningPath = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError('Authentication required');

      const languageId = req.query.lang as LanguageId | undefined;
      const path = await this.intelligenceService.getPersonalizedLearningPath(userId, languageId);

      const response: ApiResponse<typeof path> = {
        success: true,
        data: path,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public getRecommendations = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError('Authentication required');

      const languageId = req.query.lang as LanguageId | undefined;
      const recommendations = await this.intelligenceService.getRecommendations(userId, languageId);

      const response: ApiResponse<typeof recommendations> = {
        success: true,
        data: recommendations,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  public getAnalytics = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError('Authentication required');

      const languageId = req.query.lang as LanguageId | undefined;
      const analytics = await this.intelligenceService.getLearningAnalytics(userId, languageId);

      const response: ApiResponse<typeof analytics> = {
        success: true,
        data: analytics,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
