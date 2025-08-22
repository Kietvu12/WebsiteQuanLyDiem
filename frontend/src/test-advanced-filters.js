// Test logic lọc nâng cao cho HomePage
// File này để test các bộ lọc mới: search, group, status, date range, user

// Mock data: danh sách giao dịch từ API
const mockTransactions = [
  {
    id_giao_dich: 1,
    id_loai_giao_dich: 1, // Giao lịch
    id_nguoi_gui: 101,
    id_nguoi_nhan: 102,
    ten_nguoi_gui: 'Nguyễn Văn A',
    ten_nguoi_nhan: 'Trần Thị B',
    ten_nhom: 'Nhóm A',
    trang_thai: 'cho_xac_nhan',
    ngay_tao: '2024-01-15T10:00:00Z',
    noi_dung: 'Giao lịch xe cho Trần Thị B'
  },
  {
    id_giao_dich: 2,
    id_loai_giao_dich: 2, // Nhận lịch
    id_nguoi_gui: 102,
    id_nguoi_nhan: 101,
    ten_nguoi_gui: 'Trần Thị B',
    ten_nguoi_nhan: 'Nguyễn Văn A',
    ten_nhom: 'Nhóm A',
    trang_thai: 'hoan_thanh',
    ngay_tao: '2024-01-16T14:30:00Z',
    noi_dung: 'Nhận lịch xe từ Nguyễn Văn A'
  },
  {
    id_giao_dich: 3,
    id_loai_giao_dich: 4, // San cho
    id_nguoi_gui: 103,
    id_nguoi_nhan: 104,
    ten_nguoi_gui: 'Lê Văn C',
    ten_nguoi_nhan: 'Phạm Thị D',
    ten_nhom: 'Nhóm B',
    trang_thai: 'cho_xac_nhan',
    ngay_tao: '2024-01-17T09:15:00Z',
    noi_dung: 'San cho Phạm Thị D'
  },
  {
    id_giao_dich: 4,
    id_loai_giao_dich: 5, // Nhận san
    id_nguoi_gui: 104,
    id_nguoi_nhan: 103,
    ten_nguoi_gui: 'Phạm Thị D',
    ten_nguoi_nhan: 'Lê Văn C',
    ten_nhom: 'Nhóm B',
    trang_thai: 'hoan_thanh',
    ngay_tao: '2024-01-18T16:45:00Z',
    noi_dung: 'Nhận san từ Lê Văn C'
  },
  {
    id_giao_dich: 5,
    id_loai_giao_dich: 1, // Giao lịch
    id_nguoi_gui: 105,
    id_nguoi_nhan: 106,
    ten_nguoi_gui: 'Hoàng Văn E',
    ten_nguoi_nhan: 'Vũ Thị F',
    ten_nhom: 'Nhóm C',
    trang_thai: 'da_huy',
    ngay_tao: '2024-01-19T11:20:00Z',
    noi_dung: 'Giao lịch xe cho Vũ Thị F'
  }
];

// Mock filters
const mockFilters = {
  searchText: '',
  selectedGroup: '',
  selectedStatus: '',
  dateRange: null,
  selectedUser: ''
};

