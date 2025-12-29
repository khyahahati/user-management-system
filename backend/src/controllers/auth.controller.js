const { prisma } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');
const { signToken } = require('../utils/jwt');

const buildError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  error.errors = [];
  return error;
};

const signup = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return next(buildError(409, 'Email already exists'));
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE'
      }
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return next(buildError(401, 'Invalid credentials'));
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return next(buildError(401, 'Invalid credentials'));
    }

    if (user.status === 'INACTIVE') {
      return next(buildError(403, 'User is inactive'));
    }

    const token = signToken({ userId: user.id, role: user.role });

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    return res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          status: user.status
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return next(buildError(401, 'Unauthorized'));
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) {
      return next(buildError(401, 'Unauthorized'));
    }

    return res.status(200).json({
      success: true,
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { login, signup, getCurrentUser };
