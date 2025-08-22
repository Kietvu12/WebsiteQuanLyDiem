/**
 * Test file để kiểm tra logic tính điểm float (0.5, 1.25, 1.5, 2.5, 3.5)
 * Chạy với Node.js để test logic tính điểm
 */

// Mock data cho test
const mockVehicleTypes = [
  { id_loai_xe: 1, ten_loai: 'Xe 4 chỗ', so_cho: 4 },
  { id_loai_xe: 2, ten_loai: 'Xe 5 chỗ', so_cho: 5 },
  { id_loai_xe: 3, ten_loai: 'Xe 7 chỗ', so_cho: 7 },
  { id_loai_xe: 4, ten_loai: 'Xe 16 chỗ', so_cho: 16 },
  { id_loai_xe: 5, ten_loai: 'Xe 29 chỗ', so_cho: 29 },
  { id_loai_xe: 6, ten_loai: 'Xe 45 chỗ', so_cho: 45 }
]

const mockRouteTypes = [
  { id_loai_tuyen: 1, ten_loai: 'Đón sân bay', la_khu_hoi: false },
  { id_loai_tuyen: 2, ten_loai: 'Tiễn sân bay', la_khu_hoi: false },
  { id_loai_tuyen: 3, ten_loai: 'Lịch phố', la_khu_hoi: true },
  { id_loai_tuyen: 4, ten_loai: 'Lịch tỉnh/huyện', la_khu_hoi: true }
]

console.log('=== TEST TÍNH ĐIỂM FLOAT ROOM ONE - WIN [1-1] ===\n')

