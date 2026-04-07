import { useState, useCallback, useEffect } from 'react';
import { Check, Plus, ChevronDown, ChevronUp } from 'lucide-react';


const VariantSelector = ({
  variantTypes = [],
  selectedOptions = {},
  onSelectionChange,
  disabled = false,
  disabledOptions = {},
  className = '',
}) => {
  const [selection, setSelection] = useState(selectedOptions);
  const [expandedTypes, setExpandedTypes] = useState({});

  const MAX_VISIBLE_OPTIONS = 6;

  // Sync with external selection state
  useEffect(() => {
    setSelection(selectedOptions);
  }, [selectedOptions]);

  const handleOptionSelect = useCallback((typeName, option) => {
    const newSelection = {
      ...selection,
      [typeName]: option.value,
    };
    setSelection(newSelection);
    onSelectionChange?.(newSelection);
  }, [selection, onSelectionChange]);

  const toggleExpand = useCallback((typeName) => {
    setExpandedTypes(prev => ({
      ...prev,
      [typeName]: !prev[typeName]
    }));
  }, []);

  if (!variantTypes || variantTypes.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {variantTypes.map((variantType) => {
        const selectedValue = selection[variantType.name];
        const typeDisabledOptions = disabledOptions[variantType.name] || [];
        const isExpanded = expandedTypes[variantType.name] || false;
        const options = variantType.options || [];
        
        // Determine visible options and overflow
        const hasOverflow = options.length > MAX_VISIBLE_OPTIONS;
        const visibleOptions = isExpanded 
          ? options 
          : options.slice(0, MAX_VISIBLE_OPTIONS);
        const hiddenCount = options.length - MAX_VISIBLE_OPTIONS;

        return (
          <div key={variantType._id || variantType.name} className="variant-selector">
            {/* Variant Type Header */}
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-900">
                {variantType.name}
              </label>
            </div>

            {/* Options Tags */}
            <div className="flex flex-wrap gap-2">
              {visibleOptions.map((option) => {
                const isSelected = selectedValue === option.value;
                const isOptionDisabled = typeDisabledOptions.includes(option.value);

                return (
                  <button
                    key={option._id || option.value}
                    type="button"
                    onClick={() => !isOptionDisabled && !disabled && handleOptionSelect(variantType.name, option)}
                    disabled={isOptionDisabled || disabled}
                    className={`
                      relative group inline-flex items-center gap-1.5 px-4 py-2.5 
                      rounded-lg text-sm font-medium transition-all duration-200
                      border-2 min-w-[48px] justify-center
                      ${isSelected 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm' 
                        : isOptionDisabled || disabled
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-gray-50 cursor-pointer'
                      }
                    `}
                  >
                    {/* Selected Indicator */}
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    
                    {/* Option Value */}
                    <span>{option.value}</span>

                    {/* Hover Effect for Unselected */}
                    {!isSelected && !isOptionDisabled && !disabled && (
                      <span className="absolute inset-0 rounded-lg ring-2 ring-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>
                );
              })}

              {/* +N Overflow Button */}
              {hasOverflow && !isExpanded && (
                <button
                  type="button"
                  onClick={() => toggleExpand(variantType.name)}
                  className="
                    inline-flex items-center gap-1 px-4 py-2.5 
                    rounded-lg text-sm font-medium transition-all duration-200
                    border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600
                    hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600
                    cursor-pointer
                  "
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{hiddenCount} more</span>
                </button>
              )}
            </div>

            {/* Expand/Collapse Button (when expanded) */}
            {hasOverflow && isExpanded && (
              <button
                type="button"
                onClick={() => toggleExpand(variantType.name)}
                className="
                  mt-3 inline-flex items-center gap-1.5 text-sm text-indigo-600 
                  font-medium hover:text-indigo-700 transition-colors cursor-pointer
                "
              >
                <ChevronUp className="w-4 h-4" />
                <span>Show less</span>
              </button>
            )}

            {/* Show All Link (when collapsed) */}
            {hasOverflow && !isExpanded && (
              <button
                type="button"
                onClick={() => toggleExpand(variantType.name)}
                className="
                  mt-2 inline-flex items-center gap-1.5 text-sm text-gray-500 
                  hover:text-indigo-600 transition-colors cursor-pointer
                "
              >
                <ChevronDown className="w-4 h-4" />
                <span>View all {options.length} options</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VariantSelector;
