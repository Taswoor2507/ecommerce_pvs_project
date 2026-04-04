export const errorHandler = (err, req, res, next) => {

  // Handle MongoDB duplicate key errors globally
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern)[0];
    const duplicateValue = err.keyValue[duplicateField];
    
    // Handle specific duplicate cases
    if (duplicateField === 'name') {
      return res.status(409).json({
        success: false,
        message: `A record with '${duplicateValue}' already exists`,
      });
    }
    
    // Handle option duplicate (variant_type_id + value combination)
    if (err.keyPattern.variant_type_id && err.keyPattern.value) {
      const optionValue = err.keyValue.value;
      return res.status(409).json({
        success: false,
        message: `Option '${optionValue}' already exists for this variant type`,
      });
    }
    
    // Handle variant type duplicate (product_id + name combination)
    if (err.keyPattern.product_id && err.keyPattern.name) {
      const variantName = err.keyValue.name;
      return res.status(409).json({
        success: false,
        message: `Variant type '${variantName}' already exists for this product`,
      });
    }
    
    return res.status(409).json({
      success: false,
      message: `Duplicate entry: ${duplicateField} '${duplicateValue}' already exists`,
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: `Validation error: ${messages.join(', ')}`,
    });
  }

  // Handle Cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Unknown or programming errors
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};