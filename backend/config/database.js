const mysql = require('mysql2/promise');

const dbConfig = {
  host: 'localhost',
  user: 'mcp',
  password: 'ZKdP9LAL8QSAvsE@',
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
    console.log('Testing database connection...')
    console.log('Database config:', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    })
    
    const connection = await pool.getConnection();
    console.log('✅ Kết nối database thành công!');
    
    // Test query đơn giản
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('Database query test result:', rows)
    
    connection.release();
  } catch (error) {
    console.error('❌ Lỗi kết nối database:', error.message);
    console.error('Error details:', error)
  }
};

module.exports = {
  pool,
  testConnection
};
