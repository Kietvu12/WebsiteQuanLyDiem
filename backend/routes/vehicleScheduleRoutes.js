const express = require('express');
const VehicleScheduleController = require('../controllers/vehicleScheduleController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Tất cả routes đều cần xác thực
router.use(authenticateToken);

// Lấy tất cả lịch xe
router.get('/', VehicleScheduleController.getAllSchedules);

// Lấy lịch xe theo ID
router.get('/:id', VehicleScheduleController.getScheduleById);

// Tạo lịch xe mới
router.post('/', VehicleScheduleController.createSchedule);

// Cập nhật lịch xe
router.put('/:id', VehicleScheduleController.updateSchedule);

// Cập nhật trạng thái lịch xe
router.put('/:id/status', VehicleScheduleController.updateScheduleStatus);

// Xóa lịch xe
router.delete('/:id', VehicleScheduleController.deleteSchedule);

// Lấy lịch xe theo nhóm
router.get('/group/:groupId', VehicleScheduleController.getSchedulesByGroup);

// Lấy lịch xe theo người tạo
router.get('/creator/:userId', VehicleScheduleController.getSchedulesByCreator);

// Lấy lịch xe theo trạng thái
router.get('/status/:status', VehicleScheduleController.getSchedulesByStatus);

// Lấy lịch xe theo ngày
router.get('/date/:date', VehicleScheduleController.getSchedulesByDate);

module.exports = router;
