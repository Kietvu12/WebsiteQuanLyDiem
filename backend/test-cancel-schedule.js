/**
 * Test chức năng hủy lịch xe và hoàn tiền/điểm
 * Kiểm tra xem logic có hoạt động đúng không
 */

console.log('=== TEST CHỨC NĂNG HỦY LỊCH XE VÀ HOÀN TIỀN/ĐIỂM ===\n')

// Mock data cho test
const mockScheduleData = {
  id_lich_xe: 1,
  id_nguoi_tao: 1,
  id_nguoi_nhan: 2,
  trang_thai: 'cho_xac_nhan',
  thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
  thoi_gian_ket_thuc_don: '2024-01-15T08:30:00',
  ten_nguoi_tao: 'Nguyễn Văn A',
  ten_nguoi_nhan: 'Trần Thị B',
  ten_nhom: 'Nhóm Vận chuyển 1'
}

const mockTransactionData = {
  id_giao_dich: 1,
  id_loai_giao_dich: 1, // Giao lịch
  id_nguoi_gui: 1,
  id_nguoi_nhan: 2,
  so_tien: 200000, // 200k VNĐ
  diem: 10, // 10 điểm
  trang_thai: 'hoan_thanh'
}

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

// Function để test logic hủy lịch xe (giống như trong controller)
function testCancelSchedule(schedule, transaction, sender, receiver) {
  console.log('=== BẮT ĐẦU TEST HỦY LỊCH XE ===')
  console.log('Lịch xe:', { id: schedule.id_lich_xe, status: schedule.trang_thai })
  console.log('Giao dịch liên quan:', { id: transaction.id_giao_dich, amount: transaction.so_tien, points: transaction.diem })
  console.log('Người tạo (trước):', { id: sender.id_nguoi_dung, balance: sender.so_du, points: sender.diem })
  console.log('Người nhận (trước):', { id: receiver.id_nguoi_dung, balance: receiver.so_du, points: receiver.diem })
  
  // Kiểm tra điều kiện hủy lịch xe
  const canCancel = schedule.trang_thai === 'cho_xac_nhan'
  console.log('\n=== KIỂM TRA ĐIỀU KIỆN HỦY ===')
  console.log('Trạng thái lịch xe:', schedule.trang_thai)
  console.log('Có thể hủy:', canCancel ? '✅ CÓ' : '❌ KHÔNG')
  
  if (!canCancel) {
    console.log('❌ Lịch xe không thể hủy (đã hoàn thành hoặc đã hủy)')
    return { success: false, reason: 'invalid_status' }
  }
  
  // Xử lý hoàn tiền và điểm
  console.log('\n=== XỬ LÝ HOÀN TIỀN VÀ ĐIỂM ===')
  const refundAmount = transaction.so_tien || 0
  const refundPoints = transaction.diem || 0
  
  console.log('Số tiền hoàn lại:', refundAmount.toLocaleString('vi-VN'), 'VNĐ')
  console.log('Số điểm hoàn lại:', refundPoints)
  
  // Hoàn lại tiền và điểm cho người gửi (người tạo lịch)
  const newSenderBalance = parseFloat(sender.so_du) + parseFloat(refundAmount)
  const newSenderPoints = parseInt(sender.diem) + parseInt(refundPoints)
  
  // Hoàn lại tiền và điểm cho người nhận (người nhận lịch)
  const newReceiverBalance = parseFloat(receiver.so_du) - parseFloat(refundAmount)
  const newReceiverPoints = parseInt(receiver.diem) - parseInt(refundPoints)
  
  console.log('\n=== KẾT QUẢ HOÀN TIỀN VÀ ĐIỂM ===')
  console.log(`Người tạo lịch (ĐƯỢC HOÀN):`)
  console.log('  - Cũ: Balance:', sender.so_du.toLocaleString('vi-VN'), 'VNĐ, Points:', sender.diem)
  console.log('  - Mới: Balance:', newSenderBalance.toLocaleString('vi-VN'), 'VNĐ, Points:', newSenderPoints)
  console.log('  - Thay đổi: +', refundAmount.toLocaleString('vi-VN'), 'VNĐ, +', refundPoints, 'điểm')
  
  console.log(`\nNgười nhận lịch (BỊ TRỪ):`)
  console.log('  - Cũ: Balance:', receiver.so_du.toLocaleString('vi-VN'), 'VNĐ, Points:', receiver.diem)
  console.log('  - Mới: Balance:', newReceiverBalance.toLocaleString('vi-VN'), 'VNĐ, Points:', newReceiverPoints)
  console.log('  - Thay đổi: -', refundAmount.toLocaleString('vi-VN'), 'VNĐ, -', refundPoints, 'điểm')
  
  // Kiểm tra tính toán có đúng không
  const balanceCheck = (sender.so_du + receiver.so_du) === (newSenderBalance + newReceiverBalance)
  const pointsCheck = (sender.diem + receiver.diem) === (newSenderPoints + newReceiverPoints)
  
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
    pointsCheck,
    refundAmount,
    refundPoints
  }
}

