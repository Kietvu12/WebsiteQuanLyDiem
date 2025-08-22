/**
 * Service tính điểm theo quy tắc Room One - WIN [1-1]
 * Xử lý tất cả các trường hợp tính điểm theo loại xe, khung giờ và loại tuyến
 * Hỗ trợ điểm float (0.5, 1.25, 1.5, 2.5, 3.5)
 * TÁCH RIÊNG LỊCH 1 CHIỀU VÀ 2 CHIỀU - ĐÃ SỬA ĐỒNG BỘ
 */

// Constants cho loại xe - CẬP NHẬT THEO DATABASE THỰC TẾ
const VEHICLE_TYPES = {
  XE_4_CHO: 1,      // Database trả về id=1 cho xe 4 chỗ
  XE_5_CHO: 2,      // Database trả về id=2 cho xe 5 chỗ  
  XE_7_CHO: 3,      // Database trả về id=3 cho xe 7 chỗ
  XE_16_CHO: 4,     // Database trả về id=4 cho xe 16 chỗ
  XE_29_CHO: 5,     // Database trả về id=5 cho xe 29 chỗ
  XE_45_CHO: 6      // Database trả về id=6 cho xe 45 chỗ
}

// Constants cho loại tuyến MỚI (tách riêng 1 chiều và 2 chiều)
const ROUTE_TYPES = {
  DON_SAN_BAY: 1,           // Đón sân bay
  TIEN_SAN_BAY: 2,          // Tiễn sân bay
  PHO_1_CHIEU: 3,           // Lịch phố 1 chiều
  PHO_2_CHIEU: 4,           // Lịch phố 2 chiều
  TINH_HUYEN_1_CHIEU: 5,    // Lịch tỉnh/huyện 1 chiều
  TINH_HUYEN_2_CHIEU: 6,    // Lịch tỉnh/huyện 2 chiều
  HUONG_SAN_BAY_5KM: 7      // Lịch hướng sân bay bán kính 5km
}

// Constants cho khung giờ
const TIME_RANGES = {
  EARLY_MORNING: 'early_morning',      // 5h00-11h59
  LATE_NIGHT: 'late_night',           // 12h00-4h59
  NIGHT_DEPARTURE: 'night_departure', // 00h-8h59
  DAY_DEPARTURE: 'day_departure'      // 9h00-23h59
}

/**
 * Tính điểm cho lịch đón sân bay sáng (5h00-11h59) - Điểm cao nhất
 */
function calculateAirportPickupEarlyMorningPoints(vehicleType, price) {
  if (vehicleType === VEHICLE_TYPES.XE_5_CHO) {
    if (price >= 320000) return 1.5
    if (price >= 270000) return 1.25
    if (price >= 250000) return 1.0
    return 0
  }
  
  if (vehicleType === VEHICLE_TYPES.XE_7_CHO) {
    if (price >= 380000) return 1.5
    if (price >= 330000) return 1.25
    if (price >= 300000) return 1.0
    return 0
  }
  
  // Xe 16, 29, 45 chỗ tính như xe 7 chỗ
  if ([VEHICLE_TYPES.XE_16_CHO, VEHICLE_TYPES.XE_29_CHO, VEHICLE_TYPES.XE_45_CHO].includes(vehicleType)) {
    if (price >= 380000) return 1.5
    if (price >= 330000) return 1.25
    if (price >= 300000) return 1.0
    return 0
  }
  
  return 0
}

/**
 * Tính điểm cho lịch đón sân bay đêm (12h00-4h59) - Điểm trung bình
 */
function calculateAirportPickupLateNightPoints(vehicleType, price) {
  if (vehicleType === VEHICLE_TYPES.XE_5_CHO) {
    if (price >= 250000) return 1.0
    return 0
  }
  
  if (vehicleType === VEHICLE_TYPES.XE_7_CHO) {
    if (price >= 300000) return 1.0
    return 0
  }
  
  // Xe 16, 29, 45 chỗ tính như xe 7 chỗ
  if ([VEHICLE_TYPES.XE_16_CHO, VEHICLE_TYPES.XE_29_CHO, VEHICLE_TYPES.XE_45_CHO].includes(vehicleType)) {
    if (price >= 300000) return 1.0
    return 0
  }
  
  return 0
}

/**
 * Tính điểm cho lịch tiễn sân bay đêm (00h-8h59) - Điểm thấp
 */
