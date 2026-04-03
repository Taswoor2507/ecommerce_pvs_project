import Redis from 'ioredis';
import { CONSTANTS } from "./constants.js";

// Check if Redis is disabled via environment variable
const REDIS_DISABLED = CONSTANTS.REDIS_DISABLED === 'true';

let redis = null;

if (!REDIS_DISABLED) {
  redis = new Redis({
    host:     CONSTANTS.REDIS_HOST     || 'localhost',
    port:     parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    // Connection timeout - fail fast if Redis is not available
    connectTimeout: 5000, // 5 seconds
    commandTimeout: 3000, // 3 seconds
    // Reconnect with exponential backoff, capped at 30 seconds
    retryStrategy(times) {
      // In development, fail fast after 3 attempts
      if (process.env.NODE_ENV !== 'production' && times >= 3) {
        return null; // Stop retrying
      }
      return Math.min(times * 100, 30000);
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true, 
    enableOfflineQueue: false, 
  });

  redis.on('connect',      ()    => console.log('✅ Redis connected'));
  redis.on('reconnecting', ()    => console.log('🔄 Redis reconnecting…'));
  redis.on('error',        (err) => {
    console.error('❌ Redis error:', err.message);
    // In development, don't crash if Redis is not available
    if (CONS.NODE_ENV !== 'production') {
      console.warn('⚠️  Running without Redis cache (development mode)');
    }
  });
} else {
  console.warn('⚠️  Redis is disabled via REDIS_DISABLED=true');
}

export default redis;