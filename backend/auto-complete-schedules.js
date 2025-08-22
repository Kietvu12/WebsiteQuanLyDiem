/**
 * Script tự động hoàn thành lịch xe sau 2 tiếng từ giờ đón khách
 * Chạy mỗi 5 phút để kiểm tra và cập nhật trạng thái
 */

const { VehicleSchedule } = require('./models');

console.log('🚗 === SCRIPT TỰ ĐỘNG HOÀN THÀNH LỊCH XE ===')
console.log('⏰ Bắt đầu chạy:', new Date().toLocaleString('vi-VN'))
console.log('📋 Chức năng: Tự động hoàn thành lịch xe sau 2 tiếng từ giờ đón khách')
console.log('🔄 Tần suất: Chạy mỗi 5 phút')
console.log('')

async function autoCompleteSchedules() {
  try {
    console.log(`\n🕐 [${new Date().toLocaleString('vi-VN')}] Bắt đầu kiểm tra lịch xe...`)
    
    // Gọi method tự động hoàn thành lịch xe
    const completedCount = await VehicleSchedule.autoCompleteSchedules()
    
    if (completedCount > 0) {
      console.log(`✅ Đã tự động hoàn thành ${completedCount} lịch xe`)
      
      // Log chi tiết các lịch xe đã hoàn thành
      const completedSchedules = await VehicleSchedule.getCompletedSchedules()
      console.log('📋 Danh sách lịch xe vừa hoàn thành:')
      completedSchedules.slice(0, 5).forEach((schedule, index) => {
        console.log(`   ${index + 1}. ID: ${schedule.id_lich_xe}`)
        console.log(`      Tài xế: ${schedule.ten_nguoi_nhan}`)
        console.log(`      Tuyến: ${schedule.ten_loai_tuyen}`)
        console.log(`      Giờ đón: ${new Date(schedule.thoi_gian_bat_dau_don).toLocaleString('vi-VN')}`)
        console.log(`      Nhóm: ${schedule.ten_nhom}`)
        console.log('')
      })
      
      if (completedSchedules.length > 5) {
        console.log(`   ... và ${completedSchedules.length - 5} lịch xe khác`)
      }
    } else {
      console.log('ℹ️ Không có lịch xe nào cần hoàn thành')
    }
    
    console.log(`✅ Hoàn thành kiểm tra lúc ${new Date().toLocaleString('vi-VN')}`)
    
  } catch (error) {
    console.error(`❌ Lỗi khi tự động hoàn thành lịch xe: ${error.message}`)
    console.error('Stack trace:', error.stack)
  }
}

// Chạy lần đầu ngay lập tức
autoCompleteSchedules()

// Chạy định kỳ mỗi 5 phút
const INTERVAL_MINUTES = 5
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000

console.log(`⏰ Sẽ chạy lại sau mỗi ${INTERVAL_MINUTES} phút`)
console.log(`⏰ Lần chạy tiếp theo: ${new Date(Date.now() + INTERVAL_MS).toLocaleString('vi-VN')}`)

setInterval(() => {
  autoCompleteSchedules()
}, INTERVAL_MS)

// Xử lý khi script bị dừng
process.on('SIGINT', () => {
  console.log('\n\n🛑 Script bị dừng bởi người dùng')
  console.log('⏰ Thời gian dừng:', new Date().toLocaleString('vi-VN'))
  console.log('📊 Tổng thời gian chạy:', process.uptime(), 'giây')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\n🛑 Script bị dừng bởi hệ thống')
  console.log('⏰ Thời gian dừng:', new Date().toLocaleString('vi-VN'))
  console.log('📊 Tổng thời gian chạy:', process.uptime(), 'giây')
  process.exit(0)
})

console.log('')
console.log('💡 Hướng dẫn sử dụng:')
console.log('   1. Chạy script: node auto-complete-schedules.js')
console.log('   2. Script sẽ chạy liên tục mỗi 5 phút')
console.log('   3. Dừng script: Ctrl+C')
console.log('   4. Kiểm tra log để theo dõi hoạt động')
console.log('')
console.log('🔧 Cấu hình:')
console.log(`   - Tần suất: ${INTERVAL_MINUTES} phút`)
console.log('   - Điều kiện: Lịch xe chờ xác nhận + sau 2 tiếng từ giờ đón')
console.log('   - Hành động: Chuyển trạng thái thành "hoàn thành"')
console.log('')
console.log('📊 Theo dõi hoạt động:')
console.log('   - Log thời gian chạy')
console.log('   - Số lượng lịch xe đã hoàn thành')
console.log('   - Chi tiết các lịch xe vừa hoàn thành')
console.log('   - Xử lý lỗi nếu có')
console.log('')
console.log('🚀 Script đang chạy...')
console.log('')
