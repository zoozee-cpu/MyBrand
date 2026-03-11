'use strict';

/**
 * Global error handler middleware
 * Must be registered LAST in Express middleware chain
 */
function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV !== 'production';

  console.error('[Error]', err.message);
  if (isDev) console.error(err.stack);

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, error: messages.join(', ') });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format.' });
  }

  // JSON parse error
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, error: 'Invalid JSON in request body.' });
  }

  // Default 500
  res.status(err.statusCode || 500).json({
    success: false,
    error: isDev ? err.message : 'An internal server error occurred.'
  });
}

module.exports = errorHandler;
