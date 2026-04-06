import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products.api";
import ProductsList from "../components/ProductsList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/ui/Pagination";
import SkeletonSearch from "../components/ui/SkeletonSearch";
import SkeletonCard from "../components/ui/SkeletonCard";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get page and search from URL, fallback to defaults
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const searchFromUrl = searchParams.get('search') || '';
  
  // Sync URL params to state during render (React allows this pattern)
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);
  const [page, setPage] = useState(pageFromUrl);
  
  // Keep state in sync with URL params
  if (page !== pageFromUrl) {
    setPage(pageFromUrl);
  }
  if (searchTerm !== searchFromUrl) {
    setSearchTerm(searchFromUrl);
  }

  const {
    data: productsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["products", searchTerm, page],
    queryFn: () => productsApi.list({ 
      search: searchTerm, 
      page,
      limit: 12 
    }),
    staleTime: 0, // Always fetch fresh data for pagination
    gcTime: 1000 * 60 * 2, // 2 minutes cache
    retry: (failureCount, error) => {
      // Don't retry on 404, 403
      const status = error?.response?.status;
      if ([404, 403].includes(status)) return false;
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  // Use useCallback to prevent unnecessary re-renders
  const handleSearch = useCallback((newSearchTerm) => {
    // Only trigger search if the term actually changed
    if (newSearchTerm !== searchTerm) {
      setSearchTerm(newSearchTerm);
      setPage(1); // Reset to first page when searching
      // Update URL with new search and reset page
      setSearchParams({ 
        ...(newSearchTerm && { search: newSearchTerm }),
        page: 1 
      });
    }
  }, [searchTerm, setSearchParams]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage !== page && newPage >= 1) {
      setPage(newPage);
      // Update URL with new page
      setSearchParams({ 
        ...(searchTerm && { search: searchTerm }),
        page: newPage 
      });
      
      // Scroll after a small delay to ensure state updates
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [page, searchTerm, setSearchParams]);


  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <ErrorMessage 
          error={error} 
          onRetry={() => refetch()}
          className="container mx-auto px-4 py-8"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-12">
          {isLoading && !searchTerm ? (
            <SkeletonSearch />
          ) : (
            <SearchBar 
              onSearch={handleSearch}
              isLoading={isFetching}
              className="relative"
            />
          )}
        </div>

        {/* Loading State for Search */}
        {isFetching && searchTerm && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
              <LoadingSpinner size="sm" className="mr-2" />
              <span className="text-sm text-gray-600">Searching...</span>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {isLoading && !searchTerm ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <ProductsList 
            products={productsData?.products || []}
            isLoading={isFetching}
          />
        )}
        
        {/* Pagination */}
        {productsData?.pagination && (
          <Pagination
            pagination={productsData.pagination}
            onPageChange={handlePageChange}
            className="mt-16"
          />
        )}

        {/* Results Info */}
        {productsData?.products && productsData?.pagination && !isLoading && (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 bg-white rounded-full shadow-sm border border-gray-200">
              <span className="text-sm text-gray-600">
                Showing 
                <span className="font-semibold text-gray-900 mx-1">
                  {productsData.products.length}
                </span>
                of 
                <span className="font-semibold text-gray-900 mx-1">
                  {productsData.pagination.total}
                </span>
                products
                {searchTerm && (
                  <span className="ml-2">
                    for "<span className="font-medium text-indigo-600">{searchTerm}</span>"
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductListPage;
