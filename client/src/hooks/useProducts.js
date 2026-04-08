import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import toast from 'react-hot-toast';

export const useProducts = (params = {}) => {
  const queryClient = useQueryClient();

  const queryParams = {
    page: 1,
    limit: 10,
    ...params,
  };

  const productsQuery = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productsApi.list(queryParams),
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      const status = error?.response?.status;
      if ([400, 404].includes(status)) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => productsApi.remove(id),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message || 'Failed to delete product';
      toast.error(message);
    },
  });

  const rawData = productsQuery.data;

  const products = Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData?.products)
    ? rawData.products
    : Array.isArray(rawData)
    ? rawData
    : [];

  const pagination = rawData?.pagination ||
    rawData?.meta || {
      page: queryParams.page,
      pages: 1,
      total: products.length,
      limit: queryParams.limit,
    };

  return {
    products,
    pagination,
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
    isFetching: productsQuery.isFetching,
    deleteProduct: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};

export default useProducts;
