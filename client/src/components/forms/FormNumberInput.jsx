import { forwardRef } from 'react';
import { useController } from 'react-hook-form';

/**
 * Reusable Form Number Input Component
 * Built with React Hook Form integration and error handling
 * Supports proper number validation and formatting
 */
const FormNumberInput = forwardRef(({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  min,
  max,
  step = 'any',
  className = '',
  containerClassName = '',
  labelClassName = '',
  errorClassName = '',
  ...props
}, ref) => {
  const {
    field,
    fieldState: { error },
  } = useController({ 
    name,
    control,
    defaultValue: min || 0
  });

  const baseInputClasses = `
    w-full px-4 py-2 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    disabled:bg-gray-50 disabled:cursor-not-allowed
    transition-colors duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `;

  const handleChange = (e) => {
    const value = e.target.value;
    
    // Allow empty input or valid number
    if (value === '' || value === '-') {
      field.onChange('');
      return;
    }

    // Convert to number if valid
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      field.onChange(numValue);
    }
  };

  const handleBlur = (e) => {
    const value = e.target.value;
    
    // Convert empty string to 0 or min value
    if (value === '' || value === '-') {
      field.onChange(min || 0);
    }
    
    field.onBlur();
  };

  return (
    <div className={`space-y-1 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name}
          className={`
            block text-sm font-medium text-gray-700
            ${required ? 'after:content-["*"] after:ml-1 after:text-red-500' : ''}
            ${labelClassName}
          `}
        >
          {label}
        </label>
      )}
      
      <input
        id={name}
        ref={ref}
        type="number"
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={baseInputClasses}
        value={field.value === '' ? '' : field.value}
        onChange={handleChange}
        onBlur={handleBlur}
        {...props}
      />
      
      {error && (
        <p className={`
          text-sm text-red-600 mt-1
          ${errorClassName}
        `}>
          {error.message}
        </p>
      )}
    </div>
  );
});

FormNumberInput.displayName = 'FormNumberInput';

export default FormNumberInput;
