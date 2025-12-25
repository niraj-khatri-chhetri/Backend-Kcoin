const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error(err);

  // Yup Validation Error
  if (err.name === 'ValidationError') {
    const message = err.errors ? err.errors.join(', ') : 'Validation Error';
    error = {
      statusCode: 400,
      message,
      errors: err.errors,
      type: 'ValidationError',
    };
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} already exists`;
    error = {
      statusCode: 400,
      message,
      type: 'DuplicateError',
    };
  }

  // Mongoose validation error
  if (err.name === 'ValidatorError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    error = {
      statusCode: 400,
      message,
      type: 'MongooseValidationError',
    };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = {
      statusCode: 401,
      message: 'Invalid token',
      type: 'JWTError',
    };
  }

  if (err.name === 'TokenExpiredError') {
    error = {
      statusCode: 419,
      message: 'Token expired',
      type: 'JWTError',
    };
  }

  // Cast Error (Invalid ObjectId)
  if (err.name === 'CastError') {
    error = {
      statusCode: 400,
      message: 'Invalid ID format',
      type: 'CastError',
    };
  }

  // Default to 500 server error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';

  // Ensure statusCode is a valid number
  if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
    console.error('Invalid status code:', statusCode);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal Server Error',
      errors: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      type: error.type || 'ServerError',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      ...(error.errors && { details: error.errors }),
    },
  });
};

export default errorHandler;
