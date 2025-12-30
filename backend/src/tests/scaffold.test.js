process.env.PORT = process.env.PORT || '4000';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

const test = require('node:test');
const assert = require('node:assert');

const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const { prisma } = require('../config/db');
const { hashPassword } = require('../utils/password');

const createMockRes = () => {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    }
  };
};

test('signup success returns confirmation message', async () => {
  const originalFindUnique = prisma.user.findUnique;
  const originalCreate = prisma.user.create;

  prisma.user.findUnique = async () => null;
  prisma.user.create = async ({ data }) => ({
    id: 'generated-id',
    ...data
  });

  const req = {
    body: {
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'StrongPass@123'
    }
  };

  const res = createMockRes();

  try {
    await authController.signup(req, res, (err) => {
      if (err) {
        throw err;
      }
    });

    assert.strictEqual(res.statusCode, 201);
    assert.deepStrictEqual(res.body, {
      success: true,
      message: 'User registered successfully'
    });
  } finally {
    prisma.user.findUnique = originalFindUnique;
    prisma.user.create = originalCreate;
  }
});

test('login with invalid password returns error', async () => {
  const originalFindUnique = prisma.user.findUnique;
  const originalUpdate = prisma.user.update;

  const hashedPassword = await hashPassword('CorrectPass@123');

  prisma.user.findUnique = async () => ({
    id: 'user-id',
    fullName: 'Jane Doe',
    email: 'jane@example.com',
    password: hashedPassword,
    role: 'USER',
    status: 'ACTIVE'
  });

  prisma.user.update = async () => ({
    id: 'user-id'
  });

  const req = {
    body: {
      email: 'jane@example.com',
      password: 'WrongPass@123'
    }
  };

  const res = createMockRes();
  let capturedError = null;

  try {
    await authController.login(req, res, (err) => {
      capturedError = err;
    });

    assert.ok(capturedError);
    assert.strictEqual(capturedError.status, 401);
    assert.strictEqual(capturedError.message, 'Invalid credentials');
  } finally {
    prisma.user.findUnique = originalFindUnique;
    prisma.user.update = originalUpdate;
  }
});

test('update profile successfully updates provided fields', async () => {
  const originalFindUnique = prisma.user.findUnique;
  const originalFindFirst = prisma.user.findFirst;
  const originalUpdate = prisma.user.update;

  prisma.user.findUnique = async ({ where }) => {
    if (where.id === 'user-id') {
      return {
        id: 'user-id',
        fullName: 'Old Name',
        email: 'old@example.com',
        role: 'USER',
        status: 'ACTIVE'
      };
    }
    return null;
  };

  prisma.user.findFirst = async () => null;

  prisma.user.update = async ({ data }) => ({
    id: 'user-id',
    ...data
  });

  const req = {
    user: { userId: 'user-id' },
    body: {
      fullName: 'New Name',
      email: 'new@example.com'
    }
  };

  const res = createMockRes();

  try {
    await userController.updateProfile(req, res, (err) => {
      if (err) {
        throw err;
      }
    });

    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body, {
      success: true,
      message: 'Profile updated successfully'
    });
  } finally {
    prisma.user.findUnique = originalFindUnique;
    prisma.user.findFirst = originalFindFirst;
    prisma.user.update = originalUpdate;
  }
});

test('change password fails with incorrect current password', async () => {
  const originalFindUnique = prisma.user.findUnique;
  const originalUpdate = prisma.user.update;

  const hashedPassword = await hashPassword('CorrectPass@123');
  let updateCalled = false;

  prisma.user.findUnique = async ({ where }) => {
    if (where.id === 'user-id') {
      return {
        id: 'user-id',
        password: hashedPassword
      };
    }
    return null;
  };

  prisma.user.update = async () => {
    updateCalled = true;
    return null;
  };

  const req = {
    user: { userId: 'user-id' },
    body: {
      currentPassword: 'WrongPass@123',
      newPassword: 'NewStrongPass@123'
    }
  };

  const res = createMockRes();
  let capturedError = null;

  try {
    await userController.updatePassword(req, res, (err) => {
      capturedError = err;
    });

    assert.ok(capturedError);
    assert.strictEqual(capturedError.status, 401);
    assert.strictEqual(capturedError.message, 'Current password is incorrect');
    assert.strictEqual(updateCalled, false);
  } finally {
    prisma.user.findUnique = originalFindUnique;
    prisma.user.update = originalUpdate;
  }
});
