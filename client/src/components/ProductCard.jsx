import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

const ProductCard = ({ product, className = "" }) => {
  const {
    id,
    name,
    description,
    base_price,
    image,
    variant_type_count,
    stock,
  } = product;

  // Determine stock status for non-variant products
  const isOutOfStock = variant_type_count === 0 && stock <= 0;

  // Handle image fallback - use backend default or fallback image
  const handleImageError = (e) => {
    // Try backend default first, then fallback
    if (!e.target.src.includes('t-shirt-mockup')) {
      e.target.src = "https://www.inkfactory.pk/wp-content/uploads/2019/08/T-Shirt-Mockup-007.jpg";
    } else {
      e.target.src = "https://www.ub.edu/edicions13l/wp-content/themes/koji/assets/images/default-fallback-image.png";
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100 ${className}`}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Variant Badge */}
        {variant_type_count > 0 ? (
          <div className="absolute top-3 right-3 shadow-lg">
            <Badge variant="primary" size="sm" roundedFull>
              {variant_type_count} {variant_type_count === 1 ? 'Variant' : 'Variants'}
            </Badge>
          </div>
        ) : (
          <div className="absolute top-3 right-3 shadow-lg">
            <Badge variant={stock > 0 ? "success" : "danger"} size="sm" roundedFull>
              {stock > 0 ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>
        )}

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <Link to={`/products/${id}`}>
            <Button variant="secondary" size="md" rounded="full">
              View Details
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Product Name */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 hover:text-indigo-600 transition-colors leading-tight">
            <Link to={`/products/${id}`} className="block">
              {name}
            </Link>
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
          {description || "Discover this amazing product with premium quality and great value."}
        </p>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(base_price)}
            </span>
            {variant_type_count > 0 && (
              <span className="text-xs text-gray-500 font-medium">
                Starting from
              </span>
            )}
          </div>
          
          <Link to={`/products/${id}`}>
            <Button variant="primary" size="sm" isDisabled={isOutOfStock}>
              {isOutOfStock ? "Out of Stock" : "View"}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
