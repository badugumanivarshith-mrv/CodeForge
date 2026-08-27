import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ApiErrorResponse, ApiErrorDetail } from '@codeforge/shared';
import { AppError } from '../core/errors/AppError';
import { logger } from '../core/utils/logger';
import { env } from '../config/env';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): Response<ApiErrorResponse> => {
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected internal server error occurred';
  let details: ApiErrorDetail[] | undefined = undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 422;
    code = 'VALIDATION_ERROR';
    message = 'Input validation failed';
    details = err.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message,
      code: e.code,
    }));
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  if (statusCode >= 500) {
    logger.error({
      err,
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl,
    }, 'Server Error');
  } else {
    logger.warn({
      code,
      message,
      statusCode,
      requestId: req.requestId,
    }, 'Client Error');
  }

  const responsePayload: ApiErrorResponse = {
    success: false,
    error: {
      message,
      code,
      statusCode,
      ...(details ? { details } : {}),
      ...(env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
    },
    meta: {
      timestamp: new Date().toISOString(),
      ...(req.requestId ? { requestId: req.requestId } : {}),
    },
  };

  return res.status(statusCode).json(responsePayload);
};
