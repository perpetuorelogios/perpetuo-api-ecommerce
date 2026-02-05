import Fastify from 'fastify'
import { routes } from './routes.js'

export const app = Fastify()

app.register(routes)
