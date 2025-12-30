const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const buildValidationError = (message) => {
  const error = new Error(message);
  error.status = 400;
  error.errors = [];
  return error;
};

const validateUpdateProfile = (req, res, next) => {
  const { fullName, email } = req.body || {};

  if (typeof fullName === 'undefined' && typeof email === 'undefined') {
    return next(buildValidationError('Validation error'));
  }

  if (typeof fullName !== 'undefined') {
    if (typeof fullName !== 'string' || fullName.trim().length === 0) {
      return next(buildValidationError('Validation error'));
    }
  }

  if (typeof email !== 'undefined') {
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      return next(buildValidationError('Validation error'));
    }
  }

  return next();
};

const validateChangePassword = (req, res, next) => {
  const { currentPassword, newPassword } = req.body || {};

  if (typeof currentPassword !== 'string' || currentPassword.length < 8) {
    return next(buildValidationError('Validation error'));
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return next(buildValidationError('Validation error'));
  }

  return next();
};

module.exports = { validateUpdateProfile, validateChangePassword };