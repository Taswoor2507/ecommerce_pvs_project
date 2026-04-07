import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '../api/products.api.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for product mutations (create, update, delete)
 * Follows SOLID principles by separating concerns
 * Provides reusable state management for product operations
 */
export const useProductMutation = () => {
  const [serverError, setServerError] = useState(null);
  const queryClient = useQueryClient();

  // Clear error helper
  const clearError = () => setServerError(null);

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: productsApi.create,
    onSuccess: (data) => {
      toast.success('Product created successfully!');
      setServerError(null);
      
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      return data;
    },
    onError: (error) => {
      console.error('Create product error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to create product. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }) => productsApi.update(id, payload),
    onSuccess: (data) => {
      toast.success('Product updated successfully!');
      setServerError(null);
      
      // Invalidate products list and specific product cache
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.data.id] });
      
      return data;
    },
    onError: (error) => {
      console.error('Update product error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update product. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => {
      toast.success('Product deleted successfully!');
      setServerError(null);
      
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.error('Delete product error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to delete product. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  return {
    // State
    serverError,
    clearError,
    
    // Mutations
    createProduct: createProductMutation.mutateAsync,
    updateProduct: updateProductMutation.mutateAsync,
    deleteProduct: deleteProductMutation.mutateAsync,
    
    // Loading states
    isCreating: createProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    
    // Combined loading state
    isLoading: createProductMutation.isPending || 
               updateProductMutation.isPending || 
               deleteProductMutation.isPending,
  };
};
