import { useState } from 'react';
import { ImageOff } from 'lucide-react';

/**
 * A robust Image component that handles broken links gracefully with a fallback placeholder.
 */
const ImageWithFallback = ({ 
  src, 
  alt, 
  className = '', 
  fallbackIcon: Icon = ImageOff,
  ...props 
}) => {
  const [error, setError] = useState(false);

  // If no src is provided, show the fallback immediately
  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}>
        <Icon className="w-1/2 h-1/2 opacity-20" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;
