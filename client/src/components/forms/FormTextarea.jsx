import { forwardRef } from 'react';
import { useController } from 'react-hook-form';

/**
 * Reusable Form Textarea Component
 * Built with React Hook Form integration and error handling
 */
const FormTextarea = forwardRef(({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
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
    control 
  });

  const baseTextareaClasses = `
    w-full px-4 py-2 border rounded-lg
    focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
    disabled:bg-gray-50 disabled:cursor-not-allowed
    transition-colors duration-200 resize-vertical
    ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}
    ${className}
  `;

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
      
      <textarea
        id={name}
        ref={ref}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={baseTextareaClasses}
        {...field}
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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
