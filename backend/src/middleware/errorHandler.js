const { ZodError } = require('zod');
const mongoose = require('mongoose');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const config = require('../config');

function errorHandler(err, req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.flatten();
  } else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message]));
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err && err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate resource';
    details = err.keyValue;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  const payload = {
    success: false,
    message,
    ...(details && { details }),
    ...(config.isProd ? {} : { stack: err.stack }),
  };

  if (statusCode >= 500) logger.error({ err, path: req.originalUrl }, message);
  else logger.warn({ statusCode, path: req.originalUrl, message });

  res.status(statusCode).json(payload);
}

module.exports = { errorHandler, ApiError };
