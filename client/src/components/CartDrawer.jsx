import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { formatCurrency } from '../utils/formatters';
import Drawer from './ui/Drawer';
import Button from './ui/Button';
import IconButton from './ui/IconButton';
import Badge from './ui/Badge';
import QuantitySelector from './ui/QuantitySelector';
import { toast } from 'react-hot-toast';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalCount } = useCart();

  const handleQuantityChange = (item, newQuantity) => {
    updateQuantity(item.productId, item.combinationId, newQuantity);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      closeCart();
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    closeCart();
    navigate('/checkout');
  };

  const footerContent = items.length > 0 ? (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Subtotal</span>
        <span className="text-2xl font-bold text-gray-900">{formatCurrency(subtotal)}</span>
      </div>
      <Button 
        variant="primary" 
        size="xl" 
        fullWidth
        onClick={handleCheckout}
      >
        Proceed to Checkout
      </Button>
      <Button variant="ghost" size="md" fullWidth onClick={closeCart}>
        Continue Shopping
      </Button>
    </div>
  ) : null;

  const headerAction = (
    <Badge variant="primary" size="md">
      {totalCount} {totalCount === 1 ? 'item' : 'items'}
    </Badge>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeCart}
      title="Your Cart"
      headerIcon={ShoppingCart}
      headerAction={headerAction}
      footer={footerContent}
      size="md"
      position="right"
    >
      <div className="px-6 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
            <p className="text-gray-400 text-sm">Add some items to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div 
                key={`${item.productId}-${item.combinationId}`}
                className="flex gap-4 bg-gray-50 rounded-xl p-4"
              >
                {/* Product Image */}
                <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 border border-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://www.inkfactory.pk/wp-content/uploads/2019/08/T-Shirt-Mockup-007.jpg';
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  {item.variants?.length > 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      {item.variants.map(v => v.value).join(', ')}
                    </p>
                  )}
                  <p className="font-bold text-indigo-600 mt-1">{formatCurrency(item.price)}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3 mt-3">
                    <QuantitySelector
                      value={item.quantity}
                      onChange={(newQty) => handleQuantityChange(item, newQty)}
                      min={1}
                      max={item.stock}
                      size="sm"
                    />

                    <IconButton
                      icon={Trash2}
                      variant="danger"
                      size="sm"
                      onClick={() => removeItem(item.productId, item.combinationId)}
                      aria-label="Remove item"
                      className="ml-auto"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default CartDrawer;
