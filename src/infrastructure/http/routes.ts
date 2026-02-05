import { FastifyInstance } from 'fastify'
import { PrismaUserRepository } from '../repositories/prisma-user.repository'
import { RegisterUseCase } from '../../application/auth/register.usecase'
import { RegisterRequestSchema } from '../../application/dtos/register.dto'

const startTime = Date.now()

export async function routes(app: FastifyInstance) {
  // Health check route

  app.get('/health', async (req, reply) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000)
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      version: '1.0.0',
    }

    return reply.code(200).send(response)
  })

  // Register route
  app.post('/register', async (req, reply) => {
    try {
      const validatedData = RegisterRequestSchema.parse(req.body)

      const repo = new PrismaUserRepository()
      const usecase = new RegisterUseCase(repo)

      await usecase.execute(validatedData)
      return reply.code(201).send({ message: 'User created successfully' })
    } catch (error) {
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message })
      }
      return reply.code(500).send({ error: 'Internal server error' })
    }
  })
}
