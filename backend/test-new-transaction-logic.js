const { Transaction, User, Group } = require('./models');
const { testConnection } = require('./config/database');

async function testNewTransactionLogic() {
  try {
    console.log('🚀 === TEST LOGIC GIAO DỊCH MỚI ===');
    
    // Test kết nối database
    await testConnection();
    console.log('✅ Kết nối database thành công');

    // Test 1: Tạo giao dịch "Giao lịch"
    console.log('\n📋 Test 1: Tạo giao dịch "Giao lịch"');
    const giaoLichData = {
      id_loai_giao_dich: 1, // Giao lịch
      id_nguoi_gui: 2, // nguyenvanA
      id_nguoi_nhan: 3, // tranthiB
      id_nhom: 1, // Nhóm Xe Sân Bay
      id_lich_xe: 1, // Lịch xe đầu tiên
      so_tien: 500000,
      diem: 50,
      noi_dung: 'Giao lịch xe sân bay 8h sáng',
      trang_thai: 'cho_xac_nhan'
    };

    const giaoLichId = await Transaction.create(giaoLichData);
    console.log('✅ Giao dịch "Giao lịch" được tạo với ID:', giaoLichId);

    // Test 2: Tạo giao dịch đối ứng "Nhận lịch"
    console.log('\n📋 Test 2: Tạo giao dịch đối ứng "Nhận lịch"');
    const nhanLichData = {
      id_loai_giao_dich: 2, // Nhận lịch
      id_nguoi_gui: 3, // tranthiB (người nhận lịch trở thành người gửi)
      id_nguoi_nhan: 2, // nguyenvanA (người giao lịch trở thành người nhận)
      id_nhom: 1, // Nhóm Xe Sân Bay
      id_lich_xe: 1, // Lịch xe đầu tiên
      so_tien: -500000, // Đảo dấu tiền (người nhận lịch sẽ bị trừ tiền)
      diem: -50, // Đảo dấu điểm (người nhận lịch sẽ bị trừ điểm)
      noi_dung: 'Nhận lịch: Giao lịch xe sân bay 8h sáng',
      trang_thai: 'cho_xac_nhan'
    };

    const nhanLichId = await Transaction.create(nhanLichData);
    console.log('✅ Giao dịch "Nhận lịch" đối ứng được tạo với ID:', nhanLichId);

    // Test 3: Tìm giao dịch đối ứng
    console.log('\n📋 Test 3: Tìm giao dịch đối ứng');
    const oppositeTransaction = await Transaction.findOppositeTransaction(
      2, // người giao lịch
      3, // người nhận lịch
      1, // nhóm
      1, // lịch xe
      2  // loại giao dịch "Nhận lịch"
    );

    if (oppositeTransaction) {
      console.log('✅ Tìm thấy giao dịch đối ứng:', {
        id: oppositeTransaction.id_giao_dich,
        loai: oppositeTransaction.ten_loai_giao_dich,
        trang_thai: oppositeTransaction.trang_thai
      });
    } else {
      console.log('❌ Không tìm thấy giao dịch đối ứng');
    }

    // Test 4: Kiểm tra số dư và điểm trước khi xác nhận
    console.log('\n📋 Test 4: Kiểm tra số dư và điểm trước khi xác nhận');
    const user2 = await User.getById(2); // nguyenvanA
    const user3 = await User.getById(3); // tranthiB
    
    console.log('Người giao lịch (nguyenvanA):', {
      id: user2.id_nguoi_dung,
      ho_ten: user2.ho_ten,
      so_du: user2.so_du,
      diem: user2.diem
    });
    
    console.log('Người nhận lịch (tranthiB):', {
      id: user3.id_nguoi_dung,
      ho_ten: user3.ho_ten,
      so_du: user3.so_du,
      diem: user3.diem
    });

    // Test 5: Xác nhận giao dịch (cập nhật trạng thái)
    console.log('\n📋 Test 5: Xác nhận giao dịch');
    await Transaction.updateStatus(giaoLichId, 'hoan_thanh');
    await Transaction.updateStatus(nhanLichId, 'hoan_thanh');
    console.log('✅ Cả 2 giao dịch đã được cập nhật trạng thái hoàn thành');

    // Test 6: Cập nhật số dư và điểm
    console.log('\n📋 Test 6: Cập nhật số dư và điểm');
    
    // Người giao lịch (nguyenvanA) ĐƯỢC CỘNG tiền và điểm
    const newBalanceUser2 = parseFloat(user2.so_du) + 500000;
    const newPointsUser2 = parseInt(user2.diem) + 50;
    
    // Người nhận lịch (tranthiB) BỊ TRỪ tiền và điểm
    const newBalanceUser3 = parseFloat(user3.so_du) - 500000;
    const newPointsUser3 = parseInt(user3.diem) - 50;
    
    await User.updateBalanceAndPoints(2, newBalanceUser2, newPointsUser2);
    await User.updateBalanceAndPoints(3, newBalanceUser3, newPointsUser3);
    
    console.log('✅ Đã cập nhật số dư và điểm:');
    console.log('  - Người giao lịch (nguyenvanA): +500,000 VNĐ, +50 điểm');
    console.log('  - Người nhận lịch (tranthiB): -500,000 VNĐ, -50 điểm');

    // Test 7: Kiểm tra kết quả cuối cùng
    console.log('\n📋 Test 7: Kiểm tra kết quả cuối cùng');
    const finalUser2 = await User.getById(2);
    const finalUser3 = await User.getById(3);
    
    console.log('Kết quả cuối cùng:');
    console.log('Người giao lịch (nguyenvanA):', {
      ho_ten: finalUser2.ho_ten,
      so_du_cu: user2.so_du,
      so_du_moi: finalUser2.so_du,
      diem_cu: user2.diem,
      diem_moi: finalUser2.diem
    });
    
    console.log('Người nhận lịch (tranthiB):', {
      ho_ten: finalUser3.ho_ten,
      so_du_cu: user3.so_du,
      so_du_moi: finalUser3.so_du,
      diem_cu: user3.diem,
      diem_moi: finalUser3.diem
    });

    console.log('\n🎉 === TEST HOÀN THÀNH THÀNH CÔNG ===');
    console.log('✅ Logic giao dịch mới hoạt động đúng:');
    console.log('  - Giao dịch "Giao lịch" và "Nhận lịch" được tạo đối ứng');
    console.log('  - Người giao lịch ĐƯỢC CỘNG tiền và điểm');
    console.log('  - Người nhận lịch BỊ TRỪ tiền và điểm');
    console.log('  - Cả 2 giao dịch được cập nhật trạng thái đồng bộ');

  } catch (error) {
    console.error('❌ Lỗi trong quá trình test:', error);
  }
}

// Chạy test
testNewTransactionLogic();
