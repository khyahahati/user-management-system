const { prisma } = require('../config/db');

const buildError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  error.errors = [];
  return error;
};

const listUsers = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.user.count()
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit) || 1
        }
      }
    });
  } catch (error) {
    return next(error);
  }
};

const activateUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const requesterId = req.user && req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });

    if (!user) {
      return next(buildError(404, 'User not found'));
    }

    if (user.role === 'ADMIN') {
      return next(buildError(400, 'Invalid action'));
    }

    if (user.id === requesterId) {
      return next(buildError(400, 'Invalid action'));
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { status: 'ACTIVE' }
    });

    return res.status(200).json({
      success: true,
      message: 'User activated successfully'
    });
  } catch (error) {
    return next(error);
  }
};

const deactivateUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const requesterId = req.user && req.user.userId;

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });

    if (!user) {
      return next(buildError(404, 'User not found'));
    }

    if (user.role === 'ADMIN') {
      return next(buildError(400, 'Invalid action'));
    }

    if (user.id === requesterId) {
      return next(buildError(400, 'Invalid action'));
    }

    await prisma.user.update({
      where: { id: targetUserId },
      data: { status: 'INACTIVE' }
    });

    return res.status(200).json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { listUsers, activateUser, deactivateUser };
