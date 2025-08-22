// Debug logic lọc giao dịch
// File này để test logic lọc giao dịch độc lập

// Mock data từ API
const mockTransactions = [
  {
    id_giao_dich: 1,
    id_loai_giao_dich: 2, // Nhận lịch
    id_nguoi_gui: 101, // User A gửi
    id_nguoi_nhan: 102, // User B nhận (user hiện tại)
    noi_dung: 'Nhận lịch xe từ User A',
    trang_thai: 'cho_xac_nhan'
  },
  {
    id_giao_dich: 2,
    id_loai_giao_dich: 1, // Giao lịch
    id_nguoi_gui: 102, // User B gửi (user hiện tại)
    id_nguoi_nhan: 103, // User C nhận
    noi_dung: 'Giao lịch xe cho User C',
    trang_thai: 'hoan_thanh'
  },
  {
    id_giao_dich: 3,
    id_loai_giao_dich: 4, // San cho
    id_nguoi_gui: 102, // User B san (user hiện tại)
    id_nguoi_nhan: 104, // User D nhận
    noi_dung: 'San cho User D',
    trang_thai: 'hoan_thanh'
  }
];

// Mock user (User B - ID 102)
const mockUser = {
  id_nguoi_dung: 102,
  la_admin: 0
};

// Logic lọc giao dịch (copy từ HomePage)
function filterTransactionsForUser(transactions, user) {
  if (user.la_admin === 1 || user.la_admin === true) {
    return transactions; // Admin thấy tất cả
  }
  
  console.log('🔍 === FILTERING TRANSACTIONS FOR USER ===');
  console.log('🔍 User ID:', user.id_nguoi_dung);
  console.log('🔍 User ID type:', typeof user.id_nguoi_dung);
  console.log('🔍 Total transactions before filtering:', transactions.length);
  
  // Log từng giao dịch để debug
  transactions.forEach((transaction, index) => {
    const userIsSender = transaction.id_nguoi_gui === user.id_nguoi_dung;
    const userIsReceiver = transaction.id_nguoi_nhan === user.id_nguoi_dung;
    
    // Kiểm tra từng điều kiện riêng biệt
    const condition1 = transaction.id_loai_giao_dich === 1 && userIsSender;
    const condition2 = transaction.id_loai_giao_dich === 2 && userIsReceiver;
    const condition3 = transaction.id_loai_giao_dich === 4 && userIsSender;
    const condition4 = transaction.id_loai_giao_dich === 5 && userIsReceiver;
    
    const shouldShow = condition1 || condition2 || condition3 || condition4;
    
    console.log(`🔍 Transaction ${index + 1}:`, {
      id: transaction.id_giao_dich,
      type: transaction.id_loai_giao_dich,
      typeName: getTransactionTypeName(transaction.id_loai_giao_dich),
      sender: transaction.id_nguoi_gui,
      receiver: transaction.id_nguoi_nhan,
      userIsSender: userIsSender,
      userIsReceiver: userIsReceiver,
      condition1: condition1,
      condition2: condition2,
      condition3: condition3,
      condition4: condition4,
      shouldShow: shouldShow,
      userID: user.id_nguoi_dung,
      senderID: transaction.id_nguoi_gui,
      receiverID: transaction.id_nguoi_nhan
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

// Test cases
console.log('=== Debug Logic Lọc Giao Dịch ===\n');

console.log('1. Mock User:', mockUser);
console.log('2. Tổng số giao dịch:', mockTransactions.length);
console.log('3. Danh sách giao dịch gốc:');
mockTransactions.forEach(t => {
  console.log(`   - ID: ${t.id_giao_dich}, Loại: ${t.id_loai_giao_dich} (${getTransactionTypeName(t.id_loai_giao_dich)}), Gửi: ${t.id_nguoi_gui}, Nhận: ${t.id_nguoi_nhan}, Nội dung: ${t.noi_dung}`);
});

console.log('\n4. Lọc giao dịch cho User B (ID: 102):');
const filteredTransactions = filterTransactionsForUser(mockTransactions, mockUser);

console.log('\n5. Kiểm tra logic chi tiết:');
console.log(`   - Nhận lịch (ID=1): User B là người nhận → ${filteredTransactions.some(t => t.id_giao_dich === 1) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - Giao lịch (ID=2): User B là người gửi → ${filteredTransactions.some(t => t.id_giao_dich === 2) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - San cho (ID=3): User B là người gửi → ${filteredTransactions.some(t => t.id_giao_dich === 3) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);

console.log('\n6. Tóm tắt kết quả:');
console.log(`   - Giao dịch hiển thị: ${filteredTransactions.length}`);
console.log(`   - Giao dịch bị ẩn: ${mockTransactions.length - filteredTransactions.length}`);
console.log(`   - Tỷ lệ lọc: ${((mockTransactions.length - filteredTransactions.length) / mockTransactions.length * 100).toFixed(1)}%`);

console.log('\n=== Debug hoàn thành ===');
