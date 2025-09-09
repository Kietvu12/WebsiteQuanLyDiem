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

// Route lấy danh sách người dùng cơ bản (cho tất cả user đã đăng nhập)
router.get('/basic-list', UserController.getBasicUsersList);

// User-specific routes (các routes này có logic kiểm tra quyền riêng trong controller)
router.get('/:id', UserController.getUserById);
router.put('/:id', UserController.updateUser);
router.get('/:id/groups', UserController.getUserGroups);
router.get('/:id/transactions', UserController.getUserTransactions);
router.get('/:id/schedules', UserController.getUserSchedules);

// Routes chỉ dành cho admin (đặt sau /:id để tránh xung đột)
router.use(requireAdmin);

// Admin routes
router.get('/', UserController.getAllUsers);
router.post('/', UserController.createUser);
router.post('/multiple', UserController.createMultipleUsers);
router.delete('/:id', UserController.deleteUser);

module.exports = router;
