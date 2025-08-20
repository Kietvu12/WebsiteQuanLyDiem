const express = require('express');
const UserController = require('../controllers/userController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Routes không cần xác thực
router.post('/login', UserController.login);

// Routes cần xác thực
router.use(authenticateToken);

// Profile routes (đặt trước để tránh xung đột với /:id)
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateUser);
router.put('/profile/password', UserController.updatePassword);

// Routes chỉ dành cho admin
router.use(requireAdmin);

// Admin routes
router.get('/', UserController.getAllUsers);
router.post('/', UserController.createUser);

// User-specific routes (đặt sau để tránh xung đột)
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);
router.get('/:id/groups', UserController.getUserGroups);
router.get('/:id/transactions', UserController.getUserTransactions);
router.get('/:id/schedules', UserController.getUserSchedules);

module.exports = router;
