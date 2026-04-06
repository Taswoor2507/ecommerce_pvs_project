import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products.api";

import ProductsList from "../components/ProductsList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/ui/Pagination";
import SkeletonSearch from "../components/ui/SkeletonSearch";
import SkeletonCard from "../components/ui/SkeletonCard";
import { useSearchParams } from "react-router";
import { useCallback, useMemo } from "react";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // SINGLE SOURCE OF TRUTH (URL only)
  const page = useMemo(() => {
    const p = parseInt(searchParams.get("page"));
    return isNaN(p) || p < 1 ? 1 : p;
  }, [searchParams]);

  const searchTerm = useMemo(() => {
    return searchParams.get("search") || "";
  }, [searchParams]);

  // React Query (optimized)
  const {
    data: productsData,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", searchTerm, page],
    queryFn: () =>
      productsApi.list({
        search: searchTerm,
        page,
        limit: 12,
      }),

    // 🔥 BEST PRACTICE
    keepPreviousData: true, // smooth pagination
    staleTime: 1000 * 30, // 30 sec cache

    retry: (failureCount, err) => {
      const status = err?.response?.status;
      if ([400, 401, 403, 404].includes(status)) return false;
      return failureCount < 2;
    },
  });

  //  Update URL helper (clean)
  const updateParams = useCallback(
    (params) => {
      const newParams = {
        ...(searchTerm && { search: searchTerm }),
        page,
        ...params,
      };

      // remove empty search
      if (!newParams.search) delete newParams.search;

      setSearchParams(newParams);
    },
    [searchTerm, page, setSearchParams]
  );

  // Search handler
  const handleSearch = useCallback(
    (newSearchTerm) => {
      if (newSearchTerm === searchTerm) return;

      updateParams({
        search: newSearchTerm || undefined,
        page: 1,
      });
    },
    [searchTerm, updateParams]
  );

  //  Pagination handler
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage === page || newPage < 1) return;

      updateParams({ page: newPage });

      //  No hack
      // window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [page, updateParams]
  );

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ErrorMessage
          error={error}
          onRetry={refetch}
          className="container mx-auto px-4 py-8"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">

        {/* 🔍 Search */}
        <div className="mb-10">
          {isLoading && !searchTerm ? (
            <SkeletonSearch />
          ) : (
            <SearchBar
              value={searchTerm} // ✅ controlled input
              onSearch={handleSearch}
              isLoading={isFetching}
            />
          )}
        </div>

        {/* Searching indicator */}
        {isFetching && searchTerm && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full shadow border">
              <LoadingSpinner size="sm" className="mr-2" />
              <span className="text-sm text-gray-600">
                Searching "{searchTerm}"...
              </span>
            </div>
          </div>
        )}

        {/* Products */}
        {isLoading && !searchTerm ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <ProductsList
            products={productsData?.products || []}
            isLoading={isFetching}
          />
        )}

        {/*  Pagination */}
        {productsData?.pagination && (
          <Pagination
            pagination={productsData.pagination}
            onPageChange={handlePageChange}
            className="mt-12"
          />
        )}

        {/* Results */}
        {productsData?.products && productsData?.pagination && !isLoading && (
          <div className="mt-10 text-center">
            <div className="inline-flex items-center px-5 py-2 bg-white rounded-full shadow border">
              <span className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">
                  {productsData.products.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {productsData.pagination.total}
                </span>{" "}
                products
                {searchTerm && (
                  <span>
                    {" "}for{" "}
                    <span className="text-indigo-600 font-medium">
                      "{searchTerm}"
                    </span>
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