const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const unauthorizedError = () => {
  const error = new Error('Unauthorized');
  error.status = 401;
  error.errors = [];
  return error;
};

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(unauthorizedError());
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (err) {
    return next(unauthorizedError());
  }
};

module.exports = authMiddleware;
