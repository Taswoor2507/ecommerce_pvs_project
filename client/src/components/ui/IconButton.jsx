import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * IconButton - A button that only contains an icon
 * Useful for actions like close, delete, edit, etc.
 */
const variants = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300',
  ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700',
  danger: 'bg-transparent text-red-500 hover:bg-red-50 hover:text-red-600',
};

const sizes = {
  xs: 'p-1',
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
  xl: 'p-3',
};

const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
  xl: 'w-6 h-6',
};

/**
 * Reusable IconButton Component
 * 
 * @param {Object} props
 * @param {ReactNode} props.icon - The icon element to render
 * @param {string} props.variant - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {string} props.size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} props.isLoading - Show loading spinner instead of icon
 * @param {boolean} props.isDisabled - Disable button
 * @param {string} props.ariaLabel - Accessibility label (required for icon buttons)
 */
const IconButton = forwardRef(({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  ariaLabel,
  className = '',
  ...props
}, ref) => {
  const isButtonDisabled = isDisabled || isLoading;

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
    disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <button
      ref={ref}
      type="button"
      className={baseClasses}
      disabled={isButtonDisabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : (
        Icon && <Icon className={iconSizes[size]} />
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