function calculateAirportDepartureNightPoints(vehicleType, price) {
  if (vehicleType === VEHICLE_TYPES.XE_4_CHO) {
    if (price >= 200000) return 0.5
    return 0
  }
  
  if (vehicleType === VEHICLE_TYPES.XE_7_CHO) {
    if (price >= 220000) return 0.5
    return 0
  }
  
  // Xe 16, 29, 45 chỗ tính như xe 7 chỗ
  if ([VEHICLE_TYPES.XE_16_CHO, VEHICLE_TYPES.XE_29_CHO, VEHICLE_TYPES.XE_45_CHO].includes(vehicleType)) {
    if (price >= 220000) return 0.5
    return 0
  }
  
  return 0
}

/**
 * Tính điểm cho lịch tiễn sân bay ngày (9h00-23h59) - Điểm trung bình
 */
function calculateAirportDepartureDayPoints(vehicleType, price) {
  if (vehicleType === VEHICLE_TYPES.XE_4_CHO) {
    if (price >= 220000) return 1.0
    if (price >= 200000) return 0.75
    return 0
  }
  
  if (vehicleType === VEHICLE_TYPES.XE_7_CHO) {
    if (price >= 250000) return 1.0
    if (price >= 220000) return 0.75
    return 0
  }
  
  // Xe 16, 29, 45 chỗ tính như xe 7 chỗ
  if ([VEHICLE_TYPES.XE_16_CHO, VEHICLE_TYPES.XE_29_CHO, VEHICLE_TYPES.XE_45_CHO].includes(vehicleType)) {
    if (price >= 250000) return 1.0
    if (price >= 220000) return 0.75
    return 0
  }
  
  return 0
}

/**
 * Tính điểm cho lịch tỉnh/huyện theo giá (1 chiều và 2 chiều)
 */
function calculateProvinceDistrictPoints(price, isRoundTrip = false) {
  // Lịch dưới 180k = 0 điểm
  if (price < 180000) return 0
  
  // Lịch 180k-300k = 0.5 điểm
  if (price >= 180000 && price < 300000) return 0.5
  
  // Lịch 300k-600k = 1 điểm
  if (price >= 300000 && price < 600000) return 1.0
  
  // Lịch 700k-900k = 1.5 điểm
  if (price >= 700000 && price < 900000) return 1.5
  
  // Lịch 900k-1.2M = 2 điểm
  if (price >= 900000 && price < 1200000) return 2.0
  
  // Lịch 1.2M-1.5M = 2.5 điểm
  if (price >= 1200000 && price < 1500000) return 2.5
  
  // Lịch 1.5M-1.9M = 3 điểm
  if (price >= 1500000 && price < 1900000) return 3.0
  
  // Lịch 1.9M-2.1M = 3.5 điểm
  if (price >= 1900000 && price <= 2100000) return 3.5
  
  // Lịch trên 2.1M = cần tính thủ công
  return 'manual'
}

/**
 * Tính điểm cho lịch phố 2 chiều theo loại xe và giá (có khoảng cách)
 */
function calculateStreetRoundTripPoints(vehicleType, price) {
  if (vehicleType === VEHICLE_TYPES.XE_5_CHO) {
    // Lịch 2 chiều phố xe 5 chỗ: 250k-350k (0.5đ), 350k-450k (1đ), 450k-800k (1.5đ)
    if (price >= 250000 && price < 350000) return 0.5
    if (price >= 350000 && price < 450000) return 1.0
    if (price >= 450000 && price < 800000) return 1.5
    return 0
  }
  
  if (vehicleType === VEHICLE_TYPES.XE_7_CHO) {
    // Lịch 2 chiều phố xe 7 chỗ: 250k-350k (0.5đ), 350k-450k (1đ), 450k-500k (1đ), 500k-800k (1.5đ)
    if (price >= 250000 && price < 350000) return 0.5
    if (price >= 350000 && price < 450000) return 1.0
    if (price >= 450000 && price < 500000) return 1.0
    if (price >= 500000 && price < 800000) return 1.5
    return 0
  }
  
  // Xe 16, 29, 45 chỗ tính như xe 7 chỗ
  if ([VEHICLE_TYPES.XE_16_CHO, VEHICLE_TYPES.XE_29_CHO, VEHICLE_TYPES.XE_45_CHO].includes(vehicleType)) {
    if (price >= 250000 && price < 350000) return 0.5
    if (price >= 350000 && price < 450000) return 1.0
    if (price >= 450000 && price < 500000) return 1.0
    if (price >= 500000 && price < 800000) return 1.5
    return 0
  }
  
  return 0
}

