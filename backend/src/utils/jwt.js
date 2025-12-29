const jwt = require('jsonwebtoken');
const { env } = require('../config/env');

const signToken = (payload, options = {}) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    ...options
  });
};

const verifyToken = (token, options = {}) => {
  return jwt.verify(token, env.jwtSecret, options);
};

module.exports = { signToken, verifyToken };
