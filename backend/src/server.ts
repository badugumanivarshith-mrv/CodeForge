import { createApp } from './app';
import { env } from './config/env';
import { logger } from './core/utils/logger';
import { queryClient } from './database/connection';

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`🚀 CodeForge V2 Backend Service Started Successfully`);
  logger.info(`🌐 Environment : ${env.NODE_ENV}`);
  logger.info(`📡 Port        : ${env.PORT}`);
  logger.info(`❤️  Health Check: http://localhost:${env.PORT}/health`);
  logger.info(`🔗 API Base    : http://localhost:${env.PORT}/api/v1`);
  logger.info(`=======================================================`);
});

// Graceful Shutdown
const handleShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    logger.info('HTTP server closed.');
    try {
      await queryClient.end();
      logger.info('Database pool closed.');
    } catch (err) {
      logger.error({ err }, 'Error closing database pool');
    }
    process.exit(0);
  });

  // Force shutdown if taking too long
  setTimeout(() => {
    logger.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
