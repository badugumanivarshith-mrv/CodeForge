import { Router } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { authGuard } from '../../middleware/authMiddleware';
import { authRateLimiter } from '../../middleware/rateLimiter';
import { validateRequest } from '../../middleware/validateRequest';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '../../validations/auth.validation';

export const authRouter = Router();
const authController = new AuthController();

// Authentication Flow
authRouter.post('/register', authRateLimiter, validateRequest(registerSchema), authController.register);
authRouter.post('/login', authRateLimiter, validateRequest(loginSchema), authController.login);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authGuard, authController.logout);
authRouter.post('/logout-all', authGuard, authController.logoutAll);
authRouter.get('/me', authGuard, authController.getMe);

// Account Security & Recovery Flow
authRouter.post(
  '/change-password',
  authGuard,
  validateRequest(changePasswordSchema),
  authController.changePassword,
);
authRouter.post(
  '/forgot-password',
  authRateLimiter,
  validateRequest(forgotPasswordSchema),
  authController.forgotPassword,
);
authRouter.post(
  '/reset-password',
  authRateLimiter,
  validateRequest(resetPasswordSchema),
  authController.resetPassword,
);

// Email Verification Flow
authRouter.post('/verify-email', validateRequest(verifyEmailSchema), authController.verifyEmail);
authRouter.post('/resend-verification', authGuard, authController.resendVerification);
