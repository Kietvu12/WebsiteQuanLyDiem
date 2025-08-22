const axios = require('axios');
const API_BASE_URL = 'http://localhost:5000/api';

// Test users
const testUsers = [
  { username: 'admin', password: 'Admin@123' },
  { username: 'nguyenvanA', password: 'User@123' },
  { username: 'tranthiB', password: 'User@123' }
];

let tokens = {};

async function testNegativeBalance() {
  console.log('=== TEST CẬP NHẬT SỐ ÂM ===\n');

  try {
    // 1. Đăng nhập tất cả users
    console.log('1. Đăng nhập users...');
    for (const user of testUsers) {
      const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, {
        ten_dang_nhap: user.username,
        mat_khau: user.password
      });
      
      if (loginResponse.data.success) {
        tokens[user.username] = loginResponse.data.data.token;
        console.log(`✅ ${user.username} đăng nhập thành công`);
      } else {
        console.log(`❌ ${user.username} đăng nhập thất bại`);
      }
    }

    // 2. Kiểm tra số dư và điểm ban đầu
    console.log('\n2. Kiểm tra số dư và điểm ban đầu...');
    for (const user of testUsers) {
      if (tokens[user.username]) {
        try {
          const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${tokens[user.username]}` }
          });
          
          if (profileResponse.data.success) {
            const userData = profileResponse.data.data.user;
            console.log(`${user.username}: Số dư: ${userData.so_du}, Điểm: ${userData.diem}`);
          }
        } catch (error) {
          console.log(`❌ Không thể lấy profile của ${user.username}:`, error.response?.data?.message || error.message);
        }
      }
    }

    // 3. Test cập nhật số dư âm
    console.log('\n3. Test cập nhật số dư âm...');
    const adminToken = tokens['admin'];
    if (adminToken) {
      try {
        // Cập nhật số dư âm cho nguyenvanA
        const updateResponse = await axios.put(`${API_BASE_URL}/users/2`, {
          so_du: -50000,
          diem: -10
        }, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        if (updateResponse.data.success) {
          console.log('✅ Cập nhật số dư âm thành công');
        } else {
          console.log('❌ Cập nhật số dư âm thất bại:', updateResponse.data.message);
        }
      } catch (error) {
        console.log('❌ Lỗi khi cập nhật số dư âm:', error.response?.data?.message || error.message);
      }
    }

    // 4. Kiểm tra số dư sau khi cập nhật
    console.log('\n4. Kiểm tra số dư sau khi cập nhật...');
    for (const user of testUsers) {
      if (tokens[user.username]) {
        try {
          const profileResponse = await axios.get(`${API_BASE_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${tokens[user.username]}` }
          });
          
          if (profileResponse.data.success) {
            const userData = profileResponse.data.data.user;
            console.log(`${user.username}: Số dư: ${userData.so_du}, Điểm: ${userData.diem}`);
          }
        } catch (error) {
          console.log(`❌ Không thể lấy profile của ${user.username}:`, error.response?.data?.message || error.message);
        }
      }
    }

    // 5. Test tạo giao dịch với số âm
    console.log('\n5. Test tạo giao dịch với số âm...');
    if (tokens['admin']) {
      try {
        // Tạo giao dịch giao lịch với số tiền và điểm âm
        const transactionResponse = await axios.post(`${API_BASE_URL}/transactions`, {
          id_loai_giao_dich: 1, // Giao lịch
          id_nguoi_nhan: 3, // tranthiB
          id_nhom: 1,
          so_tien: -30000, // Số âm - người nhận phải trả
          diem: -5, // Số âm - người nhận phải trả điểm
          noi_dung: 'Test giao dịch với số âm'
        }, {
          headers: { Authorization: `Bearer ${tokens['admin']}` }
        });
        
        if (transactionResponse.data.success) {
          console.log('✅ Tạo giao dịch với số âm thành công');
          console.log('Transaction ID:', transactionResponse.data.data.id);
        } else {
          console.log('❌ Tạo giao dịch với số âm thất bại:', transactionResponse.data.message);
        }
      } catch (error) {
        console.log('❌ Lỗi khi tạo giao dịch với số âm:', error.response?.data?.message || error.message);
      }
    }

    // 6. Kiểm tra database trực tiếp
    console.log('\n6. Kiểm tra database trực tiếp...');
    console.log('Hãy kiểm tra bảng nguoi_dung trong database:');
    console.log('SELECT id_nguoi_dung, ten_dang_nhap, so_du, diem FROM nguoi_dung ORDER BY id_nguoi_dung;');
    
    console.log('\nHãy kiểm tra bảng giao_dich trong database:');
    console.log('SELECT * FROM giao_dich ORDER BY ngay_tao DESC LIMIT 5;');

  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy test
testNegativeBalance();
