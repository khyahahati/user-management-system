const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const { validateUpdateProfile, validateChangePassword } = require('../validators/user.validator');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', userController.getProfile);
router.put('/me', validateUpdateProfile, userController.updateProfile);
router.put('/me/password', validateChangePassword, userController.updatePassword);

module.exports = router;
