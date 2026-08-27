import { Request, Response, NextFunction } from 'express';
import { InterviewService } from '../services/interview.service';
import { ApiResponse } from '@codeforge/shared';
import { UnauthorizedError } from '../core/errors';

export class InterviewController {
  private interviewService: InterviewService;

  constructor(interviewService = new InterviewService()) {
    this.interviewService = interviewService;
  }

  start = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const result = await this.interviewService.startInterview(req.user.userId, req.body);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  };

  answer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const result = await this.interviewService.answerQuestion(id, req.user.userId, req.body);
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  finish = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const feedback = await this.interviewService.finishInterview(id, req.user.userId);
      const response: ApiResponse<typeof feedback> = {
        success: true,
        data: feedback,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getFeedback = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const { id } = req.params;
      const feedback = await this.interviewService.getInterviewFeedback(id, req.user.userId);
      const response: ApiResponse<typeof feedback> = {
        success: true,
        data: feedback,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        throw new UnauthorizedError('Authentication required');
      }
      const history = await this.interviewService.getUserInterviewHistory(req.user.userId);
      const response: ApiResponse<typeof history> = {
        success: true,
        data: history,
      };
      return res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  };
}
