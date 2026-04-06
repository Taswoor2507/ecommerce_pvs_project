import { useState, useCallback } from 'react';
import { ZoomIn } from 'lucide-react';

const ProductImages = ({ 
  image, 
  productName = 'Product',
  className = '' 
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Fallback image if fails
  const fallbackImage = 'https://www.inkfactory.pk/wp-content/uploads/2019/08/T-Shirt-Mockup-007.jpg';
  const placeholderImage = 'https://www.ub.edu/edicions13l/wp-content/themes/koji/assets/images/default-fallback-image.png';

  const currentImage = image || fallbackImage;

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const toggleZoom = useCallback(() => {
    setIsZoomed(prev => !prev);
  }, []);

  return (
    <div className={className}>
      {/* Main Image Container */}
      <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square group">
        <img
          src={imageError ? placeholderImage : currentImage}
          alt={productName}
          className={`
            w-full h-full object-cover transition-transform duration-500
            ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}
          `}
          onError={handleImageError}
          onClick={toggleZoom}
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
