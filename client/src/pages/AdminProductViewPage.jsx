import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  Box, 
  Star, 
  Eye,
  Copy,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus
} from 'lucide-react';
import Button from '../components/ui/Button.jsx';
import { useProductDetail } from '../hooks/useProductDetail.js';
import { useProducts } from '../hooks/useProducts.js';

const AdminProductViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('details');

  // Fetch product details
  const { 
    product, 
    combinations, 
    isLoading, 
    isError, 
    error 
  } = useProductDetail(id);

  // For delete functionality
  const { deleteProduct } = useProducts();

  const handleDeleteProduct = async () => {
    try {
      await deleteProduct(id);
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Failed to delete product. Please try again.');
    }
    setShowDeleteModal(false);
  };

  const handleCopyProductId = () => {
    navigator.clipboard.writeText(product?._id || product?.id);
    // You could add a toast notification here
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
      'inactive': { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Inactive' },
      'draft': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Draft' },
    };
    
    const config = statusConfig[status] || statusConfig['draft'];
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">Out of Stock</span>;
    } else if (stock < 10) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">Low Stock</span>;
    } else {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">In Stock</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-3 text-slate-600">Loading product details...</p>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Product Not Found</h2>
          <p className="text-slate-600 mb-4">{error?.message || 'This product may have been deleted or doesn\'t exist.'}</p>
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
            onClick={() => navigate('/admin/products')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
            <p className="text-slate-600">Product ID: {product._id || product.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyProductId}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(`/admin/products/${id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Product Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Status</p>
              <div className="mt-2">{getStatusBadge(product.status)}</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Base Price</p>
              <p className="text-2xl font-bold text-slate-900">${product.base_price || '0.00'}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Stock</p>
              <div className="mt-2">{getStockBadge(product.total_stock || 0)}</div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Box className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Rating</p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-amber-400 fill-current" />
                <span className="ml-1 text-lg font-semibold text-slate-900">
                  {product.rating || '0.0'}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg">
        <div className="border-b border-slate-200/60">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {['details', 'combinations', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  selectedTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Details Tab */}
          {selectedTab === 'details' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <p className="text-slate-900">{product.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
                    <p className="text-slate-900">{product.sku || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                    <p className="text-slate-900">{product.category || 'Uncategorized'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Base Price</label>
                    <p className="text-slate-900">${product.base_price || '0.00'}</p>
                  </div>
                </div>
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Description</h3>
                  <div className="prose prose-sm max-w-none text-slate-700">
                    {product.description}
                  </div>
                </div>
              )}

              {product.images && product.images.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Product Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-slate-100 rounded-lg overflow-hidden">
                        <img
                          src={image.url || image}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Combinations Tab */}
          {selectedTab === 'combinations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Product Variants ({combinations.length})
              </h3>
              
              {combinations.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">This product has no variants</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200/60">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Variant
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
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
                            <span className={`text-sm font-medium ${
                              combination.stock === 0 ? 'text-red-600' :
                              combination.stock < 10 ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                              {combination.stock}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-900">
                            ${combination.final_price?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-4 py-3">
                            {getStockBadge(combination.stock)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Analytics Tab */}
          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Analytics</h3>
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Analytics dashboard coming soon...</p>
                <p className="text-sm text-slate-500 mt-2">
                  This will show sales data, views, and other metrics for this product.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Delete Product</h3>
                <p className="text-slate-600">Are you sure you want to delete "{product.name}"?</p>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              This action cannot be undone. This will permanently delete the product and all its variants.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteProduct}
              >
                Delete Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductViewPage;
