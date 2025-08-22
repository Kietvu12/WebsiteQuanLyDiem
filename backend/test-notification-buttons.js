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

async function testNotificationButtons() {
  console.log('=== TEST NOTIFICATION BUTTONS ===\n');

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
          thoi_gian_bat_dau_don: '2024-12-29T08:00:00',
          thoi_gian_ket_thuc_don: '2024-12-29T08:30:00',
          thoi_gian_bat_dau_tra: '2024-12-29T18:00:00',
          thoi_gian_ket_thuc_tra: '2024-12-29T18:30:00',
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
          so_tien: 200000,
          diem: 25,
          noi_dung: 'Test giao dịch giao lịch để kiểm tra nút trong modal thông báo'
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

    // 3. Kiểm tra thông báo và phân tích quyền hiển thị nút
    console.log('\n3. Kiểm tra thông báo và phân tích quyền hiển thị nút...');
    for (const user of testUsers) {
      if (tokens[user.username]) {
        try {
          const notificationResponse = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${tokens[user.username]}` }
          });
          
          if (notificationResponse.data.success) {
            const notifications = notificationResponse.data.data;
            const unreadCount = notifications.filter(n => !n.da_doc).length;
            console.log(`\n${user.username}: ${notifications.length} thông báo, ${unreadCount} chưa đọc`);
            
            // Tìm thông báo liên quan đến giao dịch giao lịch mới tạo
            const relevantNotification = notifications.find(n => 
              n.id_giao_dich === transactionId && n.id_loai_giao_dich === 1
            );
            
            if (relevantNotification) {
              console.log(`  Thông báo giao dịch giao lịch:`);
              console.log(`    ID: ${relevantNotification.id_thong_bao}`);
              console.log(`    Nội dung: ${relevantNotification.noi_dung}`);
              console.log(`    Trạng thái: ${relevantNotification.trang_thai}`);
              console.log(`    Người gửi: ${relevantNotification.ten_nguoi_gui}`);
              console.log(`    Người nhận: ${relevantNotification.ten_nguoi_nhan}`);
              
              // Phân tích quyền hiển thị nút
              const isSender = relevantNotification.ten_nguoi_gui === user.username;
              const isReceiver = relevantNotification.ten_nguoi_nhan === user.username;
              const isAdmin = user.username === 'admin';
              const isPending = relevantNotification.trang_thai === 'cho_xac_nhan';
              
              console.log(`  Phân tích quyền:`);
              console.log(`    Là người gửi: ${isSender}`);
              console.log(`    Là người nhận: ${isReceiver}`);
              console.log(`    Là admin: ${isAdmin}`);
              console.log(`    Giao dịch chờ xử lý: ${isPending}`);
              
              if (isPending) {
                // Kiểm tra nút xác nhận
                if (isReceiver && relevantNotification.id_loai_giao_dich === 1) {
                  console.log(`    ✅ CÓ NÚT "XÁC NHẬN" (người nhận giao dịch giao lịch)`);
                } else {
                  console.log(`    ❌ KHÔNG CÓ NÚT "XÁC NHẬN"`);
                }
                
                // Kiểm tra nút hủy giao dịch
                if (isSender || isReceiver || isAdmin) {
                  console.log(`    ✅ CÓ NÚT "HỦY GIAO DỊCH" (người gửi, người nhận hoặc admin)`);
                } else {
                  console.log(`    ❌ KHÔNG CÓ NÚT "HỦY GIAO DỊCH"`);
                }
                
                // Tổng kết
                const canTakeAction = (isReceiver && relevantNotification.id_loai_giao_dich === 1) || 
                                    (isSender || isReceiver || isAdmin);
                console.log(`    📋 TÓM TẮT: ${canTakeAction ? 'CÓ THỂ THỰC HIỆN HÀNH ĐỘNG' : 'KHÔNG CÓ QUYỀN'}`);
              } else {
                console.log(`    📋 Giao dịch đã được xử lý, chỉ hiển thị trạng thái`);
              }
            } else {
              console.log(`  Không tìm thấy thông báo liên quan đến giao dịch giao lịch mới`);
            }
          }
        } catch (error) {
          console.log(`❌ Không thể lấy thông báo của ${user.username}`);
        }
      }
    }

    // 4. Test xác nhận giao dịch bởi người nhận
    if (transactionId && tokens['tranthiB']) {
      console.log('\n4. Test xác nhận giao dịch bởi người nhận...');
      try {
        const confirmResponse = await axios.put(`${API_BASE_URL}/transactions/${transactionId}/confirm`, {}, {
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

    // 5. Kiểm tra thông báo sau khi xác nhận
    console.log('\n5. Kiểm tra thông báo sau khi xác nhận...');
    for (const user of testUsers) {
      if (tokens[user.username]) {
        try {
          const notificationResponse = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${tokens[user.username]}` }
          });
          
          if (notificationResponse.data.success) {
            const notifications = notificationResponse.data.data;
            const relevantNotification = notifications.find(n => 
              n.id_giao_dich === transactionId && n.id_loai_giao_dich === 1
            );
            
            if (relevantNotification) {
              console.log(`${user.username}: Thông báo sau khi xác nhận - Trạng thái: ${relevantNotification.trang_thai}`);
              console.log(`  Nội dung: ${relevantNotification.noi_dung}`);
              
              // Kiểm tra xem có còn nút hành động không
              if (relevantNotification.trang_thai === 'cho_xac_nhan') {
                console.log(`  ⚠️ VẪN CÒN NÚT HÀNH ĐỘNG (có thể có lỗi)`);
              } else {
                console.log(`  ✅ ĐÃ ẨN NÚT HÀNH ĐỘNG, CHỈ HIỂN THỊ TRẠNG THÁI`);
              }
            }
          }
        } catch (error) {
          console.log(`❌ Không thể lấy thông báo của ${user.username}`);
        }
      }
    }

    console.log('\n=== TEST HOÀN TẤT ===');
    console.log('\nKiểm tra trên frontend:');
    console.log('1. Người nhận phải có CẢ HAI nút: "Xác nhận" và "Hủy giao dịch"');
    console.log('2. Người gửi chỉ có nút "Hủy giao dịch"');
    console.log('3. Admin có nút "Hủy giao dịch"');
    console.log('4. Sau khi xác nhận/hủy, tất cả nút phải biến mất');

  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy test
testNotificationButtons();
