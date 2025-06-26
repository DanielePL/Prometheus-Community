// server/src/middleware/errorHandler.js
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.name}: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    user: req.user ? req.user._id : 'anonymous'
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = {
      name: 'ValidationError',
      message,
      statusCode: 404
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    error = {
      name: 'DuplicateError',
      message,
      statusCode: 400
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = {
      name: 'ValidationError',
      message,
      statusCode: 400
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      name: 'AuthenticationError',
      message: 'Invalid token',
      statusCode: 401
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      name: 'AuthenticationError',
      message: 'Token expired',
      statusCode: 401
    };
  }

  // File upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = {
      name: 'FileUploadError',
      message: 'File size too large',
      statusCode: 413
    };
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    error = {
      name: 'FileUploadError',
      message: 'Too many files uploaded',
      statusCode: 400
    };
  }

  // Custom application errors
  if (err.isOperational) {
    error.statusCode = err.statusCode || 500;
    error.message = err.message;
  }

  // Default error response
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Prepare error response
  const errorResponse = {
    success: false,
    error: {
      name: error.name || 'ServerError',
      message,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: error
      })
    }
  };

  // Add specific fields for validation errors
  if (error.name === 'ValidationError' && err.errors) {
    errorResponse.error.fields = Object.keys(err.errors).reduce((acc, field) => {
      acc[field] = err.errors[field].message;
      return acc;
    }, {});
  }

  // Don't leak error details in production for 5xx errors
  if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
    errorResponse.error.message = 'Something went wrong on our end. Please try again later.';
    delete errorResponse.error.stack;
    delete errorResponse.error.details;
  }

  res.status(statusCode).json(errorResponse);
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Not found middleware
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  AppError,
  asyncHandler,
  notFound
};
