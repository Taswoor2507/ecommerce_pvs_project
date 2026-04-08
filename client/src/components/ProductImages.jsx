import { useState, useCallback } from 'react';
import ImageWithFallback from './ui/ImageWithFallback';
import { ZoomIn, Package } from 'lucide-react';

const ProductImages = ({ 
  image, 
  productName = 'Product',
  className = '' 
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleZoom = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  return (
    <div className={className}>
      {/* Main Image Container */}
      <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square group">
        <ImageWithFallback
          src={image}
          alt={productName}
          className={`
            w-full h-full object-cover transition-transform duration-500
            ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}
          `}
          onClick={toggleZoom}
          fallbackIcon={Package}
        />

        {/* Zoom Overlay */}
        {!isZoomed && (
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={toggleZoom}
              className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
              aria-label="Zoom image"
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImages;
