const express = require("express");
const cors = require("cors");
const { testConnection } = require("./config/database");

// Import routes
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const vehicleScheduleRoutes = require('./routes/vehicleScheduleRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Test kết nối database khi khởi động
testConnection();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/schedules', vehicleScheduleRoutes);

// Routes cơ bản
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 Backend Quản Lý Điểm API', 
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      groups: '/api/groups',
      transactions: '/api/transactions',
      schedules: '/api/schedules'
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Lỗi server:', err);
  res.status(500).json({
    success: false,
    message: 'Lỗi server nội bộ'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint không tồn tại'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend chạy tại http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 API Users: http://localhost:${PORT}/api/users`);
  console.log(`👥 API Groups: http://localhost:${PORT}/api/groups`);
  console.log(`💰 API Transactions: http://localhost:${PORT}/api/transactions`);
  console.log(`🚗 API Schedules: http://localhost:${PORT}/api/schedules`);
});
