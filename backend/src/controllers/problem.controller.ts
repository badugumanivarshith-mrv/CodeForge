import { Request, Response, NextFunction } from 'express';
import { ProblemService } from '../services';
import { ApiResponse, LanguageId } from '@codeforge/shared';

export class ProblemController {
  constructor(private problemService: ProblemService) {}

  public listProblems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { topicId, difficulty } = req.query;
      const problems = await this.problemService.listProblems({
        topicId: topicId as string | undefined,
        difficulty: difficulty as string | undefined,
      });

      const response: ApiResponse<typeof problems> = {
        success: true,
        data: problems,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getProblemDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { problemSlug } = req.params;
      const { lang } = req.query;
      const problem = await this.problemService.getProblemDetail(
        problemSlug,
        lang as LanguageId | undefined,
      );

      const response: ApiResponse<typeof problem> = {
        success: true,
        data: problem,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getProblemHints = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { problemId, tier } = req.params;
      const hint = await this.problemService.getProblemHints(problemId, Number(tier));

      const response: ApiResponse<typeof hint> = {
        success: true,
        data: hint,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
