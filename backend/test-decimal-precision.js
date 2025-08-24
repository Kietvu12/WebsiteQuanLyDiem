const { pool } = require('./config/database');

async function testDecimalPrecision() {
  console.log('=== TEST ĐỘ CHÍNH XÁC SỐ THẬP PHÂN ===\n');
  
  try {
    // Test 1: Kiểm tra việc lưu số thập phân
    console.log('1. Test lưu số thập phân vào database...');
    
    // Tạo user test
    const [createResult] = await pool.execute(
      'INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_du, diem) VALUES (?, ?, ?, ?, ?, ?)',
      ['test_decimal', 'test_hash', 'test@test.com', 'Test User', 1000.00, 0.00]
    );
    
    const testUserId = createResult.insertId;
    console.log('✅ Tạo user test với ID:', testUserId);
    
    // Test 2: Cập nhật điểm với số thập phân
    console.log('\n2. Test cập nhật điểm với số thập phân...');
    
    const testPoints = 3.5;
    console.log('Điểm test:', testPoints, 'Type:', typeof testPoints);
    
    const [updateResult] = await pool.execute(
      'UPDATE nguoi_dung SET diem = ? WHERE id_nguoi_dung = ?',
      [testPoints, testUserId]
    );
    
    console.log('✅ Cập nhật điểm thành công, affected rows:', updateResult.affectedRows);
    
    // Test 3: Đọc lại điểm từ database
    console.log('\n3. Test đọc điểm từ database...');
    
    const [readResult] = await pool.execute(
      'SELECT diem FROM nguoi_dung WHERE id_nguoi_dung = ?',
      [testUserId]
    );
    
    const storedPoints = readResult[0].diem;
    console.log('Điểm đã lưu:', storedPoints, 'Type:', typeof storedPoints);
    console.log('Điểm gốc:', testPoints, 'Type:', typeof testPoints);
    console.log('So sánh:', storedPoints === testPoints ? '✅ BẰNG NHAU' : '❌ KHÁC NHAU');
    
    // Test 4: Test phép tính cộng
    console.log('\n4. Test phép tính cộng điểm...');
    
    const currentPoints = parseFloat(storedPoints);
    const addPoints = 2.7;
    const newPoints = currentPoints + addPoints;
    
    console.log('Điểm hiện tại:', currentPoints);
    console.log('Cộng thêm:', addPoints);
    console.log('Kết quả:', newPoints);
    
    // Cập nhật điểm mới
    await pool.execute(
      'UPDATE nguoi_dung SET diem = ? WHERE id_nguoi_dung = ?',
      [newPoints, testUserId]
    );
    
    // Đọc lại để kiểm tra
    const [finalResult] = await pool.execute(
      'SELECT diem FROM nguoi_dung WHERE id_nguoi_dung = ?',
      [testUserId]
    );
    
    const finalPoints = finalResult[0].diem;
    console.log('Điểm cuối cùng trong DB:', finalPoints);
    console.log('So sánh với kết quả tính:', finalPoints === newPoints ? '✅ BẰNG NHAU' : '❌ KHÁC NHAU');
    
    // Test 5: Kiểm tra kiểu dữ liệu trong JavaScript
    console.log('\n5. Test kiểu dữ liệu trong JavaScript...');
    
    const jsPoints = 3.5;
    const jsAddPoints = 2.7;
    const jsResult = jsPoints + jsAddPoints;
    
    console.log('JavaScript: 3.5 + 2.7 =', jsResult);
    console.log('Type:', typeof jsResult);
    
    // Test 6: So sánh với database
    console.log('\n6. So sánh JavaScript vs Database...');
    console.log('JavaScript result:', jsResult);
    console.log('Database result:', finalPoints);
    console.log('Bằng nhau:', jsResult === finalPoints ? '✅ CÓ' : '❌ KHÔNG');
    
    // Test 7: Kiểm tra độ chính xác
    console.log('\n7. Kiểm tra độ chính xác...');
    console.log('JavaScript (3.5 + 2.7):', jsResult);
    console.log('Database (3.5 + 2.7):', finalPoints);
    console.log('Chênh lệch:', Math.abs(jsResult - finalPoints));
    
    // Dọn dẹp
    await pool.execute('DELETE FROM nguoi_dung WHERE id_nguoi_dung = ?', [testUserId]);
    console.log('\n✅ Đã xóa user test');
    
  } catch (error) {
    console.error('❌ Lỗi test:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Đã đóng kết nối database');
  }
}

// Chạy test
testDecimalPrecision();
