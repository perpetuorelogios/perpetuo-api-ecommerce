import type { FastifyInstance } from 'fastify'
import { registerAuthRoutes } from './auth.routes.js'
import { registerHealthRoutes } from './health.routes.js'
import { registerWebhookRoutes } from './webhook.routes.js'
import { registerProtectedRoutes } from './protected/index.js'

const startTime = Date.now()

export async function routes(app: FastifyInstance) {
  await registerHealthRoutes(app, startTime)
  await registerAuthRoutes(app)
  await registerWebhookRoutes(app)
  await registerProtectedRoutes(app)
}
