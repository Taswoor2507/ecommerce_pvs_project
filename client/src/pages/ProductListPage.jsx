import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../api/products.api";
import { useLocation } from "react-router-dom";

import { Plus } from "lucide-react";

import ProductsList from "../components/ProductsList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorMessage from "../components/ui/ErrorMessage";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/ui/Pagination";
import SkeletonSearch from "../components/ui/SkeletonSearch";
import SkeletonCard from "../components/ui/SkeletonCard";
import Button from "../components/ui/Button";
import { useSearchParams } from "react-router";
import { useCallback, useMemo, useEffect, useState } from "react";

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(null);

  // Handle success message from navigation
  useEffect(() => {
    const message = location.state?.message;
    if (message) {
      // Use setTimeout to avoid synchronous setState
      const messageTimer = setTimeout(() => {
        setSuccessMessage(message);
      }, 0);

      const clearTimer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);

      return () => {
        clearTimeout(messageTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [location.state?.message]);

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

    placeholderData: (previousData) => previousData,
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

  // Stable Pagination handler
  const handlePageChange = useCallback(
    (newPage) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set("page", newPage.toString());
        return next;
      }, { replace: true });
    },
    [setSearchParams]
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

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Plus className="w-5 h-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Success
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  {successMessage}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-400 hover:text-green-600"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
        </div>

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
            currentPage={page}
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