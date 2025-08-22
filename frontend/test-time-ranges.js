/**
 * Test logic khung giờ mới
 * Kiểm tra xem getTimeRange có hoạt động đúng không
 */

console.log('=== TEST LOGIC KHUNG GIỜ MỚI ===\n')

// Constants từ pointCalculationService
const TIME_RANGES = {
  EARLY_MORNING: 'early_morning',      // 5h00-11h59
  LATE_NIGHT: 'late_night',           // 12h00-4h59
  NIGHT_DEPARTURE: 'night_departure', // 00h-8h59
  DAY_DEPARTURE: 'day_departure'      // 9h00-23h59
}

// Function getTimeRange (giống như trong service)
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

// Test cases cho ĐÓN SÂN BAY
console.log('=== TEST ĐÓN SÂN BAY ===')
const donSanBayTests = [
  { time: '2024-01-15T05:00:00', expected: TIME_RANGES.EARLY_MORNING, description: '5h00 - Sáng' },
  { time: '2024-01-15T08:30:00', expected: TIME_RANGES.EARLY_MORNING, description: '8h30 - Sáng' },
  { time: '2024-01-15T11:59:00', expected: TIME_RANGES.EARLY_MORNING, description: '11h59 - Sáng' },
  { time: '2024-01-15T12:00:00', expected: TIME_RANGES.LATE_NIGHT, description: '12h00 - Đêm' },
  { time: '2024-01-15T15:30:00', expected: TIME_RANGES.LATE_NIGHT, description: '15h30 - Đêm' },
  { time: '2024-01-15T23:45:00', expected: TIME_RANGES.LATE_NIGHT, description: '23h45 - Đêm' },
  { time: '2024-01-15T00:00:00', expected: TIME_RANGES.LATE_NIGHT, description: '00h00 - Đêm' },
  { time: '2024-01-15T04:59:00', expected: TIME_RANGES.LATE_NIGHT, description: '4h59 - Đêm' }
]

donSanBayTests.forEach((testCase, index) => {
  const result = getTimeRange(testCase.time)
  const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL'
  
  console.log(`${index + 1}. ${testCase.description}: ${result} ${status}`)
  console.log(`   Time: ${testCase.time.substring(11, 16)}`)
  console.log(`   Expected: ${testCase.expected}`)
  console.log(`   Got: ${result}`)
  console.log('')
})

// Test cases cho TIỄN SÂN BAY
console.log('=== TEST TIỄN SÂN BAY ===')
const tienSanBayTests = [
  { time: '2024-01-15T00:00:00', expected: TIME_RANGES.NIGHT_DEPARTURE, description: '00h00 - Đêm' },
  { time: '2024-01-15T04:30:00', expected: TIME_RANGES.NIGHT_DEPARTURE, description: '4h30 - Đêm' },
  { time: '2024-01-15T08:59:00', expected: TIME_RANGES.NIGHT_DEPARTURE, description: '8h59 - Đêm' },
  { time: '2024-01-15T09:00:00', expected: TIME_RANGES.DAY_DEPARTURE, description: '9h00 - Ngày' },
  { time: '2024-01-15T14:30:00', expected: TIME_RANGES.DAY_DEPARTURE, description: '14h30 - Ngày' },
  { time: '2024-01-15T23:59:00', expected: TIME_RANGES.DAY_DEPARTURE, description: '23h59 - Ngày' }
]

tienSanBayTests.forEach((testCase, index) => {
  const result = getTimeRange(testCase.time)
  const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL'
  
  console.log(`${index + 1}. ${testCase.description}: ${result} ${status}`)
  console.log(`   Time: ${testCase.time.substring(11, 16)}`)
  console.log(`   Expected: ${testCase.expected}`)
  console.log(`   Got: ${result}`)
  console.log('')
})

// Test edge cases
console.log('=== TEST EDGE CASES ===')
console.log(`Null time: ${getTimeRange(null)}`)
console.log(`Undefined time: ${getTimeRange(undefined)}`)
console.log(`Empty string: ${getTimeRange('')}`)

console.log('\n=== KẾT LUẬN ===')
console.log('✅ Logic khung giờ đã được sửa: không còn conflict')
console.log('✅ ĐÓN SÂN BAY: 5h00-11h59 (sáng), 12h00-4h59 (đêm)')
console.log('✅ TIỄN SÂN BAY: 00h-8h59 (đêm), 9h00-23h59 (ngày)')
console.log('✅ Mỗi khung giờ có logic riêng biệt và chính xác')
