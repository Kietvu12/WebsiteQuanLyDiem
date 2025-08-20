const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Test đăng nhập
async function testLogin() {
  console.log('🔐 Test đăng nhập...');
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, {
      ten_dang_nhap: 'admin',
      mat_khau: 'Admin@123'
    });

    if (response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Đăng nhập thành công:', response.data.data.user.ho_ten);
      console.log('🔑 Token:', authToken.substring(0, 50) + '...');
    } else {
      console.log('❌ Đăng nhập thất bại:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi đăng nhập:', error.response?.data?.message || error.message);
  }
  console.log('');
}

// Test lấy thông tin cá nhân
async function testGetProfile() {
  console.log('👤 Test lấy thông tin cá nhân...');
  try {
    const response = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Lấy thông tin cá nhân thành công:', response.data.data.ho_ten);
    } else {
      console.log('❌ Lấy thông tin cá nhân thất bại:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi lấy thông tin cá nhân:', error.response?.data?.message || error.message);
  }
  console.log('');
}

// Test lấy tất cả nhóm
async function testGetGroups() {
  console.log('👥 Test lấy tất cả nhóm...');
  try {
    const response = await axios.get(`${BASE_URL}/groups`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Lấy danh sách nhóm thành công:', response.data.data.length, 'nhóm');
      response.data.data.forEach(group => {
        console.log(`  - ${group.ten_nhom}: ${group.mo_ta}`);
      });
    } else {
      console.log('❌ Lấy danh sách nhóm thất bại:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi lấy danh sách nhóm:', error.response?.data?.message || error.message);
  }
  console.log('');
}

// Test lấy giao dịch trong nhóm
async function testGetGroupTransactions() {
  console.log('💰 Test lấy giao dịch trong nhóm...');
  try {
    const response = await axios.get(`${BASE_URL}/groups/1/transactions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Lấy giao dịch trong nhóm thành công:', response.data.data.length, 'giao dịch');
      response.data.data.forEach(transaction => {
        console.log(`  - ${transaction.noi_dung} (${transaction.trang_thai})`);
      });
    } else {
      console.log('❌ Lấy giao dịch trong nhóm thất bại:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi lấy giao dịch trong nhóm:', error.response?.data?.message || error.message);
  }
  console.log('');
}

// Test lấy lịch xe trong nhóm
async function testGetGroupSchedules() {
  console.log('🚗 Test lấy lịch xe trong nhóm...');
  try {
    const response = await axios.get(`${BASE_URL}/groups/1/schedules`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Lấy lịch xe trong nhóm thành công:', response.data.data.length, 'lịch xe');
      response.data.data.forEach(schedule => {
        console.log(`  - ${schedule.ten_loai_xe} - ${schedule.ten_loai_tuyen} (${schedule.trang_thai})`);
      });
    } else {
      console.log('❌ Lấy lịch xe trong nhóm thất bại:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi lấy lịch xe trong nhóm:', error.response?.data?.message || error.message);
  }
  console.log('');
}

// Test tạo giao dịch mới
async function testCreateTransaction() {
  console.log('💸 Test tạo giao dịch mới...');
  try {
    const response = await axios.post(`${BASE_URL}/transactions`, {
      id_loai_giao_dich: 4, // San cho
      id_nguoi_nhan: 3,
      id_nhom: 1,
      diem: 10,
      noi_dung: 'Test san cho 10 điểm'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Tạo giao dịch thành công, ID:', response.data.data.id);
    } else {
      console.log('❌ Tạo giao dịch thất bại:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi tạo giao dịch:', error.response?.data?.message || error.message);
  }
  console.log('');
}

// Test lấy tất cả giao dịch
async function testGetAllTransactions() {
  console.log('📊 Test lấy tất cả giao dịch...');
  try {
    const response = await axios.get(`${BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Lấy tất cả giao dịch thành công:', response.data.data.length, 'giao dịch');
    } else {
      console.log('❌ Lấy tất cả giao dịch thất bại:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi lấy tất cả giao dịch:', error.response?.data?.message || error.message);
  }
  console.log('');
}

// Test lấy lịch xe theo trạng thái
async function testGetSchedulesByStatus() {
  console.log('📅 Test lấy lịch xe theo trạng thái...');
  try {
    const response = await axios.get(`${BASE_URL}/schedules/status/cho_xac_nhan`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });

    if (response.data.success) {
      console.log('✅ Lấy lịch xe theo trạng thái thành công:', response.data.data.length, 'lịch xe');
    } else {
      console.log('❌ Lấy lịch xe theo trạng thái thất bại:', response.data.message);
    }
  } catch (error) {
    console.error('❌ Lỗi lấy lịch xe theo trạng thái:', error.response?.data?.message || error.message);
  }
  console.log('');
}

// Chạy tất cả test
async function runAllTests() {
  console.log('🚀 Bắt đầu test API...\n');

  await testLogin();
  
  if (authToken) {
    await testGetProfile();
    await testGetGroups();
    await testGetGroupTransactions();
    await testGetGroupSchedules();
    await testCreateTransaction();
    await testGetAllTransactions();
    await testGetSchedulesByStatus();
    
    console.log('✅ Hoàn thành tất cả test!');
  } else {
    console.log('❌ Không thể test các API khác do đăng nhập thất bại');
  }
}

// Chạy test nếu file được gọi trực tiếp
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests };
