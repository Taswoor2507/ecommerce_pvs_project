import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import LoadingSpinner from "./ui/LoadingSpinner";

const SearchBar = ({ onSearch, isLoading = false, className = "" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const lastSearchTerm = useRef("");
  const isClearing = useRef(false);

  // Production-level debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized search callback to prevent unnecessary calls
  const handleSearchChange = useCallback((term) => {
    // Only trigger search if the term actually changed from the last search
    // AND we're not in the middle of clearing
    if (term !== lastSearchTerm.current && !isClearing.current) {
      lastSearchTerm.current = term;
      onSearch(term.trim());
    }
  }, [onSearch]);

  // Trigger search when debounced term changes
  useEffect(() => {
    if (debouncedSearchTerm !== undefined && !isClearing.current) {
      handleSearchChange(debouncedSearchTerm);
    }
    // Reset clearing flag after debounce
    isClearing.current = false;
  }, [debouncedSearchTerm, handleSearchChange]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleClear = () => {
    // Store the current search term
    const currentSearchTerm = lastSearchTerm.current;
    
    // Only proceed if there was actually a search term
    if (currentSearchTerm !== "") {
      // Set clearing flag to prevent debounced effect
      isClearing.current = true;
      
      // Update last search term to prevent duplicate calls
      lastSearchTerm.current = "";
      
      // Clear the input immediately
      setSearchTerm("");
      
      // Trigger search immediately (skip debouncing for clear action)
      onSearch("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearchChange(searchTerm);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Container */}
      <div className={`
        relative bg-white rounded-2xl shadow-lg border transition-all duration-300 overflow-hidden
        ${isFocused 
          ? 'shadow-xl border-indigo-300 ring-4 ring-indigo-100 scale-[1.02]' 
          : 'shadow-md border-gray-200 hover:shadow-lg'
        }
      `}>
        <form onSubmit={handleSubmit} className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Search className={`w-5 h-5 transition-all duration-300 ${isFocused ? 'text-indigo-600 scale-110' : 'text-gray-400'}`} />
            )}
          </div>
          
          {/* Search Input */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search for products..."
            className="block w-full pl-14 pr-14 py-4 text-lg border-0 rounded-2xl bg-transparent placeholder-gray-400 focus:outline-none transition-all duration-300"
          />
          
          {/* Clear Button */}
          {searchTerm && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 transition-all duration-200 hover:scale-110"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </form>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 blur transition-opacity duration-300 -z-10" />
    </div>
  );
};

export default SearchBar;
