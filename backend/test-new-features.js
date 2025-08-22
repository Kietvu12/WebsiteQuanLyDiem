const axios = require('axios');
const API_BASE_URL = 'http://localhost:5000/api';

// Test users
const testUsers = [
  { username: 'admin', password: 'Admin@123' },
  { username: 'nguyenvanA', password: 'User@123' },
  { username: 'tranthiB', password: 'User@123' }
];

let tokens = {};
let userId1, userId2, userId3;

async function testNewFeatures() {
  console.log('=== TEST NEW FEATURES ===\n');

  try {
    // 1. Đăng nhập users
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
        if (user.username === 'admin') userId3 = loginResponse.data.data.user.id_nguoi_dung;
        console.log(`✅ ${user.username} đăng nhập thành công`);
      }
    }

    // 2. Tạo giao dịch giao lịch để test
    console.log('\n2. Tạo giao dịch giao lịch để test...');
    let transactionId;
    let scheduleId;
    
    if (tokens['nguyenvanA']) {
      try {
        // Tạo lịch xe trước
        const scheduleResponse = await axios.post(`${API_BASE_URL}/schedules`, {
          id_loai_xe: 1,
          id_loai_tuyen: 1,
          thoi_gian_bat_dau_don: '2024-12-27T08:00:00',
          thoi_gian_ket_thuc_don: '2024-12-27T08:30:00',
          thoi_gian_bat_dau_tra: '2024-12-27T18:00:00',
          thoi_gian_ket_thuc_tra: '2024-12-27T18:30:00',
          id_nhom: 1,
          id_nguoi_nhan: userId2
        }, {
          headers: { Authorization: `Bearer ${tokens['nguyenvanA']}` }
        });

        if (scheduleResponse.data.success) {
          scheduleId = scheduleResponse.data.data.id;
          console.log('✅ Lịch xe tạo thành công với ID:', scheduleId);
        }

        // Tạo giao dịch giao lịch
        const transactionResponse = await axios.post(`${API_BASE_URL}/transactions`, {
          id_loai_giao_dich: 1, // Giao lịch
          id_nguoi_nhan: userId2,
          id_nhom: 1,
          id_lich_xe: scheduleId,
          so_tien: 100000,
          diem: 20,
          noi_dung: 'Test giao dịch giao lịch để kiểm tra nút hủy cho người nhận'
        }, {
          headers: { Authorization: `Bearer ${tokens['nguyenvanA']}` }
        });
        
        if (transactionResponse.data.success) {
          transactionId = transactionResponse.data.data.id;
          console.log('✅ Giao dịch giao lịch tạo thành công với ID:', transactionId);
        }
      } catch (error) {
        console.log('❌ Lỗi khi tạo giao dịch giao lịch:', error.response?.data?.message || error.message);
      }
    }

    // 3. Kiểm tra thông báo
    console.log('\n3. Kiểm tra thông báo...');
    for (const user of testUsers) {
      if (tokens[user.username]) {
        try {
          const notificationResponse = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${tokens[user.username]}` }
          });
          
          if (notificationResponse.data.success) {
            const notifications = notificationResponse.data.data;
            const unreadCount = notifications.filter(n => !n.da_doc).length;
            console.log(`${user.username}: ${notifications.length} thông báo, ${unreadCount} chưa đọc`);
          }
        } catch (error) {
          console.log(`❌ Không thể lấy thông báo của ${user.username}`);
        }
      }
    }

    // 4. Test hủy giao dịch bởi người nhận
    if (transactionId && tokens['tranthiB']) {
      console.log('\n4. Test hủy giao dịch bởi người nhận...');
      try {
        const cancelResponse = await axios.put(`${API_BASE_URL}/transactions/${transactionId}/cancel`, {}, {
          headers: { Authorization: `Bearer ${tokens['tranthiB']}` }
        });
        
        if (cancelResponse.data.success) {
          console.log('✅ Người nhận hủy giao dịch thành công');
        } else {
          console.log('❌ Người nhận hủy giao dịch thất bại:', cancelResponse.data.message);
        }
      } catch (error) {
        console.log('❌ Lỗi khi người nhận hủy giao dịch:', error.response?.data?.message || error.message);
      }
    }

    // 5. Kiểm tra trạng thái giao dịch sau khi hủy
    if (transactionId) {
      console.log('\n5. Kiểm tra trạng thái giao dịch sau khi hủy...');
      try {
        const transactionResponse = await axios.get(`${API_BASE_URL}/transactions/${transactionId}`, {
          headers: { Authorization: `Bearer ${tokens['admin']}` }
        });
        
        if (transactionResponse.data.success) {
          const transaction = transactionResponse.data.data;
          console.log('Trạng thái giao dịch:', transaction.trang_thai);
          console.log('Giao dịch đã được xử lý:', transaction.trang_thai !== 'cho_xac_nhan');
        }
      } catch (error) {
        console.log('❌ Lỗi khi kiểm tra trạng thái giao dịch:', error.response?.data?.message || error.message);
      }
    }

    // 6. Tạo giao dịch khác để test xác nhận
    console.log('\n6. Tạo giao dịch khác để test xác nhận...');
    let confirmTransactionId;
    let confirmScheduleId;
    
    if (tokens['nguyenvanA']) {
      try {
        // Tạo lịch xe mới
        const scheduleResponse = await axios.post(`${API_BASE_URL}/schedules`, {
          id_loai_xe: 2,
          id_loai_tuyen: 2,
          thoi_gian_bat_dau_don: '2024-12-28T09:00:00',
          thoi_gian_ket_thuc_don: '2024-12-28T09:30:00',
          id_nhom: 1,
          id_nguoi_nhan: userId2
        }, {
          headers: { Authorization: `Bearer ${tokens['nguyenvanA']}` }
        });

        if (scheduleResponse.data.success) {
          confirmScheduleId = scheduleResponse.data.data.id;
          console.log('✅ Lịch xe mới tạo thành công với ID:', confirmScheduleId);
        }

        // Tạo giao dịch giao lịch mới
        const transactionResponse = await axios.post(`${API_BASE_URL}/transactions`, {
          id_loai_giao_dich: 1, // Giao lịch
          id_nguoi_nhan: userId2,
          id_nhom: 1,
          id_lich_xe: confirmScheduleId,
          so_tien: 150000,
          diem: 30,
          noi_dung: 'Test giao dịch giao lịch để kiểm tra xác nhận'
        }, {
          headers: { Authorization: `Bearer ${tokens['nguyenvanA']}` }
        });
        
        if (transactionResponse.data.success) {
          confirmTransactionId = transactionResponse.data.data.id;
          console.log('✅ Giao dịch giao lịch mới tạo thành công với ID:', confirmTransactionId);
        }
      } catch (error) {
        console.log('❌ Lỗi khi tạo giao dịch giao lịch mới:', error.response?.data?.message || error.message);
      }
    }

    // 7. Test xác nhận giao dịch bởi người nhận
    if (confirmTransactionId && tokens['tranthiB']) {
      console.log('\n7. Test xác nhận giao dịch bởi người nhận...');
      try {
        const confirmResponse = await axios.put(`${API_BASE_URL}/transactions/${confirmTransactionId}/confirm`, {}, {
          headers: { Authorization: `Bearer ${tokens['tranthiB']}` }
        });
        
        if (confirmResponse.data.success) {
          console.log('✅ Người nhận xác nhận giao dịch thành công');
        } else {
          console.log('❌ Người nhận xác nhận giao dịch thất bại:', confirmResponse.data.message);
        }
      } catch (error) {
        console.log('❌ Lỗi khi người nhận xác nhận giao dịch:', error.response?.data?.message || error.message);
      }
    }

    // 8. Kiểm tra trạng thái giao dịch sau khi xác nhận
    if (confirmTransactionId) {
      console.log('\n8. Kiểm tra trạng thái giao dịch sau khi xác nhận...');
      try {
        const transactionResponse = await axios.get(`${API_BASE_URL}/transactions/${confirmTransactionId}`, {
          headers: { Authorization: `Bearer ${tokens['admin']}` }
        });
        
        if (transactionResponse.data.success) {
          const transaction = transactionResponse.data.data;
          console.log('Trạng thái giao dịch:', transaction.trang_thai);
          console.log('Giao dịch đã được xử lý:', transaction.trang_thai !== 'cho_xac_nhan');
        }
      } catch (error) {
        console.log('❌ Lỗi khi kiểm tra trạng thái giao dịch:', error.response?.data?.message || error.message);
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
            const notifications = notificationResponse.data.data;
            const unreadCount = notifications.filter(n => !n.da_doc).length;
            console.log(`${user.username}: ${notifications.length} thông báo, ${unreadCount} chưa đọc`);
            
            // Hiển thị 3 thông báo mới nhất
            notifications.slice(0, 3).forEach((notification, index) => {
              console.log(`  ${index + 1}. ${notification.noi_dung}`);
            });
          }
        } catch (error) {
          console.log(`❌ Không thể lấy thông báo của ${user.username}`);
        }
      }
    }

    console.log('\n=== TEST HOÀN TẤT ===');
    console.log('\nKiểm tra trên frontend:');
    console.log('1. Người nhận phải có cả nút "Xác nhận" và "Hủy" cho giao dịch giao lịch');
    console.log('2. Sau khi xác nhận/hủy, nút phải biến mất và hiển thị trạng thái');
    console.log('3. Thông báo phải hiển thị thông tin lịch xe chi tiết');

  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy test
testNewFeatures();
