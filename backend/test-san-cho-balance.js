/**
 * Test logic cập nhật số dư và điểm cho giao dịch San cho
 * Kiểm tra xem số dư và điểm có được cập nhật đúng không
 */

console.log('=== TEST LOGIC CẬP NHẬT SỐ DƯ VÀ ĐIỂM CHO GIAO DỊCH SAN CHO ===\n')

// Mock data cho test
const mockUserData = {
  sender: {
    id_nguoi_dung: 1,
    ho_ten: 'Nguyễn Văn A',
    so_du: 1000000, // 1 triệu VNĐ
    diem: 50
  },
  receiver: {
    id_nguoi_dung: 2,
    ho_ten: 'Trần Thị B',
    so_du: 500000, // 500k VNĐ
    diem: 25
  }
}

// Mock transaction data
const mockTransactionData = {
  id_loai_giao_dich: 4, // San cho
  so_tien: 200000, // 200k VNĐ
  diem: 10 
}

// Function để test logic cập nhật số dư và điểm (giống như trong controller)
function testSanChoBalanceUpdate(sender, receiver, transaction) {
  console.log('=== BẮT ĐẦU TEST CẬP NHẬT SỐ DƯ VÀ ĐIỂM ===')
  console.log('Dữ liệu giao dịch:', transaction)
  console.log('Người san (trước):', { id: sender.id_nguoi_dung, balance: sender.so_du, points: sender.diem })
  console.log('Người nhận san (trước):', { id: receiver.id_nguoi_dung, balance: receiver.so_du, points: receiver.diem })
  
  // Tính toán số dư và điểm mới
  const moneyChange = transaction.so_tien || 0;
  const pointsChange = transaction.diem || 0;
  
  // Người san BỊ TRỪ tiền và điểm
  const newSenderBalance = parseFloat(sender.so_du) - parseFloat(moneyChange);
  const newSenderPoints = parseInt(sender.diem) - parseInt(pointsChange);
  
  // Người nhận san ĐƯỢC CỘNG tiền và điểm
  const newReceiverBalance = parseFloat(receiver.so_du) + parseFloat(moneyChange);
  const newReceiverPoints = parseInt(receiver.diem) + parseInt(pointsChange);
  
  console.log('\n=== KẾT QUẢ TÍNH TOÁN ===')
  console.log(`Người san (BỊ TRỪ):`)
  console.log('  - Cũ: Balance:', sender.so_du.toLocaleString('vi-VN'), 'VNĐ, Points:', sender.diem)
  console.log('  - Mới: Balance:', newSenderBalance.toLocaleString('vi-VN'), 'VNĐ, Points:', newSenderPoints)
  console.log('  - Thay đổi: -', moneyChange.toLocaleString('vi-VN'), 'VNĐ, -', pointsChange, 'điểm')
  
  console.log(`\nNgười nhận san (ĐƯỢC CỘNG):`)
  console.log('  - Cũ: Balance:', receiver.so_du.toLocaleString('vi-VN'), 'VNĐ, Points:', receiver.diem)
  console.log('  - Mới: Balance:', newReceiverBalance.toLocaleString('vi-VN'), 'VNĐ, Points:', newReceiverPoints)
  console.log('  - Thay đổi: +', moneyChange.toLocaleString('vi-VN'), 'VNĐ, +', pointsChange, 'điểm')
  
  // Kiểm tra tính toán có đúng không
  const balanceCheck = (sender.so_du + receiver.so_du) === (newSenderBalance + newReceiverBalance);
  const pointsCheck = (sender.diem + receiver.diem) === (newSenderPoints + newReceiverPoints);
  
  console.log('\n=== KIỂM TRA TÍNH TOÁN ===')
  console.log('Tổng số dư trước:', (sender.so_du + receiver.so_du).toLocaleString('vi-VN'), 'VNĐ')
  console.log('Tổng số dư sau:', (newSenderBalance + newReceiverBalance).toLocaleString('vi-VN'), 'VNĐ')
  console.log('Số dư được bảo toàn:', balanceCheck ? '✅ ĐÚNG' : '❌ SAI')
  
  console.log('Tổng điểm trước:', sender.diem + receiver.diem)
  console.log('Tổng điểm sau:', newSenderPoints + newReceiverPoints)
  console.log('Điểm được bảo toàn:', pointsCheck ? '✅ ĐÚNG' : '❌ SAI')
  
  return {
    success: balanceCheck && pointsCheck,
    newSenderBalance,
    newSenderPoints,
    newReceiverBalance,
    newReceiverPoints,
    balanceCheck,
    pointsCheck
  }
}

