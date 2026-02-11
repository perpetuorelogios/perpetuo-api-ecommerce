import type { FastifyReply, FastifyRequest } from 'fastify'
import { verifyToken } from '../auth/jwt.service.js'

export async function authGuard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization
  if (!authHeader) {
    return reply.code(401).send({ error: 'Missing Authorization header' })
  }

  const [scheme, token] = authHeader.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return reply.code(401).send({ error: 'Invalid Authorization header' })
  }

  try {
    const payload = verifyToken(token)
    request.user = payload
  } catch {
    return reply.code(401).send({ error: 'Invalid token' })
  }
}
