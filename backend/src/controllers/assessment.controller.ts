import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from '../services/assessment.service';
import { sendSuccess } from '../core/utils/response';
import { UnauthorizedError, ValidationError } from '../core/errors';

export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  public createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const session = await this.assessmentService.createSession(userId, req.body);
      sendSuccess(res, session, 201);
    } catch (error) {
      next(error);
    }
  };

  public getSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      if (!id) throw new ValidationError('Session ID is required');

      const session = await this.assessmentService.getSession(userId, id);
      sendSuccess(res, session, 200);
    } catch (error) {
      next(error);
    }
  };

  public submitAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const { questionId, selectedOptionIds, codeAnswer, languageId, timeSpentSeconds } = req.body;

      if (!questionId) throw new ValidationError('Question ID is required');

      const session = await this.assessmentService.submitAnswer(userId, {
        sessionId: id,
        questionId,
        selectedOptionIds,
        codeAnswer,
        languageId,
        timeSpentSeconds,
      });

      sendSuccess(res, session, 200);
    } catch (error) {
      next(error);
    }
  };

  public completeSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const result = await this.assessmentService.completeSession(userId, id, false);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  };

  public getResult = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const result = await this.assessmentService.getResult(userId, id);
      sendSuccess(res, result, 200);
    } catch (error) {
      next(error);
    }
  };

  public getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const analytics = await this.assessmentService.getAnalytics(userId, id);
      sendSuccess(res, analytics, 200);
    } catch (error) {
      next(error);
    }
  };

  public getRemediation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const remediation = await this.assessmentService.getRemediationPlan(userId, id);
      sendSuccess(res, remediation, 200);
    } catch (error) {
      next(error);
    }
  };

  public getMyHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const history = await this.assessmentService.getUserHistory(userId);
      sendSuccess(res, history, 200);
    } catch (error) {
      next(error);
    }
  };
}
