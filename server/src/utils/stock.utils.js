import { Combination, Product } from '../models/index.js';

/**
 * Calculate and update product stock based on combination stocks
 * For products with variants: stock = sum of all active combination stocks
 * For products without variants: use the product's own stock field
 * 
 * @param {string} productId - Product ID
 * @param {object} session - MongoDB session (optional, for transactions)
 * @returns {Promise<number>} - The calculated stock
 */
export async function syncProductStockFromCombinations(productId, session = null) {
  // Get all active combinations for this product
  const combinations = await Combination.find({
    product_id: productId,
    is_active: true,
  }).session(session || null).lean();

  // Calculate total stock from combinations
  const totalStock = combinations.reduce((sum, combo) => sum + (combo.stock || 0), 0);

  // Update product stock
  await Product.findByIdAndUpdate(
    productId,
    { stock: totalStock },
    { session: session || null }
  );

  return totalStock;
}

/**
 * Get product stock with proper logic:
 * - If product has variants: return sum of combination stocks
 * - If product has no variants: return product.stock directly
 * 
 * @param {object} product - Product object (must have _id and variant_type_count)
 * @returns {Promise<number>} - The calculated stock
 */
export async function getProductStock(product) {
  // If product has no variants, use its own stock
  if (!product.variant_type_count || product.variant_type_count === 0) {
    return product.stock || 0;
  }

  // If product has variants, calculate from combinations
  const combinations = await Combination.find({
    product_id: product._id,
    is_active: true,
  }).lean();

  return combinations.reduce((sum, combo) => sum + (combo.stock || 0), 0);
}
