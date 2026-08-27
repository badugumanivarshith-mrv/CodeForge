import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env';
import * as schema from './schema';
import { logger } from '../core/utils/logger';

// Create postgres query client
export const queryClient = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {}, // Suppress notices
});

// Initialize Drizzle ORM
export const db = drizzle(queryClient, { schema });

// Database healthcheck utility
export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await queryClient`SELECT 1`;
    return true;
  } catch (error) {
    logger.error({ error }, 'Database health check failed');
    return false;
  }
};
