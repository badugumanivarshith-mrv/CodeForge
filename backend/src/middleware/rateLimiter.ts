import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/**
 * Strict rate limiter for sensitive authentication endpoints:
 * - /login, /register, /forgot-password, /reset-password
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: env.NODE_ENV === 'test' ? 1000 : env.RATE_LIMIT_LOGIN_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
      code: 'TOO_MANY_REQUESTS',
      statusCode: 429,
    },
  },
});

/**
 * General API rate limiter
 */
export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: env.NODE_ENV === 'test' ? 5000 : 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      message: 'Rate limit exceeded. Please slow down your requests.',
      code: 'TOO_MANY_REQUESTS',
      statusCode: 429,
    },
  },
});