/**
 * Tính điểm cho lịch phố 1 chiều theo giá
 */
function calculateStreetOneWayPoints(price) {
  // Lịch phố 1 chiều: 180k-300k (0.5đ), 300k-600k (1đ)
  if (price < 180000) return 0
  if (price >= 180000 && price < 300000) return 0.5
  if (price >= 300000 && price < 600000) return 1.0
  if (price >= 600000 && price < 900000) return 1.5
  if (price >= 900000 && price < 1200000) return 2.0
  if (price >= 1200000 && price < 1500000) return 2.5
  if (price >= 1500000 && price < 1900000) return 3.0
  if (price >= 1900000 && price <= 2100000) return 3.5
  if (price > 2100000) return 'manual'
  
  return 0
}

/**
 * Xác định khung giờ dựa trên thời gian - ĐÃ SỬA CONFLICT
 * Lưu ý: Khung giờ đón và tiễn sân bay khác nhau
 */
function getTimeRange(time) {
  if (!time) return TIME_RANGES.DAY_DEPARTURE
  
  const hour = new Date(time).getHours()
  
  // ĐÓN SÂN BAY: 5h00-11h59 (sáng), 12h00-4h59 (đêm)
  if (hour >= 5 && hour <= 11) return TIME_RANGES.EARLY_MORNING  // 5h00-11h59
  if (hour >= 12 || hour <= 4) return TIME_RANGES.LATE_NIGHT     // 12h00-4h59
  
  // TIỄN SÂN BAY: 00h-8h59 (đêm), 9h00-23h59 (ngày)
  if (hour >= 0 && hour <= 8) return TIME_RANGES.NIGHT_DEPARTURE // 00h-8h59
  if (hour >= 9 && hour <= 23) return TIME_RANGES.DAY_DEPARTURE  // 9h00-23h59
  
  return TIME_RANGES.DAY_DEPARTURE // Fallback
}

/**
 * Xác định loại tuyến dựa trên dữ liệu lịch xe - ĐÃ SỬA ĐỒNG BỘ
 */
function getRouteType(scheduleData) {
  const { id_loai_tuyen, thoi_gian_bat_dau_tra } = scheduleData
  
  // Kiểm tra nếu có thời gian trả (khứ hồi)
  const hasReturnTime = thoi_gian_bat_dau_tra && thoi_gian_bat_dau_tra.trim() !== ''
  
  console.log('getRouteType debug:', {
    id_loai_tuyen,
    thoi_gian_bat_dau_tra,
    hasReturnTime,
    routeType: id_loai_tuyen
  })
  
  // Trả về trực tiếp ID loại tuyến từ database
  // Không cần logic phức tạp vì đã có 7 loại tuyến riêng biệt
  return parseInt(id_loai_tuyen)
}

/**
 * Tính điểm chính cho lịch xe dựa trên tất cả điều kiện - ĐÃ SỬA ĐỒNG BỘ
 */
