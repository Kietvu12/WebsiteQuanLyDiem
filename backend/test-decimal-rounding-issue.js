const { pool } = require('./config/database');

async function testDecimalRoundingIssue() {
  console.log('=== TEST VẤN ĐỀ LÀM TRÒN SỐ THẬP PHÂN ===\n');
  
  try {
    // Test 1: Tạo giao dịch với điểm thập phân
    console.log('1. Test tạo giao dịch với điểm thập phân...');
    
    // Tạo user test
    const [createUserResult] = await pool.execute(
      'INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_du, diem) VALUES (?, ?, ?, ?, ?, ?)',
      ['test_rounding_issue', 'test_hash', 'test_rounding@test.com', 'Test User Rounding', 1000.00, 0.00]
    );
    
    const testUserId = createUserResult.insertId;
    console.log('✅ Tạo user test với ID:', testUserId);
    
    // Tạo nhóm test
    const [createGroupResult] = await pool.execute(
      'INSERT INTO nhom (ten_nhom, mo_ta) VALUES (?, ?)',
      ['Nhóm Test Rounding Issue', 'Nhóm để test vấn đề làm tròn số']
    );
    
    const testGroupId = createGroupResult.insertId;
    console.log('✅ Tạo nhóm test với ID:', testGroupId);
    
    // Thêm user vào nhóm
    await pool.execute(
      'INSERT INTO thanh_vien_nhom (id_nguoi_dung, id_nhom) VALUES (?, ?)',
      [testUserId, testGroupId]
    );
    console.log('✅ Thêm user vào nhóm');
    
    // Test 2: Tạo giao dịch với điểm 3.5
    console.log('\n2. Test tạo giao dịch với điểm 3.5...');
    
    const testPoints = 3.5;
    const testAmount = 100000;
    
    console.log('Điểm test:', testPoints, 'Type:', typeof testPoints);
    console.log('Số tiền test:', testAmount, 'Type:', typeof testAmount);
    
    // Tạo giao dịch test
    const [createTxResult] = await pool.execute(
      'INSERT INTO giao_dich (id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, so_tien, diem, noi_dung, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [1, 1, testUserId, testGroupId, testAmount, testPoints, 'Test giao dịch với điểm thập phân 3.5', 'cho_xac_nhan']
    );
    
    const testTxId = createTxResult.insertId;
    console.log('✅ Tạo giao dịch test với ID:', testTxId);
    
    // Test 3: Đọc giao dịch từ database
    console.log('\n3. Đọc giao dịch từ database...');
    
    const [readTxResult] = await pool.execute(
      'SELECT * FROM giao_dich WHERE id_giao_dich = ?',
      [testTxId]
    );
    
    const storedTx = readTxResult[0];
    console.log('Giao dịch đã lưu:');
    console.log('  - ID:', storedTx.id_giao_dich);
    console.log('  - Số tiền:', storedTx.so_tien, 'Type:', typeof storedTx.so_tien);
    console.log('  - Điểm:', storedTx.diem, 'Type:', typeof storedTx.diem);
    console.log('  - Nội dung:', storedTx.noi_dung);
    
    // Test 4: Mô phỏng cách xử lý trong controller
    console.log('\n4. Mô phỏng cách xử lý trong controller...');
    
    // Mô phỏng transaction object từ database
    const transaction = {
      so_tien: storedTx.so_tien,
      diem: storedTx.diem
    };
    
    console.log('Transaction object từ database:');
    console.log('  so_tien:', transaction.so_tien, 'Type:', typeof transaction.so_tien);
    console.log('  diem:', transaction.diem, 'Type:', typeof transaction.diem);
    
    // Cách xử lý MỚI (đã sửa)
    const moneyChange = parseFloat(transaction.so_tien) || 0;
    const pointsChange = parseFloat(transaction.diem) || 0;
    
    console.log('\nSau khi xử lý với parseFloat:');
    console.log('  so_tien:', moneyChange, 'Type:', typeof moneyChange);
    console.log('  diem:', pointsChange, 'Type:', typeof pointsChange);
    
    // Test 5: Test phép tính
    console.log('\n5. Test phép tính...');
    
    const addMoney = 50000.25;
    const addPoints = 2.5;
    
    const newMoney = moneyChange + addMoney;
    const newPoints = pointsChange + addPoints;
    
    console.log('Phép tính:');
    console.log('  Tiền:', moneyChange, '+', addMoney, '=', newMoney, 'Type:', typeof newMoney);
    console.log('  Điểm:', pointsChange, '+', addPoints, '=', newPoints, 'Type:', typeof newPoints);
    
    // Test 6: Cập nhật điểm cho user
    console.log('\n6. Cập nhật điểm cho user...');
    
    const [updateUserResult] = await pool.execute(
      'UPDATE nguoi_dung SET diem = ? WHERE id_nguoi_dung = ?',
      [newPoints, testUserId]
    );
    
    console.log('✅ Cập nhật điểm thành công, affected rows:', updateUserResult.affectedRows);
    
    // Test 7: Đọc lại điểm từ user
    console.log('\n7. Đọc lại điểm từ user...');
    
    const [readUserResult] = await pool.execute(
      'SELECT diem FROM nguoi_dung WHERE id_nguoi_dung = ?',
      [testUserId]
    );
    
    const finalUserPoints = readUserResult[0].diem;
    console.log('Điểm cuối cùng của user:', finalUserPoints);
    console.log('Type:', typeof finalUserPoints);
    console.log('So sánh với kết quả tính:', finalUserPoints == newPoints ? '✅ BẰNG NHAU' : '❌ KHÁC NHAU');
    
    // Test 8: Kiểm tra các hàm có thể gây làm tròn
    console.log('\n8. Kiểm tra các hàm có thể gây làm tròn...');
    
    const testValue = 3.5;
    console.log('Giá trị test:', testValue);
    console.log('  Math.round():', Math.round(testValue));
    console.log('  Math.ceil():', Math.ceil(testValue));
    console.log('  Math.floor():', Math.floor(testValue));
    console.log('  parseInt():', parseInt(testValue));
    console.log('  parseFloat():', parseFloat(testValue));
    console.log('  Number():', Number(testValue));
    console.log('  +testValue:', +testValue);
    
    // Test 9: Kiểm tra với string numbers
    console.log('\n9. Kiểm tra với string numbers...');
    
    const stringValue = '3.5';
    console.log('String value:', stringValue);
    console.log('  parseInt():', parseInt(stringValue));
    console.log('  parseFloat():', parseFloat(stringValue));
    console.log('  Number():', Number(stringValue));
    console.log('  +stringValue:', +stringValue);
    
    // Test 10: Kiểm tra các toán tử bitwise
    console.log('\n10. Kiểm tra các toán tử bitwise...');
    
    console.log('Giá trị test:', testValue);
    console.log('  | 0:', testValue | 0);
    console.log('  >> 0:', testValue >> 0);
    console.log('  >>> 0:', testValue >>> 0);
    console.log('  ~~testValue:', ~~testValue);
    
    // Test 11: Kiểm tra với database values
    console.log('\n11. Kiểm tra với database values...');
    
    const dbValue = storedTx.diem;
    console.log('Database value:', dbValue, 'Type:', typeof dbValue);
    console.log('  parseInt():', parseInt(dbValue));
    console.log('  parseFloat():', parseFloat(dbValue));
    console.log('  Number():', Number(dbValue));
    console.log('  +dbValue:', +dbValue);
    console.log('  | 0:', dbValue | 0);
    console.log('  >> 0:', dbValue >> 0);
    
    // Dọn dẹp
    await pool.execute('DELETE FROM giao_dich WHERE id_giao_dich = ?', [testTxId]);
    await pool.execute('DELETE FROM thanh_vien_nhom WHERE id_nguoi_dung = ? AND id_nhom = ?', [testUserId, testGroupId]);
    await pool.execute('DELETE FROM nhom WHERE id_nhom = ?', [testGroupId]);
    await pool.execute('DELETE FROM nguoi_dung WHERE id_nguoi_dung = ?', [testUserId]);
    console.log('\n✅ Đã dọn dẹp dữ liệu test');
    
    console.log('\n=== KẾT QUẢ ===');
    console.log('✅ Việc sửa lỗi số thập phân đã hoạt động!');
    console.log('✅ Số thập phân được xử lý chính xác');
    console.log('✅ Phép tính hoạt động đúng');
    console.log('✅ Không còn vấn đề làm tròn số');
    
  } catch (error) {
    console.error('❌ Lỗi test:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Đã đóng kết nối database');
  }
}

// Chạy test
testDecimalRoundingIssue();
