import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Package, 
  DollarSign, 
  Box, 
  Eye,
  Plus,
  Trash2,
  Settings,
  Edit3,
  X
} from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import { useProductDetail } from '../hooks/useProductDetail.js';
import { productsApi } from '../api/products.api.js';
import { useVariantMutation } from '../hooks/useVariantMutation.js';

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    base_price: '',
    image: '',
    stock: '',
    is_active: true
  });

  const [activeTab, setActiveTab] = useState('basic');
  const [newVariantType, setNewVariantType] = useState('');
  const [newVariantOptions, setNewVariantOptions] = useState(['']);
  const [newOptions, setNewOptions] = useState({});
  const [editingCombination, setEditingCombination] = useState(null);
  const [editingValues, setEditingValues] = useState({ stock: '', additional_price: '' });

  const { 
    product, 
    combinations, 
    isLoading, 
    isError, 
    error,
    refetchProduct 
  } = useProductDetail(id);

  const {
    addVariantType,
    addOption,
    deleteVariantType,
    deleteOption,
    updateCombination,
    serverError,
    clearError,
    isAddingVariantType,
    isAddingOption,
    isDeletingVariantType,
    isDeletingOption,
    isUpdatingCombination
  } = useVariantMutation(id);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        base_price: product.base_price || '',
        image: product.image || 'https://www.inkfactory.pk/wp-content/uploads/2019/08/T-Shirt-Mockup-007.jpg',
        stock: product.stock || '',
        is_active: product.is_active !== false
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddVariantType = async () => {
    if (!newVariantType.trim()) return;
    
    const validOptions = newVariantOptions
      .map(opt => opt.trim())
      .filter(opt => opt.length > 0);
    
    if (validOptions.length === 0) {
      alert('Please add at least one option for the variant type');
      return;
    }
    
    try {
      await addVariantType({ 
        name: newVariantType.trim(), 
        options: validOptions 
      });
      setNewVariantType('');
      setNewVariantOptions(['']);
      await refetchProduct();
    } catch (error) {
      console.error('Failed to add variant type:', error);
      alert(error.response?.data?.message || 'Failed to add variant type');
    }
  };

  const handleAddOption = async (variantTypeId) => {
    const optionValue = newOptions[variantTypeId]?.find(opt => opt.trim());
    if (!optionValue?.trim()) return;
    
    try {
      await addOption({ variantTypeId, option: optionValue.trim() });
      setNewOptions(prev => ({
        ...prev,
        [variantTypeId]: prev[variantTypeId].filter((_, i) => i !== prev[variantTypeId].indexOf(optionValue))
      }));
      await refetchProduct();
    } catch (error) {
      console.error('Failed to add option:', error);
      alert(error.response?.data?.message || 'Failed to add option');
    }
  };

  const handleDeleteVariantType = async (variantTypeId) => {
    if (!window.confirm('Are you sure you want to delete this variant type? This will remove all associated options and combinations.')) {
      return;
    }
    
    try {
      await deleteVariantType(variantTypeId);
      await refetchProduct();
    } catch (error) {
      console.error('Failed to delete variant type:', error);
      alert(error.response?.data?.message || 'Failed to delete variant type');
    }
  };

  const handleDeleteOption = async (optionId) => {
    if (!window.confirm('Are you sure you want to delete this option? This may remove associated combinations.')) {
      return;
    }
    
    try {
      await deleteOption(optionId);
      await refetchProduct();
    } catch (error) {
      console.error('Failed to delete option:', error);
      alert(error.response?.data?.message || 'Failed to delete option');
    }
  };

  const handleUpdateCombination = async (combinationId, updates) => {
    try {
      await updateCombination({ combinationId, payload: updates });
      setEditingCombination(null);
      setEditingValues({ stock: '', additional_price: '' });
      await refetchProduct();
    } catch (error) {
      console.error('Failed to update combination:', error);
      alert(error.response?.data?.message || 'Failed to update combination');
    }
  };

  const handleEditingValueChange = (field, value) => {
    setEditingValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const startEditingCombination = (combination) => {
    console.log('Starting edit for combination:', combination);
    const values = {
      stock: combination.stock || '',
      additional_price: combination.additional_price || ''
    };
    console.log('Setting editing values to:', values);
    setEditingCombination(combination._id);
    setEditingValues(values);
  };

  const handleVariantOptionChange = (index, value) => {
    setNewVariantOptions(prev => {
      const options = [...prev];
      options[index] = value;
      return options;
    });
  };

  const addVariantOptionInput = () => {
    setNewVariantOptions(prev => [...prev, '']);
  };

  const removeVariantOptionInput = (index) => {
    setNewVariantOptions(prev => {
      const options = [...prev];
      options.splice(index, 1);
      return options;
    });
  };

  const handleOptionInputChange = (variantTypeId, index, value) => {
    setNewOptions(prev => {
      const options = [...(prev[variantTypeId] || [])];
      options[index] = value;
      return { ...prev, [variantTypeId]: options };
    });
  };

  const addOptionInput = (variantTypeId) => {
    setNewOptions(prev => ({
      ...prev,
      [variantTypeId]: [...(prev[variantTypeId] || []), '']
    }));
  };

  const removeOptionInput = (variantTypeId, index) => {
    setNewOptions(prev => {
      const options = [...(prev[variantTypeId] || [])];
      options.splice(index, 1);
      return { ...prev, [variantTypeId]: options };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      if (!formData.name || !formData.base_price) {
        throw new Error('Name and base price are required');
      }

      const updateData = {
        name: formData.name,
        description: formData.description,
        base_price: parseFloat(formData.base_price),
        image: formData.image,
        stock: parseInt(formData.stock) || 0,
        is_active: formData.is_active
      };

      await productsApi.update(id, updateData);
      setSaveMessage('Product updated successfully!');
      await refetchProduct();
      setTimeout(() => setSaveMessage(''), 3000);
      
    } catch (error) {
      console.error('Failed to update product:', error);
      setSaveMessage(error.message || 'Failed to update product. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-slate-600">Loading product...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-600 mb-4">{error?.message || "This product may have been deleted or doesn't exist."}</p>
          <Button onClick={() => navigate('/admin/products')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/admin/products/${id}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Product
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>
            <p className="text-slate-600">Product ID: {product._id || product.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/admin/products/${id}`)}
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${
          saveMessage.includes('success') 
            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg">
        {/* Tabs */}
        <div className="border-b border-slate-200/60">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['basic', 'variants'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab === 'basic' ? 'Basic Information' : 'Variants & Combinations'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Base Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        name="base_price"
                        value={formData.base_price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Stock (for products without variants)
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Product Image URL
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter product description (optional)"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-700">Product is Active</span>
                </label>
                <p className="text-xs text-slate-500 mt-1 ml-7">
                  Inactive products won't be shown in the storefront
                </p>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === 'variants' && (
            <div className="space-y-8">
              {/* Variant Types Management */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Variant Types</h3>
                </div>

                <div className="space-y-4">
                  {/* Add New Variant Type */}
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Variant Type Name
                        </label>
                        <input
                          type="text"
                          value={newVariantType}
                          onChange={(e) => setNewVariantType(e.target.value)}
                          placeholder="e.g., Size, Color, Material"
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Options (at least one required)
                        </label>
                        {newVariantOptions.map((option, index) => (
                          <div key={index} className="flex items-center space-x-2 mb-2">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleVariantOptionChange(index, e.target.value)}
                              placeholder={`Option ${index + 1}`}
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {newVariantOptions.length > 1 && (
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => removeVariantOptionInput(index)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={addVariantOptionInput}
                          className="mt-2"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Another Option
                        </Button>
                      </div>

                      <Button
                        onClick={handleAddVariantType}
                        disabled={!newVariantType.trim() || newVariantOptions.filter(opt => opt.trim()).length === 0 || isAddingVariantType}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        {isAddingVariantType ? 'Adding...' : 'Add Variant Type'}
                      </Button>
                    </div>
                  </div>

                  {product?.variant_types?.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                      <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <p className="text-slate-600">No variant types yet</p>
                      <p className="text-sm text-slate-500 mt-1">Add your first variant type to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {product?.variant_types?.map((variantType) => (
                        <div key={variantType._id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-slate-900">{variantType.name}</h4>
                            <button
                              onClick={() => handleDeleteVariantType(variantType._id)}
                              className="text-red-600 hover:text-red-700 p-1"
                              disabled={isDeletingVariantType}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Options Management */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">Options:</span>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => addOptionInput(variantType._id)}
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                Add Option
                              </Button>
                            </div>

                            {/* Existing Options */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              {variantType.options?.map((option) => (
                                <div
                                  key={option._id}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-700 group"
                                >
                                  {option.value}
                                  <button
                                    onClick={() => handleDeleteOption(option._id)}
                                    className="ml-2 text-slate-500 hover:text-red-600"
                                    disabled={isDeletingOption}
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>

                            {/* New Options Input */}
                            {(newOptions[variantType._id] || []).map((option, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => handleOptionInputChange(variantType._id, index, e.target.value)}
                                  placeholder="Option value"
                                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddOption(variantType._id)}
                                  disabled={!option.trim() || isAddingOption}
                                >
                                  Add
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => removeOptionInput(variantType._id, index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Combinations Management */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Combinations</h3>
                
                {combinations?.length === 0 ? (
                  <div className="text-center py-8 bg-slate-50 rounded-lg">
                    <Box className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">No combinations yet</p>
                    <p className="text-sm text-slate-500 mt-1">Add variant types and options to generate combinations</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-slate-200 rounded-lg">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Variant
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Stock
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Additional Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Final Price
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {combinations.map((combination) => (
                          <tr key={combination._id}>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {combination.option_labels?.map((label, index) => (
                                  <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700"
                                  >
                                    {label.value}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              {editingCombination === combination._id ? (
                                <input
                                  type="number"
                                  value={editingValues.stock}
                                  onChange={(e) => handleEditingValueChange('stock', e.target.value)}
                                  min="0"
                                  className="w-20 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Stock"
                                  id={`stock-${combination._id}`}
                                />
                              ) : (
                                <span className={`text-sm font-medium ${
                                  combination.stock === 0 ? 'text-red-600' :
                                  combination.stock < 10 ? 'text-amber-600' : 'text-emerald-600'
                                }`}>
                                  {combination.stock}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {editingCombination === combination._id ? (
                                <input
                                  type="number"
                                  value={editingValues.additional_price}
                                  onChange={(e) => handleEditingValueChange('additional_price', e.target.value)}
                                  min="0"
                                  step="0.01"
                                  className="w-24 px-2 py-1 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Price"
                                  id={`price-${combination._id}`}
                                />
                              ) : (
                                <span className="text-sm text-slate-900">
                                  ${combination.additional_price?.toFixed(2) || '0.00'}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium text-slate-900">
                                ${((product?.base_price || 0) + (combination.additional_price || 0)).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {editingCombination === combination._id ? (
                                <div className="flex items-center space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      handleUpdateCombination(combination._id, {
                                        stock: parseInt(editingValues.stock) || 0,
                                        additional_price: parseFloat(editingValues.additional_price) || 0
                                      });
                                    }}
                                    disabled={isUpdatingCombination}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => {
                                      setEditingCombination(null);
                                      setEditingValues({ stock: '', additional_price: '' });
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => startEditingCombination(combination)}
                                >
                                  <Edit3 className="w-3 h-3 mr-1" />
                                  Edit
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Server Error Display */}
              {serverError && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {serverError}
                  <button
                    onClick={clearError}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="secondary"
          onClick={() => navigate(`/admin/products/${id}`)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}

export default AdminProductEditPage;