function calculateSchedulePoints(scheduleData) {
  try {
    const { id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_bat_dau_tra, so_tien } = scheduleData
    
    if (!id_loai_xe || !id_loai_tuyen || !so_tien) {
      console.log('Thiếu thông tin cần thiết để tính điểm:', { id_loai_xe, id_loai_tuyen, so_tien })
      return 'manual'
    }
    
    const vehicleType = parseInt(id_loai_xe)
    const routeType = parseInt(id_loai_tuyen)
    const price = parseFloat(so_tien)
    const isRoundTrip = !!(thoi_gian_bat_dau_tra && thoi_gian_bat_dau_tra.trim() !== '')
    
    console.log('=== TÍNH ĐIỂM VỚI DỮ LIỆU MỚI ===')
    console.log('Vehicle Type:', vehicleType, `(Xe ${vehicleType} chỗ)`)
    console.log('Route Type:', routeType, `(Loại tuyến ${routeType})`)
    console.log('Price:', price.toLocaleString('vi-VN'), 'VNĐ')
    console.log('Is Round Trip:', isRoundTrip)
    console.log('Pickup Time:', thoi_gian_bat_dau_don)
    console.log('Return Time:', thoi_gian_bat_dau_tra)
    
    let points = 0
    
    // 1. LỊCH ĐÓN SÂN BAY (id_loai_tuyen = 1)
    if (routeType === ROUTE_TYPES.DON_SAN_BAY) {
      const timeRange = getTimeRange(thoi_gian_bat_dau_don)
      console.log('🛬 ĐÓN SÂN BAY - Khung giờ:', timeRange)
      
      if (timeRange === TIME_RANGES.EARLY_MORNING) {
        // 5h00-11h59: Điểm cao nhất
        points = calculateAirportPickupEarlyMorningPoints(vehicleType, price)
        console.log(`✅ Đón sân bay sáng (5h00-11h59): ${points} điểm`)
      } else if (timeRange === TIME_RANGES.LATE_NIGHT) {
        // 12h00-4h59: Điểm trung bình
        points = calculateAirportPickupLateNightPoints(vehicleType, price)
        console.log(`✅ Đón sân bay đêm (12h00-4h59): ${points} điểm`)
      } else {
        console.log('❌ Khung giờ đón sân bay không hợp lệ:', timeRange)
        return 'manual'
      }
    }
    
    // 2. LỊCH TIỄN SÂN BAY (id_loai_tuyen = 2)
    else if (routeType === ROUTE_TYPES.TIEN_SAN_BAY) {
      const timeRange = getTimeRange(thoi_gian_bat_dau_don)
      console.log('🛫 TIỄN SÂN BAY - Khung giờ:', timeRange)
      
      if (timeRange === TIME_RANGES.NIGHT_DEPARTURE) {
        // 00h-8h59: Điểm thấp
        points = calculateAirportDepartureNightPoints(vehicleType, price)
        console.log(`✅ Tiễn sân bay đêm (00h-8h59): ${points} điểm`)
      } else if (timeRange === TIME_RANGES.DAY_DEPARTURE) {
        // 9h00-23h59: Điểm trung bình
        points = calculateAirportDepartureDayPoints(vehicleType, price)
        console.log(`✅ Tiễn sân bay ngày (9h00-23h59): ${points} điểm`)
      } else {
        console.log('❌ Khung giờ tiễn sân bay không hợp lệ:', timeRange)
        return 'manual'
      }
    }
    
    // 3. LỊCH PHỐ 1 CHIỀU (id_loai_tuyen = 3)
    else if (routeType === ROUTE_TYPES.PHO_1_CHIEU) {
      console.log('🏙️ LỊCH PHỐ 1 CHIỀU')
      points = calculateStreetOneWayPoints(price)
      console.log(`✅ Lịch phố 1 chiều: ${points} điểm`)
    }
    
    // 4. LỊCH PHỐ 2 CHIỀU (id_loai_tuyen = 4)
    else if (routeType === ROUTE_TYPES.PHO_2_CHIEU) {
      console.log('🏙️ LỊCH PHỐ 2 CHIỀU')
      points = calculateStreetRoundTripPoints(vehicleType, price)
      console.log(`✅ Lịch phố 2 chiều: ${points} điểm`)
    }
    
    // 5. LỊCH TỈNH/HUYỆN 1 CHIỀU (id_loai_tuyen = 5)
    else if (routeType === ROUTE_TYPES.TINH_HUYEN_1_CHIEU) {
      console.log('🏘️ LỊCH TỈNH/HUYỆN 1 CHIỀU')
      points = calculateProvinceDistrictPoints(price, false)
      console.log(`✅ Lịch tỉnh/huyện 1 chiều: ${points} điểm`)
    }
    
    // 6. LỊCH TỈNH/HUYỆN 2 CHIỀU (id_loai_tuyen = 6)
    else if (routeType === ROUTE_TYPES.TINH_HUYEN_2_CHIEU) {
      console.log('🏘️ LỊCH TỈNH/HUYỆN 2 CHIỀU')
      points = calculateProvinceDistrictPoints(price, true)
      console.log(`✅ Lịch tỉnh/huyện 2 chiều: ${points} điểm`)
    }
    
    // 7. LỊCH HƯỚNG SÂN BAY BÁN KÍNH 5KM (id_loai_tuyen = 7)
    else if (routeType === ROUTE_TYPES.HUONG_SAN_BAY_5KM) {
      console.log('📍 LỊCH HƯỚNG SÂN BAY 5KM')
      // Tính như lịch tiễn sân bay
      const timeRange = getTimeRange(thoi_gian_bat_dau_don)
      
      if (timeRange === TIME_RANGES.NIGHT_DEPARTURE) {
        // 00h-8h59: Điểm thấp
        points = calculateAirportDepartureNightPoints(vehicleType, price)
        console.log(`✅ Lịch hướng sân bay 5km đêm (00h-8h59): ${points} điểm`)
      } else if (timeRange === TIME_RANGES.DAY_DEPARTURE) {
        // 9h00-23h59: Điểm trung bình
        points = calculateAirportDepartureDayPoints(vehicleType, price)
        console.log(`✅ Lịch hướng sân bay 5km ngày (9h00-23h59): ${points} điểm`)
      } else {
        console.log('❌ Khung giờ lịch hướng sân bay không hợp lệ:', timeRange)
        return 'manual'
      }
    }
    
    // Trường hợp không xác định được
    else {
      console.log('❌ Loại tuyến không được hỗ trợ tính điểm tự động:', routeType)
      return 'manual'
    }
    
    // Kiểm tra kết quả
    if (points === 'manual') {
      console.log('⚠️ Cần tính điểm thủ công')
      return 'manual'
    }
    
    if (points === 0) {
      console.log('🆓 Lịch này không được tính điểm (FREE)')
      return 0
    }
    
    console.log(`🎯 KẾT QUẢ: ${points} điểm`)
    console.log('=== HOÀN THÀNH TÍNH ĐIỂM ===')
    return points
    
  } catch (error) {
    console.error('❌ Lỗi khi tính điểm:', error)
    return 'manual'
  }
}

