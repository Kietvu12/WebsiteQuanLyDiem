/**
 * Test tích hợp loại tuyến mới với logic tính điểm
 * Chạy sau khi cập nhật database với migration
 * TÁCH RIÊNG LỊCH 1 CHIỀU VÀ 2 CHIỀU
 */

const { calculateSchedulePoints, getPointCalculationDetails } = require('./services/pointCalculationService')

console.log('=== TEST TÍCH HỢP LOẠI TUYẾN MỚI (TÁCH RIÊNG 1 CHIỀU/2 CHIỀU) ===\n')

// Test data với các loại tuyến mới
const testCases = [
  // 1. ĐÓN SÂN BAY (id_loai_tuyen = 1)
  {
    name: 'Đón sân bay sáng - Xe 5 chỗ - 350k',
    data: {
      id_loai_xe: 2, // Xe 5 chỗ
      id_loai_tuyen: 1, // Đón sân bay
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00', // 8h00 (5h00-11h59)
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
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
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
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
  {
    name: 'Tiễn sân bay ngày - Xe 7 chỗ - 250k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 2, // Tiễn sân bay
      thoi_gian_bat_dau_don: '2024-01-15T14:00:00', // 14h00 (9h00-23h59)
      thoi_gian_ket_thuc_don: '2024-01-15T16:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 250000
    },
    expected: 1.0,
    description: 'Tiễn sân bay ngày >=250k = 1.0 điểm'
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
  {
    name: 'Lịch phố 1 chiều - 400k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 3, // Lịch phố 1 chiều
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 400000
    },
    expected: 1.0,
    description: 'Lịch phố 1 chiều 300k-600k = 1.0 điểm'
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
  {
    name: 'Lịch phố 2 chiều - Xe 7 chỗ - 600k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 4, // Lịch phố 2 chiều
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 600000
    },
    expected: 1.5,
    description: 'Lịch phố 2 chiều xe 7 chỗ 500k-800k = 1.5 điểm'
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
  {
    name: 'Lịch hướng sân bay 5km ngày - Xe 7 chỗ - 250k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 7, // Hướng sân bay 5km
      thoi_gian_bat_dau_don: '2024-01-15T14:00:00', // 14h00 (9h00-23h59)
      thoi_gian_ket_thuc_don: '2024-01-15T16:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 250000
    },
    expected: 1.0,
    description: 'Lịch hướng sân bay 5km ngày >=250k = 1.0 điểm (tính như tiễn sân bay)'
  },

  // 8. XE ĐẶC BIỆT (16, 29, 45 chỗ) - Tính như xe 7 chỗ
  {
    name: 'Xe 16 chỗ - Đón sân bay sáng - 400k',
    data: {
      id_loai_xe: 4, // Xe 16 chỗ
      id_loai_tuyen: 1, // Đón sân bay
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00', // 8h00 (5h00-11h59)
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 400000
    },
    expected: 1.5,
    description: 'Xe 16 chỗ đón sân bay sáng >=380k = 1.5 điểm (tính như xe 7 chỗ)'
  },

  // 9. TRƯỜNG HỢP CẦN TÍNH THỦ CÔNG
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

  // 10. TRƯỜNG HỢP FREE (0 điểm)
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
console.log('=== KẾT QUẢ TEST TÍCH HỢP ===')
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
  console.log(`✅ Logic tính điểm đã hoạt động chính xác với các loại tuyến mới`)
  console.log(`✅ Đã tách riêng lịch 1 chiều và 2 chiều`)
  console.log(`✅ Đã xử lý điều kiện khoảng cách`)
} else {
  console.log(`\n⚠️ CÓ ${totalTests - passedTests} TEST THẤT BẠI, CẦN KIỂM TRA LẠI`)
}

console.log('\n=== HƯỚNG DẪN SỬ DỤNG ===')
console.log('1. Chạy migration: mysql -u username -p database_name < update-route-types.sql')
console.log('2. Kiểm tra database đã có 7 loại tuyến: Đón sân bay, Tiễn sân bay, Phố 1 chiều, Phố 2 chiều, Tỉnh huyện 1 chiều, Tỉnh huyện 2 chiều, Hướng sân bay 5km')
console.log('3. Logic tính điểm sẽ tự động hoạt động khi tạo giao dịch "Giao lịch"')
console.log('4. Điểm được tính dựa trên: loại xe, loại tuyến, khung giờ, giá tiền')
console.log('5. Hỗ trợ điểm float: 0.5, 1.25, 1.5, 2.5, 3.5')
console.log('6. Đã tách riêng lịch 1 chiều và 2 chiều')
console.log('7. Đã xử lý điều kiện khoảng cách (lịch hướng sân bay 5km)')
