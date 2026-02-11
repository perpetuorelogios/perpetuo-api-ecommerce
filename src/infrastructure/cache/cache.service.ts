import { redis } from './redis.client.js'

export class CacheService {
  async getJson<T>(key: string): Promise<T | null> {
    const value = await redis.get(key)
    if (!value) {
      return null
    }
    return JSON.parse(value) as T
  }

  async setJson(key: string, value: unknown, ttlSeconds?: number) {
    const payload = JSON.stringify(value)
    if (ttlSeconds) {
      await redis.set(key, payload, { EX: ttlSeconds })
      return
    }
    await redis.set(key, payload)
  }

  async del(key: string) {
    await redis.del(key)
  }
}
