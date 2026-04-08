import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { addOptionSchema } from '../../schemas/variant.schema.js';
import { useVariantMutation } from '../../hooks/useVariantMutation.js';
import { Plus, X, Tag, AlertCircle, ChevronDown } from 'lucide-react';
import { FormInput, FormError } from '../forms/index.js';
import Button from '../ui/Button.jsx';

/**
 * Step 3: Options Management
 * Add options to each variant type
 */
const OptionsStep = ({ productId, variants, onVariantsChange }) => {
  const [expandedVariants, setExpandedVariants] = useState(new Set());
  const [addingToVariant, setAddingToVariant] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = useForm({
    resolver: zodResolver(addOptionSchema),
    defaultValues: {
      option: '',
    },
    mode: 'onChange',
  });

  const {
    addOption,
    deleteOption,
    isAddingOption,
    isDeletingOption,
    serverError,
    clearError,
  } = useVariantMutation(productId);

  const onSubmit = async (data) => {
    if (!addingToVariant) return;

    try {
      const result = await addOption({
        variantTypeId: addingToVariant,
        option: data.option,
      });

      // Update local variants state
      const updatedVariants = variants.map(variant => {
        if (variant._id === addingToVariant) {
          return {
            ...variant,
            options: [...variant.options, result.data.option],
          };
        }
        return variant;
      });

      onVariantsChange(updatedVariants);
      
      // Reset form
      reset({ option: '' });
      setAddingToVariant(null);
      
    } catch (error) {
      // Error handled by custom hook
      console.error('Add option failed:', error);
    }
  };

  const handleDeleteOption = async (optionId, variantId) => {
    try {
      await deleteOption(optionId);

      // Update local variants state
      const updatedVariants = variants.map(variant => {
        if (variant._id === variantId) {
          return {
            ...variant,
            options: variant.options.filter(opt => opt._id !== optionId),
          };
        }
        return variant;
      });

      onVariantsChange(updatedVariants);
    } catch (error) {
      // Error handled by custom hook
      console.error('Delete option failed:', error);
    }
  };

  const toggleVariantExpanded = (variantId) => {
    const newExpanded = new Set(expandedVariants);
    if (newExpanded.has(variantId)) {
      newExpanded.delete(variantId);
    } else {
      newExpanded.add(variantId);
    }
    setExpandedVariants(newExpanded);
  };

  // If no variants, show skip message
  if (variants.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Variant Types Added
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't added any variant types. Options are only needed when you have variants.
          </p>
          <p className="text-sm text-gray-500">
            Use the navigation buttons below to continue to the next step.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Options Management
        </h3>
        <p className="text-gray-600">
          Add options to each variant type. Each option will create new product combinations.
        </p>
      </div>

      {/* Server Error */}
      <FormError
        error={serverError}
        onDismiss={clearError}
        className="mb-6"
      />

      {/* Variant Types with Options */}
      <div className="space-y-6">
        {variants.map((variant) => (
          <div
            key={variant._id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Variant Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleVariantExpanded(variant._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Tag className="w-5 h-5 text-indigo-600 mr-3" />
                  <h4 className="font-semibold text-gray-900">{variant.name}</h4>
                  <span className="ml-2 text-sm text-gray-500">
                    ({variant.options.length} options)
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedVariants.has(variant._id) ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {/* Expanded Content */}
            {expandedVariants.has(variant._id) && (
              <div className="p-6">
                {/* Add Option Form */}
                {addingToVariant === variant._id && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h5 className="font-medium text-blue-900 mb-3">Add New Option</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                      <FormInput
                        control={control}
                        name="option"
                        placeholder="e.g., Small, Red, Cotton"
                        required
                        disabled={isAddingOption}
                      />
                      <div className="flex items-center gap-2">
                        <Button
                          type="submit"
                          variant="primary"
                          size="sm"
                          isLoading={isAddingOption}
                          disabled={!isValid || !isDirty}
                          isDisabled={!isValid || !isDirty}
                        >
                          Add Option
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setAddingToVariant(null);
                            reset({ option: '' });
                          }}
                          disabled={isAddingOption}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Existing Options */}
                <div className="space-y-3">
                  {variant.options.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No options added yet. Click "Add Option" to get started.
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {variant.options.map((option) => (
                        <div
                          key={option._id || option.id || Math.random()}
                          className="group relative inline-flex items-center"
                        >
                          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200 transition-colors">
                            <Tag className="w-3 h-3 mr-1.5 text-indigo-600" />
                            {option.value || option || 'Unknown'}
                          </span>
                          <button
                            onClick={() => handleDeleteOption(option._id || option.id, variant._id)}
                            disabled={isDeletingOption || variant.options.length <= 1}
                            className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600"
                            title={variant.options.length <= 1 ? "Cannot delete the last option" : "Delete option"}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Option Button */}
                {addingToVariant !== variant._id && (
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setAddingToVariant(variant._id)}
                      leftIcon={<Plus className="w-4 h-4" />}
                    >
                      Add Option
                    </Button>
                  </div>
                )}

                {variant.options.length > 0 && (
                  <div className="mt-4 text-sm text-gray-500">
                    <p>
                      Each option creates new combinations with other variant options.
                      Current combinations will be updated automatically.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Combination Generation
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                When you add options, the system automatically generates all possible combinations 
                with existing options from other variant types. Stock and pricing will be set to 0 
                by default and can be configured in the next step.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsStep;
