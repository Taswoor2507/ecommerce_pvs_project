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
  const [editingCombination, setEditingCombination] = useState(null);
  const [editingValues, setEditingValues] = useState({ stock: '', additional_price: '' });

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

  const startEditingCombination = (combination) => {
    setEditingCombination(combination._id);
    setEditingValues({
      stock: combination.stock?.toString() || '',
      additional_price: combination.additional_price?.toString() || ''
    });
  };

  const handleEditingValueChange = (field, value) => {
    setEditingValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveCombination = async () => {
    if (!editingCombination) return;

    try {
      const payload = {};
      if (editingValues.stock !== '') {
        payload.stock = parseInt(editingValues.stock) || 0;
      }
      if (editingValues.additional_price !== '') {
        payload.additional_price = parseFloat(editingValues.additional_price) || 0;
      }

      await updateCombination({
        combinationId: editingCombination,
        payload,
      });

      // Refetch to get updated data
      refetch();

      // Reset editing state
      setEditingCombination(null);
      setEditingValues({ stock: '', additional_price: '' });

    } catch (error) {
      // Error handled by custom hook
      console.error('Update combination failed:', error);
    }
  };

  const cancelEditing = () => {
    setEditingCombination(null);
    setEditingValues({ stock: '', additional_price: '' });
  };

  // Get display value (editing state if being edited, otherwise backend data)
  const getDisplayValue = (combination, field) => {
    if (editingCombination === combination._id) {
      return editingValues[field];
    }
    return combination[field]?.toString() || '';
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
          skipToast: true,
        })
      );

      await Promise.all(updatePromises);
      
      import('react-hot-toast').then(({ default: toast }) => {
        toast.success(`${selectedCombinations.size} combinations updated successfully!`);
      });

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
    <div className="p-0 sm:p-4">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Combinations Configuration
        </h3>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
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
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="text-slate-500 mt-4 font-medium">Loading combinations list...</p>
        </div>
      ) : (
        <>
          {/* Search and Bulk Actions */}
          <div className="mb-8 space-y-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="text"
                placeholder="Search combinations by option value..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {selectedCombinations.size > 0 && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest flex items-center gap-2">
                      <Settings className="w-3.5 h-3.5" />
                      {selectedCombinations.size} Combinations Selected
                    </span>
                    <button 
                      onClick={() => setSelectedCombinations(new Set())}
                      className="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Stock"
                        value={bulkStock}
                        onChange={(e) => setBulkStock(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="whitespace-nowrap font-bold"
                        onClick={() => handleBulkUpdate('stock')}
                        disabled={!bulkStock || isUpdatingCombination}
                      >
                        Set Stock
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={bulkPrice}
                        onChange={(e) => setBulkPrice(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="whitespace-nowrap font-bold"
                        onClick={() => handleBulkUpdate('additional_price')}
                        disabled={!bulkPrice || isUpdatingCombination}
                      >
                        Set Price
                      </Button>
                    </div>
                  </div>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
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
                        {editingCombination === combination._id ? (
                          <input
                            type="number"
                            min="0"
                            value={editingValues.stock}
                            onChange={(e) => handleEditingValueChange('stock', e.target.value)}
                            className="w-20 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isUpdatingCombination}
                          />
                        ) : (
                          <div
                            onClick={() => startEditingCombination(combination)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                          >
                            {getDisplayValue(combination, 'stock')}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCombination === combination._id ? (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingValues.additional_price}
                            onChange={(e) => handleEditingValueChange('additional_price', e.target.value)}
                            className="w-20 px-2 py-1 border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isUpdatingCombination}
                          />
                        ) : (
                          <div
                            onClick={() => startEditingCombination(combination)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm cursor-pointer hover:border-blue-300 hover:bg-blue-50"
                          >
                            {getDisplayValue(combination, 'additional_price')}
                          </div>
                        )}
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingCombination === combination._id ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={saveCombination}
                              disabled={isUpdatingCombination}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={cancelEditing}
                              disabled={isUpdatingCombination}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500">
                            Click to edit
                          </div>
                        )}
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
                  Combination Configuration
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Click on any stock or additional price field to edit.
                    Use the Save button to apply changes or Cancel to discard them.
                  </p>
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