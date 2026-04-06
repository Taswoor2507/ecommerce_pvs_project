const SkeletonSearch = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          {/* Search Icon Skeleton */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
          </div>
          
          {/* Input Skeleton */}
          <div className="w-full h-12 bg-gray-200 rounded-lg pl-12 pr-4" />
          
          {/* Clear Button Skeleton */}
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonSearch;
