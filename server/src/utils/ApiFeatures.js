class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // Mongoose query
    this.queryString = this._sanitizeQueryString(queryString);
  }

  _sanitizeQueryString(queryString) {
    if (!queryString || typeof queryString !== 'object') {
      return {};
    }
    
    // Prevent prototype pollution
    const sanitized = {};
    Object.keys(queryString).forEach(key => {
      if (key !== '__proto__' && key !== 'constructor' && key !== 'prototype') {
        sanitized[key] = queryString[key];
      }
    });
    
    return sanitized;
  }

  search(searchField = "name", allowedFields = ["name"]) {
    if (this.queryString.search) {
      const searchTerm = this.queryString.search.trim();
      
      // Validate search term
      if (this._isSafeSearchTerm(searchTerm)) {
        // Validate search field is in allowed list
        if (allowedFields.includes(searchField)) {
          // Limit regex pattern to prevent ReDoS attacks
          const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          this.query = this.query.find({
            [searchField]: { $regex: escapedTerm, $options: "i" }
          });
        }
      }
    }
    return this;
  }

  filter(allowedFields = []) {
    const filters = {};
    
    // Only allow filtering on whitelisted fields
    allowedFields.forEach(field => {
      // Check for direct field value
      if (this.queryString[field] !== undefined) {
        const value = this.queryString[field];
        
        // Skip potentially dangerous values
        if (this._isSafeFilterValue(value)) {
          filters[field] = value;
        }
      }
      
      // Check for range operators (gt, gte, lt, lte)
      const rangeOperators = ['gt', 'gte', 'lt', 'lte'];
      rangeOperators.forEach(op => {
        const fieldKey = `${field}_${op}`;
        if (this.queryString[fieldKey] !== undefined) {
          const value = this.queryString[fieldKey];
          
          // Validate numeric range values
          if (this._isSafeRangeValue(value)) {
            if (!filters[field]) {
              filters[field] = {};
            }
            filters[field][`$${op}`] = parseFloat(value);
          }
        }
      });
    });
    
    // Only apply filters if there are safe ones
    if (Object.keys(filters).length > 0) {
      this.query = this.query.find(filters);
    }
    
    return this;
  }

  _isSafeFilterValue(value) {
    // Prevent NoSQL injection attempts
    if (typeof value === 'string') {
      // Block MongoDB operators and dangerous patterns
      const dangerousPatterns = [
        /^\$/,           // MongoDB operators like $gt, $lt, $in, etc.
        /\{.*\}/,        // Object notation
        /\[/,            // Array notation
        /javascript:/i,  // JavaScript protocol
        /<script/i,      // Script tags
        /eval/i,         // eval() attempts
        /function/i,     // function() attempts
        /__proto__/i,    // Prototype pollution
        /constructor/i,  // Constructor pollution
      ];
      
      return !dangerousPatterns.some(pattern => pattern.test(value));
    }
    
    // Allow safe primitive types
    return typeof value === 'number' || typeof value === 'boolean';
  }

  _isSafeRangeValue(value) {
    // Only allow numeric values for range operations
    if (typeof value === 'number') {
      return !isNaN(value) && isFinite(value);
    }
    
    if (typeof value === 'string') {
      // Check if it's a valid number string
      const numValue = value.trim();
      
      // Block dangerous patterns
      const dangerousPatterns = [
        /^\$/,           // MongoDB operators
        /\{.*\}/,        // Object notation
        /\[/,            // Array notation
        /javascript:/i,  // JavaScript protocol
        /<script/i,      // Script tags
        /eval/i,         // eval() attempts
        /__proto__/i,    // Prototype pollution
        /constructor/i,  // Constructor pollution
        /[^^\d\.-]/,     // Only allow digits, dots, and minus signs (improved)
      ];
      
      if (dangerousPatterns.some(pattern => pattern.test(numValue))) {
        return false;
      }
      
      // Validate it's a proper number
      const parsed = parseFloat(numValue);
      return !isNaN(parsed) && isFinite(parsed);
    }
    
    return false;
  }

  _isSafeSearchTerm(term) {
    // Prevent empty or extremely long search terms
    if (!term || term.length > 100) {
      return false;
    }
    
    // Block dangerous patterns in search
    const dangerousPatterns = [
      /javascript:/i,
      /<script/i,
      /\{.*\}/,
      /\[/,
      /eval/i,
      /__proto__/i,
      /constructor/i,
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(term));
  }

  paginate(defaultLimit = 20, maxLimit = 100) {
    const page = Math.max(1, parseInt(this.queryString.page) || 1);
    const limit = Math.min(maxLimit, Math.max(1, parseInt(this.queryString.limit) || defaultLimit));
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }

  sort(defaultSort = "-createdAt", allowedFields = ["createdAt", "updatedAt", "name", "base_price"]) {
    const sortField = this.queryString.sort || defaultSort;
    
    // Validate sort field
    if (this._isSafeSortField(sortField, allowedFields)) {
      this.query = this.query.sort(sortField);
    } else {
      this.query = this.query.sort(defaultSort);
    }
    
    return this;
  }

  _isSafeSortField(sortField, allowedFields) {
    // Only allow sorting on whitelisted fields
    const field = sortField.replace(/^[-+]/, ''); // Remove sort direction
    return allowedFields.includes(field);
  }
}

export default ApiFeatures;