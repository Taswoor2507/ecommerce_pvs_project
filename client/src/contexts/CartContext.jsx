import { useReducer, useCallback, useEffect, useMemo } from 'react';
import { CartContext } from './cart.context';

const CART_STORAGE_KEY = 'ecommerce_cart';

const initialState = {
  items: [],
  isOpen: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(
        item => item.productId === action.payload.productId && 
                item.combinationId === action.payload.combinationId
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + action.payload.quantity
        };
        return { ...state, items: updatedItems };
      }

      return {
        ...state,
        items: [...state.items, action.payload]
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(
          item => !(item.productId === action.payload.productId && 
                    item.combinationId === action.payload.combinationId)
        )
      };
    }

    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === action.payload.productId && 
          item.combinationId === action.payload.combinationId
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    }

    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }

    case 'TOGGLE_CART': {
      return { ...state, isOpen: !state.isOpen };
    }

    case 'OPEN_CART': {
      return { ...state, isOpen: true };
    }

    case 'CLOSE_CART': {
      return { ...state, isOpen: false };
    }

    case 'LOAD_CART': {
      return { ...state, items: action.payload };
    }

    default:
      return state;
  }
};

const loadCartFromStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage errors
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const savedItems = loadCartFromStorage();
    if (savedItems.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedItems });
    }
  }, []);

  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addItem = useCallback((item) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  }, []);

  const removeItem = useCallback((productId, combinationId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, combinationId } });
  }, []);

  const updateQuantity = useCallback((productId, combinationId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId, combinationId);
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, combinationId, quantity } });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const toggleCart = useCallback(() => {
    dispatch({ type: 'TOGGLE_CART' });
  }, []);

  const openCart = useCallback(() => {
    dispatch({ type: 'OPEN_CART' });
  }, []);

  const closeCart = useCallback(() => {
    dispatch({ type: 'CLOSE_CART' });
  }, []);

  const totals = useMemo(() => {
    return {
      // Count unique line items (distinct products/variants), not total quantity
      uniqueItemsCount: state.items.length,
      // Total quantity across all items
      totalQuantity: state.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }, [state.items]);

  const value = useMemo(() => ({
    items: state.items,
    isOpen: state.isOpen,
    // Cart icon badge shows unique items count (not total quantity)
    totalCount: totals.uniqueItemsCount,
    // Total items count for reference
    totalQuantity: totals.totalQuantity,
    subtotal: totals.subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
  }), [state.items, state.isOpen, totals, addItem, removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
