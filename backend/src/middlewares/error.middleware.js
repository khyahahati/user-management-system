const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  const errors = Array.isArray(err.errors) ? err.errors : [];

  return res.status(status).json({
    success: false,
    message,
    errors
  });
};

module.exports = errorMiddleware;
