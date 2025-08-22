const axios = require('axios');
const API_BASE_URL = 'http://localhost:5000/api';

// Test users
const testUsers = [
  { username: 'admin', password: 'Admin@123' },
  { username: 'nguyenvanA', password: 'User@123' },
  { username: 'tranthiB', password: 'User@123' }
];

let tokens = {};
let userId1, userId2;

async function testFullFlow() {
  console.log('=== TEST FULL FLOW ===\n');

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
        if (user.username === 'nguyenvanA') userId1 = loginResponse.data.data.user.id_nguoi_dung;
        if (user.username === 'tranthiB') userId2 = loginResponse.data.data.user.id_nguoi_dung;
        console.log(`✅ ${user.username} đăng nhập thành công`);
      }
    }

    // 2. Kiểm tra số dư ban đầu
    console.log('\n2. Kiểm tra số dư ban đầu...');
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
          console.log(`❌ Không thể lấy profile của ${user.username}`);
        }
      }
    }

    // 3. Tạo giao dịch giao lịch với lịch xe
    console.log('\n3. Tạo giao dịch giao lịch với lịch xe...');
    let transactionId;
    if (tokens['nguyenvanA']) {
      try {
        // Tạo lịch xe trước
        const scheduleResponse = await axios.post(`${API_BASE_URL}/schedules`, {
          id_loai_xe: 1,
          id_loai_tuyen: 1,
          thoi_gian_bat_dau_don: '2024-12-25T08:00:00',
          thoi_gian_ket_thuc_don: '2024-12-25T08:30:00',
          thoi_gian_bat_dau_tra: '2024-12-25T18:00:00',
          thoi_gian_ket_thuc_tra: '2024-12-25T18:30:00',
          id_nhom: 1,
          id_nguoi_nhan: userId2
        }, {
          headers: { Authorization: `Bearer ${tokens['nguyenvanA']}` }
        });

        let scheduleId = null;
        if (scheduleResponse.data.success) {
          scheduleId = scheduleResponse.data.data.id;
          console.log('✅ Lịch xe tạo thành công với ID:', scheduleId);
        }

        // Tạo giao dịch
        const transactionResponse = await axios.post(`${API_BASE_URL}/transactions`, {
          id_loai_giao_dich: 1, // Giao lịch
          id_nguoi_nhan: userId2,
          id_nhom: 1,
          id_lich_xe: scheduleId,
          so_tien: 75000,
          diem: 15,
          noi_dung: 'Test giao dịch giao lịch với lịch xe'
        }, {
          headers: { Authorization: `Bearer ${tokens['nguyenvanA']}` }
        });
        
        if (transactionResponse.data.success) {
          transactionId = transactionResponse.data.data.id;
          console.log('✅ Giao dịch tạo thành công với ID:', transactionId);
        }
      } catch (error) {
        console.log('❌ Lỗi khi tạo giao dịch:', error.response?.data?.message || error.message);
      }
    }

    // 4. Kiểm tra thông báo
    console.log('\n4. Kiểm tra thông báo...');
    for (const user of testUsers) {
      if (tokens[user.username]) {
        try {
          const notificationResponse = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${tokens[user.username]}` }
          });
          
          if (notificationResponse.data.success) {
            console.log(`${user.username} có ${notificationResponse.data.data.length} thông báo`);
            // Hiển thị thông báo mới nhất
            if (notificationResponse.data.data.length > 0) {
              const latest = notificationResponse.data.data[0];
              console.log(`  Mới nhất: ${latest.noi_dung}`);
              if (latest.id_lich_xe) {
                console.log(`  Có lịch xe: ${latest.ten_loai_xe}, ${latest.ten_loai_tuyen}`);
              }
            }
          }
        } catch (error) {
          console.log(`❌ Không thể lấy thông báo của ${user.username}`);
        }
      }
    }

    // 5. Test xác nhận giao dịch (bởi người nhận)
    if (transactionId && tokens['tranthiB']) {
      console.log('\n5. Test xác nhận giao dịch...');
      try {
        const confirmResponse = await axios.put(`${API_BASE_URL}/transactions/${transactionId}/confirm`, {}, {
          headers: { Authorization: `Bearer ${tokens['tranthiB']}` }
        });
        
        if (confirmResponse.data.success) {
          console.log('✅ Xác nhận giao dịch thành công');
        }
      } catch (error) {
        console.log('❌ Lỗi khi xác nhận giao dịch:', error.response?.data?.message || error.message);
        console.log('Error status:', error.response?.status);
        console.log('Error data:', error.response?.data);
      }
    }

    // 6. Kiểm tra số dư sau khi xác nhận
    console.log('\n6. Kiểm tra số dư sau khi xác nhận...');
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
          console.log(`❌ Không thể lấy profile của ${user.username}`);
        }
      }
    }

    // 7. Test tạo giao dịch khác và hủy bởi người nhận
    console.log('\n7. Test tạo giao dịch và hủy bởi người nhận...');
    let cancelTransactionId;
    if (tokens['nguyenvanA']) {
      try {
        // Tạo lịch xe mới
        const scheduleResponse = await axios.post(`${API_BASE_URL}/schedules`, {
          id_loai_xe: 2,
          id_loai_tuyen: 2,
          thoi_gian_bat_dau_don: '2024-12-26T09:00:00',
          thoi_gian_ket_thuc_don: '2024-12-26T09:30:00',
          id_nhom: 1,
          id_nguoi_nhan: userId2
        }, {
          headers: { Authorization: `Bearer ${tokens['nguyenvanA']}` }
        });

        let scheduleId = null;
        if (scheduleResponse.data.success) {
          scheduleId = scheduleResponse.data.data.id;
          console.log('✅ Lịch xe mới tạo thành công với ID:', scheduleId);
        }

        // Tạo giao dịch mới
        const transactionResponse = await axios.post(`${API_BASE_URL}/transactions`, {
          id_loai_giao_dich: 1,
          id_nguoi_nhan: userId2,
          id_nhom: 1,
          id_lich_xe: scheduleId,
          so_tien: 50000,
          diem: 10,
          noi_dung: 'Test giao dịch để hủy'
        }, {
          headers: { Authorization: `Bearer ${tokens['nguyenvanA']}` }
        });
        
        if (transactionResponse.data.success) {
          cancelTransactionId = transactionResponse.data.data.id;
          console.log('✅ Giao dịch để hủy tạo thành công với ID:', cancelTransactionId);
        }
      } catch (error) {
        console.log('❌ Lỗi khi tạo giao dịch để hủy:', error.response?.data?.message || error.message);
      }
    }

    // 8. Hủy giao dịch bởi người nhận
    if (cancelTransactionId && tokens['tranthiB']) {
      try {
        const cancelResponse = await axios.put(`${API_BASE_URL}/transactions/${cancelTransactionId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${tokens['tranthiB']}` }
        });
        
        if (cancelResponse.data.success) {
          console.log('✅ Hủy giao dịch bởi người nhận thành công');
        }
      } catch (error) {
        console.log('❌ Lỗi khi hủy giao dịch:', error.response?.data?.message || error.message);
      }
    }

    // 9. Kiểm tra thông báo cuối cùng
    console.log('\n9. Kiểm tra thông báo cuối cùng...');
    for (const user of testUsers) {
      if (tokens[user.username]) {
        try {
          const notificationResponse = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${tokens[user.username]}` }
          });
          
          if (notificationResponse.data.success) {
            console.log(`${user.username} có ${notificationResponse.data.data.length} thông báo`);
            // Hiển thị 2 thông báo mới nhất
            notificationResponse.data.data.slice(0, 2).forEach((notification, index) => {
              console.log(`  ${index + 1}. ${notification.noi_dung}`);
            });
          }
        } catch (error) {
          console.log(`❌ Không thể lấy thông báo của ${user.username}`);
        }
      }
    }

    console.log('\n=== TEST HOÀN TẤT ===');

  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy test
testFullFlow();
