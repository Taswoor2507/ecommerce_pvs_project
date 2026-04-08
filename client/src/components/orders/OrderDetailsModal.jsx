import { X, ShoppingBag, User, Calendar, DollarSign, Package, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../../api/orders.api';
import Button from '../ui/Button';
import StatusBadge from '../ui/StatusBadge';

const OrderDetailsModal = ({ isOpen, onClose, orderId }) => {
  const { 
    data: orderResponse, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['order-details', orderId],
    queryFn: () => ordersApi.getOrderDetails(orderId),
    enabled: !!orderId && isOpen,
  });

  if (!isOpen) return null;

  const order = orderResponse?.data;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              Order Details
            </h2>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">
              Order ID: {orderId}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
              <p className="text-sm text-slate-500 font-medium">Fetching order data...</p>
            </div>
          ) : isError ? (
            <div className="py-20 text-center">
              <p className="text-red-500 font-medium">Failed to load order details</p>
              <Button variant="ghost" onClick={onClose} className="mt-4">Close</Button>
            </div>
          ) : (
            <>
              {/* Status Section */}
              <div className="flex items-center justify-between bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Current Status</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">{order.status}</p>
                  </div>
                </div>
                <StatusBadge type="status" value={order.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Customer Information
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <InfoRow label="Name" value={order.user_id?.name} />
                    <InfoRow label="Email" value={order.user_id?.email} />
                    <InfoRow label="Joined" value={new Date(order.user_id?.createdAt).toLocaleDateString()} />
                  </div>
                </section>

                {/* Order Summary */}
                <section className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    Order Info
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                    <InfoRow label="Placed On" value={new Date(order.createdAt).toLocaleString()} />
                    <InfoRow label="Quantity" value={order.quantity} />
                    <InfoRow 
                      label="Payment Method" 
                      value={<span className="text-emerald-600 font-medium">Cash on Delivery</span>} 
                    />
                  </div>
                </section>
              </div>

              {/* Product Details */}
              <section className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-slate-400" />
                  Item Details
                </h3>
                <div className="border border-slate-100 rounded-2xl overflow-hidden">
                  <div className="p-4 bg-slate-50/50 flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 overflow-hidden flex-shrink-0">
                      <img 
                        src={order.product_id?.image || 'https://via.placeholder.com/150'} 
                        alt={order.product_snapshot?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900">{order.product_snapshot?.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {order.combination_snapshot?.option_labels?.map((label, idx) => (
                          <span key={idx} className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-600 uppercase">
                            {label.type}: {label.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 bg-white space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Base Price</span>
                      <span className="font-semibold text-slate-900">${order.product_snapshot?.base_price?.toFixed(2)}</span>
                    </div>
                    {order.combination_snapshot?.additional_price > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Variant Additional</span>
                        <span className="font-semibold text-indigo-600">+${order.combination_snapshot.additional_price.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm pt-2 border-t border-slate-50 border-dashed">
                      <span className="text-slate-500 font-medium">Unit Price</span>
                      <span className="font-bold text-slate-900">${order.unit_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 font-medium">Quantity</span>
                      <span className="font-bold text-slate-900">x {order.quantity}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-lg">
                      <span className="font-black text-slate-900">Total Amount</span>
                      <span className="font-black text-indigo-600">${order.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <Button onClick={onClose} variant="secondary">Close</Button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{label}</span>
    <span className="text-sm font-medium text-slate-700">{value}</span>
  </div>
);

export default OrderDetailsModal;
