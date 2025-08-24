const { pool } = require('./config/database');

async function testDecimalCreationFlow() {
  console.log('=== TEST LUỒNG TẠO GIAO DỊCH VỚI SỐ THẬP PHÂN ===\n');
  
  try {
    // Test 1: Tạo user test
    console.log('1. Tạo user test...');
    
    const [createUserResult] = await pool.execute(
      'INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_du, diem) VALUES (?, ?, ?, ?, ?, ?)',
      ['test_decimal_flow', 'test_hash', 'test_decimal_flow@test.com', 'Test User Decimal Flow', 1000.00, 0.00]
    );
    
    const testUserId = createUserResult.insertId;
    console.log('✅ Tạo user test với ID:', testUserId);
    
    // Test 2: Tạo nhóm test
    console.log('\n2. Tạo nhóm test...');
    
    const [createGroupResult] = await pool.execute(
      'INSERT INTO nhom (ten_nhom, mo_ta) VALUES (?, ?)',
      ['Nhóm Test Decimal Flow', 'Nhóm để test luồng tạo giao dịch với số thập phân']
    );
    
    const testGroupId = createGroupResult.insertId;
    console.log('✅ Tạo nhóm test với ID:', testGroupId);
    
    // Test 3: Thêm user vào nhóm
    console.log('\n3. Thêm user vào nhóm...');
    
    await pool.execute(
      'INSERT INTO thanh_vien_nhom (id_nguoi_dung, id_nhom) VALUES (?, ?)',
      [testUserId, testGroupId]
    );
    console.log('✅ Thêm user vào nhóm');
    
    // Test 4: Mô phỏng request body từ frontend
    console.log('\n4. Mô phỏng request body từ frontend...');
    
    const requestBody = {
      id_loai_giao_dich: 1,
      id_nguoi_nhan: testUserId,
      id_nhom: testGroupId,
      id_lich_xe: null,
      so_tien: 100000,
      diem: 3.5, // Điểm thập phân từ frontend
      noi_dung: 'Test giao dịch với điểm thập phân 3.5'
    };
    
    console.log('Request body từ frontend:');
    console.log('  diem:', requestBody.diem, 'Type:', typeof requestBody.diem);
    console.log('  so_tien:', requestBody.so_tien, 'Type:', typeof requestBody.so_tien);
    
    // Test 5: Mô phỏng cách xử lý trong controller
    console.log('\n5. Mô phỏng cách xử lý trong controller...');
    
    // Lấy dữ liệu từ request body (giống như trong controller)
    const {
      id_loai_giao_dich,
      id_nguoi_nhan,
      id_nhom,
      id_lich_xe,
      so_tien,
      diem,
      noi_dung
    } = requestBody;
    
    console.log('Dữ liệu đã extract từ request body:');
    console.log('  diem:', diem, 'Type:', typeof diem);
    console.log('  so_tien:', so_tien, 'Type:', typeof so_tien);
    
    // Xử lý điểm (giống như trong controller)
    let calculatedPoints = diem; // Sử dụng điểm được gửi lên nếu có
    
    console.log('Điểm sau khi xử lý:');
    console.log('  calculatedPoints:', calculatedPoints, 'Type:', typeof calculatedPoints);
    
    // Test 6: Mô phỏng cách xử lý trong model
    console.log('\n6. Mô phỏng cách xử lý trong model...');
    
    // Tạo transaction data (giống như trong controller)
    const mainTransactionData = {
      id_loai_giao_dich,
      id_nguoi_gui: 1, // Admin
      id_nguoi_nhan,
      id_nhom,
      id_lich_xe,
      so_tien,
      diem: calculatedPoints, // Sử dụng điểm đã tính được
      noi_dung,
      trang_thai: 'cho_xac_nhan'
    };
    
    console.log('Main transaction data:');
    console.log('  diem:', mainTransactionData.diem, 'Type:', typeof mainTransactionData.diem);
    console.log('  so_tien:', mainTransactionData.so_tien, 'Type:', typeof mainTransactionData.so_tien);
    
    // Xử lý trong model (giống như trong Transaction.create)
    const {
      diem: modelDiem,
      so_tien: modelSoTien
    } = mainTransactionData;
    
    console.log('Dữ liệu trong model:');
    console.log('  diem:', modelDiem, 'Type:', typeof modelDiem);
    console.log('  so_tien:', modelSoTien, 'Type:', typeof modelSoTien);
    
    // Xử lý null/undefined (giống như trong model)
    const processedDiem = modelDiem !== undefined && modelDiem !== null ? modelDiem : null;
    const processedSoTien = modelSoTien !== undefined && modelSoTien !== null ? modelSoTien : null;
    
    console.log('Dữ liệu sau khi xử lý null/undefined:');
    console.log('  processedDiem:', processedDiem, 'Type:', typeof processedDiem);
    console.log('  processedSoTien:', processedSoTien, 'Type:', typeof processedSoTien);
    
    // Test 7: Tạo giao dịch thực tế
    console.log('\n7. Tạo giao dịch thực tế...');
    
    const [createTxResult] = await pool.execute(
      'INSERT INTO giao_dich (id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, id_lich_xe, so_tien, diem, noi_dung, trang_thai) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_loai_giao_dich, 1, id_nguoi_nhan, id_nhom, id_lich_xe, processedSoTien, processedDiem, noi_dung, 'cho_xac_nhan']
    );
    
    const testTxId = createTxResult.insertId;
    console.log('✅ Tạo giao dịch test với ID:', testTxId);
    
    // Test 8: Đọc giao dịch từ database
    console.log('\n8. Đọc giao dịch từ database...');
    
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
    
    // Test 9: So sánh giá trị
    console.log('\n9. So sánh giá trị...');
    
    console.log('Frontend → Controller → Model → Database:');
    console.log('  Frontend diem:', requestBody.diem, 'Type:', typeof requestBody.diem);
    console.log('  Controller calculatedPoints:', calculatedPoints, 'Type:', typeof calculatedPoints);
    console.log('  Model mainTransactionData.diem:', mainTransactionData.diem, 'Type:', typeof mainTransactionData.diem);
    console.log('  Model processedDiem:', processedDiem, 'Type:', typeof processedDiem);
    console.log('  Database storedTx.diem:', storedTx.diem, 'Type:', typeof storedTx.diem);
    
    // Kiểm tra có bị làm tròn không
    const frontendValue = requestBody.diem;
    const databaseValue = storedTx.diem;
    
    console.log('\nKết quả so sánh:');
    console.log('  Frontend == Database:', frontendValue == databaseValue ? '✅ BẰNG NHAU' : '❌ KHÁC NHAU');
    console.log('  Frontend === Database:', frontendValue === databaseValue ? '✅ BẰNG NHAU' : '❌ KHÁC NHAU');
    
    if (frontendValue !== databaseValue) {
      console.log('  ❌ ĐIỂM BỊ LÀM TRÒN!');
      console.log('  Frontend:', frontendValue);
      console.log('  Database:', databaseValue);
      console.log('  Chênh lệch:', Math.abs(frontendValue - databaseValue));
    } else {
      console.log('  ✅ ĐIỂM KHÔNG BỊ LÀM TRÒN!');
    }
    
    // Dọn dẹp
    await pool.execute('DELETE FROM giao_dich WHERE id_giao_dich = ?', [testTxId]);
    await pool.execute('DELETE FROM thanh_vien_nhom WHERE id_nguoi_dung = ? AND id_nhom = ?', [testUserId, testGroupId]);
    await pool.execute('DELETE FROM nhom WHERE id_nhom = ?', [testGroupId]);
    await pool.execute('DELETE FROM nguoi_dung WHERE id_nguoi_dung = ?', [testUserId]);
    console.log('\n✅ Đã dọn dẹp dữ liệu test');
    
    console.log('\n=== KẾT LUẬN ===');
    if (frontendValue !== databaseValue) {
      console.log('❌ VẤN ĐỀ: Điểm bị làm tròn khi lưu vào database');
      console.log('🔍 Nguyên nhân: Có thể do MySQL driver hoặc database configuration');
      console.log('💡 Giải pháp: Cần kiểm tra MySQL settings');
    } else {
      console.log('✅ KHÔNG CÓ VẤN ĐỀ: Điểm được lưu chính xác');
    }
    
  } catch (error) {
    console.error('❌ Lỗi test:', error);
  } finally {
    await pool.end();
    console.log('\n✅ Đã đóng kết nối database');
  }
}

// Chạy test
testDecimalCreationFlow();
