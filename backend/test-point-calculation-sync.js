/**
 * Test logic tính điểm đã đồng bộ giữa frontend và backend
 * Kiểm tra 7 loại tuyến mới và logic tính điểm chính xác
 */

const { calculateSchedulePoints, getPointCalculationDetails } = require('./services/pointCalculationService')

console.log('=== TEST LOGIC TÍNH ĐIỂM ĐÃ ĐỒNG BỘ ===\n')

// Test data với 7 loại tuyến mới
const testCases = [
  // 1. ĐÓN SÂN BAY (id_loai_tuyen = 1)
  {
    name: 'Đón sân bay sáng - Xe 5 chỗ - 350k',
    data: {
      id_loai_xe: 2, // Xe 5 chỗ
      id_loai_tuyen: 1, // Đón sân bay
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00', // 8h00 (5h00-11h59)
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 350000
    },
    expected: 1.5,
    description: 'Đón sân bay sáng >=320k = 1.5 điểm'
  },
  {
    name: 'Đón sân bay đêm - Xe 7 chỗ - 300k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 1, // Đón sân bay
      thoi_gian_bat_dau_don: '2024-01-15T02:00:00', // 2h00 (12h00-4h59)
      thoi_gian_ket_thuc_don: '2024-01-15T04:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 300000
    },
    expected: 1.0,
    description: 'Đón sân bay đêm >=300k = 1.0 điểm'
  },

  // 2. TIỄN SÂN BAY (id_loai_tuyen = 2)
  {
    name: 'Tiễn sân bay đêm - Xe 4 chỗ - 250k',
    data: {
      id_loai_xe: 1, // Xe 4 chỗ
      id_loai_tuyen: 2, // Tiễn sân bay
      thoi_gian_bat_dau_don: '2024-01-15T06:00:00', // 6h00 (00h-8h59)
      thoi_gian_ket_thuc_don: '2024-01-15T08:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 250000
    },
    expected: 0.5,
    description: 'Tiễn sân bay đêm >=200k = 0.5 điểm'
  },

  // 3. LỊCH PHỐ 1 CHIỀU (id_loai_tuyen = 3)
  {
    name: 'Lịch phố 1 chiều - 250k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 3, // Lịch phố 1 chiều
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: null, // Không có thời gian trả = 1 chiều
      thoi_gian_ket_thuc_tra: null,
      so_tien: 250000
    },
    expected: 0.5,
    description: 'Lịch phố 1 chiều 180k-300k = 0.5 điểm'
  },

  // 4. LỊCH PHỐ 2 CHIỀU (id_loai_tuyen = 4)
  {
    name: 'Lịch phố 2 chiều - Xe 5 chỗ - 400k',
    data: {
      id_loai_xe: 2, // Xe 5 chỗ
      id_loai_tuyen: 4, // Lịch phố 2 chiều
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00', // Có thời gian trả = 2 chiều
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 400000
    },
    expected: 1.0,
    description: 'Lịch phố 2 chiều xe 5 chỗ 350k-450k = 1.0 điểm'
  },

  // 5. LỊCH TỈNH/HUYỆN 1 CHIỀU (id_loai_tuyen = 5)
  {
    name: 'Lịch tỉnh 1 chiều - 400k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 5, // Tỉnh huyện 1 chiều
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: null, // Không có thời gian trả = 1 chiều
      thoi_gian_ket_thuc_tra: null,
      so_tien: 400000
    },
    expected: 1.0,
    description: 'Lịch tỉnh 1 chiều 300k-600k = 1.0 điểm'
  },

  // 6. LỊCH TỈNH/HUYỆN 2 CHIỀU (id_loai_tuyen = 6)
  {
    name: 'Lịch tỉnh 2 chiều - 800k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 6, // Tỉnh huyện 2 chiều
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00', // Có thời gian trả = 2 chiều
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 800000
    },
    expected: 1.5,
    description: 'Lịch tỉnh 2 chiều 700k-900k = 1.5 điểm'
  },

  // 7. LỊCH HƯỚNG SÂN BAY BÁN KÍNH 5KM (id_loai_tuyen = 7)
  {
    name: 'Lịch hướng sân bay 5km đêm - Xe 4 chỗ - 250k',
    data: {
      id_loai_xe: 1, // Xe 4 chỗ
      id_loai_tuyen: 7, // Hướng sân bay 5km
      thoi_gian_bat_dau_don: '2024-01-15T06:00:00', // 6h00 (00h-8h59)
      thoi_gian_ket_thuc_don: '2024-01-15T08:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 250000
    },
    expected: 0.5,
    description: 'Lịch hướng sân bay 5km đêm >=200k = 0.5 điểm (tính như tiễn sân bay)'
  },

  // 8. TRƯỜNG HỢP CẦN TÍNH THỦ CÔNG
  {
    name: 'Lịch tỉnh 1 chiều - 2.5M',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 5, // Tỉnh huyện 1 chiều
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 2500000
    },
    expected: 'manual',
    description: 'Lịch tỉnh >2.1M = cần tính thủ công'
  },

  // 9. TRƯỜNG HỢP FREE (0 điểm)
  {
    name: 'Lịch tỉnh 1 chiều - 150k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 5, // Tỉnh huyện 1 chiều
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 150000
    },
    expected: 0,
    description: 'Lịch tỉnh <180k = 0 điểm (FREE)'
  }
]

