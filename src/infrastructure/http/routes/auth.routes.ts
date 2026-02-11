import type { FastifyInstance } from 'fastify'
import { PrismaCustomerRepository } from '../../repositories/prisma-customer.repository.js'
import { RegisterUseCase } from '../../../application/auth/register.usecase.js'
import { RegisterRequestSchema, RegisterResponseSchema } from '../../../application/dtos/register.dto.js'
import { LoginRequestSchema } from '../../../application/dtos/login.dto.js'
import {
  SessionLogoutRequestSchema,
  SessionRefreshRequestSchema,
  SessionResponseSchema,
} from '../../../application/dtos/session.dto.js'
import { SessionService } from '../../auth/session.service.js'
import { LoginAttemptsService } from '../../auth/login-attempts.service.js'
import { JwtTokenService } from '../../auth/jwt-token.service.js'
import { RefreshSessionUseCase } from '../../../application/auth/refresh-session.usecase.js'
import { LogoutUseCase } from '../../../application/auth/logout.usecase.js'
import { env } from '../../../env.js'
import { LoginUseCase } from '../../../application/auth/login.usecase.js'
import { Logger } from '../../logging/logger.js'

export async function registerAuthRoutes(app: FastifyInstance) {
  const sessionService = new SessionService()
  const loginAttempts = new LoginAttemptsService()
  const tokenService = new JwtTokenService()
  const logger = new Logger()

  app.post(
    '/register',
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_MAX,
          timeWindow: env.RATE_LIMIT_WINDOW_SECONDS * 1000,
        },
      },
    },
    async (req, reply) => {
      const validatedData = RegisterRequestSchema.parse(req.body)

      const repo = new PrismaCustomerRepository()
      const usecase = new RegisterUseCase(repo, logger)

      const result = await usecase.execute(validatedData)
      return reply.code(201).send(RegisterResponseSchema.parse(result))
    },
  )

  app.post(
    '/login',
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_MAX,
          timeWindow: env.RATE_LIMIT_WINDOW_SECONDS * 1000,
        },
      },
    },
    async (req, reply) => {
      const validatedData = LoginRequestSchema.parse(req.body)
      const repo = new PrismaCustomerRepository()
      const usecase = new LoginUseCase(
        repo,
        tokenService,
        sessionService,
        loginAttempts,
        logger,
      )

      const result = await usecase.execute(validatedData, {
        ip: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
      })

      return reply.code(200).send(SessionResponseSchema.parse(result))
    },
  )

  app.post(
    '/refresh',
    {
      config: {
        rateLimit: {
          max: env.RATE_LIMIT_MAX,
          timeWindow: env.RATE_LIMIT_WINDOW_SECONDS * 1000,
        },
      },
    },
    async (req, reply) => {
      const body = SessionRefreshRequestSchema.parse(req.body)
      const repo = new PrismaCustomerRepository()
      const usecase = new RefreshSessionUseCase(
        repo,
        tokenService,
        sessionService,
        logger,
      )

      const result = await usecase.execute(body.sessionId, {
        ip: req.ip,
        userAgent: req.headers['user-agent'] || 'unknown',
      })

      return reply.code(200).send(SessionResponseSchema.parse(result))
    },
  )

  app.post('/logout', async (req, reply) => {
    const body = SessionLogoutRequestSchema.parse(req.body)
    const usecase = new LogoutUseCase(sessionService, logger)
    await usecase.execute(body.sessionId)
    return reply.code(204).send()
  })
}
