import { useReducer, useCallback, useEffect, useMemo } from 'react';
import { CartStateContext, CartActionsContext } from './cart.context';

// Action constants
const CART_ACTIONS = {
  ADD: 'ADD_ITEM',
  REMOVE: 'REMOVE_ITEM',
  UPDATE: 'UPDATE_QUANTITY',
  CLEAR: 'CLEAR_CART',
  TOGGLE: 'TOGGLE_CART',
  OPEN: 'OPEN_CART',
  CLOSE: 'CLOSE_CART',
  LOAD: 'LOAD_CART',
};

// LocalStorage key
const CART_STORAGE_KEY = 'ecommerce_cart';

// Initial state
const initialState = {
  items: [],
  isOpen: false,
};

// Reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD: {
      const newItem = action.payload;
      const { productId, combinationId, quantity } = newItem;
      const existingIndex = state.items.findIndex(
        item => item.productId === productId && item.combinationId === combinationId
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: quantity, // Replace with new quantity instead of adding
        };
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, newItem] };
    }

    case CART_ACTIONS.REMOVE: {
      const { productId, combinationId } = action.payload;
      return {
        ...state,
        items: state.items.filter(item => !(item.productId === productId && item.combinationId === combinationId)),
      };
    }

    case CART_ACTIONS.UPDATE: {
      const { productId, combinationId, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => !(item.productId === productId && item.combinationId === combinationId)),
        };
      }
      return {
        ...state,
        items: state.items.map(item =>
          item.productId === productId && item.combinationId === combinationId
            ? { ...item, quantity }
            : item
        ),
      };
    }

    case CART_ACTIONS.CLEAR:
      return { ...state, items: [] };

    case CART_ACTIONS.TOGGLE:
      return { ...state, isOpen: !state.isOpen };

    case CART_ACTIONS.OPEN:
      return { ...state, isOpen: true };

    case CART_ACTIONS.CLOSE:
      return { ...state, isOpen: false };

    case CART_ACTIONS.LOAD:
      return { ...state, items: action.payload };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  // Load cart from localStorage on initial render
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (!savedCart) return initialState;
      
      const parsedCart = JSON.parse(savedCart);
      
      // Ensure the parsed cart has the correct structure
      return {
        items: Array.isArray(parsedCart.items) ? parsedCart.items : [],
        isOpen: Boolean(parsedCart.isOpen),
      };
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      return initialState;
    }
  };

  const [state, dispatch] = useReducer(cartReducer, loadCartFromStorage());

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
        items: state.items,
        isOpen: state.isOpen,
      }));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [state]);

  // Actions
  const addItem = useCallback((item) => dispatch({ type: CART_ACTIONS.ADD, payload: item }), []);
  const removeItem = useCallback(
    (productId, combinationId) => dispatch({ type: CART_ACTIONS.REMOVE, payload: { productId, combinationId } }),
    []
  );
  const updateQuantity = useCallback((productId, combinationId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE, payload: { productId, combinationId, quantity } });
  }, []);
  const clearCart = useCallback(() => dispatch({ type: CART_ACTIONS.CLEAR }), []);
  const toggleCart = useCallback(() => dispatch({ type: CART_ACTIONS.TOGGLE }), []);
  const openCart = useCallback(() => dispatch({ type: CART_ACTIONS.OPEN }), []);
  const closeCart = useCallback(() => dispatch({ type: CART_ACTIONS.CLOSE }), []);

  // Totals (memoized)
  const totals = useMemo(() => {
    const items = Array.isArray(state.items) ? state.items : [];
    return {
      uniqueItemsCount: items.length,
      totalQuantity: items.reduce((sum, item) => sum + (item.quantity || 0), 0),
      subtotal: items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0),
    };
  }, [state.items]);

  return (
    <CartStateContext.Provider
      value={{
        items: Array.isArray(state.items) ? state.items : [],
        isOpen: Boolean(state.isOpen),
        totalCount: totals.uniqueItemsCount,
        totalQuantity: totals.totalQuantity,
        subtotal: totals.subtotal,
      }}
    >
      <CartActionsContext.Provider
        value={{ addItem, removeItem, updateQuantity, clearCart, toggleCart, openCart, closeCart }}
      >
        {children}
      </CartActionsContext.Provider>
    </CartStateContext.Provider>
  );
};