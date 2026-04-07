import { AlertTriangle, X } from 'lucide-react';

/**
 * Reusable Form Error Component
 * Displays form-level errors with dismiss functionality
 */
const FormError = ({ 
  error, 
  onDismiss, 
  className = '',
  variant = 'error' // 'error' | 'warning' | 'info'
}) => {
  // Handle error objects and strings
  const errorMessage = error?.message || error;
  if (!errorMessage) return null;

  const variants = {
    error: {
      container: 'bg-red-50 border-red-200',
      icon: 'text-red-400',
      title: 'text-red-800',
      message: 'text-red-700',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-400',
      title: 'text-yellow-800',
      message: 'text-yellow-700',
    },
    info: {
      container: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      message: 'text-blue-700',
    },
  };

  const styles = variants[variant];

  return (
    <div className={`p-4 border rounded-lg ${styles.container} ${className}`}>
      <div className="flex">
        <div className="shrink-0">
          <AlertTriangle className={`w-5 h-5 ${styles.icon}`} />
        </div>
        <div className="ml-3 flex-1">
          <h3 className={`text-sm font-medium ${styles.title}`}>
            {variant === 'error' ? 'Error' : variant === 'warning' ? 'Warning' : 'Info'}
          </h3>
          <p className={`mt-1 text-sm ${styles.message}`}>
            {errorMessage}
          </p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className={`${styles.icon} hover:opacity-70 transition-opacity`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormError;
