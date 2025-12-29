const express = require('express');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { validateLogin, validateSignup } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', validateLogin, authController.login);
router.post('/signup', validateSignup, authController.signup);
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
