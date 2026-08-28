import { Request, Response, NextFunction } from 'express';
import { JudgeService } from '../modules/judge/judgeService';
import { AnalyticsService } from '../services/analytics.service';
import { SubmissionRepository } from '../repositories/SubmissionRepository';
import {
  ApiResponse,
  SubmitSolutionDto,
  RunCodeDto,
  SubmissionFilterQueryDto,
  LanguageId,
  SubmissionStatus,
} from '@codeforge/shared';

export class JudgeController {
  private judgeService: JudgeService;
  private analyticsService: AnalyticsService;
  private submissionRepo: SubmissionRepository;

  constructor(
    judgeService?: JudgeService,
    analyticsService?: AnalyticsService,
    submissionRepo?: SubmissionRepository,
  ) {
    this.judgeService = judgeService || new JudgeService();
    this.analyticsService = analyticsService || new AnalyticsService();
    this.submissionRepo = submissionRepo || new SubmissionRepository();
  }

  /**
   * Fast sample test execution
   */
  public runCode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { problemId, languageId, sourceCode, customInput } = req.body as RunCodeDto;

      if (!problemId || !languageId || sourceCode === undefined) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'problemId, languageId, and sourceCode are required.' },
        });
        return;
      }

      const result = await this.judgeService.runSample({
        problemId,
        languageId,
        sourceCode,
        customInput,
      });

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

  /**
   * Official submission judging
   */
  public submitSolution = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      const { problemId, languageId, sourceCode, contestId } = req.body as SubmitSolutionDto;

      if (!problemId || !languageId || sourceCode === undefined) {
        res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'problemId, languageId, and sourceCode are required.' },
        });
        return;
      }

      const result = await this.judgeService.submitSolution(userId, {
        problemId,
        languageId,
        sourceCode,
        contestId,
      });

      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Single submission lookup
   */
  public getSubmission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { submissionId } = req.params;
      const userId = (req as any).user?.id || (req as any).user?.userId;

      const submission = await this.judgeService.getSubmissionDetail(submissionId, userId);

      if (!submission) {
        res.status(404).json({
          success: false,
          error: { code: 'NOT_FOUND', message: `Submission '${submissionId}' not found.` },
        });
        return;
      }

      const response: ApiResponse<typeof submission> = {
        success: true,
        data: submission,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * AI failure root cause analysis
   */
  public getSubmissionAnalysis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { submissionId } = req.params;

      const analysis = await this.judgeService.getSubmissionAnalysis(submissionId);

      const response: ApiResponse<typeof analysis> = {
        success: true,
        data: analysis,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * List submissions with filters
   */
  public listSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.userId;
      const { problemId, contestId, languageId, status, limit, offset, sortBy, sortOrder, userOnly } = req.query;

      const filter: SubmissionFilterQueryDto = {
        userId: userOnly === 'true' || userOnly === '1' ? userId : (req.query.userId as string) || undefined,
        problemId: problemId as string | undefined,
        contestId: contestId as string | undefined,
        languageId: languageId as LanguageId | undefined,
        status: status as SubmissionStatus | undefined,
        limit: limit ? parseInt(limit as string, 10) : 20,
        offset: offset ? parseInt(offset as string, 10) : 0,
        sortBy: sortBy as any,
        sortOrder: sortOrder as any,
      };

      const result = await this.submissionRepo.listSubmissions(filter);

      const response: ApiResponse<typeof result.submissions> = {
        success: true,
        data: result.submissions,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Submissions for a specific problem
   */
  public getProblemSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { problemId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const submissionsList = await this.submissionRepo.getByProblem(problemId, limit);

      const response: ApiResponse<typeof submissionsList> = {
        success: true,
        data: submissionsList,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Submissions for a specific contest
   */
  public getContestSubmissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { contestId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const submissionsList = await this.submissionRepo.getByContest(contestId, limit);

      const response: ApiResponse<typeof submissionsList> = {
        success: true,
        data: submissionsList,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Performance analytics for authenticated user
   */
  public getPerformanceAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id || (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        });
        return;
      }

      const analytics = await this.analyticsService.getPerformanceAnalytics(userId);

      const response: ApiResponse<typeof analytics> = {
        success: true,
        data: analytics,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Active language runtimes
   */
  public getLanguageRuntimes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const runtimes = await this.judgeService.getLanguageRuntimes();

      const response: ApiResponse<typeof runtimes> = {
        success: true,
        data: runtimes,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
