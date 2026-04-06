import { useState, useCallback } from 'react';
import { ShoppingCart, Minus, Plus, AlertCircle, Check, Package, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

/**
 * ProductInfo Component - Enhanced Price Display
 * Displays product pricing with clear hierarchy: base, additional, final, and total
 */
const ProductInfo = ({
  basePrice = 0,
  finalPrice = null,
  additionalPrice = 0,
  stock = 0,
  inStock = true,
  hasVariants = false,
  isAllVariantsSelected = false,
  isLoadingCombination = false,
  onAddToCart,
  className = '',
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Determine the display price
  const displayPrice = finalPrice !== null ? finalPrice : basePrice;
  const hasPriceVariation = additionalPrice > 0;
  const totalPrice = displayPrice * quantity;

  // Handle quantity changes
  const handleDecreaseQuantity = useCallback(() => {
    setQuantity(prev => Math.max(1, prev - 1));
  }, []);

  const handleIncreaseQuantity = useCallback(() => {
    if (stock > 0) {
      setQuantity(prev => Math.min(stock, prev + 1));
    }
  }, [stock]);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(Math.min(stock > 0 ? stock : 99, value));
    }
  }, [stock]);

  // Handle add to cart
  const handleAddToCart = useCallback(async () => {
    if (isAddingToCart) return;
    
    setIsAddingToCart(true);
    try {
      await onAddToCart?.(quantity);
    } finally {
      setIsAddingToCart(false);
    }
  }, [isAddingToCart, onAddToCart, quantity]);

  // Determine button state
  const isAddToCartDisabled = 
    !inStock || 
    (hasVariants && !isAllVariantsSelected) || 
    isLoadingCombination || 
    isAddingToCart;

  // Get button text based on state
  const getButtonText = () => {
    if (isAddingToCart) return 'Adding...';
    if (isLoadingCombination) return 'Loading...';
    if (!inStock) return 'Out of Stock';
    if (hasVariants && !isAllVariantsSelected) return 'Select Options';
    return 'Add to Cart';
  };

  // Get stock status display
  const getStockStatus = () => {
    if (!inStock || stock === 0) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        text: 'Out of Stock',
        color: 'text-red-600 bg-red-50 border-red-200',
      };
    }
    if (stock <= 5) {
      return {
        icon: <AlertCircle className="w-5 h-5" />,
        text: `Only ${stock} left`,
        color: 'text-amber-600 bg-amber-50 border-amber-200',
      };
    }
    return {
      icon: <Check className="w-5 h-5" />,
      text: 'In Stock',
      color: 'text-green-600 bg-green-50 border-green-200',
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Price Card */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-3">
        {/* Base Price Row */}
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Base Price</span>
          <span className="font-medium text-gray-900">{formatCurrency(basePrice)}</span>
        </div>

        {/* Variant Additional Row (if applicable) */}
        {hasPriceVariation && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Variant Additional
            </span>
            <span className="font-medium text-indigo-600">+{formatCurrency(additionalPrice)}</span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200 pt-3 mt-3">
          {/* Total - BIG TEXT */}
          <div className="flex justify-between items-baseline">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-4xl font-bold text-indigo-600 tracking-tight">
              {formatCurrency(totalPrice)}
            </span>
          </div>
          {quantity > 1 && (
            <div className="text-right text-sm text-gray-500 mt-1">
              {quantity} items × {formatCurrency(displayPrice)}
            </div>
          )}
        </div>
      </div>

      {/* Stock Status */}
      <div className={`
        inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border ${stockStatus.color}
      `}>
        {stockStatus.icon}
        <span className="font-semibold text-sm">{stockStatus.text}</span>
        {stock > 0 && stock <= 20 && (
          <span className="text-xs opacity-75">({stock} available)</span>
        )}
      </div>

      {/* Quantity Selector */}
      {inStock && stock > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">
            Quantity
          </label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <button
                onClick={handleDecreaseQuantity}
                disabled={quantity <= 1}
                className="px-4 py-3 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-5 h-5" />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min={1}
                max={stock}
                className="w-16 text-center border-x-2 border-gray-200 py-3 text-gray-900 font-bold text-lg focus:outline-none"
              />
              <button
                onClick={handleIncreaseQuantity}
                disabled={quantity >= stock}
                className="px-4 py-3 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={isAddToCartDisabled}
        className={`
          w-full flex items-center justify-center gap-3 px-8 py-4 
          rounded-xl font-bold text-lg transition-all duration-200 shadow-sm
          ${isAddToCartDisabled
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
          }
        `}
      >
        <ShoppingCart className="w-6 h-6" />
        {getButtonText()}
      </button>
    </div>
  );
};

export default ProductInfo;
