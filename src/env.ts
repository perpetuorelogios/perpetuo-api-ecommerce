import { z } from 'zod'
import type { SignOptions } from 'jsonwebtoken'

const envSchema = z.object({
  NODE_ENV: z.enum(['local', 'hml', 'prod']).default('local'),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().min(1),

  JWT_SECRET: z.string().min(1),

  // 👇 força o tipo certo
  JWT_EXPIRES_IN: z.custom<SignOptions['expiresIn']>().default('1d'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error(parsed.error.flatten().fieldErrors)
  throw new Error('Invalid env vars')
}

export const env = parsed.data
