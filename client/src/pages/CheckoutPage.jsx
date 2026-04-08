import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '../schemas/checkout.schema';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../contexts/AuthContext';
import { useOrderMutation } from '../hooks/useOrderMutation';
import { formatCurrency } from '../utils/formatters';
import { FormField } from '../components/forms';
import Button from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import PageHeader from '../components/ui/PageHeader';
import { ShoppingBag, Truck, CreditCard, ShieldCheck } from 'lucide-react';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items, subtotal, totalQuantity } = useCart();
  const { placeOrder, isLoading } = useOrderMutation();

  const methods = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  const { handleSubmit } = methods;

  // Redirect if cart is empty or user not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else if (items.length === 0) {
      navigate('/products');
    }
  }, [isAuthenticated, items.length, navigate]);

  const onSubmit = async () => {
    try {
      // Place orders for all items in the cart
      // The backend currently supports one item per POST /orders call
      // In a real production app, we'd have a bulk order endpoint or loop correctly.
      // Based on provided API: POST /api/orders { combination_id, quantity }
      
      // For this implementation, we will place the first item or handle bulk if server supports it.
      // Given the requirement "Integrate order API POST /api/orders { combination_id, quantity }":
      // We'll process the items sequentially or pick the most important one.
      // Usually, a production app handles the whole cart. 
      // I'll implement a loop to process all items.
      
      for (const item of items) {
        await placeOrder({
          combinationId: item.combinationId,
          quantity: item.quantity
        });
      }
      
      navigate('/order-success');
    } catch {
      // Error handled by hook
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <PageHeader 
          title="Checkout" 
          subtitle="Complete your order by providing delivery details"
          backTo="/products"
          backLabel="Continue Shopping"
        />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Delivery Information" icon={Truck}>
              <FormProvider {...methods}>
                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField 
                      name="fullName" 
                      label="Full Name" 
                      placeholder="John Doe"
                      required
                    />
                    <FormField 
                      name="email" 
                      label="Email Address" 
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField 
                      name="phone" 
                      label="Phone Number" 
                      placeholder="+92 300 1234567"
                      required
                    />
                    <FormField 
                      name="city" 
                      label="City" 
                      placeholder="Karachi"
                      required
                    />
                  </div>

                  <FormField 
                    name="address" 
                    label="Delivery Address" 
                    placeholder="Street, House No, Area..."
                    multiline
                    required
                  />

                  <FormField 
                    name="postalCode" 
                    label="Postal Code" 
                    placeholder="75500"
                    required
                  />
                </form>
              </FormProvider>
            </Card>

            <Card title="Payment Method" icon={CreditCard}>
              <div className="p-4 border-2 border-indigo-600 bg-indigo-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                    $
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Cash on Delivery</h4>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </div>
                <div className="w-6 h-6 border-4 border-indigo-600 rounded-full bg-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-400 text-center">
                Payment integration is coming soon. Securely pay on delivery for now.
              </p>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="space-y-6">
            <Card title="Order Summary" icon={ShoppingBag}>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.combinationId}`} className="flex gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-16 h-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold truncate">{item.name}</h4>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                      {item.variants?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.variants.map((v, i) => (
                            <span key={i} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                              {v.value}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3">
                  <span>Total</span>
                  <span className="text-indigo-600">{formatCurrency(subtotal)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="checkout-form" 
                variant="primary" 
                size="xl" 
                fullWidth 
                className="mt-8"
                isLoading={isLoading}
              >
                Place Order
              </Button>

              <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-green-600 font-medium bg-green-50 py-2 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure Checkout Guaranteed</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
