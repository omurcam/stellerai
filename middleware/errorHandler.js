// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let error = err.message;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  } else if (err.message.includes('not found')) {
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.message.includes('duplicate') || err.message.includes('unique')) {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (err.message.includes('unauthorized') || err.message.includes('permission')) {
    statusCode = 403;
    message = 'Access forbidden';
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'production' ? undefined : error,
    timestamp: new Date().toISOString()
  });
};