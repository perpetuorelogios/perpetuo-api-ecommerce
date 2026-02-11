import { z } from 'zod'
import type { SignOptions } from 'jsonwebtoken'

const envSchema = z.object({
  NODE_ENV: z.enum(['local', 'hml', 'prod']).default('local'),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),
  ASAAS_API_URL: z.string().min(1),
  ASAAS_API_KEY: z.string().min(1),
  ASAAS_WEBHOOK_TOKEN: z.string().min(1),

  ACCESS_TOKEN_EXPIRES_IN: z.custom<SignOptions['expiresIn']>().default('15m'),

  // 👇 força o tipo certo
  JWT_EXPIRES_IN: z.custom<SignOptions['expiresIn']>().default('1d'),

  SESSION_TTL_SECONDS: z.coerce.number().default(60 * 60 * 24 * 7),
  RATE_LIMIT_MAX: z.coerce.number().default(20),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().default(60),
  LOGIN_MAX_ATTEMPTS: z.coerce.number().default(5),
  LOGIN_LOCK_SECONDS: z.coerce.number().default(15 * 60),

  CORS_ORIGINS: z.string().optional(),
  LOGSTASH_URL: z.string().optional(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors)
  throw new Error('Invalid env vars')
}

export const env = parsed.data
