const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildValidationError = (message) => {
  const error = new Error(message);
  error.status = 400;
  error.errors = [];
  return error;
};

const validateSignup = (req, res, next) => {
  const { fullName, email, password } = req.body || {};

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    return next(buildValidationError('Validation error'));
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return next(buildValidationError('Validation error'));
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return next(buildValidationError('Validation error'));
  }

  return next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return next(buildValidationError('Validation error'));
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return next(buildValidationError('Validation error'));
  }

  return next();
};

module.exports = { validateSignup, validateLogin };
