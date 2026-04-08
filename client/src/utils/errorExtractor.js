/**
 * Safely extracts the most meaningful error message from an API response
 * Handles:
 * 1. backend message field
 * 2. structured errors object (validation errors)
 * 3. axios generic error message
 * 4. fallback message
 */
export const extractErrorMessage = (error, fallback = 'An unexpected error occurred') => {
  if (!error) return fallback;

  const responseData = error.response?.data;
  
  // 1. Check for explicit message
  if (responseData?.message) {
    return responseData.message;
  }

  // 2. Check for validation errors object
  if (responseData?.errors && typeof responseData.errors === 'object') {
    const errorValues = Object.values(responseData.errors);
    if (errorValues.length > 0) {
      // If the error is a nested object or array, handle accordingly
      const firstError = errorValues[0];
      return typeof firstError === 'string' ? firstError : JSON.stringify(firstError);
    }
  }

  // 3. Fallback to axios error message
  if (error.message && error.message !== 'Network Error') {
    return error.message;
  }

  return fallback;
};