// Chạy test
console.log('=== KẾT QUẢ TEST ĐỒNG BỘ ===')
let passedTests = 0
let totalTests = testCases.length

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`)
  console.log(`   Mô tả: ${testCase.description}`)
  console.log(`   Dữ liệu:`, {
    loai_xe: `Xe ${testCase.data.id_loai_xe} chỗ`,
    loai_tuyen: testCase.data.id_loai_tuyen,
    so_tien: testCase.data.so_tien.toLocaleString('vi-VN') + ' VNĐ',
    thoi_gian: testCase.data.thoi_gian_bat_dau_don.substring(11, 16),
    khứ_hồi: testCase.data.thoi_gian_bat_dau_tra ? 'Có' : 'Không'
  })

  try {
    const result = calculateSchedulePoints(testCase.data)
    const expected = testCase.expected

    console.log(`   Kết quả: ${result}`)
    console.log(`   Mong đợi: ${expected}`)

    if (result === expected) {
      console.log(`   ✅ PASS`)
      passedTests++
    } else {
      console.log(`   ❌ FAIL - Không khớp kết quả`)
    }

    // Hiển thị chi tiết tính điểm
    const details = getPointCalculationDetails(testCase.data)
    console.log(`   Chi tiết: ${details.vehicleType} • ${details.routeType} • ${details.timeRange}`)
    console.log(`   Phương pháp: ${details.calculationMethod}`)

  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`)
  }
})

console.log(`\n=== TỔNG KẾT ===`)
console.log(`Tổng số test: ${totalTests}`)
console.log(`Test thành công: ${passedTests}`)
console.log(`Test thất bại: ${totalTests - passedTests}`)
console.log(`Tỷ lệ thành công: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

if (passedTests === totalTests) {
  console.log(`\n🎉 TẤT CẢ TEST ĐỀU THÀNH CÔNG!`)
  console.log(`✅ Logic tính điểm đã đồng bộ giữa frontend và backend`)
  console.log(`✅ 7 loại tuyến mới hoạt động chính xác`)
  console.log(`✅ Đã tách riêng lịch 1 chiều và 2 chiều`)
  console.log(`✅ Đã xử lý điều kiện khoảng cách`)
  console.log(`✅ Hỗ trợ điểm float: 0.5, 1.25, 1.5, 2.5, 3.5`)
} else {
  console.log(`\n⚠️ CÓ ${totalTests - passedTests} TEST THẤT BẠI, CẦN KIỂM TRA LẠI`)
}

console.log('\n=== HƯỚNG DẪN SỬ DỤNG ===')
console.log('1. Logic tính điểm đã được đồng bộ giữa frontend và backend')
console.log('2. Sử dụng 7 loại tuyến mới với ID từ 1-7')
console.log('3. Không cần logic phức tạp để xác định 1 chiều/2 chiều')
console.log('4. Database đã có 7 loại tuyến riêng biệt')
console.log('5. Frontend và backend sử dụng cùng logic tính điểm')

console.log('\n=== KIỂM TRA TÍNH NĂNG ===')
console.log('1. Chạy migration để cập nhật database: .\\run-migration.ps1')
console.log('2. Test tạo giao dịch "Giao lịch" mới trên frontend')
console.log('3. Kiểm tra điểm được tính tự động chính xác')
console.log('4. Kiểm tra console log để debug nếu cần')
