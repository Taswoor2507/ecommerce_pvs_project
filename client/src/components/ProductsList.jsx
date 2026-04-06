import ProductCard from "./ProductCard";
import SkeletonCard from "./ui/SkeletonCard";

const ProductsList = ({ products, isLoading = false, className = "" }) => {
  if (!products || products.length === 0) {
    return (
      <div className={`text-center py-20 ${className}`}>
        <div className="max-w-md mx-auto">
          {/* Empty State Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            No products found
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Try adjusting your search terms to find what you're looking for.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product}
          className={isLoading ? "opacity-75" : ""}
        />
      ))}
    </div>
  );
};

export default ProductsList;
