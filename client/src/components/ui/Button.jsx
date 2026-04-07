import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Button Variants Configuration
 * Follows a consistent design system with clear hierarchy
 */
const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 border-transparent',
  secondary: 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:shadow-sm active:scale-95',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent hover:text-gray-900',
  danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg border-transparent',
  outline: 'bg-transparent text-indigo-600 border-indigo-600 hover:bg-indigo-50',
};

const sizes = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-md',
  md: 'rounded-lg',
  lg: 'rounded-xl',
  full: 'rounded-full',
};

/**
 * Reusable Button Component
 * 
 * @param {Object} props
 * @param {string} props.variant - 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
 * @param {string} props.size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {string} props.rounded - 'none' | 'sm' | 'md' | 'lg' | 'full'
 * @param {boolean} props.isLoading - Show loading spinner
 * @param {boolean} props.isDisabled - Disable button
 * @param {ReactNode} props.leftIcon - Icon before text
 * @param {ReactNode} props.rightIcon - Icon after text
 * @param {boolean} props.fullWidth - Take full width
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  rounded = 'lg',
  isLoading = false,
  isDisabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className = '',
  type = 'button',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const isButtonDisabled = isDisabled || isLoading;

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-semibold
    border-2
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none
    ${variants[variant]}
    ${sizes[size]}
    ${roundedStyles[rounded]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <button
      ref={ref}
      type={type}
      className={baseClasses}
      disabled={isButtonDisabled}
      aria-label={ariaLabel}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}
      {!isLoading && LeftIcon && (
        <span className="inline-flex">{LeftIcon}</span>
      )}
      {children}
      {!isLoading && RightIcon && (
        <span className="inline-flex">{RightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
