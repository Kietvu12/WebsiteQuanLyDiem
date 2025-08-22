// Test script để kiểm tra flow xác nhận/hủy giao dịch
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser1 = {
  ten_dang_nhap: 'admin',
  mat_khau: 'admin123'
};

const testUser2 = {
  ten_dang_nhap: 'user1',
  mat_khau: 'user123'
};

let token1, token2;
let transactionId, scheduleId;

async function testTransactionFlow() {
  console.log('=== Bắt đầu test flow giao dịch ===\n');

  try {
    // 1. Đăng nhập user 1 (admin)
    console.log('1. Đăng nhập user 1 (admin)...');
    const login1 = await axios.post(`${API_BASE_URL}/users/login`, testUser1);
    token1 = login1.data.data.token;
    console.log('✅ Đăng nhập user 1 thành công\n');

    // 2. Đăng nhập user 2
    console.log('2. Đăng nhập user 2...');
    const login2 = await axios.post(`${API_BASE_URL}/users/login`, testUser2);
    token2 = login2.data.data.token;
    console.log('✅ Đăng nhập user 2 thành công\n');

    // 3. Lấy danh sách nhóm
    console.log('3. Lấy danh sách nhóm...');
    const groups = await axios.get(`${API_BASE_URL}/groups`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const groupId = groups.data.data[0]?.id_nhom;
    console.log(`✅ Lấy nhóm thành công, ID: ${groupId}\n`);

    // 4. Lấy danh sách thành viên nhóm
    console.log('4. Lấy danh sách thành viên nhóm...');
    const members = await axios.get(`${API_BASE_URL}/groups/${groupId}/members`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const recipientId = members.data.data.find(m => m.ten_dang_nhap === 'user1')?.id_nguoi_dung;
    console.log(`✅ Lấy thành viên thành công, recipient ID: ${recipientId}\n`);

    // 5. Lấy loại xe và tuyến
    console.log('5. Lấy loại xe và tuyến...');
    const [vehicleTypes, routeTypes] = await Promise.all([
      axios.get(`${API_BASE_URL}/schedules/vehicle-types`, {
        headers: { Authorization: `Bearer ${token1}` }
      }),
      axios.get(`${API_BASE_URL}/schedules/route-types`, {
        headers: { Authorization: `Bearer ${token1}` }
      })
    ]);
    const vehicleTypeId = vehicleTypes.data.data[0]?.id_loai_xe;
    const routeTypeId = routeTypes.data.data[0]?.id_loai_tuyen;
    console.log(`✅ Lấy loại xe và tuyến thành công\n`);

    // 6. Tạo lịch xe
    console.log('6. Tạo lịch xe...');
    const scheduleData = {
      id_loai_xe: vehicleTypeId,
      id_loai_tuyen: routeTypeId,
      thoi_gian_bat_dau_don: '2024-01-20T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-20T09:00:00',
      thoi_gian_bat_dau_tra: '2024-01-20T17:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-20T18:00:00',
      id_nhom: groupId
    };
    
    const schedule = await axios.post(`${API_BASE_URL}/schedules`, scheduleData, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    scheduleId = schedule.data.data.id;
    console.log(`✅ Tạo lịch xe thành công, ID: ${scheduleId}\n`);

    // 7. Tạo giao dịch giao lịch
    console.log('7. Tạo giao dịch giao lịch...');
    const transactionData = {
      id_loai_giao_dich: 1, // Giao lịch
      id_nguoi_nhan: recipientId,
      id_nhom: groupId,
      id_lich_xe: scheduleId,
      so_tien: 500000,
      diem: 50,
      noi_dung: 'Giao lịch xe khách Hà Nội - Hải Phòng'
    };
    
    const transaction = await axios.post(`${API_BASE_URL}/transactions`, transactionData, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    transactionId = transaction.data.data.id;
    console.log(`✅ Tạo giao dịch thành công, ID: ${transactionId}\n`);

    // 8. Kiểm tra trạng thái giao dịch
    console.log('8. Kiểm tra trạng thái giao dịch...');
    const transactionStatus = await axios.get(`${API_BASE_URL}/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log(`✅ Trạng thái giao dịch: ${transactionStatus.data.data.trang_thai}\n`);

    // 9. User 2 xác nhận giao dịch
    console.log('9. User 2 xác nhận giao dịch...');
    const confirm = await axios.put(`${API_BASE_URL}/transactions/${transactionId}/confirm`, {}, {
      headers: { Authorization: `Bearer ${token2}` }
    });
    console.log('✅ Xác nhận giao dịch thành công\n');

    // 10. Kiểm tra trạng thái sau khi xác nhận
    console.log('10. Kiểm tra trạng thái sau khi xác nhận...');
    const finalStatus = await axios.get(`${API_BASE_URL}/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log(`✅ Trạng thái cuối: ${finalStatus.data.data.trang_thai}\n`);

    // 11. Kiểm tra thông báo cho người nhận
    console.log('11. Kiểm tra thông báo cho người nhận...');
    try {
      const notifications = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token2}` }
      });
      
      if (notifications.data.success) {
        console.log('✅ Lấy thông báo thành công')
        console.log('📋 Số lượng thông báo:', notifications.data.data.length)
        
        // Tìm thông báo liên quan đến giao dịch này
        const relatedNotifications = notifications.data.data.filter(n => 
          n.id_giao_dich === transactionId || 
          n.noi_dung.includes('lịch xe mới')
        );
        
        if (relatedNotifications.length > 0) {
          console.log('✅ Tìm thấy thông báo liên quan:')
          relatedNotifications.forEach((n, index) => {
            console.log(`  ${index + 1}. ID: ${n.id_thong_bao}, Nội dung: "${n.noi_dung}", Đã đọc: ${n.da_doc}`)
          });
        } else {
          console.log('⚠️ Không tìm thấy thông báo liên quan đến giao dịch này')
        }
      } else {
        console.log('❌ Không thể lấy thông báo:', notifications.data.message)
      }
    } catch (error) {
      console.log('❌ Không thể kiểm tra thông báo:', error.response?.data || error.message)
    }

    // 12. Kiểm tra thông báo cho người gửi
    console.log('12. Kiểm tra thông báo cho người gửi...');
    try {
      const senderNotifications = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token1}` }
      });
      
      if (senderNotifications.data.success) {
        console.log('✅ Lấy thông báo người gửi thành công')
        console.log('📋 Số lượng thông báo:', senderNotifications.data.data.length)
        
        // Tìm thông báo liên quan đến giao dịch này
        const senderRelatedNotifications = senderNotifications.data.data.filter(n => 
          n.id_giao_dich === transactionId
        );
        
        if (senderRelatedNotifications.length > 0) {
          console.log('✅ Tìm thấy thông báo cho người gửi:')
          senderRelatedNotifications.forEach((n, index) => {
            console.log(`  ${index + 1}. ID: ${n.id_thong_bao}, Nội dung: "${n.noi_dung}", Đã đọc: ${n.da_doc}`)
          });
        } else {
          console.log('⚠️ Không tìm thấy thông báo cho người gửi')
        }
      } else {
        console.log('❌ Không thể lấy thông báo người gửi:', senderNotifications.data.message)
      }
    } catch (error) {
      console.log('❌ Không thể kiểm tra thông báo người gửi:', error.response?.data || error.message)
    }

    // 13. Kiểm tra lịch xe có thông tin người nhận
    console.log('13. Kiểm tra lịch xe có thông tin người nhận...');
    try {
      const scheduleCheck = await axios.get(`${API_BASE_URL}/schedules/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token1}` }
      });
      console.log('✅ Lịch xe vẫn tồn tại sau khi xác nhận');
      console.log('📋 Thông tin lịch xe:', {
        id_nguoi_tao: scheduleCheck.data.data.id_nguoi_tao,
        id_nguoi_nhan: scheduleCheck.data.data.id_nguoi_nhan,
        ten_nguoi_nhan: scheduleCheck.data.data.ten_nguoi_nhan
      });
    } catch (error) {
      console.log('❌ Không thể kiểm tra lịch xe:', error.response?.data || error.message);
    }

    // 14. Kiểm tra thông báo lịch xe cho người nhận
    console.log('14. Kiểm tra thông báo lịch xe cho người nhận...');
    try {
      const scheduleNotifications = await axios.get(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token2}` }
      });
      
      if (scheduleNotifications.data.success) {
        // Tìm thông báo lịch xe
        const scheduleRelatedNotifications = scheduleNotifications.data.data.filter(n => 
          n.noi_dung.includes('lịch xe mới')
        );
        
        if (scheduleRelatedNotifications.length > 0) {
          console.log('✅ Tìm thấy thông báo lịch xe:')
          scheduleRelatedNotifications.forEach((n, index) => {
            console.log(`  ${index + 1}. ID: ${n.id_thong_bao}, Nội dung: "${n.noi_dung}", Đã đọc: ${n.da_doc}`)
          });
        } else {
          console.log('⚠️ Không tìm thấy thông báo lịch xe')
        }
      } else {
        console.log('❌ Không thể lấy thông báo lịch xe:', scheduleNotifications.data.message)
      }
    } catch (error) {
      console.log('❌ Không thể kiểm tra thông báo lịch xe:', error.response?.data || error.message)
    }

    // 15. Kiểm tra số dư và điểm sau khi xác nhận
    console.log('15. Kiểm tra số dư và điểm sau khi xác nhận...');
    try {
      // Kiểm tra số dư và điểm của user1 (người giao lịch)
      const user1BalanceResponse = await axios.get(`${API_BASE_URL}/users/${userId1}`, {
        headers: { Authorization: `Bearer ${token1}` }
      });
      
      if (user1BalanceResponse.data.success) {
        const user1Data = user1BalanceResponse.data.data;
        console.log('✅ User1 (người giao lịch) sau khi xác nhận:')
        console.log('  Số dư:', user1Data.so_du)
        console.log('  Điểm:', user1Data.diem)
        console.log('  Kỳ vọng: số dư +50000, điểm +10')
      }
      
      // Kiểm tra số dư và điểm của user2 (người nhận lịch)
      const user2BalanceResponse = await axios.get(`${API_BASE_URL}/users/${userId2}`, {
        headers: { Authorization: `Bearer ${token2}` }
      });
      
      if (user2BalanceResponse.data.success) {
        const user2Data = user2BalanceResponse.data.data;
        console.log('✅ User2 (người nhận lịch) sau khi xác nhận:')
        console.log('  Số dư:', user2Data.so_du)
        console.log('  Điểm:', user2Data.diem)
        console.log('  Kỳ vọng: số dư -50000, điểm -10')
      }
    } catch (error) {
      console.log('❌ Không thể kiểm tra số dư và điểm:', error.response?.data || error.message);
    }

    console.log('=== Test flow xác nhận thành công! ===\n');

  } catch (error) {
    console.error('❌ Lỗi trong quá trình test:', error.response?.data || error.message);
  }
}

// Test flow hủy giao dịch
async function testCancelFlow() {
  console.log('=== Bắt đầu test flow hủy giao dịch ===\n');

  try {
    // Tạo giao dịch mới để test hủy
    console.log('1. Tạo giao dịch mới để test hủy...');
    const groups = await axios.get(`${API_BASE_URL}/groups`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const groupId = groups.data.data[0]?.id_nhom;
    
    const members = await axios.get(`${API_BASE_URL}/groups/${groupId}/members`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const recipientId = members.data.data.find(m => m.ten_dang_nhap === 'user1')?.id_nguoi_dung;
    
    const [vehicleTypes, routeTypes] = await Promise.all([
      axios.get(`${API_BASE_URL}/schedules/vehicle-types`, {
        headers: { Authorization: `Bearer ${token1}` }
      }),
      axios.get(`${API_BASE_URL}/schedules/route-types`, {
        headers: { Authorization: `Bearer ${token1}` }
      })
    ]);
    const vehicleTypeId = vehicleTypes.data.data[0]?.id_loai_xe;
    const routeTypeId = routeTypes.data.data[0]?.id_loai_tuyen;
    
    // Tạo lịch xe mới
    const scheduleData = {
      id_loai_xe: vehicleTypeId,
      id_loai_tuyen: routeTypeId,
      thoi_gian_bat_dau_don: '2024-01-21T08:00:00',
      thoi_gian_ket_thuc_don: '2024-01-21T09:00:00',
      thoi_gian_bat_dau_tra: '2024-01-21T17:00:00',
      thoi_gian_ket_thuc_tra: '2024-01-21T18:00:00',
      id_nhom: groupId
    };
    
    const schedule = await axios.post(`${API_BASE_URL}/schedules`, scheduleData, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const newScheduleId = schedule.data.data.id;
    console.log(`✅ Tạo lịch xe mới thành công, ID: ${newScheduleId}`);
    
    // Tạo giao dịch mới
    const transactionData = {
      id_loai_giao_dich: 1,
      id_nguoi_nhan: recipientId,
      id_nhom: groupId,
      id_lich_xe: newScheduleId,
      so_tien: 300000,
      diem: 30,
      noi_dung: 'Giao lịch xe khách Hà Nội - Đà Nẵng (để test hủy)'
    };
    
    const transaction = await axios.post(`${API_BASE_URL}/transactions`, transactionData, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    const newTransactionId = transaction.data.data.id;
    console.log(`✅ Tạo giao dịch mới thành công, ID: ${newTransactionId}\n`);

    // 2. Hủy giao dịch
    console.log('2. Hủy giao dịch...');
    const cancel = await axios.put(`${API_BASE_URL}/transactions/${newTransactionId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log('✅ Hủy giao dịch thành công\n');

    // 3. Kiểm tra trạng thái sau khi hủy
    console.log('3. Kiểm tra trạng thái sau khi hủy...');
    const cancelStatus = await axios.get(`${API_BASE_URL}/transactions/${newTransactionId}`, {
      headers: { Authorization: `Bearer ${token1}` }
    });
    console.log(`✅ Trạng thái sau khi hủy: ${cancelStatus.data.data.trang_thai}\n`);

    // 4. Kiểm tra lịch xe có bị xóa không
    console.log('4. Kiểm tra lịch xe có bị xóa không...');
    try {
      const scheduleCheck = await axios.get(`${API_BASE_URL}/schedules/${newScheduleId}`, {
        headers: { Authorization: `Bearer ${token1}` }
      });
      console.log('❌ Lịch xe vẫn còn tồn tại');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Lịch xe đã bị xóa thành công');
      } else {
        console.log('❌ Lỗi khi kiểm tra lịch xe:', error.response?.data || error.message);
      }
    }

    console.log('=== Test flow hủy thành công! ===\n');

  } catch (error) {
    console.error('❌ Lỗi trong quá trình test hủy:', error.response?.data || error.message);
  }
}

// Chạy test
async function runTests() {
  await testTransactionFlow();
  await testCancelFlow();
  console.log('=== Hoàn thành tất cả tests ===');
}

// Chạy nếu file được gọi trực tiếp
if (require.main === module) {
  runTests();
}

module.exports = { testTransactionFlow, testCancelFlow };
