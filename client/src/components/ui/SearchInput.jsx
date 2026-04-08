import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = ({
  value,
  onChange,
  placeholder = 'Search…',
  debounceMs = 300,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    timerRef.current = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [localValue, debounceMs, onChange]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-9 py-2.5
          bg-white border border-slate-200 rounded-xl
          text-sm text-slate-900 placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400
          transition-all duration-200
        "
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
