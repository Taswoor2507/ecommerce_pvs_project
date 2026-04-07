// Search utility functions for sharing between components

export const createSearchState = () => {
  let searchTerm = '';
  let isSearching = false;
  let listeners = [];

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const notify = () => {
    listeners.forEach(listener => listener({ searchTerm, isSearching }));
  };

  const handleSearch = (term) => {
    searchTerm = term;
    isSearching = !!term.trim();
    notify();
  };

  const clearSearch = () => {
    searchTerm = '';
    isSearching = false;
    notify();
  };

  const getState = () => ({ searchTerm, isSearching });

  return {
    subscribe,
    handleSearch,
    clearSearch,
    getState
  };
};

// Create a singleton search state
export const searchState = createSearchState();
