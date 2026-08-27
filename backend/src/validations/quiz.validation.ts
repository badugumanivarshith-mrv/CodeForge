import { z } from 'zod';

export const topicIdParamSchema = z.object({
  params: z.object({
    topicId: z.string().uuid('Invalid topic UUID'),
  }),
});

export const quizIdParamSchema = z.object({
  params: z.object({
    quizId: z.string().uuid('Invalid quiz UUID'),
  }),
});

export const quizSubmitBodySchema = z.object({
  params: z.object({
    quizId: z.string().uuid('Invalid quiz UUID'),
  }),
  body: z.object({
    answers: z.array(
      z.object({
        questionId: z.string().uuid('Invalid question UUID'),
        selectedOptionId: z.string().uuid('Invalid option UUID'),
      }),
    ).min(1, 'At least one answer must be submitted'),
  }),
});