// Test cases cho từng loại lịch
const testCases = [
  // 1. LỊCH ĐÓN SÂN BAY SÁNG (5h00-11h59) - Điểm cao nhất
  {
    name: 'Xe 5 chỗ - Đón sân bay sáng - 350k',
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
    description: 'Xe 5 chỗ đón sân bay sáng >=320k = 1.5 điểm'
  },
  {
    name: 'Xe 5 chỗ - Đón sân bay sáng - 280k',
    data: {
      id_loai_xe: 2,
      id_loai_tuyen: 1,
      thoi_gian_bat_dau_don: '2024-01-15T10:00:00', // 10h00 (5h00-11h59)
      thoi_gian_ket_thuc_don: '2024-01-15T12:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 280000
    },
    expected: 1.25,
    description: 'Xe 5 chỗ đón sân bay sáng >=270k = 1.25 điểm'
  },
  {
    name: 'Xe 7 chỗ - Đón sân bay sáng - 400k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 1, // Đón sân bay
      thoi_gian_bat_dau_don: '2024-01-15T07:00:00', // 7h00 (5h00-11h59)
      thoi_gian_ket_thuc_don: '2024-01-15T09:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 400000
    },
    expected: 1.5,
    description: 'Xe 7 chỗ đón sân bay sáng >=380k = 1.5 điểm'
  },

  // 2. LỊCH ĐÓN SÂN BAY ĐÊM (12h00-4h59) - Điểm trung bình
  {
    name: 'Xe 5 chỗ - Đón sân bay đêm - 280k',
    data: {
      id_loai_xe: 2,
      id_loai_tuyen: 1,
      thoi_gian_bat_dau_don: '2024-01-15T02:00:00', // 2h00 (12h00-4h59)
      thoi_gian_ket_thuc_don: '2024-01-15T04:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 280000
    },
    expected: 1.0,
    description: 'Xe 5 chỗ đón sân bay đêm >=250k = 1.0 điểm'
  },

  // 3. LỊCH TIỄN SÂN BAY ĐÊM (00h-8h59) - Điểm thấp
  {
    name: 'Xe 4 chỗ - Tiễn sân bay đêm - 250k',
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
    description: 'Xe 4 chỗ tiễn sân bay đêm >=200k = 0.5 điểm'
  },

  // 4. LỊCH TIỄN SÂN BAY NGÀY (9h00-23h59) - Điểm trung bình
  {
    name: 'Xe 4 chỗ - Tiễn sân bay ngày - 250k',
    data: {
      id_loai_xe: 1,
      id_loai_tuyen: 2,
      thoi_gian_bat_dau_don: '2024-01-15T14:00:00', // 14h00 (9h00-23h59)
      thoi_gian_ket_thuc_don: '2024-01-15T16:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 250000
    },
    expected: 1.0,
    description: 'Xe 4 chỗ tiễn sân bay ngày >=220k = 1.0 điểm'
  },

  // 5. LỊCH TỈNH/HUYỆN - Điểm theo giá
  {
    name: 'Lịch tỉnh 1 chiều - 400k',
    data: {
      id_loai_xe: 3,
      id_loai_tuyen: 4, // Tỉnh huyện
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: null, // Không có thời gian trả = 1 chiều
      thoi_gian_ket_thuc_tra: null,
      so_tien: 400000
    },
    expected: 1.0,
    description: 'Lịch tỉnh 1 chiều 300k-600k = 1.0 điểm'
  },
  {
    name: 'Lịch tỉnh 2 chiều - 800k',
    data: {
      id_loai_xe: 3,
      id_loai_tuyen: 4,
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00', // Có thời gian trả = 2 chiều
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 800000
    },
    expected: 1.5,
    description: 'Lịch tỉnh 2 chiều 700k-900k = 1.5 điểm'
  },
  {
    name: 'Lịch tỉnh 1 chiều - 1.3M',
    data: {
      id_loai_xe: 3,
      id_loai_tuyen: 4,
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: null,
      thoi_gian_ket_thuc_tra: null,
      so_tien: 1300000
    },
    expected: 2.5,
    description: 'Lịch tỉnh 1 chiều 1.2M-1.5M = 2.5 điểm'
  },

  // 6. LỊCH PHỐ 2 CHIỀU - Điểm theo xe và giá
  {
    name: 'Lịch phố 2 chiều xe 5 chỗ - 400k',
    data: {
      id_loai_xe: 2, // Xe 5 chỗ
      id_loai_tuyen: 3, // Lịch phố
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
    name: 'Lịch phố 2 chiều xe 7 chỗ - 600k',
    data: {
      id_loai_xe: 3, // Xe 7 chỗ
      id_loai_tuyen: 3, // Lịch phố
      thoi_gian_bat_dau_don: '2024-01-15T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-15T10:00:00',
      thoi_gian_bat_dau_tra: '2024-01-15T18:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-15T20:00:00',
      so_tien: 600000
    },
    expected: 1.5,
    description: 'Lịch phố 2 chiều xe 7 chỗ 500k-800k = 1.5 điểm'
  },

  // 7. XE ĐẶC BIỆT (16, 29, 45 chỗ) - Tính như xe 7 chỗ
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

  // 8. TRƯỜNG HỢP CẦN TÍNH THỦ CÔNG
  {
    name: 'Lịch tỉnh 1 chiều - 2.5M',
    data: {
      id_loai_xe: 3,
      id_loai_tuyen: 4,
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
      id_loai_xe: 3,
      id_loai_tuyen: 4,
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

// Mock function để test logic (sẽ được thay thế bằng service thực tế)
function mockCalculateSchedulePoints(scheduleData) {
  const { id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_bat_dau_tra, so_tien } = scheduleData
  
  if (!id_loai_xe || !id_loai_tuyen || !so_tien) {
    return 'manual'
  }
  
  const vehicleType = parseInt(id_loai_xe)
  const routeType = parseInt(id_loai_tuyen)
  const price = parseFloat(so_tien)
  const isRoundTrip = !!(thoi_gian_bat_dau_tra)
  
  // Xác định khung giờ
  const hour = new Date(thoi_gian_bat_dau_don).getHours()
  let timeRange = 'unknown'
  
  if (hour >= 5 && hour <= 11) timeRange = 'early_morning'      // 5h00-11h59
  else if (hour >= 0 && hour <= 4) timeRange = 'late_night'     // 12h00-4h59
  else if (hour >= 0 && hour <= 8) timeRange = 'night_departure' // 00h-8h59
  else if (hour >= 9 && hour <= 23) timeRange = 'day_departure'  // 9h00-23h59
  
  let points = 0
  
  // 1. LỊCH ĐÓN SÂN BAY
  if (routeType === 1) {
    if (timeRange === 'early_morning') {
      if (vehicleType === 2) { // Xe 5 chỗ
        if (price >= 320000) points = 1.5
        else if (price >= 270000) points = 1.25
        else if (price >= 250000) points = 1.0
      } else if (vehicleType === 3 || vehicleType === 4 || vehicleType === 5 || vehicleType === 6) { // Xe 7, 16, 29, 45 chỗ
        if (price >= 380000) points = 1.5
        else if (price >= 330000) points = 1.25
        else if (price >= 300000) points = 1.0
      }
    } else if (timeRange === 'late_night') {
      if (vehicleType === 2) { // Xe 5 chỗ
        if (price >= 250000) points = 1.0
      } else if (vehicleType === 3 || vehicleType === 4 || vehicleType === 5 || vehicleType === 6) { // Xe 7, 16, 29, 45 chỗ
        if (price >= 300000) points = 1.0
      }
    }
  }
  
  // 2. LỊCH TIỄN SÂN BAY
  else if (routeType === 2) {
    if (timeRange === 'night_departure') {
      if (vehicleType === 1) { // Xe 4 chỗ
        if (price >= 200000) points = 0.5
      } else if (vehicleType === 3 || vehicleType === 4 || vehicleType === 5 || vehicleType === 6) { // Xe 7, 16, 29, 45 chỗ
        if (price >= 220000) points = 0.5
      }
    } else if (timeRange === 'day_departure') {
      if (vehicleType === 1) { // Xe 4 chỗ
        if (price >= 220000) points = 1.0
        else if (price >= 200000) points = 0.75
      } else if (vehicleType === 3 || vehicleType === 4 || vehicleType === 5 || vehicleType === 6) { // Xe 7, 16, 29, 45 chỗ
        if (price >= 250000) points = 1.0
        else if (price >= 220000) points = 0.75
      }
    }
  }
  
  // 3. LỊCH TỈNH/HUYỆN
  else if (routeType === 4) {
    if (price < 180000) points = 0
    else if (price >= 180000 && price < 300000) points = 0.5
    else if (price >= 300000 && price < 600000) points = 1.0
    else if (price >= 700000 && price < 900000) points = 1.5
    else if (price >= 900000 && price < 1200000) points = 2.0
    else if (price >= 1200000 && price < 1500000) points = 2.5
    else if (price >= 1500000 && price < 1900000) points = 3.0
    else if (price >= 1900000 && price <= 2100000) points = 3.5
    else if (price > 2100000) points = 'manual'
  }
  
  // 4. LỊCH PHỐ 2 CHIỀU
  else if (routeType === 3 && isRoundTrip) {
    if (vehicleType === 2) { // Xe 5 chỗ
      if (price >= 250000 && price < 350000) points = 0.5
      else if (price >= 350000 && price < 450000) points = 1.0
      else if (price >= 450000 && price < 800000) points = 1.5
    } else if (vehicleType === 3 || vehicleType === 4 || vehicleType === 5 || vehicleType === 6) { // Xe 7, 16, 29, 45 chỗ
      if (price >= 450000 && price < 500000) points = 1.0
      else if (price >= 500000 && price < 800000) points = 1.5
    }
  }
  
  // 5. LỊCH PHỐ MỘT CHIỀU
  else if (routeType === 3 && !isRoundTrip) {
    if (price < 180000) points = 0
    else if (price >= 180000 && price < 300000) points = 0.5
    else if (price >= 300000 && price < 600000) points = 1.0
    else if (price >= 700000 && price < 900000) points = 1.5
    else if (price >= 900000 && price < 1200000) points = 2.0
    else if (price >= 1200000 && price < 1500000) points = 2.5
    else if (price >= 1500000 && price < 1900000) points = 3.0
    else if (price >= 1900000 && price <= 2100000) points = 3.5
    else if (price > 2100000) points = 'manual'
  }
  
  return points
}

// Chạy test
console.log('=== KẾT QUẢ TEST ===')
let passedTests = 0
let totalTests = testCases.length

testCases.forEach((testCase, index) => {
  console.log(`\n${index + 1}. ${testCase.name}`)
  console.log(`   Mô tả: ${testCase.description}`)
  console.log(`   Dữ liệu:`, {
    loai_xe: mockVehicleTypes.find(t => t.id_loai_xe === testCase.data.id_loai_xe)?.ten_loai,
    loai_tuyen: mockRouteTypes.find(t => t.id_loai_tuyen === testCase.data.id_loai_tuyen)?.ten_loai,
    so_tien: testCase.data.so_tien.toLocaleString('vi-VN') + ' VNĐ',
    thoi_gian: testCase.data.thoi_gian_bat_dau_don.substring(11, 16),
    khứ_hồi: testCase.data.thoi_gian_bat_dau_tra ? 'Có' : 'Không'
  })
  
  const result = mockCalculateSchedulePoints(testCase.data)
  const expected = testCase.expected
  
  console.log(`   Kết quả: ${result}`)
  console.log(`   Mong đợi: ${expected}`)
  
  if (result === expected) {
    console.log(`   ✅ PASS`)
    passedTests++
  } else {
    console.log(`   ❌ FAIL - Không khớp kết quả`)
  }
})

console.log(`\n=== TỔNG KẾT ===`)
console.log(`Tổng số test: ${totalTests}`)
console.log(`Test thành công: ${passedTests}`)
console.log(`Test thất bại: ${totalTests - passedTests}`)
console.log(`Tỷ lệ thành công: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

if (passedTests === totalTests) {
  console.log(`\n🎉 TẤT CẢ TEST ĐỀU THÀNH CÔNG!`)
} else {
  console.log(`\n⚠️ CÓ ${totalTests - passedTests} TEST THẤT BẠI, CẦN KIỂM TRA LẠI`)
}

console.log('\n=== HƯỚNG DẪN SỬ DỤNG ===')
console.log('1. Logic tính điểm đã hỗ trợ float (0.5, 1.25, 1.5, 2.5, 3.5)')
console.log('2. Tự động tính điểm dựa trên loại xe, loại tuyến, khung giờ và giá')
console.log('3. Xe 16, 29, 45 chỗ được tính như xe 7 chỗ')
console.log('4. Lịch trên 2.1M cần tính thủ công')
console.log('5. Lịch dưới 180k không được tính điểm (FREE)')
