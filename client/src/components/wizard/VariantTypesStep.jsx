import { useState } from 'react';
import { useVariantMutation } from '../../hooks/useVariantMutation.js';
import { Plus, X, Trash2, AlertCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';

const VariantTypesStep = ({ productId, variants, basicProductData, onVariantsChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [variantName, setVariantName] = useState('');
  const [currentOption, setCurrentOption] = useState('');
  const [options, setOptions] = useState([]);

  const hasStock = basicProductData?.stock && basicProductData.stock > 0;

  const {
    addVariantType,
    deleteVariantType,
    isAddingVariantType,
    isDeletingVariantType,
    serverError,
    clearError,
  } = useVariantMutation(productId);

  const handleAddOption = () => {
    if (currentOption.trim() && !options.includes(currentOption.trim())) {
      setOptions([...options, currentOption.trim()]);
      setCurrentOption('');
    }
  };

  const handleOptionKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddOption();
    }
  };

  const removeOption = (optionToRemove) => {
    setOptions(options.filter(option => option !== optionToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!variantName.trim() || options.length === 0) {
      alert('Please enter a variant name and at least one option.');
      return;
    }

    if (hasStock) {
      alert('Cannot create variants while product has stock. Please set stock to 0 first.');
      return;
    }

    try {
      const result = await addVariantType({
        name: variantName.trim(),
        options: options,
      });
      
      const variantTypeData = result.data?.variant_type || result.data?.variantType || result.data;
      const optionsData = result.data?.variant_type?.options || result.data?.variantType?.options || variantTypeData?.options || [];
      const combinationsData = result.data?.combinations_generated || result.data?.combinationsGenerated || 0;
      const variantId = variantTypeData?._id || variantTypeData?.id;
      
      if (!variantTypeData || !variantId) {
        throw new Error('Invalid variant type response from server');
      }
      
      const newVariant = {
        _id: variantId,
        name: variantTypeData.name,
        options: optionsData,
        combinationsGenerated: combinationsData,
      };
      
      onVariantsChange([...variants, newVariant]);
      setVariantName('');
      setOptions([]);
      setCurrentOption('');
      setShowAddForm(false);
      
    } catch {
      // Error handled by custom hook
    }
  };

  const handleDeleteVariant = async (variantId) => {
    if (!confirm('Are you sure you want to delete this variant type?')) {
      return;
    }

    try {
      await deleteVariantType(productId, variantId);
      onVariantsChange(variants.filter(v => v._id !== variantId));
    } catch {
      // Error handled by custom hook
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-left mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Product Variants</h2>
        <p className="text-gray-600">Add different options for your product like size, color, or material</p>
      </div>

      {/* Stock Warning */}
      {hasStock && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 shrink-0" />
            <div>
              <h3 className="font-medium text-amber-800">Stock Management</h3>
              <p className="text-sm text-amber-700 mt-1">
                This product has {basicProductData.stock} units in stock. Set stock to 0 to add variants.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Server Error */}
      {serverError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 shrink-0" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{serverError}</p>
              <button
                onClick={clearError}
                className="text-sm text-red-600 hover:text-red-800 mt-2"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Variants */}
      {variants.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Variants</h3>
          <div className="space-y-3">
            {variants.map((variant) => (
              <div key={variant._id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{variant.name}</h4>
                  <button
                    onClick={() => handleDeleteVariant(variant._id)}
                    disabled={isDeletingVariantType}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(variant.options || []).map((option, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white border border-gray-300 rounded-full text-sm text-gray-700"
                    >
                      {option.value || option}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {showAddForm ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add Variant Type</h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setVariantName('');
                setOptions([]);
                setCurrentOption('');
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Variant Name
              </label>
              <input
                type="text"
                value={variantName}
                onChange={(e) => setVariantName(e.target.value)}
                placeholder="e.g., Size, Color"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isAddingVariantType}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Options
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentOption}
                    onChange={(e) => setCurrentOption(e.target.value)}
                    onKeyPress={handleOptionKeyPress}
                    placeholder="Add an option"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isAddingVariantType}
                  />
                  <button
                    type="button"
                    onClick={handleAddOption}
                    disabled={!currentOption.trim() || isAddingVariantType}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
                
                {options.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {options.map((option, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {option}
                        <button
                          type="button"
                          onClick={() => removeOption(option)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false);
                  setVariantName('');
                  setOptions([]);
                  setCurrentOption('');
                }}
                disabled={isAddingVariantType}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!variantName.trim() || options.length === 0 || isAddingVariantType}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isAddingVariantType ? 'Adding...' : 'Add Variant'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="text-center">
          {variants.length === 0 ? (
            <div className="py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No variants yet</h3>
              <p className="text-gray-600 mb-6">Add variants to offer different options like size or color</p>
            </div>
          ) : (
            <div className="py-6">
              <p className="text-gray-600 mb-4">Add another variant type or continue to the next step</p>
            </div>
          )}
          
          <div className="inline-block">
            <button
              onClick={() => setShowAddForm(true)}
              disabled={hasStock}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {variants.length === 0 ? 'Add First Variant' : 'Add Another Variant'}
            </button>
          </div>
          
          {hasStock && (
            <p className="text-sm text-gray-500 mt-2">
              Set stock to 0 to enable variants
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default VariantTypesStep;
