const express = require('express');
const TransactionController = require('../controllers/transactionController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes đều cần xác thực
router.use(authenticateToken);

// Tạo giao dịch mới
router.post('/', TransactionController.createTransaction);

// Lấy giao dịch theo ID
router.get('/:id', TransactionController.getTransactionById);

// Xác nhận giao dịch
router.put('/:id/confirm', TransactionController.confirmTransaction);

// Hủy giao dịch
router.put('/:id/cancel', TransactionController.cancelTransaction);

// Lấy giao dịch theo trạng thái
router.get('/status/:status', TransactionController.getTransactionsByStatus);

// Lấy giao dịch theo loại
router.get('/type/:typeId', TransactionController.getTransactionsByType);

// Lấy giao dịch theo ngày
router.get('/date/:date', TransactionController.getTransactionsByDate);

// Routes chỉ dành cho admin
router.use(requireAdmin);

// Lấy tất cả giao dịch
router.get('/', TransactionController.getAllTransactions);

// Xóa giao dịch
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;
