const express = require('express');
const NotificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes đều cần xác thực
router.use(authenticateToken);

// Lấy tất cả thông báo của người dùng hiện tại
router.get('/', NotificationController.getUserNotifications);

// Lấy thông báo chưa đọc của người dùng hiện tại
router.get('/unread', NotificationController.getUnreadNotifications);

// Lấy số lượng thông báo chưa đọc
router.get('/unread-count', NotificationController.getUnreadCount);

// Đánh dấu thông báo đã đọc
router.put('/:id/read', NotificationController.markAsRead);

// Đánh dấu tất cả thông báo đã đọc
router.put('/mark-all-read', NotificationController.markAllAsRead);

// Xóa thông báo
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;
