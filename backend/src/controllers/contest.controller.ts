import { Request, Response, NextFunction } from 'express';
import { ContestService } from '../services/contest.service';
import { sendSuccess } from '../core/utils/response';
import { UnauthorizedError, ValidationError } from '../core/errors';
import { ContestState } from '@codeforge/shared';

export class ContestController {
  constructor(private readonly contestService: ContestService) {}

  public listContests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.query.status as ContestState | undefined;
      const contests = await this.contestService.listContests(status);
      sendSuccess(res, contests, 200);
    } catch (error) {
      next(error);
    }
  };

  public getContest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      if (!id) throw new ValidationError('Contest ID is required');

      const contest = await this.contestService.getContest(id, userId);
      sendSuccess(res, contest, 200);
    } catch (error) {
      next(error);
    }
  };

  public createContest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const contest = await this.contestService.createContest(userId, req.body);
      sendSuccess(res, contest, 201);
    } catch (error) {
      next(error);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const participant = await this.contestService.registerParticipant(userId, id);
      sendSuccess(res, participant, 200);
    } catch (error) {
      next(error);
    }
  };

  public start = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const participant = await this.contestService.startContest(userId, id);
      sendSuccess(res, participant, 200);
    } catch (error) {
      next(error);
    }
  };

  public submitProblem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const { problemId, sourceCode, languageId } = req.body;

      if (!problemId || !sourceCode) {
        throw new ValidationError('Problem ID and source code are required');
      }

      const submission = await this.contestService.submitSolution(userId, {
        contestId: id,
        problemId,
        sourceCode,
        languageId,
      });

      sendSuccess(res, submission, 200);
    } catch (error) {
      next(error);
    }
  };

  public finish = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) throw new UnauthorizedError();

      const { id } = req.params;
      const participant = await this.contestService.finishContest(userId, id);
      sendSuccess(res, participant, 200);
    } catch (error) {
      next(error);
    }
  };
}
