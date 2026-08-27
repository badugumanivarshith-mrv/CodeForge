import { Request, Response, NextFunction } from 'express';
import { MentorService } from '../services/mentor.service';
import { sendSuccess } from '../core/utils/response';
import { UnauthorizedError } from '../core/errors';

export class MentorController {
  constructor(private mentorService: MentorService) {}

  public createSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const session = await this.mentorService.createSession(userId, req.body);
      sendSuccess(res, session, 201);
    } catch (err) {
      next(err);
    }
  };

  public getSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const session = await this.mentorService.getSession(userId, id);
      sendSuccess(res, session);
    } catch (err) {
      next(err);
    }
  };

  public getUserSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const limit = req.query.limit ? Number(req.query.limit) : 20;
      const sessions = await this.mentorService.getUserSessions(userId, limit);
      sendSuccess(res, sessions);
    } catch (err) {
      next(err);
    }
  };

  public sendMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const result = await this.mentorService.sendMessage(userId, req.body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  };

  public requestHint = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const hint = await this.mentorService.requestHint(userId, req.body);
      sendSuccess(res, hint);
    } catch (err) {
      next(err);
    }
  };

  public requestCodeReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const review = await this.mentorService.requestCodeReview(userId, req.body);
      sendSuccess(res, review);
    } catch (err) {
      next(err);
    }
  };

  public analyzeSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const analysis = await this.mentorService.analyzeSubmission(userId, req.body);
      sendSuccess(res, analysis);
    } catch (err) {
      next(err);
    }
  };

  public explainConcept = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const explanation = await this.mentorService.explainConcept(userId, req.body);
      sendSuccess(res, explanation);
    } catch (err) {
      next(err);
    }
  };

  public generatePractice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const practice = await this.mentorService.generatePractice(userId, req.body);
      sendSuccess(res, practice);
    } catch (err) {
      next(err);
    }
  };
}
