import { Router, Request, Response } from 'express';
import { checkDatabaseConnection } from '../database/connection';
import { sendSuccess } from '../core/utils/response';

export const healthRouter = Router();

healthRouter.get('/', async (req: Request, res: Response) => {
  const isDbHealthy = await checkDatabaseConnection();

  const healthData = {
    status: isDbHealthy ? 'healthy' : 'degraded',
    version: '2.0.0',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      api: 'up',
      database: isDbHealthy ? 'connected' : 'disconnected',
    },
  };

  const statusCode = isDbHealthy ? 200 : 503;
  return sendSuccess(res, healthData, statusCode, req.requestId);
});
