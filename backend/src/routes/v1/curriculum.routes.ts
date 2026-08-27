import { Router, Request, Response } from 'express';
import { sendSuccess } from '../../core/utils/response';
import { TIER_1_LANGUAGES } from '@codeforge/shared';

export const curriculumRouter = Router();

curriculumRouter.get('/languages', (_req: Request, res: Response) => {
  return sendSuccess(res, TIER_1_LANGUAGES);
});

curriculumRouter.get('/:languageSlug', (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Language curriculum roadmap endpoint ready' });
});

curriculumRouter.get('/:languageSlug/:topicSlug', (_req: Request, res: Response) => {
  return sendSuccess(res, { message: 'Topic details endpoint ready' });
});
