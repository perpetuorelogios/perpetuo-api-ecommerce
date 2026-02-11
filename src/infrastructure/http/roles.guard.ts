import type { FastifyReply, FastifyRequest } from 'fastify'
import { UserRole } from '../../domain/commerce/shared/enums.js'

export function requireRoles(roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const role = request.user?.role as UserRole | undefined
    if (!role || !roles.includes(role)) {
      return reply.code(403).send({ error: 'Forbidden' })
    }
  }
}
