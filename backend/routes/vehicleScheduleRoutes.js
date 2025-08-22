const express = require('express');
const router = express.Router();
const VehicleScheduleController = require('../controllers/vehicleScheduleController');
const { authenticateToken } = require('../middleware/auth');

// Debug middleware để log tất cả requests
router.use((req, res, next) => {
  console.log(`VehicleSchedule Route - ${req.method} ${req.path}`);
  console.log('Request headers:', req.headers);
  next();
});

// All routes require authentication
router.use(authenticateToken);

// Vehicle Type routes - Đặt trước để tránh conflict với :id
router.get('/vehicle-types', (req, res, next) => {
  console.log('Route /vehicle-types matched');
  next();
}, VehicleScheduleController.getVehicleTypes);

// Route Type routes - Đặt trước để tránh conflict với :id
router.get('/route-types', (req, res, next) => {
  console.log('Route /route-types matched');
  next();
}, VehicleScheduleController.getRouteTypes);

// Vehicle Schedule routes
router.get('/', VehicleScheduleController.getAllSchedules);
router.post('/', VehicleScheduleController.createSchedule);
router.get('/:id', VehicleScheduleController.getScheduleById);
router.put('/:id', VehicleScheduleController.updateSchedule);
router.patch('/:id/status', VehicleScheduleController.updateScheduleStatus);
router.delete('/:id', VehicleScheduleController.deleteSchedule);
router.get('/group/:groupId', VehicleScheduleController.getSchedulesByGroup);
router.get('/creator/:userId', VehicleScheduleController.getSchedulesByCreator);
router.get('/status/:status', VehicleScheduleController.getSchedulesByStatus);
router.get('/date/:date', VehicleScheduleController.getSchedulesByDate);

module.exports = router;
