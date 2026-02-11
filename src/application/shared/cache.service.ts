export interface CacheServicePort {
  getJson<T>(key: string): Promise<T | null>
  setJson(key: string, value: unknown, ttlSeconds?: number): Promise<void>
  del(key: string): Promise<void>
}
