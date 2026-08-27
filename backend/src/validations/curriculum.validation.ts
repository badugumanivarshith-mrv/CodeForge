import { z } from 'zod';

export const languageSlugParamSchema = z.object({
  params: z.object({
    languageSlug: z.string().min(1, 'Language slug is required'),
  }),
});

export const topicSlugParamsSchema = z.object({
  params: z.object({
    languageSlug: z.string().min(1, 'Language slug is required'),
    topicSlug: z.string().min(1, 'Topic slug is required'),
  }),
});

export const lessonIdParamSchema = z.object({
  params: z.object({
    lessonId: z.string().uuid('Invalid lesson UUID'),
  }),
});
