const axios = require('axios');
const API_BASE_URL = 'http://localhost:5000/api';

// Test users
const testUsers = [
  { username: 'admin', password: 'Admin@123' },
  { username: 'nguyenvanA', password: 'User@123' }
];

let tokens = {};
let userId1, userId2;

async function testNotificationRead() {
  console.log('=== TEST NOTIFICATION READ STATUS ===\n');

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
        if (user.username === 'admin') userId2 = loginResponse.data.data.user.id_nguoi_dung;
        console.log(`✅ ${user.username} đăng nhập thành công`);
      }
    }

    // 2. Tạo giao dịch để có thông báo
    console.log('\n2. Tạo giao dịch để có thông báo...');
    let transactionId;
    if (tokens['nguyenvanA']) {
      try {
        const transactionResponse = await axios.post(`${API_BASE_URL}/transactions`, {
          id_loai_giao_dich: 4, // San cho
          id_nguoi_nhan: userId2,
          id_nhom: 1,
          so_tien: 25000,
          diem: 5,
          noi_dung: 'Test thông báo để kiểm tra trạng thái đọc'
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

    // 3. Kiểm tra thông báo ban đầu
    console.log('\n3. Kiểm tra thông báo ban đầu...');
    let initialNotifications = [];
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
            
            if (user.username === 'admin') {
              initialNotifications = notifications;
            }
          }
        } catch (error) {
          console.log(`❌ Không thể lấy thông báo của ${user.username}`);
        }
      }
    }

    // 4. Test đánh dấu một thông báo đã đọc
    if (initialNotifications.length > 0) {
      const notificationToMark = initialNotifications.find(n => !n.da_doc);
      if (notificationToMark) {
        console.log('\n4. Test đánh dấu một thông báo đã đọc...');
        console.log('Thông báo ID:', notificationToMark.id_thong_bao);
        console.log('Nội dung:', notificationToMark.noi_dung);
        console.log('Trạng thái đọc ban đầu:', notificationToMark.da_doc);
        
        try {
          const markResponse = await axios.put(`${API_BASE_URL}/notifications/${notificationToMark.id_thong_bao}/read`, {}, {
            headers: { Authorization: `Bearer ${tokens['admin']}` }
          });
          
          if (markResponse.data.success) {
            console.log('✅ Đánh dấu thông báo đã đọc thành công');
          } else {
            console.log('❌ Đánh dấu thông báo đã đọc thất bại:', markResponse.data.message);
          }
        } catch (error) {
          console.log('❌ Lỗi khi đánh dấu thông báo đã đọc:', error.response?.data?.message || error.message);
        }
      }
    }

    // 5. Test đánh dấu tất cả thông báo đã đọc
    console.log('\n5. Test đánh dấu tất cả thông báo đã đọc...');
    try {
      const markAllResponse = await axios.put(`${API_BASE_URL}/notifications/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${tokens['admin']}` }
      });
      
      if (markAllResponse.data.success) {
        console.log('✅ Đánh dấu tất cả thông báo đã đọc thành công');
      } else {
        console.log('❌ Đánh dấu tất cả thông báo đã đọc thất bại:', markAllResponse.data.message);
      }
    } catch (error) {
      console.log('❌ Lỗi khi đánh dấu tất cả thông báo đã đọc:', error.response?.data?.message || error.message);
    }

    // 6. Kiểm tra trạng thái sau khi đánh dấu
    console.log('\n6. Kiểm tra trạng thái sau khi đánh dấu...');
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
            
            // Hiển thị trạng thái của từng thông báo
            notifications.slice(0, 3).forEach((notification, index) => {
              console.log(`  ${index + 1}. ID: ${notification.id_thong_bao}, Đã đọc: ${notification.da_doc ? 'Có' : 'Chưa'}`);
            });
          }
        } catch (error) {
          console.log(`❌ Không thể lấy thông báo của ${user.username}`);
        }
      }
    }

    // 7. Kiểm tra database trực tiếp
    console.log('\n7. Kiểm tra database trực tiếp...');
    console.log('Hãy kiểm tra bảng thong_bao trong database:');
    console.log('SELECT id_thong_bao, id_nguoi_dung, noi_dung, da_doc, ngay_tao FROM thong_bao ORDER BY ngay_tao DESC LIMIT 10;');

    console.log('\n=== TEST HOÀN TẤT ===');

  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy test
testNotificationRead();
