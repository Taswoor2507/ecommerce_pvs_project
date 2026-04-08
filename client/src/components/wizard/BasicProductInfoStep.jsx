import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema } from '../../schemas/product.schema.js';
import { useProductMutation } from '../../hooks/useProductMutation.js';
import { FormField, FormError } from '../forms/index.js';
import Button from '../ui/Button.jsx';

/**
 * Step 1: Basic Product Information
 * Handles creation of basic product info before adding variants
 * Uses reusable form components and DRY principles
 */
const BasicProductInfoStep = ({ data, onDataChange, onNext }) => {
  const methods = useForm({
    resolver: zodResolver(createProductSchema),
    defaultValues: data || {
      name: '',
      description: '',
      base_price: 0,
      stock: 0,
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { isValid, isDirty },
  } = methods;

  const {
    createProduct,
    isCreating,
    serverError,
    clearError,
  } = useProductMutation();

  const onSubmit = async (formData) => {
    try {
      const result = await createProduct(formData);
      onDataChange(result.data);
      
      // Try to proceed to next step immediately
      setTimeout(() => {
        onNext();
      }, 0);
    } catch {
      // Error handled by custom hook and displayed in UI
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Basic Product Information
          </h3>
          <p className="text-sm sm:text-base text-gray-600">
            Enter the basic details for your product. You can add variants in the next steps.
          </p>
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Creating Product
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{serverError}</p>
                  </div>
                  <button
                    onClick={clearError}
                    className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Product Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <FormField
              name="name"
              label="Product Name"
              placeholder="e.g., Premium Cotton T-Shirt"
              required
              disabled={isCreating}
              containerClassName="col-span-1"
            />

            <FormField
              name="base_price"
              label="Base Price"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0"
              required
              disabled={isCreating}
              containerClassName="col-span-1"
            />

            <FormField
              name="stock"
              label="Initial Stock"
              placeholder="0"
              type="number"
              min="0"
              disabled={isCreating}
              containerClassName="col-span-1 lg:col-span-2"
            />
          </div>

          <FormField
            name="description"
            label="Description"
            placeholder="Describe your product features, materials, fit, etc."
            multiline
            disabled={isCreating}
          />

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  About Stock Management
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    If you plan to add variants to this product, the stock will be calculated 
                    from variant combinations. You can still set an initial stock here for 
                    products without variants.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Button
              type="submit"
              variant="primary"
              isLoading={isCreating}
              disabled={!isValid || !isDirty}
              isDisabled={!isValid || !isDirty}
              className="w-full sm:w-auto min-w-[140px]"
            >
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </FormProvider>
  );
};

export default BasicProductInfoStep;
