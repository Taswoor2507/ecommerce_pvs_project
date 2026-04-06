import { X } from 'lucide-react';
import IconButton from './IconButton';

/**
 * Drawer - A reusable slide-in panel component
 * Used for cart, filters, mobile menus, etc.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the drawer is visible
 * @param {function} props.onClose - Callback when drawer should close
 * @param {ReactNode} props.children - Drawer content
 * @param {string} props.title - Drawer header title
 * @param {ReactNode} props.headerIcon - Icon to show before title
 * @param {ReactNode} props.headerAction - Additional action in header (like item count badge)
 * @param {ReactNode} props.footer - Content for drawer footer
 * @param {string} props.position - 'left' | 'right'
 * @param {string} props.size - 'sm' | 'md' | 'lg' | 'xl' | 'full'
 */
const Drawer = ({
  isOpen,
  onClose,
  children,
  title,
  headerIcon: HeaderIcon,
  headerAction,
  footer,
  position = 'right',
  size = 'md',
  className = '',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full',
  };

  const positionClasses = {
    left: 'left-0 animate-slide-in-left',
    right: 'right-0 animate-slide-in-right',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`
          fixed top-0 h-full w-full ${sizeClasses[size]}
          bg-white shadow-2xl z-50 flex flex-col
          ${positionClasses[position]}
          ${className}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            {HeaderIcon && (
              <HeaderIcon className="w-6 h-6 text-indigo-600" />
            )}
            <h2 
              id="drawer-title" 
              className="text-xl font-bold text-gray-900"
            >
              {title}
            </h2>
            {headerAction}
          </div>
          <IconButton
            icon={X}
            variant="ghost"
            size="md"
            onClick={onClose}
            ariaLabel="Close drawer"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

export default Drawer;
