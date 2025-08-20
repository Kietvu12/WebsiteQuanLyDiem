const { testConnection } = require('./config/database');
const { User, Group, VehicleSchedule, Transaction, Notification, Report } = require('./models');

async function testModels() {
  console.log('🚀 Bắt đầu test các model...\n');

  try {
    // Test kết nối database
    await testConnection();
    console.log('');

    // Test User model
    console.log('📋 Test User Model:');
    const users = await User.getAll();
    console.log(`- Tổng số người dùng: ${users.length}`);
    if (users.length > 0) {
      console.log(`- Người dùng đầu tiên: ${users[0].ho_ten} (${users[0].ten_dang_nhap})`);
    }
    console.log('');

    // Test Group model
    console.log('👥 Test Group Model:');
    const groups = await Group.getAll();
    console.log(`- Tổng số nhóm: ${groups.length}`);
    if (groups.length > 0) {
      console.log(`- Nhóm đầu tiên: ${groups[0].ten_nhom}`);
      const memberCount = await Group.getMemberCount(groups[0].id_nhom);
      console.log(`- Số thành viên trong nhóm: ${memberCount}`);
    }
    console.log('');

    // Test VehicleSchedule model
    console.log('🚗 Test VehicleSchedule Model:');
    const schedules = await VehicleSchedule.getAll();
    console.log(`- Tổng số lịch xe: ${schedules.length}`);
    if (schedules.length > 0) {
      console.log(`- Lịch xe đầu tiên: ${schedules[0].ten_loai_xe} - ${schedules[0].ten_loai_tuyen}`);
    }
    console.log('');

    // Test Transaction model
    console.log('💰 Test Transaction Model:');
    const transactions = await Transaction.getAll();
    console.log(`- Tổng số giao dịch: ${transactions.length}`);
    if (transactions.length > 0) {
      console.log(`- Giao dịch đầu tiên: ${transactions[0].ten_loai_giao_dich} - ${transactions[0].noi_dung}`);
    }
    console.log('');

    // Test Notification model
    console.log('🔔 Test Notification Model:');
    const notifications = await Notification.getAll();
    console.log(`- Tổng số thông báo: ${notifications.length}`);
    if (notifications.length > 0) {
      console.log(`- Thông báo đầu tiên: ${notifications[0].noi_dung}`);
    }
    console.log('');

    // Test Report model
    console.log('📊 Test Report Model:');
    const reports = await Report.getAll();
    console.log(`- Tổng số báo cáo: ${reports.length}`);
    if (reports.length > 0) {
      console.log(`- Báo cáo đầu tiên: ${reports[0].duong_dan_file}`);
    }
    console.log('');

    console.log('✅ Test tất cả model thành công!');

  } catch (error) {
    console.error('❌ Lỗi khi test models:', error.message);
  }
}

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
  testModels();
}

module.exports = { testModels };
