const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const adminController = require('../controllers/admin.controller');

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware('ADMIN'));

router.get('/users', adminController.listUsers);
router.patch('/users/:id/activate', adminController.activateUser);
router.patch('/users/:id/deactivate', adminController.deactivateUser);

module.exports = router;