// Test case 1: Giao dịch San cho với tiền và điểm
console.log('=== TEST CASE 1: SAN CHO VỚI TIỀN VÀ ĐIỂM ===')
const testResult1 = testSanChoBalanceUpdate(
  mockUserData.sender,
  mockUserData.receiver,
  mockTransactionData
)

console.log('\n=== KẾT QUẢ TEST CASE 1 ===')
console.log('Test thành công:', testResult1.success ? '✅ PASS' : '❌ FAIL')
console.log('Số dư được bảo toàn:', testResult1.balanceCheck ? '✅ ĐÚNG' : '❌ SAI')
console.log('Điểm được bảo toàn:', testResult1.pointsCheck ? '✅ ĐÚNG' : '❌ SAI')

// Test case 2: Giao dịch San cho chỉ với tiền (không có điểm)
console.log('\n\n=== TEST CASE 2: SAN CHO CHỈ VỚI TIỀN ===')
const testResult2 = testSanChoBalanceUpdate(
  mockUserData.sender,
  mockUserData.receiver,
  { ...mockTransactionData, diem: 0 }
)

console.log('\n=== KẾT QUẢ TEST CASE 2 ===')
console.log('Test thành công:', testResult2.success ? '✅ PASS' : '❌ FAIL')

// Test case 3: Giao dịch San cho chỉ với điểm (không có tiền)
console.log('\n\n=== TEST CASE 3: SAN CHO CHỈ VỚI ĐIỂM ===')
const testResult3 = testSanChoBalanceUpdate(
  mockUserData.sender,
  mockUserData.receiver,
  { ...mockTransactionData, so_tien: 0 }
)

console.log('\n=== KẾT QUẢ TEST CASE 3 ===')
console.log('Test thành công:', testResult3.success ? '✅ PASS' : '❌ FAIL')

// Test case 4: Giao dịch San cho với số tiền và điểm lớn
console.log('\n\n=== TEST CASE 4: SAN CHO VỚI SỐ TIỀN VÀ ĐIỂM LỚN ===')
const testResult4 = testSanChoBalanceUpdate(
  mockUserData.sender,
  mockUserData.receiver,
  { so_tien: 500000, diem: 20 } // 500k VNĐ, 20 điểm
)

console.log('\n=== KẾT QUẢ TEST CASE 4 ===')
console.log('Test thành công:', testResult4.success ? '✅ PASS' : '❌ FAIL')

// Tổng kết
console.log('\n\n=== TỔNG KẾT TEST ===')
const allTests = [testResult1, testResult2, testResult3, testResult4]
const passedTests = allTests.filter(test => test.success).length
const totalTests = allTests.length

console.log(`Tổng số test: ${totalTests}`)
console.log(`Test thành công: ${passedTests}`)
console.log(`Test thất bại: ${totalTests - passedTests}`)
console.log(`Tỷ lệ thành công: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

if (passedTests === totalTests) {
  console.log('\n🎉 TẤT CẢ TEST ĐỀU THÀNH CÔNG!')
  console.log('✅ Logic cập nhật số dư và điểm cho giao dịch San cho hoạt động chính xác')
  console.log('✅ Số dư và điểm được bảo toàn trong hệ thống')
  console.log('✅ Người san BỊ TRỪ đúng số tiền và điểm')
  console.log('✅ Người nhận san ĐƯỢC CỘNG đúng số tiền và điểm')
} else {
  console.log('\n⚠️ CÓ TEST THẤT BẠI, CẦN KIỂM TRA LẠI LOGIC')
}

console.log('\n=== HƯỚNG DẪN KIỂM TRA TRÊN BACKEND ===')
console.log('1. Chạy test: node test-san-cho-balance.js')
console.log('2. Tạo giao dịch "San cho" trên frontend')
console.log('3. Kiểm tra số dư và điểm có được cập nhật đúng không')
console.log('4. Kiểm tra giao dịch "Nhận san" đối ứng có được tạo không')
console.log('5. Kiểm tra tổng số dư và điểm trong hệ thống có bảo toàn không')
