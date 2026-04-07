import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

const CartIcon = ({ className = '' }) => {
  const { totalCount, toggleCart } = useCart();

  return (
    <button
      onClick={toggleCart}
      className={`relative p-2 text-gray-600 hover:text-indigo-600 transition-colors ${className}`}
      aria-label={`Shopping cart with ${totalCount} items`}
    >
      <ShoppingCart className="w-6 h-6" />
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
          {totalCount > 99 ? '99+' : totalCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
