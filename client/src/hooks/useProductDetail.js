import { useQuery, useMutation } from '@tanstack/react-query';
import { productsApi } from '../api/products.api';
import { useMemo } from 'react';

export const useProductDetail = (productId) => {
  const productQuery = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getById(productId),
    enabled: !!productId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      const status = error?.response?.status;
      if ([400, 404].includes(status)) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
  });

  const lookupMutation = useMutation({
    mutationFn: (selection) =>
      productsApi.lookupCombination(productId, selection),
    retry: 1,
  });

  const product = productQuery.data || null;

  const combinations = useMemo(() => {
    const allCombos = product?.combinations || [];
    return [...allCombos].sort((a, b) => {
      if (a.in_stock && !b.in_stock) return -1;
      if (!a.in_stock && b.in_stock) return 1;
      return a.final_price - b.final_price;
    });
  }, [product]);

  const firstAvailableCombo = useMemo(() => {
    return combinations.find((c) => c.in_stock) || null;
  }, [combinations]);

  return {
    product,
    combinations,
    firstAvailableCombo,
    productBasePrice: product?.base_price || 0,
    hasVariants: product?.variant_types?.length > 0,
    variantTypes: product?.variant_types || [],

    isLoading: productQuery.isLoading,
    isError: productQuery.isError,
    error: productQuery.error,
    isFetching: productQuery.isFetching,

    productQuery,
    lookupCombination: lookupMutation.mutateAsync,
    lookupCombinationState: lookupMutation,
    refetchProduct: productQuery.refetch,
  };
};

export default useProductDetail;
