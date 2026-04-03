import redis from '../config/redis.js';
import Product from '../models/Product.js';
import VariantType from '../models/VariantType.js';
import Option from '../models/Option.js';

const CACHE_TTL = 300; // 5 minutes

/**
 * Get full product data (product + variant types + options, nested).
 * Checks Redis cache first; on miss, fetches from MongoDB and populates cache.
 *
 * @param {string} productId  MongoDB ObjectId string
 * @returns {Object|null}     Nested product object, or null if not found
 */
async function getProductWithVariants(productId) {
  const cacheKey = `product:${productId}:full`;

  // ── 1. Try cache ──────────────────────────────────────────────────────────
  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);
  } catch (err) {
    console.error('Cache read failed, falling back to DB:', err.message);
  }

  // ── 2. Cache miss — fetch from MongoDB ────────────────────────────────────
  const product = await Product.findOne({ _id: productId, is_active: true }).lean();
  if (!product) return null;

  const variantTypes = await VariantType.find({ product_id: productId })
    .sort({ position: 1, createdAt: 1 })
    .lean();

  const options = await Option.find({ product_id: productId })
    .sort({ position: 1, createdAt: 1 })
    .lean();

  // Group options by variant_type_id for O(N) assembly (not O(N²))
  const optionsByType = options.reduce((acc, opt) => {
    const key = opt.variant_type_id.toString();
    if (!acc[key]) acc[key] = [];
    acc[key].push({ _id: opt._id, value: opt.value, position: opt.position });
    return acc;
  }, {});

  const result = {
    ...product,
    is_simple: product.variant_type_count === 0,
    variant_types: variantTypes.map((vt) => ({
      ...vt,
      options: optionsByType[vt._id.toString()] || [],
    })),
  };

  // ── 3. Populate cache ─────────────────────────────────────────────────────
  try {
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
  } catch (err) {
    console.error('Cache write failed:', err.message);
    // Non-fatal — next request will hit DB too, no big deal
  }

  return result;
}

/**
 * Invalidate the cached product data.
 * Must be called after ANY admin mutation to product, variant types, or options.
 *
 * @param {string} productId  MongoDB ObjectId string
 */
async function invalidateProductCache(productId) {
  try {
    await redis.del(`product:${productId}:full`);
  } catch (err) {
    console.error('Cache invalidation failed:', err.message);
    
  }
}

export  { getProductWithVariants, invalidateProductCache };