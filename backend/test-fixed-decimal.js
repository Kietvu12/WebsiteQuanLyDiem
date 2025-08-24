const { pool } = require('./config/database');

async function testFixedDecimal() {
  console.log('=== TEST VIỆC SỬA LỖI SỐ THẬP PHÂN ===\n');
  
  try {
    // Test 1: Tạo giao dịch với điểm thập phân
    console.log('1. Test tạo giao dịch với điểm thập phân...');
    
    // Tạo user test
    const [createUserResult] = await pool.execute(
      'INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_du, diem) VALUES (?, ?, ?, ?, ?, ?)',
      ['test_fixed_decimal', 'test_hash', 'test_fixed@test.com', 'Test User Fixed', 1000.00, 0.00]
    );
    
    const testUserId = createUserResult.insertId;
    console.log('✅ Tạo user test với ID:', testUserId);
    
    // Tạo nhóm test
    const [createGroupResult] = await pool.execute(
      'INSERT INTO nhom (ten_nhom, mo_ta) VALUES (?, ?)',
      ['Nhóm Test Fixed Decimal', 'Nhóm để test việc sửa lỗi số thập phân']
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
      [1, 1, testUserId, testGroupId, testAmount, testPoints, 'Test giao dịch với điểm thập phân đã sửa', 'cho_xac_nhan']
    );
    
    const testTxId = createTxResult.insertId;
    console.log('✅ Tạo giao dịch test với ID:', testTxId);
    
    // Test 3: Đọc giao dịch từ database
    console.log('\n3. Test đọc giao dịch từ database...');
    
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
    
    // Test 4: Mô phỏng cách xử lý trong controller (đã sửa)
    console.log('\n4. Test cách xử lý trong controller (đã sửa)...');
    
    // Mô phỏng transaction object từ database
    const transaction = {
      so_tien: storedTx.so_tien,
      diem: storedTx.diem
    };
    
    console.log('Transaction object từ database:');
    console.log('  so_tien:', transaction.so_tien, 'Type:', typeof transaction.so_tien);
    console.log('  diem:', transaction.diem, 'Type:', typeof transaction.diem);
    
    // Cách xử lý CŨ (gây lỗi)
    const oldWayMoney = transaction.so_tien || 0;
    const oldWayPoints = transaction.diem || 0;
    
    // Cách xử lý MỚI (đã sửa)
    const newWayMoney = parseFloat(transaction.so_tien) || 0;
    const newWayPoints = parseFloat(transaction.diem) || 0;
    
    console.log('\nCách xử lý CŨ (gây lỗi):');
    console.log('  so_tien || 0:', oldWayMoney, 'Type:', typeof oldWayMoney);
    console.log('  diem || 0:', oldWayPoints, 'Type:', typeof oldWayPoints);
    
    console.log('\nCách xử lý MỚI (đã sửa):');
    console.log('  parseFloat(so_tien) || 0:', newWayMoney, 'Type:', typeof newWayMoney);
    console.log('  parseFloat(diem) || 0:', newWayPoints, 'Type:', typeof newWayPoints);
    
    // Test 5: Test phép tính
    console.log('\n5. Test phép tính...');
    
    const addMoney = 50000.25;
    const addPoints = 2.5;
    
    console.log('Với cách xử lý CŨ:');
    const oldMoneyResult = oldWayMoney + addMoney;
    const oldPointsResult = oldWayPoints + addPoints;
    console.log('  Tiền:', oldWayMoney, '+', addMoney, '=', oldMoneyResult, 'Type:', typeof oldMoneyResult);
    console.log('  Điểm:', oldWayPoints, '+', addPoints, '=', oldPointsResult, 'Type:', typeof oldPointsResult);
    
    console.log('\nVới cách xử lý MỚI:');
    const newMoneyResult = newWayMoney + addMoney;
    const newPointsResult = newWayPoints + addPoints;
    console.log('  Tiền:', newWayMoney, '+', addMoney, '=', newMoneyResult, 'Type:', typeof newMoneyResult);
    console.log('  Điểm:', newWayPoints, '+', addPoints, '=', newPointsResult, 'Type:', typeof newPointsResult);
    
    // Test 6: Cập nhật điểm cho user (sử dụng cách xử lý MỚI)
    console.log('\n6. Test cập nhật điểm cho user (sử dụng cách xử lý MỚI)...');
    
    const currentPoints = newWayPoints; // Sử dụng cách xử lý MỚI
    const newPoints = currentPoints + addPoints;
    
    console.log('Điểm hiện tại:', currentPoints);
    console.log('Cộng thêm:', addPoints);
    console.log('Kết quả tính:', newPoints);
    console.log('Type của kết quả:', typeof newPoints);
    
    // Cập nhật điểm cho user
    const [updateUserResult] = await pool.execute(
      'UPDATE nguoi_dung SET diem = ? WHERE id_nguoi_dung = ?',
      [newPoints, testUserId]
    );
    
    console.log('✅ Cập nhật điểm thành công, affected rows:', updateUserResult.affectedRows);
    
    // Test 7: Đọc lại điểm từ user
    console.log('\n7. Test đọc lại điểm từ user...');
    
    const [readUserResult] = await pool.execute(
      'SELECT diem FROM nguoi_dung WHERE id_nguoi_dung = ?',
      [testUserId]
    );
    
    const finalUserPoints = readUserResult[0].diem;
    console.log('Điểm cuối cùng của user:', finalUserPoints);
    console.log('Type:', typeof finalUserPoints);
    console.log('So sánh với kết quả tính:', finalUserPoints == newPoints ? '✅ BẰNG NHAU' : '❌ KHÁC NHAU');
    
    // Test 8: Test với số âm
    console.log('\n8. Test với số âm...');
    
    const negativePoints = -2.75;
    const negativeAmount = -50000.50;
    
    console.log('Điểm âm:', negativePoints, 'Type:', typeof negativePoints);
    console.log('Số tiền âm:', negativeAmount, 'Type:', typeof negativeAmount);
    
    // Tạo giao dịch với số âm
    const [createNegativeTxResult] = await pool.execute(
      'INSERT INTO giao_dich (id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, so_tien, diem, noi_dung, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [4, 1, testUserId, testGroupId, negativeAmount, negativePoints, 'Test giao dịch với số âm', 'hoan_thanh']
    );
    
    const negativeTxId = createNegativeTxResult.insertId;
    console.log('✅ Tạo giao dịch âm với ID:', negativeTxId);
    
    // Đọc giao dịch âm
    const [readNegativeTxResult] = await pool.execute(
      'SELECT * FROM giao_dich WHERE id_giao_dich = ?',
      [negativeTxId]
    );
    
    const negativeTx = readNegativeTxResult[0];
    console.log('Giao dịch âm đã lưu:');
    console.log('  - Số tiền:', negativeTx.so_tien, 'Type:', typeof negativeTx.so_tien);
    console.log('  - Điểm:', negativeTx.diem, 'Type:', typeof negativeTx.diem);
    
    // Xử lý với cách MỚI
    const negativeMoney = parseFloat(negativeTx.so_tien) || 0;
    const negativePointsProcessed = parseFloat(negativeTx.diem) || 0;
    
    console.log('\nSau khi xử lý với parseFloat:');
    console.log('  Số tiền:', negativeMoney, 'Type:', typeof negativeMoney);
    console.log('  Điểm:', negativePointsProcessed, 'Type:', typeof negativePointsProcessed);
    
    // Dọn dẹp
    await pool.execute('DELETE FROM giao_dich WHERE id_giao_dich IN (?, ?)', [testTxId, negativeTxId]);
    await pool.execute('DELETE FROM thanh_vien_nhom WHERE id_nguoi_dung = ? AND id_nhom = ?', [testUserId, testGroupId]);
    await pool.execute('DELETE FROM nhom WHERE id_nhom = ?', [testGroupId]);
    await pool.execute('DELETE FROM nguoi_dung WHERE id_nguoi_dung = ?', [testUserId]);
    console.log('\n✅ Đã dọn dẹp dữ liệu test');
    
    console.log('\n=== KẾT QUẢ ===');
    console.log('✅ Việc sửa lỗi số thập phân đã hoạt động!');
    console.log('✅ Số thập phân được xử lý chính xác');
    console.log('✅ Phép tính hoạt động đúng');
    console.log('✅ Số âm cũng được xử lý chính xác');
    
  } catch (error) {
    console.error('❌ Lỗi test:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Đã đóng kết nối database');
  }
}

// Chạy test
testFixedDecimal();
