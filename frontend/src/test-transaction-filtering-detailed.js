// Test logic lọc giao dịch chi tiết
// File này để test logic lọc giao dịch trong HomePage với các trường hợp cụ thể

// Mock data: danh sách giao dịch từ API (giả lập dữ liệu thực tế)
const mockTransactions = [
  // Giao dịch liên quan đến User A (ID: 101)
  {
    id_giao_dich: 1,
    id_loai_giao_dich: 1, // Giao lịch
    id_nguoi_gui: 101, // User A là người giao lịch
    id_nguoi_nhan: 102, // User B là người nhận lịch
    noi_dung: 'Giao lịch xe cho User B',
    trang_thai: 'cho_xac_nhan'
  },
  {
    id_giao_dich: 2,
    id_loai_giao_dich: 2, // Nhận lịch
    id_nguoi_gui: 102, // User B là người giao lịch
    id_nguoi_nhan: 101, // User A là người nhận lịch
    noi_dung: 'Nhận lịch xe từ User B',
    trang_thai: 'cho_xac_nhan'
  },
  {
    id_giao_dich: 3,
    id_loai_giao_dich: 4, // San cho
    id_nguoi_gui: 101, // User A là người san cho
    id_nguoi_nhan: 103, // User C là người nhận san
    noi_dung: 'San cho User C',
    trang_thai: 'hoan_thanh'
  },
  {
    id_giao_dich: 4,
    id_loai_giao_dich: 5, // Nhận san
    id_nguoi_gui: 103, // User C là người san cho
    id_nguoi_nhan: 101, // User A là người nhận san
    noi_dung: 'Nhận san từ User C',
    trang_thai: 'hoan_thanh'
  },
  
  // Giao dịch KHÔNG liên quan đến User A
  {
    id_giao_dich: 5,
    id_loai_giao_dich: 1, // Giao lịch
    id_nguoi_gui: 104, // User D là người giao lịch
    id_nguoi_nhan: 105, // User E là người nhận lịch
    noi_dung: 'Giao lịch xe cho User E',
    trang_thai: 'cho_xac_nhan'
  },
  {
    id_giao_dich: 6,
    id_loai_giao_dich: 4, // San cho
    id_nguoi_gui: 106, // User F là người san cho
    id_nguoi_nhan: 107, // User G là người nhận san
    noi_dung: 'San cho User G',
    trang_thai: 'hoan_thanh'
  },
  {
    id_giao_dich: 7,
    id_loai_giao_dich: 2, // Nhận lịch
    id_nguoi_gui: 108, // User H là người giao lịch
    id_nguoi_nhan: 109, // User I là người nhận lịch
    noi_dung: 'Nhận lịch xe từ User H',
    trang_thai: 'cho_xac_nhan'
  }
];

// Mock user (User A - ID 101)
const mockUser = {
  id_nguoi_dung: 101,
  la_admin: 0
};

// Logic lọc giao dịch (copy từ HomePage)
function filterTransactionsForUser(transactions, user) {
  if (user.la_admin === 1 || user.la_admin === true) {
    return transactions; // Admin thấy tất cả
  }
  
  console.log('🔍 === FILTERING TRANSACTIONS FOR USER ===');
  console.log('🔍 User ID:', user.id_nguoi_dung);
  console.log('🔍 Total transactions before filtering:', transactions.length);
  
  // Log từng giao dịch để debug
  transactions.forEach((transaction, index) => {
    const userIsSender = transaction.id_nguoi_gui === user.id_nguoi_dung;
    const userIsReceiver = transaction.id_nguoi_nhan === user.id_nguoi_dung;
    
    const shouldShow = (
      (transaction.id_loai_giao_dich === 1 && userIsSender) || // Giao lịch - user là người giao
      (transaction.id_loai_giao_dich === 2 && userIsReceiver) || // Nhận lịch - user là người nhận
      (transaction.id_loai_giao_dich === 4 && userIsSender) || // San cho - user là người san
      (transaction.id_loai_giao_dich === 5 && userIsReceiver)    // Nhận san - user là người nhận
    );
    
    console.log(`🔍 Transaction ${index + 1}:`, {
      id: transaction.id_giao_dich,
      type: transaction.id_loai_giao_dich,
      typeName: getTransactionTypeName(transaction.id_loai_giao_dich),
      sender: transaction.id_nguoi_gui,
      receiver: transaction.id_nguoi_nhan,
      userIsSender: userIsSender,
      userIsReceiver: userIsReceiver,
      shouldShow: shouldShow,
      reason: getShowReason(transaction, user)
    });
  });
  
  // User thường: chỉ thấy giao dịch liên quan
  const filteredTransactions = transactions.filter(transaction => {
    return (
      (transaction.id_loai_giao_dich === 1 && transaction.id_nguoi_gui === user.id_nguoi_dung) || // Giao lịch - user là người giao
      (transaction.id_loai_giao_dich === 2 && transaction.id_nguoi_nhan === user.id_nguoi_dung) || // Nhận lịch - user là người nhận
      (transaction.id_loai_giao_dich === 4 && transaction.id_nguoi_gui === user.id_nguoi_dung) || // San cho - user là người san
      (transaction.id_loai_giao_dich === 5 && transaction.id_nguoi_nhan === user.id_nguoi_dung)    // Nhận san - user là người nhận
    )
  });
  
  console.log('🔍 Filtered transactions for user:', filteredTransactions.length, 'out of', transactions.length);
  
  // Log giao dịch đã được lọc
  filteredTransactions.forEach((transaction, index) => {
    let role = '';
    if (transaction.id_loai_giao_dich === 1 && transaction.id_nguoi_gui === user.id_nguoi_dung) role = 'Người giao lịch';
    else if (transaction.id_loai_giao_dich === 2 && transaction.id_nguoi_nhan === user.id_nguoi_dung) role = 'Người nhận lịch';
    else if (transaction.id_loai_giao_dich === 4 && transaction.id_nguoi_gui === user.id_nguoi_dung) role = 'Người san cho';
    else if (transaction.id_loai_giao_dich === 5 && transaction.id_nguoi_nhan === user.id_nguoi_dung) role = 'Người nhận san';
    
    console.log(`🔍 Filtered Transaction ${index + 1}:`, {
      id: transaction.id_giao_dich,
      type: transaction.id_loai_giao_dich,
      typeName: getTransactionTypeName(transaction.id_loai_giao_dich),
      role: role,
      content: transaction.noi_dung
    });
  });
  
  return filteredTransactions;
}

