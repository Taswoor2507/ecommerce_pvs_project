/**
 * Badge - A reusable label/tag component
 * Used for status indicators, counts, labels, etc.
 * 
 * @param {Object} props
 * @param {ReactNode} props.children - Badge content
 * @param {string} props.variant - 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
 * @param {string} props.size - 'sm' | 'md' | 'lg'
 * @param {boolean} props.roundedFull - Use fully rounded corners (pill shape)
 * @param {ReactNode} props.leftIcon - Icon before text
 * @param {ReactNode} props.rightIcon - Icon after text
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  roundedFull = true,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
}) => {
  const variants = {
    primary: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    secondary: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const baseClasses = `
    inline-flex items-center gap-1.5
    font-semibold
    border
    ${roundedFull ? 'rounded-full' : 'rounded-md'}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <span className={baseClasses}>
      {LeftIcon && (
        <LeftIcon className="w-3.5 h-3.5" />
      )}
      {children}
      {RightIcon && (
        <RightIcon className="w-3.5 h-3.5" />
      )}
    </span>
  );
};

export default Badge;
