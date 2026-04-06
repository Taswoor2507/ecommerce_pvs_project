export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '-';
  }
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number, locale = 'en-US') => {
  if (number === null || number === undefined || isNaN(number)) {
    return '-';
  }
  
  return new Intl.NumberFormat(locale).format(number);
};

export const formatDate = (date, locale = 'en-US', options = {}) => {
  if (!date) return '-';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
};
