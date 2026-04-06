import { AlertTriangle, RefreshCw, WifiOff, Search } from "lucide-react";

const ErrorMessage = ({ error, onRetry, className = "" }) => {
  const getErrorMessage = (error) => {
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return "Something went wrong. Please try again.";
  };

  const getErrorStatus = (error) => {
    return error?.response?.status;
  };

  const status = getErrorStatus(error);
  const message = getErrorMessage(error);

  const getErrorContent = () => {
    switch (status) {
      case 404:
        return {
          icon: <Search className="w-12 h-12 text-gray-400" />,
          title: "Not Found",
          description: "The products you're looking for couldn't be found.",
        };
      case 500:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-400" />,
          title: "Server Error",
          description: "Our servers are experiencing issues. Please try again later.",
        };
      case 0:
      case undefined:
        return {
          icon: <WifiOff className="w-12 h-12 text-gray-400" />,
          title: "Network Error",
          description: "Unable to connect to our servers. Check your internet connection.",
        };
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-gray-400" />,
          title: "Something went wrong",
          description: "An unexpected error occurred. Please try again.",
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className={`text-center py-16 ${className}`}>
      <div className="max-w-md mx-auto">
        {/* Error Icon */}
        <div className="mb-6">
          {icon}
        </div>
        
        {/* Error Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        {/* Error Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>

        {/* Additional Error Details */}
        {message && message !== description && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 font-mono">
              {message}
            </p>
          </div>
        )}

        {/* Retry Button */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}

        {/* Status Code */}
        {status && (
          <div className="mt-6 text-xs text-gray-400">
            Error Code: {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
