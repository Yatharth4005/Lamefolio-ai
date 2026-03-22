import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  GEMINI_API_KEY: z.string(),
  GITHUB_TOKEN: z.string().optional(),
  GITHUB_CLIENT_ID: z.string().default(''),
  GITHUB_CLIENT_SECRET: z.string().default(''),
  NOTION_TOKEN: z.string().optional(),
  NOTION_PAGE_ID: z.string().optional(),
  NOTION_CLIENT_ID: z.string().default(''),
  NOTION_CLIENT_SECRET: z.string().default(''),
  NEON_DATABASE_URL: z.string().optional(),
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
