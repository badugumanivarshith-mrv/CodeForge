import { z } from 'zod';
import { LanguageId } from '@codeforge/shared';

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().max(100).optional(),
    avatarUrl: z.string().url().max(500).optional(),
    bio: z.string().max(500).optional(),
    githubUsername: z.string().max(100).optional(),
    preferredLanguageId: z.nativeEnum(LanguageId).optional(),
    timezone: z.string().max(50).optional(),
    learningGoals: z.array(z.string()).optional(),
  }),
});

export const updatePreferencesSchema = z.object({
  body: z.object({
    theme: z.enum(['dark', 'light']).optional(),
    editorFontSize: z.number().int().min(10).max(32).optional(),
    editorKeybindings: z.enum(['standard', 'vim', 'emacs']).optional(),
    emailNotifications: z.boolean().optional(),
    aiHintLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  }),
});

export const getUsernameParamSchema = z.object({
  params: z.object({
    username: z.string().min(1),
  }),
});
