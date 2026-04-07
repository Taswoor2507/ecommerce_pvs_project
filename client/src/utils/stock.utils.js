/**
 * Calculate product stock with proper DRY logic:
 * - If product has variants (variant_type_count > 0): use product.stock (which is sum of combination stocks from backend)
 * - If product has no variants: use product.stock directly
 * 
 * @param {object} product - Product object with stock and variant_type_count
 * @returns {number} - The calculated stock
 */
export function getProductStock(product) {
  if (!product) return 0;
  
  // For both cases, the backend now returns the correct stock:
  // - Simple products: product.stock is the direct stock value
  // - Variant products: product.stock is the sum of all combination stocks
  return product.stock || 0;
}

/**
 * Check if product is in stock
 * @param {object} product - Product object
 * @returns {boolean} - True if in stock
 */
export function isProductInStock(product) {
  return getProductStock(product) > 0;
}

/**
 * Get stock status text
 * @param {object} product - Product object
 * @returns {string} - "In Stock" or "Out of Stock"
 */
export function getStockStatusText(product) {
  return isProductInStock(product) ? "In Stock" : "Out of Stock";
}

/**
 * Get stock badge variant for UI
 * @param {object} product - Product object
 * @returns {string} - "success" or "danger"
 */
export function getStockBadgeVariant(product) {
  return isProductInStock(product) ? "success" : "danger";
}

/**
 * Calculate available stock for a specific combination
 * @param {object} combination - Combination object with stock
 * @returns {number} - The combination stock
 */
export function getCombinationStock(combination) {
  if (!combination) return 0;
  return combination.stock || 0;
}

/**
 * Check if combination is in stock
 * @param {object} combination - Combination object
 * @returns {boolean} - True if in stock
 */
export function isCombinationInStock(combination) {
  return getCombinationStock(combination) > 0;
}
