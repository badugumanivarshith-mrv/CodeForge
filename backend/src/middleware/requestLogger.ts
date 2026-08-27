import { Request, Response, NextFunction } from 'express';
import { logger } from '../core/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const requestId = `req_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
  req.requestId = requestId;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    logger.info({
      requestId,
      method,
      url: originalUrl,
      statusCode,
      durationMs: duration,
    });
  });

  next();
};