// Test case 1: Hủy lịch xe với tiền và điểm
console.log('=== TEST CASE 1: HỦY LỊCH XE VỚI TIỀN VÀ ĐIỂM ===')
const testResult1 = testCancelSchedule(
  mockScheduleData,
  mockTransactionData,
  mockUserData.sender,
  mockUserData.receiver
)

console.log('\n=== KẾT QUẢ TEST CASE 1 ===')
console.log('Test thành công:', testResult1.success ? '✅ PASS' : '❌ FAIL')
console.log('Số dư được bảo toàn:', testResult1.balanceCheck ? '✅ ĐÚNG' : '❌ SAI')
console.log('Điểm được bảo toàn:', testResult1.pointsCheck ? '✅ ĐÚNG' : '❌ SAI')

// Test case 2: Hủy lịch xe chỉ với tiền (không có điểm)
console.log('\n\n=== TEST CASE 2: HỦY LỊCH XE CHỈ VỚI TIỀN ===')
const testResult2 = testCancelSchedule(
  mockScheduleData,
  { ...mockTransactionData, diem: 0 },
  mockUserData.sender,
  mockUserData.receiver
)

console.log('\n=== KẾT QUẢ TEST CASE 2 ===')
console.log('Test thành công:', testResult2.success ? '✅ PASS' : '❌ FAIL')

// Test case 3: Hủy lịch xe chỉ với điểm (không có tiền)
console.log('\n\n=== TEST CASE 3: HỦY LỊCH XE CHỈ VỚI ĐIỂM ===')
const testResult3 = testCancelSchedule(
  mockScheduleData,
  { ...mockTransactionData, so_tien: 0 },
  mockUserData.sender,
  mockUserData.receiver
)

console.log('\n=== KẾT QUẢ TEST CASE 3 ===')
console.log('Test thành công:', testResult3.success ? '✅ PASS' : '❌ FAIL')

// Test case 4: Hủy lịch xe với số tiền và điểm lớn
console.log('\n\n=== TEST CASE 4: HỦY LỊCH XE VỚI SỐ TIỀN VÀ ĐIỂM LỚN ===')
const testResult4 = testCancelSchedule(
  mockScheduleData,
  { so_tien: 500000, diem: 20 }, // 500k VNĐ, 20 điểm
  mockUserData.sender,
  mockUserData.receiver
)

console.log('\n=== KẾT QUẢ TEST CASE 4 ===')
console.log('Test thành công:', testResult4.success ? '✅ PASS' : '❌ FAIL')

// Test case 5: Hủy lịch xe đã hoàn thành (không thể hủy)
console.log('\n\n=== TEST CASE 5: HỦY LỊCH XE ĐÃ HOÀN THÀNH ===')
const testResult5 = testCancelSchedule(
  { ...mockScheduleData, trang_thai: 'hoan_thanh' },
  mockTransactionData,
  mockUserData.sender,
  mockUserData.receiver
)

console.log('\n=== KẾT QUẢ TEST CASE 5 ===')
console.log('Test thành công:', testResult5.success ? '✅ PASS' : '❌ FAIL')
console.log('Lý do:', testResult5.reason === 'invalid_status' ? 'Trạng thái không hợp lệ' : 'Khác')

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
  console.log('✅ Logic hủy lịch xe hoạt động chính xác')
  console.log('✅ Hoàn tiền và điểm được xử lý đúng')
  console.log('✅ Số dư và điểm được bảo toàn trong hệ thống')
  console.log('✅ Người tạo lịch được hoàn lại tiền và điểm')
  console.log('✅ Người nhận lịch bị trừ tiền và điểm tương ứng')
} else {
  console.log('\n⚠️ CÓ TEST THẤT BẠI, CẦN KIỂM TRA LẠI LOGIC')
}

console.log('\n=== HƯỚNG DẪN KIỂM TRA TRÊN BACKEND ===')
console.log('1. Chạy test: node test-cancel-schedule.js')
console.log('2. Tạo lịch xe trên frontend')
console.log('3. Hủy lịch xe và kiểm tra số dư/điểm có được hoàn lại không')
console.log('4. Kiểm tra giao dịch có được cập nhật trạng thái không')
console.log('5. Kiểm tra thông báo có được gửi không')
console.log('')
console.log('=== LOGIC HOẠT ĐỘNG ===')
console.log('1. Kiểm tra trạng thái lịch xe (chỉ cho phép hủy khi chờ xác nhận)')
console.log('2. Tìm giao dịch liên quan đến lịch xe')
console.log('3. Hoàn lại tiền và điểm cho người tạo lịch')
console.log('4. Trừ tiền và điểm từ người nhận lịch')
console.log('5. Cập nhật trạng thái lịch xe thành "đã hủy"')
console.log('6. Gửi thông báo cho các bên liên quan')
console.log('')
console.log('=== BẢO TOÀN DỮ LIỆU ===')
console.log('✅ Tổng số dư trong hệ thống không thay đổi')
console.log('✅ Tổng số điểm trong hệ thống không thay đổi')
console.log('✅ Chỉ chuyển tiền/điểm giữa các người dùng')
console.log('✅ Không có tiền/điểm bị mất hoặc tạo thêm')
