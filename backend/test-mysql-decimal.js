const { pool } = require('./config/database');

async function testMySQLDecimal() {
  console.log('=== TEST MYSQL DECIMAL HANDLING ===\n');
  
  try {
    // Test 1: Kiểm tra cách MySQL xử lý số thập phân
    console.log('1. Test cách MySQL xử lý số thập phân...');
    
    // Tạo bảng test tạm thời
    await pool.execute(`
      CREATE TEMPORARY TABLE test_decimal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        test_points DECIMAL(12,2),
        test_amount DECIMAL(12,2)
      )
    `);
    console.log('✅ Tạo bảng test tạm thời');
    
    // Test 2: Insert số thập phân
    console.log('\n2. Test insert số thập phân...');
    
    const testValues = [
      { points: 3.5, amount: 100000.50 },
      { points: 2.75, amount: 250000.25 },
      { points: 1.25, amount: 50000.75 },
      { points: 0.5, amount: 10000.10 }
    ];
    
    for (const value of testValues) {
      console.log(`Inserting: points=${value.points}, amount=${value.amount}`);
      
      const [result] = await pool.execute(
        'INSERT INTO test_decimal (test_points, test_amount) VALUES (?, ?)',
        [value.points, value.amount]
      );
      
      console.log(`  ✅ Inserted with ID: ${result.insertId}`);
    }
    
    // Test 3: Đọc lại dữ liệu
    console.log('\n3. Test đọc lại dữ liệu...');
    
    const [readResult] = await pool.execute('SELECT * FROM test_decimal ORDER BY id');
    
    console.log('Dữ liệu đã đọc:');
    for (const row of readResult) {
      console.log(`  ID ${row.id}:`);
      console.log(`    Points: ${row.test_points} (Type: ${typeof row.test_points})`);
      console.log(`    Amount: ${row.test_amount} (Type: ${typeof row.test_amount})`);
    }
    
    // Test 4: Test phép tính
    console.log('\n4. Test phép tính...');
    
    for (const row of readResult) {
      const originalPoints = parseFloat(row.test_points);
      const addPoints = 1.5;
      const newPoints = originalPoints + addPoints;
      
      console.log(`  ID ${row.id}:`);
      console.log(`    Original: ${originalPoints} + ${addPoints} = ${newPoints}`);
      console.log(`    Type: ${typeof newPoints}`);
      
      // Cập nhật điểm mới
      await pool.execute(
        'UPDATE test_decimal SET test_points = ? WHERE id = ?',
        [newPoints, row.id]
      );
    }
    
    // Test 5: Đọc lại sau khi cập nhật
    console.log('\n5. Test đọc lại sau khi cập nhật...');
    
    const [updatedResult] = await pool.execute('SELECT * FROM test_decimal ORDER BY id');
    
    console.log('Dữ liệu sau khi cập nhật:');
    for (const row of updatedResult) {
      console.log(`  ID ${row.id}:`);
      console.log(`    Points: ${row.test_points} (Type: ${typeof row.test_points})`);
      console.log(`    Amount: ${row.test_amount} (Type: ${typeof row.test_amount})`);
    }
    
    // Test 6: Test với số âm
    console.log('\n6. Test với số âm...');
    
    const negativeValues = [
      { points: -3.5, amount: -100000.50 },
      { points: -2.75, amount: -250000.25 }
    ];
    
    for (const value of negativeValues) {
      console.log(`Inserting negative: points=${value.points}, amount=${value.amount}`);
      
      const [result] = await pool.execute(
        'INSERT INTO test_decimal (test_points, test_amount) VALUES (?, ?)',
        [value.points, value.amount]
      );
      
      console.log(`  ✅ Inserted with ID: ${result.insertId}`);
    }
    
    // Test 7: Đọc tất cả dữ liệu
    console.log('\n7. Test đọc tất cả dữ liệu...');
    
    const [allResult] = await pool.execute('SELECT * FROM test_decimal ORDER BY id');
    
    console.log('Tất cả dữ liệu:');
    for (const row of allResult) {
      console.log(`  ID ${row.id}:`);
      console.log(`    Points: ${row.test_points} (Type: ${typeof row.test_points})`);
      console.log(`    Amount: ${row.test_amount} (Type: ${typeof row.test_amount})`);
    }
    
    // Dọn dẹp
    await pool.execute('DROP TEMPORARY TABLE IF EXISTS test_decimal');
    console.log('\n✅ Đã xóa bảng test tạm thời');
    
  } catch (error) {
    console.error('❌ Lỗi test:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Đã đóng kết nối database');
  }
}

// Chạy test
testMySQLDecimal();
