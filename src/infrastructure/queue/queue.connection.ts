import IORedis from 'ioredis'
import { env } from '../../env.js'

export const queueConnection = new IORedis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
})
