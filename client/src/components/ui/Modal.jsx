import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import IconButton from './IconButton';

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-[calc(100vw-2rem)]',
};

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  className = '',
}) => {
  const overlayRef = useRef(null);
  const previousFocusRef = useRef(null);

  const handleEsc = useCallback(
    (e) => {
      if (closeOnEsc && e.key === 'Escape') onClose();
    },
    [closeOnEsc, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleEsc);
      previousFocusRef.current?.focus?.();
    };
  }, [isOpen, handleEsc]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`
          w-full ${sizeClasses[size]}
          bg-white rounded-2xl shadow-2xl
          transform transition-all duration-200
          animate-in zoom-in-95 fade-in duration-200
          ${className}
        `}
      >
        {(title || showCloseButton) && (
          <div className="flex items-start justify-between p-6 pb-0">
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-slate-500">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <IconButton
                icon={X}
                variant="ghost"
                size="sm"
                onClick={onClose}
                ariaLabel="Close dialog"
              />
            )}
          </div>
        )}

        <div className="p-6">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3 px-6 pb-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
