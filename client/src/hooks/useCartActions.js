import { useCallback, useContext } from 'react';
import { CartActionsContext } from '../contexts/cart.context';

export const useCartActions = () => {
  const { addItem, openCart } = useContext(CartActionsContext);

  const addToCart = useCallback((product, combination, quantity = 1) => {
    const cartItem = {
      productId: product._id,
      combinationId: combination?._id || undefined, // Use undefined instead of null for simple products
      name: product.name,
      image: product.image || 'https://www.inkfactory.pk/wp-content/uploads/2019/08/T-Shirt-Mockup-007.jpg',
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
