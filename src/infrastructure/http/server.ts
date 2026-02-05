import Fastify from 'fastify'
import { routes } from './routes'

export const app = Fastify()

app.register(routes)
