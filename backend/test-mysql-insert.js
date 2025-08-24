const { pool } = require('./config/database');

async function testMySQLInsert() {
  console.log('=== TEST MYSQL INSERT VỚI SỐ THẬP PHÂN ===\n');
  
  try {
    // Test 1: Tạo bảng test tạm thời
    console.log('1. Tạo bảng test tạm thời...');
    
    await pool.execute(`
      CREATE TEMPORARY TABLE test_insert_decimal (
        id INT AUTO_INCREMENT PRIMARY KEY,
        test_points DECIMAL(12,2),
        test_amount DECIMAL(12,2)
      )
    `);
    console.log('✅ Tạo bảng test tạm thời');
    
    // Test 2: Test INSERT với các giá trị khác nhau
    console.log('\n2. Test INSERT với các giá trị khác nhau...');
    
    const testValues = [
      { points: 3.5, amount: 100000.50 },
      { points: 2.75, amount: 250000.25 },
      { points: 1.25, amount: 50000.75 },
      { points: 0.5, amount: 10000.10 },
      { points: -3.5, amount: -100000.50 },
      { points: -2.75, amount: -250000.25 }
    ];
    
    for (const value of testValues) {
      console.log(`Inserting: points=${value.points}, amount=${value.amount}`);
      
      const [result] = await pool.execute(
        'INSERT INTO test_insert_decimal (test_points, test_amount) VALUES (?, ?)',
        [value.points, value.amount]
      );
      
      console.log(`  ✅ Inserted with ID: ${result.insertId}`);
    }
    
    // Test 3: Đọc lại dữ liệu
    console.log('\n3. Đọc lại dữ liệu...');
    
    const [readResult] = await pool.execute('SELECT * FROM test_insert_decimal ORDER BY id');
    
    console.log('Dữ liệu đã đọc:');
    for (const row of readResult) {
      console.log(`  ID ${row.id}:`);
      console.log(`    Points: ${row.test_points} (Type: ${typeof row.test_points})`);
      console.log(`    Amount: ${row.test_amount} (Type: ${typeof row.test_amount})`);
    }
    
    // Test 4: So sánh với giá trị gốc
    console.log('\n4. So sánh với giá trị gốc...');
    
    for (let i = 0; i < testValues.length; i++) {
      const original = testValues[i];
      const stored = readResult[i];
      
      console.log(`\nTest case ${i + 1}:`);
      console.log(`  Original points: ${original.points} (${typeof original.points})`);
      console.log(`  Stored points: ${stored.test_points} (${typeof stored.test_points})`);
      console.log(`  Points match: ${original.points === stored.test_points ? '✅ YES' : '❌ NO'}`);
      
      console.log(`  Original amount: ${original.amount} (${typeof original.amount})`);
      console.log(`  Stored amount: ${stored.test_amount} (${typeof stored.test_amount})`);
      console.log(`  Amount match: ${original.amount === stored.test_amount ? '✅ YES' : '❌ NO'}`);
    }
    
    // Test 5: Test với các kiểu dữ liệu khác nhau
    console.log('\n5. Test với các kiểu dữ liệu khác nhau...');
    
    const differentTypes = [
      { points: 3.5, amount: 100000.50 },
      { points: '3.5', amount: '100000.50' },
      { points: 3.5, amount: '100000.50' },
      { points: '3.5', amount: 100000.50 }
    ];
    
    for (let i = 0; i < differentTypes.length; i++) {
      const value = differentTypes[i];
      console.log(`\nTest ${i + 1}:`);
      console.log(`  Points: ${value.points} (Type: ${typeof value.points})`);
      console.log(`  Amount: ${value.amount} (Type: ${typeof value.amount})`);
      
      try {
        const [result] = await pool.execute(
          'INSERT INTO test_insert_decimal (test_points, test_amount) VALUES (?, ?)',
          [value.points, value.amount]
        );
        
        console.log(`  ✅ Inserted with ID: ${result.insertId}`);
        
        // Đọc lại để kiểm tra
        const [readBack] = await pool.execute(
          'SELECT * FROM test_insert_decimal WHERE id = ?',
          [result.insertId]
        );
        
        const stored = readBack[0];
        console.log(`  Stored: points=${stored.test_points}, amount=${stored.test_amount}`);
        
      } catch (error) {
        console.log(`  ❌ Insert failed: ${error.message}`);
      }
    }
    
    // Test 6: Kiểm tra tất cả dữ liệu
    console.log('\n6. Kiểm tra tất cả dữ liệu...');
    
    const [allResult] = await pool.execute('SELECT * FROM test_insert_decimal ORDER BY id');
    
    console.log('Tất cả dữ liệu:');
    for (const row of allResult) {
      console.log(`  ID ${row.id}:`);
      console.log(`    Points: ${row.test_points} (Type: ${typeof row.test_points})`);
      console.log(`    Amount: ${row.test_amount} (Type: ${typeof row.test_amount})`);
    }
    
    // Dọn dẹp
    await pool.execute('DROP TEMPORARY TABLE IF EXISTS test_insert_decimal');
    console.log('\n✅ Đã xóa bảng test tạm thời');
    
  } catch (error) {
    console.error('❌ Lỗi test:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Đã đóng kết nối database');
  }
}

// Chạy test
testMySQLInsert();
