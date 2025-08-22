// Test logic lọc giao dịch cho user thường
// File này để test logic lọc giao dịch trong HomePage

// Mock data: danh sách giao dịch từ API
const mockTransactions = [
  {
    id_giao_dich: 1,
    id_loai_giao_dich: 1, // Giao lịch
    id_nguoi_gui: 101, // User A
    id_nguoi_nhan: 102, // User B
    noi_dung: 'Giao lịch xe cho User B',
    trang_thai: 'cho_xac_nhan'
  },
  {
    id_giao_dich: 2,
    id_loai_giao_dich: 2, // Nhận lịch
    id_nguoi_gui: 102, // User B
    id_nguoi_nhan: 101, // User A
    noi_dung: 'Nhận lịch xe từ User A',
    trang_thai: 'cho_xac_nhan'
  },
  {
    id_giao_dich: 3,
    id_loai_giao_dich: 4, // San cho
    id_nguoi_gui: 101, // User A
    id_nguoi_nhan: 103, // User C
    noi_dung: 'San cho User C',
    trang_thai: 'hoan_thanh'
  },
  {
    id_giao_dich: 4,
    id_loai_giao_dich: 5, // Nhận san
    id_nguoi_gui: 103, // User C
    id_nguoi_nhan: 101, // User A
    noi_dung: 'Nhận san từ User C',
    trang_thai: 'hoan_thanh'
  },
  {
    id_giao_dich: 5,
    id_loai_giao_dich: 1, // Giao lịch
    id_nguoi_gui: 104, // User D
    id_nguoi_nhan: 105, // User E
    noi_dung: 'Giao lịch xe cho User E',
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
  
  // User thường: chỉ thấy giao dịch liên quan
  return transactions.filter(transaction => {
    return (
      (transaction.id_loai_giao_dich === 1 && transaction.id_nguoi_gui === user.id_nguoi_dung) || // Giao lịch - user là người giao
      (transaction.id_loai_giao_dich === 2 && transaction.id_nguoi_nhan === user.id_nguoi_dung) || // Nhận lịch - user là người nhận
      (transaction.id_loai_giao_dich === 4 && transaction.id_nguoi_gui === user.id_nguoi_dung) || // San cho - user là người san
      (transaction.id_loai_giao_dich === 5 && transaction.id_nguoi_nhan === user.id_nguoi_dung)    // Nhận san - user là người nhận
    )
  });
}

// Test cases
console.log('=== Test Logic Lọc Giao Dịch ===\n');

console.log('1. Mock User:', mockUser);
console.log('2. Tổng số giao dịch:', mockTransactions.length);
console.log('3. Danh sách giao dịch gốc:');
mockTransactions.forEach(t => {
  console.log(`   - ID: ${t.id_giao_dich}, Loại: ${t.id_loai_giao_dich}, Gửi: ${t.id_nguoi_gui}, Nhận: ${t.id_nguoi_nhan}, Nội dung: ${t.noi_dung}`);
});

console.log('\n4. Lọc giao dịch cho User A (ID: 101):');
const filteredTransactions = filterTransactionsForUser(mockTransactions, mockUser);
console.log(`   Kết quả: ${filteredTransactions.length} giao dịch`);

filteredTransactions.forEach(t => {
  let role = '';
  if (t.id_loai_giao_dich === 1 && t.id_nguoi_gui === mockUser.id_nguoi_dung) role = 'Người giao lịch';
  else if (t.id_loai_giao_dich === 2 && t.id_nguoi_nhan === mockUser.id_nguoi_dung) role = 'Người nhận lịch';
  else if (t.id_loai_giao_dich === 4 && t.id_nguoi_gui === mockUser.id_nguoi_dung) role = 'Người san cho';
  else if (t.id_loai_giao_dich === 5 && t.id_nguoi_nhan === mockUser.id_nguoi_dung) role = 'Người nhận san';
  
  console.log(`   - ID: ${t.id_giao_dich}, Loại: ${t.id_loai_giao_dich}, Vai trò: ${role}, Nội dung: ${t.noi_dung}`);
});

console.log('\n5. Kiểm tra logic:');
console.log(`   - Giao lịch (ID=1): User A là người gửi → ${filteredTransactions.some(t => t.id_giao_dich === 1) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - Nhận lịch (ID=2): User A là người nhận → ${filteredTransactions.some(t => t.id_giao_dich === 2) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - San cho (ID=3): User A là người gửi → ${filteredTransactions.some(t => t.id_giao_dich === 3) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - Nhận san (ID=4): User A là người nhận → ${filteredTransactions.some(t => t.id_giao_dich === 4) ? '✅ Hiển thị' : '❌ Không hiển thị'}`);
console.log(`   - Giao lịch khác (ID=5): User A không liên quan → ${filteredTransactions.some(t => t.id_giao_dich === 5) ? '❌ Hiển thị (sai)' : '✅ Không hiển thị (đúng)'}`);

console.log('\n=== Test hoàn thành ===');
