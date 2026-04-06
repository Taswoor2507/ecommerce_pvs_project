import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ pagination, onPageChange, className = "" }) => {
  const { page: currentPage, pages: totalPages, total, limit } = pagination;

  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  const handlePageClick = (newPage) => {
    // Validate the page number
    if (typeof newPage !== 'number' || newPage < 1 || newPage > totalPages) {
      return;
    }

    // Don't do anything if clicking the same page
    if (newPage === currentPage) {
      return;
    }
    
    // Call the parent's page change handler
    onPageChange(newPage);
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Results Info */}
      <div className="text-sm text-gray-700 font-medium">
        Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, total)} of {total} results
      </div>

      {/* Pagination Controls */}
      <nav className="flex items-center space-x-1" role="navigation" aria-label="Pagination navigation">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            p-2 rounded-lg border transition-all duration-200 font-medium text-sm
            ${currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:shadow-sm active:scale-95'
            }
          `}
          aria-label="Go to previous page"
          aria-disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {visiblePages.map((pageNum, index) => (
            <div key={`page-${pageNum}-${index}`}>
              {pageNum === '...' ? (
                <span 
                  className="px-3 py-2 text-gray-500 font-medium" 
                  aria-hidden="true"
                >
                  ...
                </span>
              ) : (
                <button
                  onClick={() => handlePageClick(pageNum)}
                  disabled={pageNum === currentPage}
                  className={`
                    px-3 py-2 rounded-lg border transition-all duration-200 font-medium text-sm
                    ${pageNum === currentPage
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md cursor-default'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:shadow-sm active:scale-95 cursor-pointer'
                    }
                  `}
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                  aria-pressed={pageNum === currentPage}
                >
                  {pageNum}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            p-2 rounded-lg border transition-all duration-200 font-medium text-sm
            ${currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
              : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:shadow-sm active:scale-95'
            }
          `}
          aria-label="Go to next page"
          aria-disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
