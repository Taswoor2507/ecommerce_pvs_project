import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const OrderSuccessPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 relative">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto scale-110 animate-bounce transition-all">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <div className="absolute top-0 right-1/4 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
          <div className="absolute bottom-4 left-1/4 w-3 h-3 bg-indigo-400 rounded-full animate-pulse" />
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          Order Placed!
        </h1>
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          Thank you for your purchase. Your order has been received and is being processed by our team.
        </p>

        <div className="space-y-4">
          <Link to="/products" className="block">
            <Button variant="primary" size="xl" fullWidth className="rounded-2xl shadow-lg shadow-indigo-200">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          
          <Link to="/" className="block">
            <Button variant="secondary" size="lg" fullWidth className="bg-white border-transparent hover:bg-gray-100 font-semibold group">
              Back to Home
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
          <p className="text-sm text-indigo-800 font-medium">
            A confirmation email has been sent to your inbox with full order details and tracking link.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
