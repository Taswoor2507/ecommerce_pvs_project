import { useQuery, useMutation } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import { useMemo } from 'react';


export const useProductDetail = (productId) => {
  // ── Query: Product Detail (now includes combinations)
  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getById(productId),
    enabled: !!productId,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: (failureCount, error) => {
      // Don't retry on 404 (not found) or 400 (bad request)
      const status = error?.response?.status;
      if ([400, 404].includes(status)) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  // ── Mutation: Combination Lookup 
  // Used when user selects specific variant options (for real-time validation)
  const lookupMutation = useMutation({
    mutationFn: (selection) => productsApi.lookupCombination(productId, selection),
    retry: 1,
  });

  // ── Derived State
  const isLoading = productQuery.isLoading;
  const isError = productQuery.isError;
  const error = productQuery.error;
  const isFetching = productQuery.isFetching;

  // Extract data safely - combinations now come from product response
  const product = productQuery.data || null;
  
  // Use combinations from product response (backend now includes them)
  // Sort: in-stock combinations first, then by final_price ascending
  const combinations = useMemo(() => {
    const allCombos = product?.combinations || [];
    return [...allCombos].sort((a, b) => {
      // In-stock items first
      if (a.in_stock && !b.in_stock) return -1;
      if (!a.in_stock && b.in_stock) return 1;
      // Then sort by price (lowest first)
      return a.final_price - b.final_price;
    });
  }, [product]);

  // Find the first available in-stock combination for auto-selection
  const firstAvailableCombo = useMemo(() => {
    return combinations.find(c => c.in_stock) || null;
  }, [combinations]);

  // Base price from product
  const productBasePrice = product?.base_price || 0;

  // Check if product has variants
  const hasVariants = product?.variant_types?.length > 0;

  // Get variant types for selector
  const variantTypes = product?.variant_types || [];

  return {
    // Data
    product,
    combinations,
    firstAvailableCombo,
    productBasePrice,
    hasVariants,
    variantTypes,
    
    // States
    isLoading,
    isError,
    error,
    isFetching,
    
    // Individual query states for granular control
    productQuery,
    
    // Actions
    lookupCombination: lookupMutation.mutateAsync,
    lookupCombinationState: lookupMutation,
    
    // Refetch
    refetchProduct: productQuery.refetch,
  };
};

export default useProductDetail;
