export const errorHandler = (err, req, res, next) => {

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
  });
};