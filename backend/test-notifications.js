const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUsers = [
  {
    ten_dang_nhap: 'admin',
    mat_khau: 'admin123',
    name: 'Admin User'
  },
  {
    ten_dang_nhap: 'user1',
    mat_khau: 'user123',
    name: 'User 1'
  },
  {
    ten_dang_nhap: 'user2',
    mat_khau: 'user123',
    name: 'User 2'
  }
];

let tokens = {};

async function testNotifications() {
  console.log('=== TEST THÔNG BÁO ===\n');

  try {
    // 1. Đăng nhập tất cả users
    console.log('1. Đăng nhập users...');
    for (const user of testUsers) {
      const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, {
        ten_dang_nhap: user.ten_dang_nhap,
        mat_khau: user.mat_khau
      });
      
      if (loginResponse.data.success) {
        tokens[user.ten_dang_nhap] = loginResponse.data.data.token;
        console.log(`✅ ${user.name} đăng nhập thành công`);
      } else {
        console.log(`❌ ${user.name} đăng nhập thất bại:`, loginResponse.data.message);
      }
    }

    // 2. Kiểm tra thông báo ban đầu của mỗi user
    console.log('\n2. Kiểm tra thông báo ban đầu...');
    for (const user of testUsers) {
      if (tokens[user.ten_dang_nhap]) {
        try {
          const notificationsResponse = await axios.get(`${API_BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${tokens[user.ten_dang_nhap]}` }
          });
          
          if (notificationsResponse.data.success) {
            console.log(`📋 ${user.name} có ${notificationsResponse.data.data.length} thông báo`);
            if (notificationsResponse.data.data.length > 0) {
              console.log('   Thông báo đầu tiên:', notificationsResponse.data.data[0].noi_dung);
            }
          } else {
            console.log(`❌ ${user.name} không thể lấy thông báo:`, notificationsResponse.data.message);
          }
        } catch (error) {
          console.log(`❌ ${user.name} lỗi khi lấy thông báo:`, error.response?.data || error.message);
        }
      }
    }

    // 3. Tạo giao dịch giao lịch từ user1 đến user2
    console.log('\n3. Tạo giao dịch giao lịch...');
    if (tokens.user1) {
      try {
        // Lấy danh sách nhóm
        const groupsResponse = await axios.get(`${API_BASE_URL}/groups`, {
          headers: { Authorization: `Bearer ${tokens.user1}` }
        });
        
        if (groupsResponse.data.success && groupsResponse.data.data.length > 0) {
          const groupId = groupsResponse.data.data[0].id_nhom;
          console.log('✅ Lấy nhóm thành công, ID:', groupId);
          
          // Lấy thành viên nhóm
          const membersResponse = await axios.get(`${API_BASE_URL}/groups/${groupId}/members`, {
            headers: { Authorization: `Bearer ${tokens.user1}` }
          });
          
          if (membersResponse.data.success && membersResponse.data.data.length > 0) {
            // Tìm user2 trong nhóm
            const user2Member = membersResponse.data.data.find(m => m.ten_dang_nhap === 'user2');
            if (user2Member) {
              console.log('✅ Tìm thấy user2 trong nhóm, ID:', user2Member.id_nguoi_dung);
              
              // Tạo lịch xe
              const scheduleResponse = await axios.post(`${API_BASE_URL}/schedules`, {
                id_loai_xe: 1,
                id_loai_tuyen: 1,
                thoi_gian_bat_dau_don: '2024-12-25T08:00:00',
                thoi_gian_ket_thuc_don: '2024-12-25T09:00:00',
                thoi_gian_bat_dau_tra: '2024-12-25T17:00:00',
                thoi_gian_ket_thuc_tra: '2024-12-25T18:00:00',
                id_nhom: groupId,
                id_nguoi_nhan: user2Member.id_nguoi_dung
              }, {
                headers: { Authorization: `Bearer ${tokens.user1}` }
              });
              
              if (scheduleResponse.data.success) {
                const scheduleId = scheduleResponse.data.data.id;
                console.log('✅ Tạo lịch xe thành công, ID:', scheduleId);
                
                // Tạo giao dịch
                const transactionResponse = await axios.post(`${API_BASE_URL}/transactions`, {
                  id_loai_giao_dich: 1,
                  id_nguoi_nhan: user2Member.id_nguoi_dung,
                  id_nhom: groupId,
                  id_lich_xe: scheduleId,
                  so_tien: 50000,
                  diem: 10,
                  noi_dung: 'Giao lịch xe đi công tác'
                }, {
                  headers: { Authorization: `Bearer ${tokens.user1}` }
                });
                
                if (transactionResponse.data.success) {
                  const transactionId = transactionResponse.data.data.id;
                  console.log('✅ Tạo giao dịch thành công, ID:', transactionId);
                  
                  // 4. Kiểm tra thông báo sau khi tạo giao dịch
                  console.log('\n4. Kiểm tra thông báo sau khi tạo giao dịch...');
                  
                  // Kiểm tra thông báo của user2 (người nhận)
                  const user2Notifications = await axios.get(`${API_BASE_URL}/notifications`, {
                    headers: { Authorization: `Bearer ${tokens.user2}` }
                  });
                  
                  if (user2Notifications.data.success) {
                    console.log(`📋 User2 có ${user2Notifications.data.data.length} thông báo`);
                    const newNotifications = user2Notifications.data.data.filter(n => 
                      n.noi_dung.includes('lịch xe mới') || n.noi_dung.includes('giao dịch')
                    );
                    if (newNotifications.length > 0) {
                      console.log('✅ Tìm thấy thông báo mới:');
                      newNotifications.forEach((n, index) => {
                        console.log(`  ${index + 1}. ID: ${n.id_thong_bao}, Nội dung: "${n.noi_dung}"`);
                      });
                    } else {
                      console.log('⚠️ Không tìm thấy thông báo mới');
                    }
                  }
                  
                  // Kiểm tra thông báo của user1 (người gửi)
                  const user1Notifications = await axios.get(`${API_BASE_URL}/notifications`, {
                    headers: { Authorization: `Bearer ${tokens.user1}` }
                  });
                  
                  if (user1Notifications.data.success) {
                    console.log(`📋 User1 có ${user1Notifications.data.data.length} thông báo`);
                    const senderNotifications = user1Notifications.data.data.filter(n => 
                      n.noi_dung.includes('giao dịch giao lịch thành công')
                    );
                    if (senderNotifications.length > 0) {
                      console.log('✅ Tìm thấy thông báo cho người gửi:');
                      senderNotifications.forEach((n, index) => {
                        console.log(`  ${index + 1}. ID: ${n.id_thong_bao}, Nội dung: "${n.noi_dung}"`);
                      });
                    } else {
                      console.log('⚠️ Không tìm thấy thông báo cho người gửi');
                    }
                  }
                  
                } else {
                  console.log('❌ Tạo giao dịch thất bại:', transactionResponse.data.message);
                }
              } else {
                console.log('❌ Tạo lịch xe thất bại:', scheduleResponse.data.message);
              }
            } else {
              console.log('❌ Không tìm thấy user2 trong nhóm');
            }
          } else {
            console.log('❌ Không thể lấy thành viên nhóm:', membersResponse.data.message);
          }
        } else {
          console.log('❌ Không thể lấy danh sách nhóm:', groupsResponse.data.message);
        }
      } catch (error) {
        console.log('❌ Lỗi khi tạo giao dịch:', error.response?.data || error.message);
      }
    }

    // 5. Kiểm tra database trực tiếp
    console.log('\n5. Kiểm tra database trực tiếp...');
    console.log('Hãy kiểm tra bảng thong_bao trong database:');
    console.log('SELECT * FROM thong_bao ORDER BY ngay_tao DESC LIMIT 10;');

  } catch (error) {
    console.error('❌ Lỗi chung:', error.message);
  }
}

// Chạy test
testNotifications();
