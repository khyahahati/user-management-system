const forbiddenError = () => {
  const error = new Error('Forbidden');
  error.status = 403;
  error.errors = [];
  return error;
};

const roleMiddleware = (requiredRole) => (req, res, next) => {
  if (!req.user || req.user.role !== requiredRole) {
    return next(forbiddenError());
  }

  return next();
};

module.exports = roleMiddleware;
