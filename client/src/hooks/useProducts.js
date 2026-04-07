import { useQuery, useMutation } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';

export const useProducts = (params = {}) => {
  // Default pagination parameters
  const defaultParams = {
    page: 1,
    limit: 10,
    ...params
  };

  // ── Query: Products List
  const productsQuery = useQuery({
    queryKey: ['products', defaultParams],
    queryFn: () => productsApi.list(defaultParams),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry on 404 or 400 
      const status = error?.response?.status;
      if ([400, 404].includes(status)) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  // ── Mutation: Delete Product
  const deleteMutation = useMutation({
    mutationFn: (id) => productsApi.remove(id),
    onSuccess: () => {
      // Refetch products list after successful deletion
      productsQuery.refetch();
    },
  });

  // ── Derived State
  const isLoading = productsQuery.isLoading;
  const isError = productsQuery.isError;
  const error = productsQuery.error;
  const isFetching = productsQuery.isFetching;

  // Extract data safely - handle different API response structures
  const rawData = productsQuery.data;
  
  // Handle paginated response structure
  const products = Array.isArray(rawData?.data) ? rawData.data : 
                   Array.isArray(rawData?.products) ? rawData.products :
                   Array.isArray(rawData) ? rawData :
                   [];
                   
  // Extract pagination info if available
  const pagination = rawData?.pagination || rawData?.meta || {
    page: defaultParams.page,
    pages: 1,
    total: products.length,
    limit: defaultParams.limit
  };

  
  return {
    // Data
    products,
    pagination,
    
    // States
    isLoading,
    isError,
    error,
    isFetching,
    
    // Query state
    productsQuery,
    
    // Actions
    deleteProduct: deleteMutation.mutateAsync,
    deleteProductState: deleteMutation,
    
    // Refetch
    refetchProducts: productsQuery.refetch,
  };
};

export default useProducts;
