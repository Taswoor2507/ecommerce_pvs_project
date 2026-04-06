import { useCallback } from 'react';
import { useCart } from './useCart';

export const useCartActions = () => {
  const { addItem, openCart } = useCart();

  const addToCart = useCallback((product, combination, quantity = 1) => {
    const cartItem = {
      productId: product._id,
      combinationId: combination?._id || null,
      name: product.name,
      image: product.image,
      price: combination?.final_price || product.base_price,
      originalPrice: product.base_price,
      quantity,
      variants: combination?.option_labels || [],
      stock: combination?.stock || product.stock || 10,
      addedAt: new Date().toISOString(),
    };

    addItem(cartItem);
    openCart();
    
    return cartItem;
  }, [addItem, openCart]);

  return { addToCart };
};

export default useCartActions;
