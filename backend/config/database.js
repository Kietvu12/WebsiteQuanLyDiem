const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'quanlydiem',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Tạo pool connection
const pool = mysql.createPool(dbConfig);

// Test kết nối
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Kết nối database thành công!');
    connection.release();
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error.message);
  }
};

module.exports = {
  pool,
  testConnection
};
