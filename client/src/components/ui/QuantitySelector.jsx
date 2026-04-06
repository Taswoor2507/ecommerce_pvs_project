import { Minus, Plus } from 'lucide-react';
import IconButton from './IconButton';

/**
 * QuantitySelector - A reusable quantity input component
 * Used in product detail, cart, etc.
 * 
 * @param {Object} props
 * @param {number} props.value - Current quantity value
 * @param {function} props.onChange - Callback when quantity changes (newValue) => void
 * @param {number} props.min - Minimum allowed value (default: 1)
 * @param {number} props.max - Maximum allowed value (default: 99)
 * @param {boolean} props.disabled - Disable all interactions
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 */
const QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const handleDecrease = () => {
    if (disabled) return;
    const newValue = Math.max(min, value - 1);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleIncrease = () => {
    if (disabled) return;
    const newValue = Math.min(max, value + 1);
    if (newValue !== value) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;
    const inputValue = e.target.value;
    
    // Allow empty string for better UX while typing
    if (inputValue === '') {
      return;
    }
    
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      const newValue = Math.max(min, Math.min(max, parsed));
      onChange(newValue);
    }
  };

  const handleBlur = (e) => {
    if (disabled) return;
    const inputValue = e.target.value;
    if (inputValue === '' || isNaN(parseInt(inputValue, 10))) {
      onChange(min);
    }
  };

  const sizeClasses = {
    sm: {
      container: 'border rounded-lg',
      button: 'px-2 py-1',
      input: 'w-10 py-1 text-sm',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'border-2 rounded-xl',
      button: 'px-3 py-2',
      input: 'w-12 py-2 text-base',
      icon: 'w-4 h-4',
    },
    lg: {
      container: 'border-2 rounded-xl',
      button: 'px-4 py-3',
      input: 'w-16 py-3 text-lg',
      icon: 'w-5 h-5',
    },
  };

  const { container, button, input } = sizeClasses[size];

  const isMinDisabled = disabled || value <= min;
  const isMaxDisabled = disabled || value >= max;

  return (
    <div className={`inline-flex items-center ${container} border-gray-200 overflow-hidden bg-white shadow-sm ${className}`}>
      <button
        type="button"
        onClick={handleDecrease}
        disabled={isMinDisabled}
        className={`
          ${button}
          hover:bg-gray-100 
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
        `}
        aria-label="Decrease quantity"
      >
        <Minus className={sizeClasses[size].icon} />
      </button>
      
      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        disabled={disabled}
        className={`
          ${input}
          text-center border-x-2 border-gray-200
          text-gray-900 font-bold
          focus:outline-none
          disabled:opacity-50 disabled:cursor-not-allowed
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        `}
        aria-label="Quantity"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={isMaxDisabled}
        className={`
          ${button}
          hover:bg-gray-100 
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
          transition-colors
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500
        `}
        aria-label="Increase quantity"
      >
        <Plus className={sizeClasses[size].icon} />
      </button>
    </div>
  );
};

export default QuantitySelector;
