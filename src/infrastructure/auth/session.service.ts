import { redis } from '../cache/redis.client.js'
import { env } from '../../env.js'

type SessionData = {
  customerId: string
  ip: string
  userAgent: string
  createdAt: string
}

export class SessionService {
  private key(sessionId: string) {
    return `sessions:${sessionId}`
  }

  async createSession(data: Omit<SessionData, 'createdAt'>) {
    const sessionId = crypto.randomUUID()
    const payload: SessionData = {
      ...data,
      createdAt: new Date().toISOString(),
    }
    await redis.set(this.key(sessionId), JSON.stringify(payload), {
      EX: env.SESSION_TTL_SECONDS,
    })
    return { sessionId }
  }

  async getSession(sessionId: string): Promise<SessionData | null> {
    const value = await redis.get(this.key(sessionId))
    if (!value) {
      return null
    }
    return JSON.parse(value) as SessionData
  }

  async rotateSession(sessionId: string, data: Omit<SessionData, 'createdAt'>) {
    await this.revokeSession(sessionId)
    return this.createSession(data)
  }

  async revokeSession(sessionId: string) {
    await redis.del(this.key(sessionId))
  }
}
