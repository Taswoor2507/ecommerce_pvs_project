import { useReducer, useCallback, useMemo} from 'react';

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
      const { productId, combinationId, quantity, price } = action.payload;
      const existingIndex = state.items.findIndex(
        item => item.productId === productId && item.combinationId === combinationId
      );

      if (existingIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, { productId, combinationId, quantity, price }] };
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

// LocalStorage helpers
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
    // ignore
  }
};



export const CartProvider = ({ children }) => {
  // Lazy init reducer from storage (no extra render)
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => ({
    ...init,
    items: loadCartFromStorage(),
  }));

  // Save cart to localStorage
  useMemo(() => saveCartToStorage(state.items), [state.items]);

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
    return {
      uniqueItemsCount: state.items.length,
      totalQuantity: state.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    };
  }, [state.items]);

  return (
    <CartStateContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
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