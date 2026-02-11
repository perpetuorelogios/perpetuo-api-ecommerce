import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import { ZodError } from 'zod'
import { AppError } from '../../application/shared/app-error.js'
import { env } from '../../env.js'
import { routes } from './routes/index.js'

export const app = Fastify()

app.register(helmet)

const allowedOrigins = env.CORS_ORIGINS
	? env.CORS_ORIGINS.split(',').map((origin) => origin.trim())
	: env.NODE_ENV === 'local'
		? true
		: []

app.register(cors, {
	origin: allowedOrigins,
})

app.register(rateLimit, {
	global: false,
})

app.setErrorHandler((error, _req, reply) => {
	if (error instanceof ZodError) {
		return reply.code(400).send({ error: error.message })
	}
	if (error instanceof AppError) {
		return reply.code(error.statusCode).send({ error: error.message })
	}
	return reply.code(500).send({ error: 'Internal server error' })
})

app.register(routes)
