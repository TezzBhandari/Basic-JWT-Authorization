const createError = require('http-errors');

// 404 Error Handler
const notFoundError = (req, res, next) => {
  next(
    createError(
      404,
      `The requested URL ${req.url} was not found on this server`
    )
  );
};

// Custom Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || `Internal Server Error`,
  });
};

module.exports = {
  notFoundError,
  errorHandler,
};
