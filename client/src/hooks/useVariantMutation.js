import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { variantsApi } from '../api/variants.api.js';
import { combinationsApi } from '../api/combinations.api.js';
import toast from 'react-hot-toast';

/**
 * Custom hook for variant and combination mutations
 * Handles all variant-related operations with proper error handling
 */
export const useVariantMutation = (productId) => {
  const [serverError, setServerError] = useState(null);
  const queryClient = useQueryClient();

  const clearError = () => setServerError(null);

  // Add variant type mutation
  const addVariantTypeMutation = useMutation({
    mutationFn: (payload) => variantsApi.addVariantType(productId, payload),
    onSuccess: (data) => {
      const variantName = data.data?.variant_type?.name || data.data?.variantType?.name || data.data?.name || 'Unknown';
      toast.success(`Variant type "${variantName}" added successfully!`);
      setServerError(null);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['combinations', productId] });
      
      return data;
    },
    onError: (error) => {
      console.error('Add variant type error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to add variant type. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Add option mutation
  const addOptionMutation = useMutation({
    mutationFn: ({ variantTypeId, option }) => 
      variantsApi.addOption(productId, variantTypeId, { option }),
    onSuccess: (data) => {
      const optionValue = data.data?.newOption?.value || data.data?.option?.value || 'Unknown';
      toast.success(`Option "${optionValue}" added successfully!`);
      setServerError(null);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['combinations', productId] });
      
      return data;
    },
    onError: (error) => {
      console.error('Add option error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to add option. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Delete variant type mutation
  const deleteVariantTypeMutation = useMutation({
    mutationFn: (variantTypeId) => 
      variantsApi.deleteVariantType(productId, variantTypeId),
    onSuccess: (data) => {
      toast.success(`Variant type "${data.data.name}" removed successfully!`);
      setServerError(null);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['combinations', productId] });
      
      return data;
    },
    onError: (error) => {
      console.error('Delete variant type error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to delete variant type. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Delete option mutation
  const deleteOptionMutation = useMutation({
    mutationFn: (optionId) => variantsApi.deleteOption(optionId),
    onSuccess: (data) => {
      const optionValue = data.data?.value || data.data?.option?.value || 'Unknown';
      toast.success(`Option "${optionValue}" removed successfully!`);
      setServerError(null);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['combinations', productId] });
      
      return data;
    },
    onError: (error) => {
      console.error('Delete option error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to delete option. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  // Update combination mutation
  const updateCombinationMutation = useMutation({
    mutationFn: ({ combinationId, payload }) => 
      combinationsApi.update(combinationId, payload),
    onSuccess: (data, variables) => {
      if (!variables?.skipToast) {
        toast.success('Combination updated successfully!');
      }
      setServerError(null);
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      queryClient.invalidateQueries({ queryKey: ['combinations', productId] });
      
      return data;
    },
    onError: (error) => {
      console.error('Update combination error:', error);
      const errorMessage = error?.response?.data?.message || 
                          error?.message || 
                          'Failed to update combination. Please try again.';
      setServerError(errorMessage);
      toast.error(errorMessage);
    },
  });

  return {
    // State
    serverError,
    clearError,
    
    // Mutations
    addVariantType: addVariantTypeMutation.mutateAsync,
    addOption: addOptionMutation.mutateAsync,
    deleteVariantType: deleteVariantTypeMutation.mutateAsync,
    deleteOption: deleteOptionMutation.mutateAsync,
    updateCombination: updateCombinationMutation.mutateAsync,
    
    // Loading states
    isAddingVariantType: addVariantTypeMutation.isPending,
    isAddingOption: addOptionMutation.isPending,
    isDeletingVariantType: deleteVariantTypeMutation.isPending,
    isDeletingOption: deleteOptionMutation.isPending,
    isUpdatingCombination: updateCombinationMutation.isPending,
    
    // Combined loading state
    isLoading: addVariantTypeMutation.isPending || 
               addOptionMutation.isPending ||
               deleteVariantTypeMutation.isPending ||
               deleteOptionMutation.isPending ||
               updateCombinationMutation.isPending,
  };
};
