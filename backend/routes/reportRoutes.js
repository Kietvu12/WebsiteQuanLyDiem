const express = require('express')
const router = express.Router()
const reportController = require('../controllers/reportController')
const { authenticateToken } = require('../middleware/auth')

// Tất cả routes đều cần xác thực
router.use(authenticateToken)

// Xuất báo cáo giao dịch của người dùng
router.post('/export-user-transactions', reportController.exportUserTransactionsReport)

// Xuất báo cáo lịch xe của người dùng
router.post('/export-user-schedules', reportController.exportUserSchedulesReport)

// Xuất báo cáo tổng hợp của nhóm
router.post('/export-group', reportController.exportGroupReport)

// Lấy danh sách báo cáo
router.get('/list', reportController.getReportsList)

// Tải về báo cáo
router.get('/download/:reportId', reportController.downloadReport)

// Xóa báo cáo
router.delete('/:reportId', reportController.deleteReport)

// Tạo thư mục báo cáo cho người dùng mới
router.post('/create-user-directory', reportController.createUserReportDirectory)

// Tạo thư mục báo cáo cho nhóm mới
router.post('/create-group-directory', reportController.createGroupReportDirectory)

// Lấy danh sách folder báo cáo
router.get('/folders', reportController.getReportFolders)

// Tải về file theo đường dẫn
router.post('/download-by-path', reportController.downloadFileByPath)

// Xóa file theo đường dẫn
router.delete('/delete-by-path', reportController.deleteFileByPath)

module.exports = router
