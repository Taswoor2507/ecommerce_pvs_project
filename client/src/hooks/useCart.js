import { useContext } from 'react';
import { CartStateContext, CartActionsContext } from '../contexts/cart.context';

export const useCart = () => {
  const state = useContext(CartStateContext);
  const actions = useContext(CartActionsContext);
  
  if (!state || !actions) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return { ...state, ...actions };
};

export default useCart;
