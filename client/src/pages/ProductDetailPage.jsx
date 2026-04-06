import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useProductDetail } from '../hooks/useProductDetail';
import ProductImages from '../components/ProductImages';
import VariantSelector from '../components/VariantSelector';
import ProductInfo from '../components/ProductInfo';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';


const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ── State ──
  const [selectedVariants, setSelectedVariants] = useState({});

  // ── Data Fetching ─
  const {
    product,
    combinations,
    firstAvailableCombo,
    productBasePrice,
    hasVariants,
    variantTypes,
    isLoading,
    isError,
    error,
    lookupCombination,
    lookupCombinationState,
    refetchProduct,
  } = useProductDetail(id);

  // ── Derived State
  const isAllVariantsSelected = useMemo(() => {
    if (!hasVariants) return true;
    return variantTypes.every(vt => selectedVariants[vt.name]);
  }, [hasVariants, variantTypes, selectedVariants]);

  // Get stock and pricing info for selected combination
  const combinationInfo = useMemo(() => {
    if (!isAllVariantsSelected || !combinations.length) {
      return {
        stock: 0,
        inStock: false,
        finalPrice: null,
        additionalPrice: 0,
        combinationId: null,
      };
    }

    // Find matching combination based on selected variants
    const matchingCombo = combinations.find(combo => {
      const comboSelections = combo.option_labels.reduce((acc, label) => {
        acc[label.type] = label.value;
        return acc;
      }, {});
      
      return Object.entries(selectedVariants).every(
        ([type, value]) => comboSelections[type] === value
      );
    });

    if (matchingCombo) {
      return {
        stock: matchingCombo.stock,
        inStock: matchingCombo.in_stock,
        finalPrice: matchingCombo.final_price,
        additionalPrice: matchingCombo.additional_price,
        combinationId: matchingCombo._id,
      };
    }

    return {
      stock: 0,
      inStock: false,
      finalPrice: null,
      additionalPrice: 0,
      combinationId: null,
    };
  }, [combinations, isAllVariantsSelected, selectedVariants]);

  // ── Auto-select first available in-stock combination 
  const hasAutoSelectedRef = useRef(false);
  
  useEffect(() => {
    if (!hasAutoSelectedRef.current && hasVariants && firstAvailableCombo) {
      // Defer state update to avoid cascading renders
      const timer = setTimeout(() => {
        const autoSelection = firstAvailableCombo.option_labels.reduce((acc, label) => {
          acc[label.type] = label.value;
          return acc;
        }, {});
        setSelectedVariants(autoSelection);
        hasAutoSelectedRef.current = true;
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [hasVariants, firstAvailableCombo]);

  // ── Handlers 
  const handleVariantChange = useCallback(async (newSelection) => {
    setSelectedVariants(newSelection);
    
    // Check if all variants are selected
    const allSelected = variantTypes.every(vt => newSelection[vt.name]);
    
    if (allSelected) {
      try {
        await lookupCombination(newSelection);
      } catch {
        // Combination lookup failed - product combination might not exist
      }
    }
  }, [lookupCombination, variantTypes]);

  const handleAddToCart = useCallback(async (quantity) => {
    // TODO: Implement cart functionality
    // For now, just log the cart action
    console.log('Adding to cart:', {
      productId: id,
      combinationId: combinationInfo.combinationId,
      quantity,
      selectedVariants,
    });
    
    // Show success message (can be replaced with toast notification)
    alert(`Added ${quantity} item(s) to cart!`);
  }, [id, combinationInfo.combinationId, selectedVariants]);

  const handleRetry = useCallback(() => {
    refetchProduct();
  }, [refetchProduct]);

  // ── Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="xl" />
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  // ── Error State 
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ErrorMessage 
            error={error} 
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  // ── Not Found State 
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <ErrorMessage 
            error={{ response: { status: 404, data: { message: 'Product not found' } } }}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  // ── Render 
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <button 
            onClick={() => navigate(-1)}
            className="hover:text-indigo-600 transition-colors"
          >
            Products
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate max-w-xs">
            {product.name}
          </span>
        </nav>

        {/* Back Button (Mobile) */}
        <button
          onClick={() => navigate(-1)}
          className="md:hidden flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Main Product Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
            {/* Left Column: Product Images */}
            <div className="order-1">
              <ProductImages
                image={product.image}
                productName={product.name}
              />
            </div>

            {/* Right Column: Product Info */}
            <div className="order-2 space-y-6">
              {/* Product Header */}
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                  {product.name}
                </h1>
                
                {/* Variant Count Badge */}
                {hasVariants && (
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 text-sm font-medium rounded-full">
                      {product.variant_type_count} Variants Available
                    </span>
                    <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                      SKU: {combinationInfo.combinationId || product._id}
                    </span>
                  </div>
                )}
              </div>

              {/* Product Description */}
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {/* Variant Selector */}
              {hasVariants && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Select Options
                  </h3>
                  <VariantSelector
                    variantTypes={variantTypes}
                    selectedOptions={selectedVariants}
                    onSelectionChange={handleVariantChange}
                    disabled={lookupCombinationState.isPending}
                  />
                </div>
              )}

              {/* Price & Add to Cart */}
              <div className="border-t border-gray-100 pt-6">
                <ProductInfo
                  basePrice={productBasePrice}
                  finalPrice={combinationInfo.finalPrice}
                  additionalPrice={combinationInfo.additionalPrice}
                  stock={combinationInfo.stock}
                  inStock={hasVariants ? combinationInfo.inStock : true}
                  hasVariants={hasVariants}
                  isAllVariantsSelected={isAllVariantsSelected}
                  isLoadingCombination={lookupCombinationState.isPending}
                  onAddToCart={handleAddToCart}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
