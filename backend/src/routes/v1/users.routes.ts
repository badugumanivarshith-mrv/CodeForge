import { Router } from 'express';
import { UserController } from '../../controllers/user.controller';
import { authGuard } from '../../middleware/authMiddleware';
import { validateRequest } from '../../middleware/validateRequest';
import {
  updateProfileSchema,
  updatePreferencesSchema,
  getUsernameParamSchema,
} from '../../validations/user.validation';

export const usersRouter = Router();
const userController = new UserController();

// Profile endpoints
usersRouter.get('/me', authGuard, userController.getMyProfile);
usersRouter.patch('/me', authGuard, validateRequest(updateProfileSchema), userController.updateMyProfile);

// Preferences endpoints
usersRouter.get('/me/preferences', authGuard, userController.getMyPreferences);
usersRouter.patch(
  '/me/preferences',
  authGuard,
  validateRequest(updatePreferencesSchema),
  userController.updateMyPreferences,
);

// Backward compatible aliases
usersRouter.get('/profile', authGuard, userController.getMyProfile);
usersRouter.patch('/profile', authGuard, validateRequest(updateProfileSchema), userController.updateMyProfile);
usersRouter.get('/profile/:username', validateRequest(getUsernameParamSchema), userController.getPublicProfile);

// Public profile endpoint (/api/v1/users/:username)
usersRouter.get('/:username', validateRequest(getUsernameParamSchema), userController.getPublicProfile);