// Logic lọc giao dịch (copy từ HomePage)
function filterTransactions(transactions, filters) {
  let filtered = transactions;

  // Filter by search text (tên người gửi/nhận)
  if (filters.searchText) {
    filtered = filtered.filter(transaction => 
      (transaction.ten_nguoi_gui && transaction.ten_nguoi_gui.toLowerCase().includes(filters.searchText.toLowerCase())) ||
      (transaction.ten_nguoi_nhan && transaction.ten_nguoi_nhan.toLowerCase().includes(filters.searchText.toLowerCase()))
    );
  }

  // Filter by group
  if (filters.selectedGroup) {
    filtered = filtered.filter(transaction => 
      transaction.ten_nhom === filters.selectedGroup
    );
  }

  // Filter by status
  if (filters.selectedStatus) {
    filtered = filtered.filter(transaction => 
      transaction.trang_thai === filters.selectedStatus
    );
  }

  // Filter by date range
  if (filters.dateRange && filters.dateRange.length === 2) {
    const startDate = new Date(filters.dateRange[0]);
    const endDate = new Date(filters.dateRange[1]);
    endDate.setHours(23, 59, 59, 999); // End of day
    
    filtered = filtered.filter(transaction => {
      const transactionDate = new Date(transaction.ngay_tao);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }

  // Filter by specific user
  if (filters.selectedUser) {
    filtered = filtered.filter(transaction => 
      transaction.ten_nguoi_gui === filters.selectedUser ||
      transaction.ten_nguoi_nhan === filters.selectedUser
    );
  }

  return filtered;
}

// Get unique values for filter options
function getUniqueGroups(transactions) {
  const groups = [...new Set(transactions.map(t => t.ten_nhom).filter(Boolean))];
  return groups.sort();
}

function getUniqueUsers(transactions) {
  const users = new Set();
  transactions.forEach(t => {
    if (t.ten_nguoi_gui) users.add(t.ten_nguoi_gui);
    if (t.ten_nguoi_nhan) users.add(t.ten_nguoi_nhan);
  });
  return Array.from(users).sort();
}

// Test cases
console.log('=== Test Logic Lọc Nâng Cao ===\n');

console.log('1. Tổng số giao dịch:', mockTransactions.length);
console.log('2. Danh sách giao dịch gốc:');
mockTransactions.forEach(t => {
  console.log(`   - ID: ${t.id_giao_dich}, Loại: ${t.id_loai_giao_dich}, Gửi: ${t.ten_nguoi_gui}, Nhận: ${t.ten_nguoi_nhan}, Nhóm: ${t.ten_nhom}, Trạng thái: ${t.trang_thai}, Ngày: ${t.ngay_tao.split('T')[0]}`);
});

console.log('\n3. Các nhóm có sẵn:', getUniqueGroups(mockTransactions));
console.log('4. Các người dùng có sẵn:', getUniqueUsers(mockTransactions));

// Test 1: Lọc theo search text
console.log('\n=== Test 1: Lọc theo search text ===');
const testFilters1 = { ...mockFilters, searchText: 'Nguyễn' };
const result1 = filterTransactions(mockTransactions, testFilters1);
console.log(`Search "Nguyễn": ${result1.length} giao dịch`);
result1.forEach(t => console.log(`   - ${t.ten_nguoi_gui} → ${t.ten_nguoi_nhan}`));

// Test 2: Lọc theo nhóm
console.log('\n=== Test 2: Lọc theo nhóm ===');
const testFilters2 = { ...mockFilters, selectedGroup: 'Nhóm A' };
const result2 = filterTransactions(mockTransactions, testFilters2);
console.log(`Nhóm "Nhóm A": ${result2.length} giao dịch`);
result2.forEach(t => console.log(`   - ${t.ten_nhom}: ${t.ten_nguoi_gui} → ${t.ten_nguoi_nhan}`));

// Test 3: Lọc theo trạng thái
console.log('\n=== Test 3: Lọc theo trạng thái ===');
const testFilters3 = { ...mockFilters, selectedStatus: 'cho_xac_nhan' };
const result3 = filterTransactions(mockTransactions, testFilters3);
console.log(`Trạng thái "cho_xac_nhan": ${result3.length} giao dịch`);
result3.forEach(t => console.log(`   - ${t.trang_thai}: ${t.ten_nguoi_gui} → ${t.ten_nguoi_nhan}`));

// Test 4: Lọc theo khoảng thời gian
console.log('\n=== Test 4: Lọc theo khoảng thời gian ===');
const testFilters4 = { ...mockFilters, dateRange: ['2024-01-16', '2024-01-17'] };
const result4 = filterTransactions(mockTransactions, testFilters4);
console.log(`Khoảng thời gian 16-17/01: ${result4.length} giao dịch`);
result4.forEach(t => console.log(`   - ${t.ngay_tao.split('T')[0]}: ${t.ten_nguoi_gui} → ${t.ten_nguoi_nhan}`));

// Test 5: Lọc theo người dùng cụ thể
console.log('\n=== Test 5: Lọc theo người dùng cụ thể ===');
const testFilters5 = { ...mockFilters, selectedUser: 'Trần Thị B' };
const result5 = filterTransactions(mockTransactions, testFilters5);
console.log(`Người dùng "Trần Thị B": ${result5.length} giao dịch`);
result5.forEach(t => console.log(`   - ${t.ten_nguoi_gui} → ${t.ten_nguoi_nhan}`));

// Test 6: Kết hợp nhiều bộ lọc
console.log('\n=== Test 6: Kết hợp nhiều bộ lọc ===');
const testFilters6 = { 
  ...mockFilters, 
  selectedGroup: 'Nhóm A',
  selectedStatus: 'hoan_thanh'
};
const result6 = filterTransactions(mockTransactions, testFilters6);
console.log(`Nhóm "Nhóm A" + Trạng thái "hoan_thanh": ${result6.length} giao dịch`);
result6.forEach(t => console.log(`   - ${t.ten_nhom} | ${t.trang_thai}: ${t.ten_nguoi_gui} → ${t.ten_nguoi_nhan}`));

// Test 7: Lọc với search text và nhóm
console.log('\n=== Test 7: Lọc với search text và nhóm ===');
const testFilters7 = { 
  ...mockFilters, 
  searchText: 'Lê',
  selectedGroup: 'Nhóm B'
};
const result7 = filterTransactions(mockTransactions, testFilters7);
console.log(`Search "Lê" + Nhóm "Nhóm B": ${result7.length} giao dịch`);
result7.forEach(t => console.log(`   - ${t.ten_nhom} | ${t.ten_nguoi_gui} → ${t.ten_nguoi_nhan}`));

console.log('\n=== Test hoàn thành ===');
