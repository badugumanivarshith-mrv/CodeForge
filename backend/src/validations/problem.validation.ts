import { z } from 'zod';

export const problemSlugParamSchema = z.object({
  params: z.object({
    problemSlug: z.string().min(1, 'Problem slug is required'),
  }),
});

export const problemHintParamSchema = z.object({
  params: z.object({
    problemId: z.string().uuid('Invalid problem UUID'),
    tier: z.coerce.number().int().min(1).max(3),
  }),
});
