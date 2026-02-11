import { redis } from '../cache/redis.client.js'
import { env } from '../../env.js'

export class LoginAttemptsService {
  private key(email: string, ip: string) {
    return `login:attempts:${email.toLowerCase()}:${ip}`
  }

  async isLocked(email: string, ip: string): Promise<boolean> {
    const count = await redis.get(this.key(email, ip))
    return count ? Number(count) >= env.LOGIN_MAX_ATTEMPTS : false
  }

  async recordFailed(email: string, ip: string): Promise<number> {
    const key = this.key(email, ip)
    const count = await redis.incr(key)
    if (count === 1) {
      await redis.expire(key, env.LOGIN_LOCK_SECONDS)
    }
    return count
  }

  async reset(email: string, ip: string) {
    await redis.del(this.key(email, ip))
  }
}
