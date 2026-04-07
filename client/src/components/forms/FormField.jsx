import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';

/**
 * Reusable Form Field Component
 * Follows DRY principles and SOLID design patterns
 * Single Responsibility: Handles one form field
 * Open/Closed: Extensible via props
 * Dependency Inversion: Depends on abstractions (control, name)
 */
const FormField = ({ 
  name, 
  label, 
  placeholder, 
  type = 'text', 
  required = false,
  multiline = false,
  step,
  min,
  max,
  disabled = false,
  containerClassName = '',
  labelClassName = '',
  inputClassName = '',
}) => {
  const { control } = useFormContext();

  const renderInput = (field) => {
    const commonProps = {
      ...field,
      id: name,
      placeholder,
      disabled,
      className: `w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${inputClassName}`,
      ...(type === 'number' && { step, min, max }),
    };

    if (multiline) {
      return (
        <textarea
          {...commonProps}
          rows={4}
          placeholder={placeholder}
        />
      );
    }

    if (type === 'number') {
      return (
        <input
          {...commonProps}
          type="number"
          onChange={(e) => {
            const value = e.target.value;
            // Convert empty string to undefined, otherwise try to parse as number
            const parsedValue = value === '' ? undefined : parseFloat(value);
            field.onChange(isNaN(parsedValue) ? value : parsedValue);
          }}
          onBlur={(e) => {
            const value = e.target.value;
            // Convert empty string to undefined, otherwise try to parse as number
            const parsedValue = value === '' ? undefined : parseFloat(value);
            field.onBlur();
            field.onChange(isNaN(parsedValue) ? value : parsedValue);
          }}
        />
      );
    }

    return <input {...commonProps} type={type} />;
  };

  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label 
          htmlFor={name} 
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            {renderInput(field)}
            {error && error.message && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default FormField;
