// src/utils/redisLock.js
// ─────────────────────────────────────────────────────────────────────────────
// Distributed lock using Redis SET NX PX (Redlock pattern, single-node).
//
// WHY THIS IS NEEDED:
//   Two admins simultaneously adding variant types to the same product would
//   both read "current state", compute independent Cartesian products, and
//   write conflicting/incomplete combinations. MongoDB transactions alone
//   cannot prevent this because both transactions would read the same state
//   before either writes.
//
//   The lock ensures only ONE combination-generation run executes per product
//   at a time. The TTL (15s) guarantees the lock auto-expires if the server
//   crashes while holding it — preventing permanent deadlock.
//
// LUA SCRIPT for release:
//   We use a Lua script to atomically check+delete the lock. Without it,
//   a race condition exists: check key == our value → CRASH → key expires →
//   new owner gets lock → we wake up and delete their lock. The script makes
//   check+delete atomic at the Redis server level.
// ─────────────────────────────────────────────────────────────────────────────
import redis from '../config/redis.js';
import { ApiError } from './apiError.js';

const LOCK_TTL_MS  = 15_000; // 15 seconds max for combination generation
const RETRY_WAIT   = 500;    // 500ms between retry attempts
const MAX_ATTEMPTS = 10;     // 10 * 500ms = 5 seconds max wait

/**
 * Attempt to acquire a Redis distributed lock.
 * @param {string} key       Lock key (e.g. "lock:product:123:combinations")
 * @param {number} [ttlMs]   Lock TTL in milliseconds
 * @returns {string|null}    Lock value (to pass to releaseLock) or null if not acquired
 */
async function acquireLock(key, ttlMs = LOCK_TTL_MS) {
  // Unique value so we only release OUR lock (not a lock held by someone else)
  const lockValue = `${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  // SET key value NX PX ttl  — atomic: only sets if key does NOT exist
  const result = await redis.set(key, lockValue, 'NX', 'PX', ttlMs);
  return result === 'OK' ? lockValue : null;
}

/**
 * Release a lock using a Lua script (atomic check+delete).
 * @param {string} key        Lock key
 * @param {string} lockValue  Value returned by acquireLock (proves ownership)
 */
async function releaseLock(key, lockValue) {
  const lua = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  await redis.eval(lua, 1, key, lockValue);
}

/**
 * Execute fn() while holding a product-level combination generation lock.
 * Retries acquiring the lock for up to 5 seconds before giving up.
 *
 * @param {string}   productId  MongoDB product ObjectId string
 * @param {Function} fn         Async function to execute inside the lock
 */
async function withProductLock(productId, fn) {
  const lockKey   = `lock:product:${productId}:combinations`;
  let   lockValue = null;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    lockValue = await acquireLock(lockKey);
    if (lockValue) break;
    await new Promise((r) => setTimeout(r, RETRY_WAIT));
  }

  if (!lockValue) {
    throw new ApiError(
      409,
      'Product is currently being updated. Please try again in a moment.'
    );
  }

  try {
    return await fn();
  } finally {
    // Always release — even if fn() throws
    await releaseLock(lockKey, lockValue);
  }
}

module.exports = { withProductLock };