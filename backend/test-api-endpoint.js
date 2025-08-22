const { pool } = require('./config/database');

async function testAPIEndpoint() {
  try {
    console.log('=== Testing API Endpoint /api/users/3/schedules ===');
    
    const userId = 3;
    
    console.log('1. Testing VehicleSchedule.getUserSchedules directly...');
    const { VehicleSchedule } = require('./models');
    const schedules = await VehicleSchedule.getUserSchedules(userId);
    console.log('✅ getUserSchedules result:', schedules.length, 'schedules');
    
    if (schedules.length > 0) {
      console.log('\n📋 Schedule details:');
      schedules.forEach((schedule, index) => {
        console.log(`\nSchedule ${index + 1}:`);
        console.log('- ID:', schedule.id_lich_xe);
        console.log('- Người tạo:', schedule.ten_nguoi_tao, '(ID:', schedule.id_nguoi_tao, ')');
        console.log('- Người nhận (tài xế):', schedule.ten_nguoi_nhan || 'NULL', '(ID:', schedule.id_nguoi_nhan || 'NULL', ')');
        console.log('- Trạng thái:', schedule.trang_thai);
        console.log('- Loại xe:', schedule.ten_loai_xe);
        console.log('- Loại tuyến:', schedule.ten_loai_tuyen);
      });
    }
    
    console.log('\n2. Testing upcoming schedules...');
    const upcomingSchedules = await VehicleSchedule.getUserUpcomingSchedules(userId);
    console.log('✅ getUserUpcomingSchedules result:', upcomingSchedules.length, 'schedules');
    
    console.log('\n3. Testing completed schedules...');
    const completedSchedules = await VehicleSchedule.getUserCompletedSchedules(userId);
    console.log('✅ getUserCompletedSchedules result:', completedSchedules.length, 'schedules');
    
    console.log('\n📊 Summary:');
    console.log('- Total schedules:', schedules.length);
    console.log('- Upcoming schedules:', upcomingSchedules.length);
    console.log('- Completed schedules:', completedSchedules.length);
    
    // Kiểm tra phân tích dữ liệu
    const createdByUser = schedules.filter(s => s.id_nguoi_tao === userId);
    const receivedByUser = schedules.filter(s => s.id_nguoi_nhan === userId);
    
    console.log('\n🔍 Data Analysis:');
    console.log('- Schedules created by user:', createdByUser.length);
    console.log('- Schedules where user is driver (id_nguoi_nhan):', receivedByUser.length);
    console.log('- Total (should match):', createdByUser.length + receivedByUser.length);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

testAPIEndpoint();