/**
 * Tính điểm cho giao dịch (fallback method)
 */
function calculateTransactionPoints(transactionData) {
  // Nếu có lịch xe, sử dụng calculateSchedulePoints
  if (transactionData.id_lich_xe) {
    return calculateSchedulePoints(transactionData)
  }
  
  // Fallback: tính theo số tiền (đơn giản)
  return calculatePointsByAmount(transactionData.so_tien)
}

/**
 * Tính điểm theo số tiền (fallback method)
 */
function calculatePointsByAmount(amount) {
  if (!amount || amount < 0) return 0
  
  const price = parseFloat(amount)
  
  // Logic đơn giản dựa trên giá
  if (price >= 1000000) return 2.0
  if (price >= 500000) return 1.0
  if (price >= 200000) return 0.5
  
  return 0
}

/**
 * Lấy chi tiết cách tính điểm - ĐÃ SỬA ĐỒNG BỘ
 */
function getPointCalculationDetails(scheduleData) {
  try {
    const { id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_bat_dau_tra, so_tien } = scheduleData
    
    if (!id_loai_xe || !id_loai_tuyen || !so_tien) {
      return {
        vehicleType: 'Không xác định',
        routeType: 'Không xác định',
        timeRange: 'Không xác định',
        price: 0,
        calculationMethod: 'Không thể tính',
        reason: 'Thiếu thông tin cần thiết'
      }
    }
    
    const vehicleType = parseInt(id_loai_xe)
    const routeType = parseInt(id_loai_tuyen)
    const price = parseFloat(so_tien)
    const isRoundTrip = !!(thoi_gian_bat_dau_tra && thoi_gian_bat_dau_tra.trim() !== '')
    const timeRange = getTimeRange(thoi_gian_bat_dau_don)
    
    // Xác định tên loại xe
    let vehicleTypeName = 'Không xác định'
    if (vehicleType === VEHICLE_TYPES.XE_4_CHO) vehicleTypeName = 'Xe 4 chỗ'
    else if (vehicleType === VEHICLE_TYPES.XE_5_CHO) vehicleTypeName = 'Xe 5 chỗ'
    else if (vehicleType === VEHICLE_TYPES.XE_7_CHO) vehicleTypeName = 'Xe 7 chỗ'
    else if (vehicleType === VEHICLE_TYPES.XE_16_CHO) vehicleTypeName = 'Xe 16 chỗ'
    else if (vehicleType === VEHICLE_TYPES.XE_29_CHO) vehicleTypeName = 'Xe 29 chỗ'
    else if (vehicleType === VEHICLE_TYPES.XE_45_CHO) vehicleTypeName = 'Xe 45 chỗ'
    else vehicleTypeName = `Xe ${vehicleType} chỗ` // Fallback cho ID khác
    
    // Xác định tên loại tuyến theo ID mới
    let routeTypeName = 'Không xác định'
    if (routeType === 1) routeTypeName = 'Đón sân bay'
    else if (routeType === 2) routeTypeName = 'Tiễn sân bay'
    else if (routeType === 3) routeTypeName = 'Phố 1 chiều'
    else if (routeType === 4) routeTypeName = 'Phố 2 chiều'
    else if (routeType === 5) routeTypeName = 'Tỉnh huyện 1 chiều'
    else if (routeType === 6) routeTypeName = 'Tỉnh huyện 2 chiều'
    else if (routeType === 7) routeTypeName = 'Hướng sân bay (5km)'
    
    // Xác định khung giờ
    let timeRangeName = 'Không xác định'
    if (timeRange === TIME_RANGES.EARLY_MORNING) timeRangeName = '5h00-11h59'
    else if (timeRange === TIME_RANGES.LATE_NIGHT) timeRangeName = '12h00-4h59'
    else if (timeRange === TIME_RANGES.NIGHT_DEPARTURE) timeRangeName = '00h-8h59'
    else if (timeRange === TIME_RANGES.DAY_DEPARTURE) timeRangeName = '9h00-23h59'
    
    // Xác định phương pháp tính theo ID mới
    let calculationMethod = 'Tự động'
    if (routeType === 1) {
      if (timeRange === TIME_RANGES.EARLY_MORNING) {
        calculationMethod = 'Đón sân bay sáng (điểm cao nhất)'
      } else if (timeRange === TIME_RANGES.LATE_NIGHT) {
        calculationMethod = 'Đón sân bay đêm (điểm trung bình)'
      }
    } else if (routeType === 2) {
      if (timeRange === TIME_RANGES.NIGHT_DEPARTURE) {
        calculationMethod = 'Tiễn sân bay đêm (điểm thấp)'
      } else if (timeRange === TIME_RANGES.DAY_DEPARTURE) {
        calculationMethod = 'Tiễn sân bay ngày (điểm trung bình)'
      }
    } else if (routeType === 3) {
      calculationMethod = 'Phố 1 chiều theo giá (180k+)'
    } else if (routeType === 4) {
      calculationMethod = 'Phố 2 chiều theo xe và giá (250k+)'
    } else if (routeType === 5) {
      calculationMethod = 'Tỉnh huyện 1 chiều theo giá (180k+)'
    } else if (routeType === 6) {
      calculationMethod = 'Tỉnh huyện 2 chiều theo giá (180k+)'
    } else if (routeType === 7) {
      calculationMethod = 'Hướng sân bay 5km (tính như tiễn sân bay)'
    }
    
    return {
      vehicleType: vehicleTypeName,
      routeType: routeTypeName,
      timeRange: timeRangeName,
      price: price,
      isRoundTrip: isRoundTrip,
      calculationMethod: calculationMethod,
      reason: 'Tính điểm tự động theo quy tắc Room One - WIN [1-1]'
    }
    
  } catch (error) {
    console.error('Lỗi khi lấy chi tiết tính điểm:', error)
    return {
      vehicleType: 'Lỗi',
      routeType: 'Lỗi',
      timeRange: 'Lỗi',
      price: 0,
      calculationMethod: 'Không thể xác định',
      reason: `Lỗi: ${error.message}`
    }
  }
}

/**
 * Validate dữ liệu lịch xe
 */
function validateScheduleData(scheduleData) {
  const errors = []
  
  if (!scheduleData.id_loai_xe) {
    errors.push('Thiếu loại xe')
  }
  
  if (!scheduleData.id_loai_tuyen) {
    errors.push('Thiếu loại tuyến')
  }
  
  if (!scheduleData.so_tien) {
    errors.push('Thiếu số tiền')
  }
  
  if (!scheduleData.thoi_gian_bat_dau_don) {
    errors.push('Thiếu thời gian bắt đầu đón')
  }
  
  if (scheduleData.so_tien && parseFloat(scheduleData.so_tien) < 0) {
    errors.push('Số tiền không thể âm')
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  }
}

export {
  calculateSchedulePoints,
  calculateTransactionPoints,
  getPointCalculationDetails,
  validateScheduleData,
  VEHICLE_TYPES,
  ROUTE_TYPES,
  TIME_RANGES
}
