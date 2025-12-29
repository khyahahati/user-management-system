const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.use(authMiddleware);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.put('/me/password', userController.updatePassword);

module.exports = router;
