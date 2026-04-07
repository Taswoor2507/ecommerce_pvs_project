import { ChevronLeft, ChevronRight } from "lucide-react";
import IconButton from "./IconButton";
import Button from "./Button";

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
        <IconButton
          icon={ChevronLeft}
          variant="secondary"
          size="md"
          onClick={() => handlePageClick(currentPage - 1)}
          isDisabled={currentPage === 1}
          aria-label="Go to previous page"
          className="border border-gray-300"
        />

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
                <Button
                  onClick={() => handlePageClick(pageNum)}
                  isDisabled={pageNum === currentPage}
                  variant={pageNum === currentPage ? "primary" : "secondary"}
                  size="sm"
                  rounded="lg"
                  className="min-w-[40px]"
                  aria-label={`Go to page ${pageNum}`}
                  aria-current={pageNum === currentPage ? 'page' : undefined}
                  aria-pressed={pageNum === currentPage}
                >
                  {pageNum}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <IconButton
          icon={ChevronRight}
          variant="secondary"
          size="md"
          onClick={() => handlePageClick(currentPage + 1)}
          isDisabled={currentPage === totalPages}
          aria-label="Go to next page"
          className="border border-gray-300"
        />
      </nav>
    </div>
  );
};

export default Pagination;
