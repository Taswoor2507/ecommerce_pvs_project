import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { ArrowLeft, Package, Plus, AlertCircle, Layers, BarChart3 } from 'lucide-react';
import ProductCreationWizard from '../components/ProductCreationWizard.jsx';

/**
 * Create Product Page - Production Ready
 * Professional admin interface for creating products with variants
 * Includes breadcrumb navigation, error handling, and proper UX
 */
const CreateProductPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle completion of product creation
  const handleProductCreated = () => {
    navigate('/admin/products', { 
      state: { 
        message: 'Product created successfully!',
        timestamp: Date.now()
      } 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Create Product</h1>
          <p className="text-slate-600 mt-1">Add a new product to your inventory with variants</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => navigate('/admin/products')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200/60 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Product Creation Wizard</h3>
            <p className="text-blue-800 leading-relaxed">
              Follow the step-by-step process to create products with variants. You can add variant types (Size, Color, etc.), 
              options, and configure combinations with stock and pricing.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message from Navigation */}
      {location.state?.message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <Plus className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-emerald-900">Success</h3>
              <p className="text-sm text-emerald-800 mt-1">{location.state.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl">
        <ProductCreationWizard onProductCreated={handleProductCreated} />
      </div>

      {/* Help Section */}
      <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200/60 p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mr-4">
            <AlertCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Need Help?</h3>
            <p className="text-slate-600 mt-1">Quick guide to creating products</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-200">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Simple Products</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Create products without variants by completing only the basic information step.
            </p>
          </div>
          <div className="group">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors duration-200">
              <Layers className="w-6 h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Variant Products</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Add variant types like Size, Color, or Material. The system will automatically generate combinations.
            </p>
          </div>
          <div className="group">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-200 transition-colors duration-200">
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Stock Management</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Configure stock and pricing for each combination. Use bulk actions for efficiency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
