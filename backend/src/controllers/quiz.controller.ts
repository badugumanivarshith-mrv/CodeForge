import { Request, Response, NextFunction } from 'express';
import { QuizService } from '../services';
import { ApiResponse } from '@codeforge/shared';

export class QuizController {
  constructor(private quizService: QuizService) {}

  public getQuizByTopic = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { topicId } = req.params;
      const quiz = await this.quizService.getQuizByTopicId(topicId);

      const response: ApiResponse<typeof quiz> = {
        success: true,
        data: quiz,
        meta: { timestamp: new Date().toISOString() },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  public submitQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { quizId } = req.params;
      const { answers } = req.body;
      const userId = (req as any).user.id;

      const result = await this.quizService.submitQuiz(userId, quizId, answers);

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
}
