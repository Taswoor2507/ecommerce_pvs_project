const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Title Skeleton */}
        <div className="h-6 bg-gray-200 rounded-lg w-3/4" />
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        
        {/* Price and Button Skeleton */}
        <div className="flex items-center justify-between pt-3">
          <div className="h-8 bg-gray-200 rounded w-20" />
          <div className="h-10 bg-gray-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
