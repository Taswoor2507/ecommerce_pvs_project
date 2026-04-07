import { useState, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useProductDetail } from '../hooks/useProductDetail';
import { useCartActions } from '../hooks/useCartActions';
import { findMatchingCombination } from '../utils/findMatchingCombination';
import ProductImages from '../components/ProductImages';
import VariantSelector from '../components/VariantSelector';
import ProductInfo from '../components/ProductInfo';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import Breadcrumb from '../components/ui/Breadcrumb';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;

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

  // Initialize selectedVariants lazily based on firstAvailableCombo
  const [selectedVariants, setSelectedVariants] = useState(() => {
    if (!firstAvailableCombo) return {};
    return firstAvailableCombo.option_labels.reduce((acc, label) => {
      acc[label.type] = label.value;
      return acc;
    }, {});
  });

  const { addToCart } = useCartActions();
  // Check all variants selected
  const isAllVariantsSelected = useMemo(() => {
    if (!hasVariants) return true;
    return variantTypes.every(vt => selectedVariants[vt.name]);
  }, [hasVariants, variantTypes, selectedVariants]);

  // Single source of truth (DRY)
  const selectedCombo = useMemo(() => {
    if (!isAllVariantsSelected) return null;
    return findMatchingCombination(combinations, selectedVariants);
  }, [combinations, selectedVariants, isAllVariantsSelected]);

  
  // Combination info
  const combinationInfo = useMemo(() => {
    if (!selectedCombo) {
      return {
        stock: 0,
        inStock: false,
        finalPrice: null,
        additionalPrice: 0,
        combinationId: null,
      };
    }

    return {
      stock: selectedCombo.stock,
      inStock: selectedCombo.in_stock,
      finalPrice: selectedCombo.final_price,
      additionalPrice: selectedCombo.additional_price,
      combinationId: selectedCombo._id,
    };
  }, [selectedCombo]);

  //  Handlers
  const handleVariantChange = useCallback(async (newSelection) => {
    setSelectedVariants(newSelection);

    const allSelected = variantTypes.every(vt => newSelection[vt.name]);

    if (allSelected) {
      try {
        await lookupCombination(newSelection);
      } catch {
        toast.error("Combination not available");
      }
    }
  }, [lookupCombination, variantTypes]);

  const handleAddToCart = useCallback((quantity) => {
    const availableStock = hasVariants ? combinationInfo.stock : (product.stock || 0);

    if (availableStock <= 0) {
      toast.error('Out of stock');
      return;
    }

    if (quantity > availableStock) {
      toast.error(`Only ${availableStock} items available`);
      return;
    }

    addToCart(product, selectedCombo || null, quantity);
    toast.success("Added to cart");
  }, [product, selectedCombo, addToCart, hasVariants, combinationInfo.stock]);

  const handleRetry = useCallback(() => {
    refetchProduct();
  }, [refetchProduct]);

  //  FIXED Navigation 
  const handleBack = () => {
    navigate(`/products?page=${page}`);
  };

  const breadcrumbItems = [
    { label: 'Home', to: '/' },
    { label: 'Products', onClick: handleBack },
    { label: product?.name || 'Product' },
  ];

  // ── STATES
  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage error={error} onRetry={handleRetry} />;
  }

  if (!product) {
    return <ErrorMessage error={{ message: 'Product not found' }} />;
  }

  // ── UI
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">

        <Breadcrumb items={breadcrumbItems} />

        <div className="bg-white rounded-2xl shadow-sm mt-6 p-6 grid lg:grid-cols-2 gap-8">

          <ProductImages image={product.image} productName={product.name} />

          <div className="space-y-6">

            <h1 className="text-3xl font-bold">{product.name}</h1>

            {hasVariants && (
              <div className="flex gap-2">
                <Badge>{product.variant_type_count} Variants</Badge>
                <Badge>SKU: {combinationInfo.combinationId || product._id}</Badge>
              </div>
            )}

            {!hasVariants && (
              <div className="flex gap-2">
                <Badge variant={product.stock > 0 ? "success" : "danger"}>
                  {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>
                <Badge variant="secondary">{product.stock} available</Badge>
              </div>
            )}

            <p className="text-gray-600">{product.description}</p>

            {hasVariants && (
              <VariantSelector
                variantTypes={variantTypes}
                selectedOptions={selectedVariants}
                onSelectionChange={handleVariantChange}
                disabled={lookupCombinationState.isPending}
              />
            )}

            <ProductInfo
              basePrice={productBasePrice}
              finalPrice={combinationInfo.finalPrice}
              stock={hasVariants ? combinationInfo.stock : product.stock}
              inStock={hasVariants ? combinationInfo.inStock : product.stock > 0}
              onAddToCart={handleAddToCart}
            />

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;