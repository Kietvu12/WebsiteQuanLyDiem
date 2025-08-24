const { pool } = require('./config/database');

async function testDecimalTransaction() {
  console.log('=== TEST XỬ LÝ SỐ THẬP PHÂN TRONG GIAO DỊCH ===\n');
  
  try {
    // Test 1: Tạo giao dịch với điểm thập phân
    console.log('1. Test tạo giao dịch với điểm thập phân...');
    
    // Tạo user test
    const [createUserResult] = await pool.execute(
      'INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_du, diem) VALUES (?, ?, ?, ?, ?, ?)',
      ['test_decimal_tx', 'test_hash', 'test_tx@test.com', 'Test User TX', 1000.00, 0.00]
    );
    
    const testUserId = createUserResult.insertId;
    console.log('✅ Tạo user test với ID:', testUserId);
    
    // Tạo nhóm test
    const [createGroupResult] = await pool.execute(
      'INSERT INTO nhom (ten_nhom, mo_ta) VALUES (?, ?)',
      ['Nhóm Test Decimal', 'Nhóm để test số thập phân']
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
      [1, 1, testUserId, testGroupId, testAmount, testPoints, 'Test giao dịch với điểm thập phân', 'cho_xac_nhan']
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
    
    // Test 4: Test phép tính với điểm thập phân
    console.log('\n4. Test phép tính với điểm thập phân...');
    
    const currentPoints = parseFloat(storedTx.diem);
    const addPoints = 2.7;
    const newPoints = currentPoints + addPoints;
    
    console.log('Điểm hiện tại:', currentPoints);
    console.log('Cộng thêm:', addPoints);
    console.log('Kết quả tính:', newPoints);
    console.log('Type của kết quả:', typeof newPoints);
    
    // Test 5: Cập nhật điểm cho user
    console.log('\n5. Test cập nhật điểm cho user...');
    
    const [updateUserResult] = await pool.execute(
      'UPDATE nguoi_dung SET diem = ? WHERE id_nguoi_dung = ?',
      [newPoints, testUserId]
    );
    
    console.log('✅ Cập nhật điểm thành công, affected rows:', updateUserResult.affectedRows);
    
    // Test 6: Đọc lại điểm từ user
    console.log('\n6. Test đọc lại điểm từ user...');
    
    const [readUserResult] = await pool.execute(
      'SELECT diem FROM nguoi_dung WHERE id_nguoi_dung = ?',
      [testUserId]
    );
    
    const finalUserPoints = readUserResult[0].diem;
    console.log('Điểm cuối cùng của user:', finalUserPoints);
    console.log('Type:', typeof finalUserPoints);
    console.log('So sánh với kết quả tính:', finalUserPoints === newPoints ? '✅ BẰNG NHAU' : '❌ KHÁC NHAU');
    
    // Test 7: Test xử lý trong JavaScript
    console.log('\n7. Test xử lý trong JavaScript...');
    
    // Mô phỏng cách xử lý trong controller
    const transaction = {
      so_tien: storedTx.so_tien,
      diem: storedTx.diem
    };
    
    console.log('Transaction object:', transaction);
    console.log('Transaction.diem type:', typeof transaction.diem);
    
    // Test các cách xử lý khác nhau
    const way1 = transaction.diem || 0;
    const way2 = parseFloat(transaction.diem) || 0;
    const way3 = Number(transaction.diem) || 0;
    
    console.log('Cách 1 (diem || 0):', way1, 'Type:', typeof way1);
    console.log('Cách 2 (parseFloat(diem) || 0):', way2, 'Type:', typeof way2);
    console.log('Cách 3 (Number(diem) || 0):', way3, 'Type:', typeof way3);
    
    // Test phép tính
    const calc1 = way1 + 2.7;
    const calc2 = way2 + 2.7;
    const calc3 = way3 + 2.7;
    
    console.log('Kết quả phép tính:');
    console.log('  Cách 1:', calc1, 'Type:', typeof calc1);
    console.log('  Cách 2:', calc2, 'Type:', typeof calc2);
    console.log('  Cách 3:', calc3, 'Type:', typeof calc3);
    
    // Dọn dẹp
    await pool.execute('DELETE FROM giao_dich WHERE id_giao_dich = ?', [testTxId]);
    await pool.execute('DELETE FROM thanh_vien_nhom WHERE id_nguoi_dung = ? AND id_nhom = ?', [testUserId, testGroupId]);
    await pool.execute('DELETE FROM nhom WHERE id_nhom = ?', [testGroupId]);
    await pool.execute('DELETE FROM nguoi_dung WHERE id_nguoi_dung = ?', [testUserId]);
    console.log('\n✅ Đã dọn dẹp dữ liệu test');
    
  } catch (error) {
    console.error('❌ Lỗi test:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Đã đóng kết nối database');
  }
}

// Chạy test
testDecimalTransaction();
