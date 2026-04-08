import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';
import { useCart } from './useCart';
import { toast } from 'react-hot-toast';
import { extractErrorMessage } from '../utils/errorExtractor';

export const useOrderMutation = () => {
  const queryClient = useQueryClient();
  const { clearCart } = useCart();

  const placeOrderMutation = useMutation({
    mutationFn: ordersApi.placeOrder,
    onSuccess: (data) => {
      toast.success('Order placed successfully!');
      clearCart();
      // Invalidate products to refresh stock levels
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      return data;
    },
    onError: (error) => {
      const message = extractErrorMessage(error, 'Failed to place order');
      toast.error(message);
    },
  });

  return {
    placeOrder: placeOrderMutation.mutateAsync,
    isLoading: placeOrderMutation.isPending,
    isSuccess: placeOrderMutation.isSuccess,
    data: placeOrderMutation.data,
  };
};
