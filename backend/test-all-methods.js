const VehicleSchedule = require('./models/VehicleSchedule.js');

async function testAllMethods() {
  try {
    console.log('=== Testing All VehicleSchedule Methods ===');
    
    const userId = 3;
    
    console.log('\n1. Testing getUserSchedules...');
    const userSchedules = await VehicleSchedule.getUserSchedules(userId);
    console.log('✅ getUserSchedules:', userSchedules.length, 'schedules');
    
    console.log('\n2. Testing getUserUpcomingSchedules...');
    const userUpcomingSchedules = await VehicleSchedule.getUserUpcomingSchedules(userId);
    console.log('✅ getUserUpcomingSchedules:', userUpcomingSchedules.length, 'schedules');
    
    console.log('\n3. Testing getUserCompletedSchedules...');
    const userCompletedSchedules = await VehicleSchedule.getUserCompletedSchedules(userId);
    console.log('✅ getUserCompletedSchedules:', userCompletedSchedules.length, 'schedules');
    
    console.log('\n4. Testing getAll (Admin only)...');
    try {
      const allSchedules = await VehicleSchedule.getAll();
      console.log('✅ getAll (Admin):', allSchedules.length, 'schedules');
    } catch (error) {
      console.log('❌ getAll error (expected for non-admin):', error.message);
    }
    
    console.log('\n5. Testing getUpcomingSchedules (Admin only)...');
    try {
      const allUpcomingSchedules = await VehicleSchedule.getUpcomingSchedules();
      console.log('✅ getUpcomingSchedules (Admin):', allUpcomingSchedules.length, 'schedules');
    } catch (error) {
      console.log('❌ getUpcomingSchedules error (expected for non-admin):', error.message);
    }
    
    console.log('\n6. Testing getCompletedSchedules (Admin only)...');
    try {
      const allCompletedSchedules = await VehicleSchedule.getCompletedSchedules();
      console.log('✅ getCompletedSchedules (Admin):', allCompletedSchedules.length, 'schedules');
    } catch (error) {
      console.log('❌ getCompletedSchedules error (expected for non-admin):', error.message);
    }
    
    console.log('\n📊 Summary for User ID', userId, ':');
    console.log('- Total schedules:', userSchedules.length);
    console.log('- Upcoming schedules:', userUpcomingSchedules.length);
    console.log('- Completed schedules:', userCompletedSchedules.length);
    
    if (userUpcomingSchedules.length > 0) {
      console.log('\n🚗 Upcoming schedule details:');
      userUpcomingSchedules.forEach((schedule, index) => {
        console.log(`\nSchedule ${index + 1}:`);
        console.log('- ID:', schedule.id_lich_xe);
        console.log('- Người tạo:', schedule.ten_nguoi_tao);
        console.log('- Người nhận (tài xế):', schedule.ten_nguoi_nhan || 'NULL');
        console.log('- Loại xe:', schedule.ten_loai_xe);
        console.log('- Loại tuyến:', schedule.ten_loai_tuyen);
        console.log('- Thời gian đón:', schedule.thoi_gian_bat_dau_don);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}

testAllMethods();
