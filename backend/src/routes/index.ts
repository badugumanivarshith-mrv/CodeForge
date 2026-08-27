import { Router } from 'express';
import { healthRouter } from './health.routes';
import { v1Router } from './v1';

export const rootRouter = Router();

rootRouter.use('/health', healthRouter);
rootRouter.use('/api/v1', v1Router);
