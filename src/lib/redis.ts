import Redis from 'ioredis'

const redisClientSingleton = () => {
  const client = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 1,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 50, 2000);
    },
  });

  client.on('error', (err) => {
    // Only log if not during build/static-gen to keep build logs clean
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      console.error('[REDIS] Connection error:', err);
    }
  });

  return client;
}

declare global {
  var redis: undefined | ReturnType<typeof redisClientSingleton>
}

const redis = global.redis ?? redisClientSingleton()

export { redis }

if (process.env.NODE_ENV !== 'production') global.redis = redis

export const CACHE_TTL = {
  MATCHES: 60, // 1 minute
  NEWS: 300,   // 5 minutes
  GALLERY: 600, // 10 minutes
  SQUAD: 1200,  // 20 minutes
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedData = await redis.get(key)
    if (cachedData) {
      console.log(`[REDIS] Cache HIT: ${key}`)
      return JSON.parse(cachedData)
    }
    console.log(`[REDIS] Cache MISS: ${key}`)
    return null
  } catch (error) {
    console.error(`[REDIS] Error getting cache for ${key}:`, error)
    return null
  }
}

export const setCache = async (key: string, data: any, ttl: number = 60): Promise<void> => {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttl)
    console.log(`[REDIS] Cache SET: ${key} (TTL: ${ttl}s)`)
  } catch (error) {
    console.error(`[REDIS] Error setting cache for ${key}:`, error)
  }
}

export const invalidateCache = async (key: string): Promise<void> => {
  try {
    await redis.del(key)
    console.log(`[REDIS] Cache INVALIDATED: ${key}`)
  } catch (error) {
    console.error(`[REDIS] Error invalidating cache for ${key}:`, error)
  }
}
