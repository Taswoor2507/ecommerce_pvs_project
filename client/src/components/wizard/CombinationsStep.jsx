import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { combinationsApi } from '../../api/combinations.api.js';
import { useVariantMutation } from '../../hooks/useVariantMutation.js';
import { Settings, Package, DollarSign, Box, AlertCircle, Search, Tag } from 'lucide-react';
import { FormNumberInput, FormError } from '../forms/index.js';
import Button from '../ui/Button.jsx';

/**
 * Step 4: Combinations Configuration
 * Configure stock and pricing for each combination
 */
const CombinationsStep = ({ productId, onCombinationsChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkStock, setBulkStock] = useState('');
  const [bulkPrice, setBulkPrice] = useState('');
  const [selectedCombinations, setSelectedCombinations] = useState(new Set());

  // Fetch combinations for the product
  const {
    data: combinationsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['combinations', productId],
    queryFn: () => combinationsApi.list(productId),
    enabled: !!productId,
  });

  
  const {
    updateCombination,
    isUpdatingCombination,
    serverError,
    clearError,
  } = useVariantMutation(productId);

  // Handle the actual backend response structure
  // Backend returns: { status: "success", data: { product_base_price, combinations } }
  const actualCombinationsData = combinationsData?.data || combinationsData;
  const combinations = useMemo(() => actualCombinationsData?.combinations || [], [actualCombinationsData?.combinations]);

  // Update local combinations when data changes
  useEffect(() => {
    if (actualCombinationsData) {
      onCombinationsChange(combinations);
    }
  }, [actualCombinationsData, combinations, onCombinationsChange]);

  const handleUpdateCombination = async (combinationId, field, value) => {
    try {
      await updateCombination({
        combinationId,
        payload: { [field]: value },
      });
      
      // Refetch to get updated data
      refetch();
      
    } catch (error) {
      // Error handled by custom hook
      console.error('Update combination failed:', error);
    }
  };

  const handleBulkUpdate = async (field) => {
    const value = field === 'stock' ? parseInt(bulkStock) : parseFloat(bulkPrice);
    
    if (isNaN(value) || value < 0) {
      alert(`Please enter a valid ${field === 'stock' ? 'stock' : 'price'} value.`);
      return;
    }

    if (selectedCombinations.size === 0) {
      alert('Please select at least one combination to update.');
      return;
    }

    try {
      // Update each selected combination
      const updatePromises = Array.from(selectedCombinations).map(combinationId =>
        updateCombination({
          combinationId,
          payload: { [field]: value },
        })
      );

      await Promise.all(updatePromises);
      
      // Clear selections and input
      setSelectedCombinations(new Set());
      if (field === 'stock') {
        setBulkStock('');
      } else {
        setBulkPrice('');
      }
      
      // Refetch to get updated data
      refetch();
      
    } catch (error) {
      // Error handled by custom hook
      console.error('Bulk update failed:', error);
    }
  };

  const toggleCombinationSelection = (combinationId) => {
    const newSelected = new Set(selectedCombinations);
    if (newSelected.has(combinationId)) {
      newSelected.delete(combinationId);
    } else {
      newSelected.add(combinationId);
    }
    setSelectedCombinations(newSelected);
  };

  const selectAllCombinations = () => {
    if (filteredCombinations.length === selectedCombinations.size) {
      setSelectedCombinations(new Set());
    } else {
      setSelectedCombinations(new Set(filteredCombinations.map(c => c._id)));
    }
  };

  // Filter combinations based on search
  const filteredCombinations = combinations?.filter(combination =>
    combination.option_labels.some(label =>
      label.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      label.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) || [];

  // If no combinations, show appropriate message
  if (!isLoading && (!combinations || combinations.length === 0)) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Combinations Found
          </h3>
          <p className="text-gray-600 mb-6">
            {productId 
              ? "This product doesn't have any variants or combinations. You can complete the setup."
              : "Please complete the previous steps first."
            }
          </p>
          <p className="text-sm text-gray-500">
            Use the navigation buttons below to continue or complete the setup.
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
          Combinations Configuration
        </h3>
        <p className="text-gray-600">
          Set stock and additional pricing for each combination. The final price is base price + additional price.
        </p>
      </div>

      {/* Server Error */}
      <FormError
        error={serverError}
        onDismiss={clearError}
        className="mb-6"
      />

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading combinations...</p>
        </div>
      ) : (
        <>
          {/* Search and Bulk Actions */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search combinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            
            {selectedCombinations.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedCombinations.size} selected
                </span>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Stock"
                    value={bulkStock}
                    onChange={(e) => setBulkStock(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkUpdate('stock')}
                    disabled={!bulkStock || isUpdatingCombination}
                  >
                    Set Stock
                  </Button>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkUpdate('additional_price')}
                    disabled={!bulkPrice || isUpdatingCombination}
                  >
                    Set Price
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Combinations Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filteredCombinations.length > 0 && filteredCombinations.length === selectedCombinations.size}
                    onChange={selectAllCombinations}
                    className="mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {filteredCombinations.length} combination{filteredCombinations.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Base Price: ${combinationsData?.product_base_price?.toFixed(2) || '0.00'}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Combination
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Additional Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Final Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCombinations.map((combination) => (
                    <tr key={combination._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedCombinations.has(combination._id)}
                          onChange={() => toggleCombinationSelection(combination._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {combination.option_labels.map((label, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300"
                            >
                              <Tag className="w-2.5 h-2.5 mr-1 text-gray-600" />
                              <span className="font-semibold">{label.type}:</span> {label.value}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={combination.stock}
                          onChange={(e) => handleUpdateCombination(combination._id, 'stock', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          disabled={isUpdatingCombination}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={combination.additional_price}
                          onChange={(e) => handleUpdateCombination(combination._id, 'additional_price', parseFloat(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                          disabled={isUpdatingCombination}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          ${combination.final_price?.toFixed(2) || '0.00'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          combination.in_stock
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {combination.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Pricing & Stock Information
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>Final Price = Base Price + Additional Price</li>
                    <li>Stock of 0 means the combination is out of stock</li>
                    <li>You can use bulk actions to update multiple combinations at once</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

          </div>
  );
};

export default CombinationsStep;
