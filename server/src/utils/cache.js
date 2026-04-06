import redis from '../config/redis.js';
import { Product, VariantType, Option } from '../models/index.js';
import Combination from '../models/combination.model.js';

const CACHE_TTL = 300; // 5 minutes 

/**
 * Get full product data (product + variant types + options + combinations, nested).
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

  // Fetch all active combinations for this product
  const combinations = await Combination.find({ 
    product_id: productId, 
    is_active: true 
  })
    .sort({ createdAt: 1 })
    .lean();

  // Group options by variant_type_id for O(N) assembly (not O(N²))
  const optionsByType = options.reduce((acc, opt) => {
    const key = opt.variant_type_id.toString();
    if (!acc[key]) acc[key] = [];
    acc[key].push({ _id: opt._id, value: opt.value, position: opt.position });
    return acc;
  }, {});

  // Process combinations with computed final prices
  const processedCombinations = combinations.map((c) => ({
    _id: c._id,
    option_labels: c.option_labels,
    additional_price: c.additional_price,
    final_price: parseFloat((product.base_price + c.additional_price).toFixed(2)),
    stock: c.stock,
    in_stock: c.stock > 0,
    options_hash: c.options_hash,
  }));

  const result = {
    ...product,
    variant_types: variantTypes.map((vt) => ({
      ...vt,
      options: optionsByType[vt._id.toString()] || [],
    })),
    combinations: processedCombinations,
    combinations_count: processedCombinations.length,
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