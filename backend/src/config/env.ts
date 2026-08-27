import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';

// Load .env from current directory or backend directory
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../backend/.env'),
];

for (const envPath of envPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  // Database
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/codeforge_dev'),

  // Redis
  REDIS_URL: z.string().default('redis://localhost:6379'),

  // JWT Auth
  JWT_SECRET: z.string().min(16).default('codeforge-super-secret-jwt-key-change-in-prod'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_SECRET: z.string().min(16).default('codeforge-super-secret-refresh-key-change-in-prod'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  COOKIE_SECRET: z.string().default('codeforge-cookie-secret-key'),
  AUTH_COOKIE_SECURE: z.coerce.boolean().default(false),
  AUTH_COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),

  // Rate Limiting
  RATE_LIMIT_LOGIN_MAX: z.coerce.number().default(10),
  RATE_LIMIT_REGISTER_MAX: z.coerce.number().default(5),

  // AI Providers
  AI_PROVIDER: z.enum(['gemini', 'openai', 'mock']).default('mock'),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),

  // Judge Configuration
  JUDGE_MAX_CONCURRENCY: z.coerce.number().default(4),
  JUDGE_WORKER_TIMEOUT_MS: z.coerce.number().default(10000),
  JUDGE_DEFAULT_MEMORY_MB: z.coerce.number().default(256),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables configuration:');
    console.error(result.error.format());
    process.exit(1);
  }
  return result.data;
};

export const env = parseEnv();
export type Environment = z.infer<typeof envSchema>;
