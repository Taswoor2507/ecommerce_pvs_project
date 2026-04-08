import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/orders.api';

export const useOrders = (params = {}) => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['admin-orders', params],
    queryFn: () => ordersApi.getAdminOrders(params),
    placeholderData: (previousData) => previousData,
  });

  return {
    orders: data?.orders || [],
    pagination: data?.pagination || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};