// Helper functions
function getTransactionTypeName(typeId) {
  switch (typeId) {
    case 1: return 'Giao lịch';
    case 2: return 'Nhận lịch';
    case 4: return 'San cho';
    case 5: return 'Nhận san';
    default: return 'Khác';
  }
}

function getShowReason(transaction, user) {
  if (transaction.id_loai_giao_dich === 1 && transaction.id_nguoi_gui === user.id_nguoi_dung) {
    return 'User là người giao lịch (người gửi)';
  } else if (transaction.id_loai_giao_dich === 2 && transaction.id_nguoi_nhan === user.id_nguoi_dung) {
    return 'User là người nhận lịch (người nhận)';
  } else if (transaction.id_loai_giao_dich === 4 && transaction.id_nguoi_gui === user.id_nguoi_dung) {
    return 'User là người san cho (người gửi)';
  } else if (transaction.id_loai_giao_dich === 5 && transaction.id_nguoi_nhan === user.id_nguoi_dung) {
    return 'User là người nhận san (người nhận)';
  } else {
    return 'User không liên quan đến giao dịch này';
  }
}

// Test cases
console.log('=== Test Logic Lọc Giao Dịch Chi Tiết ===\n');

console.log('1. Mock User:', mockUser);
console.log('2. Tổng số giao dịch:', mockTransactions.length);
console.log('3. Danh sách giao dịch gốc:');
mockTransactions.forEach(t => {
  console.log(`   - ID: ${t.id_giao_dich}, Loại: ${t.id_loai_giao_dich} (${getTransactionTypeName(t.id_loai_giao_dich)}), Gửi: ${t.id_nguoi_gui}, Nhận: ${t.id_nguoi_nhan}, Nội dung: ${t.noi_dung}`);
});

console.log('\n4. Lọc giao dịch cho User A (ID: 101):');
const filteredTransactions = filterTransactionsForUser(mockTransactions, mockUser);

console.log('\n5. Kiểm tra logic chi tiết:');
console.log(`   - Giao lịch (ID=1): User A là người gửi → ${filteredTransactions.some(t => t.id_giao_dich === 1) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - Nhận lịch (ID=2): User A là người nhận → ${filteredTransactions.some(t => t.id_giao_dich === 2) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - San cho (ID=3): User A là người gửi → ${filteredTransactions.some(t => t.id_giao_dich === 3) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - Nhận san (ID=4): User A là người nhận → ${filteredTransactions.some(t => t.id_giao_dich === 4) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - Giao lịch khác (ID=5): User A không liên quan → ${filteredTransactions.some(t => t.id_giao_dich === 5) ? '❌ Hiển thị (sai)' : '✅ Không hiển thị (đúng)'}`);
console.log(`   - San cho khác (ID=6): User A không liên quan → ${filteredTransactions.some(t => t.id_giao_dich === 6) ? '❌ Hiển thị (sai)' : '✅ Không hiển thị (đúng)'}`);
console.log(`   - Nhận lịch khác (ID=7): User A không liên quan → ${filteredTransactions.some(t => t.id_giao_dich === 7) ? '❌ Hiển thị (sai)' : '✅ Không hiển thị (đúng)'}`);

console.log('\n6. Tóm tắt kết quả:');
console.log(`   - Giao dịch hiển thị: ${filteredTransactions.length}`);
console.log(`   - Giao dịch bị ẩn: ${mockTransactions.length - filteredTransactions.length}`);
console.log(`   - Tỷ lệ lọc: ${((mockTransactions.length - filteredTransactions.length) / mockTransactions.length * 100).toFixed(1)}%`);

console.log('\n=== Test hoàn thành ===');
