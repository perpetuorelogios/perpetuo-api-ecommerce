import type { FastifyInstance } from 'fastify'

export async function registerHealthRoutes(
  app: FastifyInstance,
  startTime: number,
) {
  app.get('/health', async (_req, reply) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000)
    const response = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime,
      version: '1.0.0',
    }

    return reply.code(200).send(response)
  })
}
