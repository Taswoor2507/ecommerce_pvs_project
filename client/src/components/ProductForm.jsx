import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, X } from 'lucide-react';
import { createProductSchema } from '../schemas/product.schema.js';
import { useProductMutation } from '../hooks/useProductMutation.js';
import Button from './ui/Button.jsx';
import { FormInput, FormTextarea, FormNumberInput, FormError } from './forms/index.js';

/**
 * Product Form Component
 * Handles product creation with validation and error handling
 * Uses React Hook Form with Zod validation
 */
const ProductForm = ({ onSuccess, onCancel, initialData = null }) => {
  const isEdit = Boolean(initialData);
  const defaultValues = initialData || {
    name: '',
    description: '',
    base_price: 0,
    stock: 0,
  };

  const {
    serverError,
    clearError,
    createProduct,
    updateProduct,
    isCreating,
    isUpdating,
  } = useProductMutation();

  const isSubmitting = isCreating || (isEdit && isUpdating);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    const payload = {
      name: data.name.trim(),
      description: data.description.trim() || '',
      base_price: Number(data.base_price),
      stock: Number(data.stock),
    };

    try {
      let response;
      if (isEdit) {
        response = await updateProduct({ id: initialData.id, payload });
      } else {
        response = await createProduct(payload);
      }

      // Reset form on success for new products
      if (!isEdit) {
        reset(defaultValues);
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      }

    } catch (error) {
      // Error handling is now managed by the custom hook
      console.error('Product form error:', error);
    }
  };

  const handleCancel = () => {
    reset(defaultValues);
    clearError();
    if (onCancel) {
      onCancel();
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    clearError();
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </h2>
          {onCancel && (
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Server Error */}
        <FormError
          error={serverError}
          onDismiss={clearError}
        />

        {/* Product Name */}
        <FormInput
          control={control}
          name="name"
          label="Product Name"
          placeholder="Enter product name"
          required
          disabled={isSubmitting}
          containerClassName="col-span-2"
        />

        {/* Description */}
        <FormTextarea
          control={control}
          name="description"
          label="Description"
          placeholder="Enter product description (optional)"
          rows={4}
          disabled={isSubmitting}
          containerClassName="col-span-2"
        />

        {/* Price and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormNumberInput
            control={control}
            name="base_price"
            label="Base Price"
            placeholder="0.00"
            min={0}
            step="0.01"
            required
            disabled={isSubmitting}
          />

          <FormNumberInput
            control={control}
            name="stock"
            label="Stock Quantity"
            placeholder="0"
            min={0}
            step="1"
            disabled={isSubmitting}
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleReset}
            disabled={isSubmitting || !isDirty}
            isDisabled={isSubmitting || !isDirty}
          >
            Reset
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={!isValid || !isDirty}
            isDisabled={!isValid || !isDirty}
            leftIcon={isEdit ? null : <Plus className="w-4 h-4" />}
          >
            {isEdit ? 'Update Product' : 'Create Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
