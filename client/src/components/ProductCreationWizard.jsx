import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Package, Layers, Tag, Settings, ArrowLeft, X } from 'lucide-react';
import Button from './ui/Button.jsx';
import { FormError } from './forms/index.js';
import BasicProductInfoStep from './wizard/BasicProductInfoStep.jsx';
import VariantTypesStep from './wizard/VariantTypesStep.jsx';
import OptionsStep from './wizard/OptionsStep.jsx';
import CombinationsStep from './wizard/CombinationsStep.jsx';

/**
 * Multi-step Product Creation Wizard
 * Handles the complete product creation flow with variants
 */
const ProductCreationWizard = ({ onProductCreated }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState({
    basic: null,
    variants: [],
    combinations: [],
  });
  const [isCompleted, setIsCompleted] = useState(false);

  // Wizard steps configuration
  const steps = [
    {
      id: 1,
      title: 'Basic Info',
      description: 'Product name, description, and base price',
      icon: Package,
      component: 'BasicProductInfo',
    },
    {
      id: 2,
      title: 'Variant Types',
      description: 'Add variant types like Size, Color, etc.',
      icon: Layers,
      component: 'VariantTypesManager',
    },
    {
      id: 3,
      title: 'Options',
      description: 'Add options for each variant type',
      icon: Tag,
      component: 'OptionsManager',
    },
    {
      id: 4,
      title: 'Combinations',
      description: 'Configure stock and pricing for combinations',
      icon: Settings,
      component: 'CombinationsManager',
    },
  ];

  const totalSteps = steps.length;

  // Navigation functions
  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === totalSteps) {
      // Handle completion when on the final step
      setIsCompleted(true);
    }
  }, [currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  // Data update functions
  const updateBasicInfo = useCallback((data) => {
    setProductData(prev => ({ ...prev, basic: data }));
  }, []);

  const updateVariants = useCallback((variants) => {
    setProductData(prev => ({ ...prev, variants }));
  }, []);

  const updateCombinations = useCallback((combinations) => {
    setProductData(prev => ({ ...prev, combinations }));
  }, []);

  // Step validation
  const isStepValid = useCallback((step) => {
    switch (step) {
      case 1: {
        return productData.basic && 
               productData.basic.name && 
               productData.basic.base_price >= 0;
      }
      case 2:
        return true; // Variants are optional - always valid
      case 3: {
        return productData.variants.length === 0 || 
               productData.variants.every(v => v.options && v.options.length > 0);
      }
      case 4:
        // For simple products (no variants), always allow completion
        // For products with variants, ensure combinations are loaded
        return productData.variants.length === 0 || 
               (productData.combinations && productData.combinations.length > 0);
      default:
        return false;
    }
  }, [productData]);

  const canGoNext = isStepValid(currentStep);
  const canGoPrevious = currentStep > 1;

  // Get current step component
  const getCurrentStepComponent = () => {
    const step = steps.find(s => s.id === currentStep);
    if (!step) return null;

    switch (step.component) {
      case 'BasicProductInfo':
        return (
          <BasicProductInfoStep
            data={productData.basic}
            onDataChange={updateBasicInfo}
            onNext={goToNextStep}
          />
        );
      case 'VariantTypesManager':
        return (
          <VariantTypesStep
            productId={productData.basic?.id || productData.basic?._id}
            variants={productData.variants}
            basicProductData={productData.basic}
            onVariantsChange={updateVariants}
          />
        );
      case 'OptionsManager':
        return (
          <OptionsStep
            productId={productData.basic?.id || productData.basic?._id}
            variants={productData.variants}
            onVariantsChange={updateVariants}
          />
        );
      case 'CombinationsManager':
        return (
          <CombinationsStep
            productId={productData.basic?.id || productData.basic?._id}
            onCombinationsChange={updateCombinations}
          />
        );
      default:
        return null;
    }
  };

  // If completed, show success screen
  if (isCompleted) {
    // Call the callback if provided
    if (onProductCreated) {
      onProductCreated();
    }

    return (
      <div className="flex items-center justify-center py-12">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-2xl p-10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Product Created Successfully!</h2>
          <p className="text-slate-600 mb-8 text-base leading-relaxed">
            "{productData.basic?.name}" has been created with all variants and combinations.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => navigate('/admin/products')}
              className="w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/25 group"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>View Products</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </button>
            <button 
              onClick={() => {
                // Reset wizard for another product
                setIsCompleted(false);
                setCurrentStep(1);
                setProductData({
                  basic: null,
                  variants: [],
                  combinations: [],
                });
              }}
              className="w-full px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-semibold transition-all duration-200"
            >
              Create Another Product
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-6 overflow-hidden">
        <div className="flex items-center overflow-x-auto pb-4 pt-1 snap-x [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-50">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center shrink-0 snap-start">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step.id < currentStep && isStepValid(step.id)
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25'
                      : step.id === currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 ring-2 ring-blue-200 ring-offset-2'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {step.id < currentStep && isStepValid(step.id) ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm">{step.id}</span>
                  )}
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-semibold transition-colors duration-300 ${
                    step.id < currentStep && isStepValid(step.id)
                      ? 'text-emerald-600'
                      : step.id === currentStep
                      ? 'text-blue-600'
                      : 'text-slate-500'
                  }`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 transition-all duration-300 ${
                  step.id < currentStep && isStepValid(step.id) 
                    ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' 
                    : 'bg-slate-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-4 sm:p-8">
        {getCurrentStepComponent()}
      </div>

      {/* Navigation Footer - Only show for steps 2-4 */}
      {currentStep > 1 && (
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-lg p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            {currentStep > 2 ? (
              <button
                onClick={goToPreviousStep}
                disabled={!canGoPrevious}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group text-sm sm:text-base"
              >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                <span className="hidden xs:inline">Previous</span>
              </button>
            ) : <div className="hidden xs:block w-24"></div>}

            <div className="flex items-center space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-100 rounded-xl flex-shrink-0">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] sm:text-sm font-medium text-slate-700 whitespace-nowrap uppercase tracking-wider">
                Step {currentStep}/{steps.length}
              </span>
            </div>

            <button
              onClick={goToNextStep}
              disabled={!canGoNext}
              className="flex items-center space-x-2 px-4 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 group text-sm sm:text-base"
            >
              <span className="whitespace-nowrap">{currentStep === steps.length ? 'Finish' : 'Next'}</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCreationWizard;
