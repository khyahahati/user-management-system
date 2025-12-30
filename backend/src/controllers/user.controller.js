const { prisma } = require('../config/db');
const { hashPassword, comparePassword } = require('../utils/password');

const buildError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  error.errors = [];
  return error;
};

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user && req.user.userId;

    if (!userId) {
      return next(buildError(401, 'Unauthorized'));
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

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
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user && req.user.userId;

    if (!userId) {
      return next(buildError(401, 'Unauthorized'));
    }

    const { fullName, email } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(buildError(401, 'Unauthorized'));
    }

    const data = {};

    if (typeof fullName !== 'undefined') {
      data.fullName = fullName.trim();
    }

    if (typeof email !== 'undefined') {
      const normalizedEmail = email.trim();

      const existingUser = await prisma.user.findFirst({
        where: {
          email: normalizedEmail,
          NOT: { id: userId }
        }
      });

      if (existingUser) {
        return next(buildError(409, 'Email already exists'));
      }

      data.email = normalizedEmail;
    }

    if (Object.keys(data).length === 0) {
      return next(buildError(400, 'Validation error'));
    }

    await prisma.user.update({
      where: { id: userId },
      data
    });

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    return next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const userId = req.user && req.user.userId;

    if (!userId) {
      return next(buildError(401, 'Unauthorized'));
    }

    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(buildError(401, 'Unauthorized'));
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return next(buildError(401, 'Current password is incorrect'));
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getProfile, updateProfile, updatePassword };
