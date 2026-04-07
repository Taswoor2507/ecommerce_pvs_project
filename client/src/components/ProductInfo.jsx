import { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, AlertCircle, Check, Package, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import Button from './ui/Button';
import QuantitySelector from './ui/QuantitySelector';
import Badge from './ui/Badge';

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

  // Reset quantity to 1 when stock becomes unavailable or combination changes
  useEffect(() => {
    if (!inStock || stock === 0) {
      setQuantity(1);
    }
  }, [inStock, stock]);

  // Determine the display price
  const displayPrice = finalPrice !== null ? finalPrice : basePrice;
  const hasPriceVariation = additionalPrice > 0;
  const totalPrice = displayPrice * quantity;

  // Handle quantity changes via QuantitySelector
  const handleQuantityChange = useCallback((newQuantity) => {
    setQuantity(newQuantity);
  }, []);

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
        variant: 'danger',
        icon: AlertCircle,
        text: 'Out of Stock',
      };
    }
    if (stock <= 5) {
      return {
        variant: 'warning',
        icon: AlertCircle,
        text: `Only ${stock} left`,
      };
    }
    return {
      variant: 'success',
      icon: Check,
      text: 'In Stock',
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Price Card - Only show when in stock */}
      {inStock && stock > 0 && (
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
      )}

      {/* Stock Status */}
      <Badge
        variant={stockStatus.variant}
        size="md"
        leftIcon={stockStatus.icon}
      >
        {stockStatus.text}
        {stock > 0 && stock <= 20 && (
          <span className="text-xs opacity-75 ml-1">({stock} available)</span>
        )}
      </Badge>

      {/* Quantity Selector */}
      {inStock && stock > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-900">
            Quantity
          </label>
          <QuantitySelector
            value={quantity}
            onChange={handleQuantityChange}
            min={1}
            max={stock}
            size="lg"
          />
        </div>
      )}

      {/* Add to Cart Button */}
      <Button
        variant="primary"
        size="xl"
        fullWidth
        onClick={handleAddToCart}
        isLoading={isAddingToCart}
        isDisabled={isAddToCartDisabled}
        leftIcon={<ShoppingCart className="w-6 h-6" />}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};

export default ProductInfo;
