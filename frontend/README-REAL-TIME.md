# Hệ thống Real-time Updates

## Tổng quan
Hệ thống này cho phép cập nhật giao diện ngay lập tức khi có thay đổi dữ liệu mà không cần reload trang.

## Cách hoạt động

### 1. Global State Context
- `GlobalStateContext` quản lý state toàn cục cho toàn bộ ứng dụng
- Các component có thể subscribe để nhận updates
- State được cập nhật real-time khi có thay đổi

### 2. Real-time Service
- Sử dụng polling để kiểm tra thay đổi dữ liệu mỗi 5 giây
- Tự động cập nhật state khi phát hiện thay đổi
- Hỗ trợ nhiều loại dữ liệu: transactions, groups, users, schedules, notifications

### 3. Tự động cập nhật
- Khi user tạo giao dịch mới → hiển thị ngay lập tức
- Khi xác nhận/hủy giao dịch → cập nhật trạng thái ngay lập tức
- Khi có thông báo mới → hiển thị ngay lập tức
- Khi thay đổi thông tin user → cập nhật ngay lập tức

## Các tính năng

### ✅ Đã hoàn thành
- [x] Cập nhật giao dịch real-time
- [x] Cập nhật thông báo real-time
- [x] Cập nhật lịch xe real-time
- [x] Cập nhật thông tin nhóm real-time
- [x] Cập nhật thông tin user real-time
- [x] Tự động cập nhật khi tạo/sửa/xóa dữ liệu

### 🔄 Cách sử dụng

#### Trong Component
```jsx
import { useGlobalState } from '../../contexts/GlobalStateContext'

const MyComponent = () => {
  const { transactions, addTransaction, updateTransaction } = useGlobalState()
  
  // Sử dụng dữ liệu từ global state
  // Dữ liệu sẽ tự động cập nhật khi có thay đổi
  
  return (
    <div>
      {transactions.map(transaction => (
        <div key={transaction.id}>{transaction.noi_dung}</div>
      ))}
    </div>
  )
}
```

#### Cập nhật dữ liệu
```jsx
// Thêm giao dịch mới
addTransaction(newTransaction)

// Cập nhật giao dịch
updateTransaction(transactionId, { trang_thai: 'hoan_thanh' })

// Xóa giao dịch
removeTransaction(transactionId)
```

## Cấu trúc file

```
src/
├── contexts/
│   └── GlobalStateContext.jsx     # Quản lý state toàn cục
├── services/
│   └── realTimeService.js         # Service real-time updates
└── components/
    └── Layout/
        └── Layout.jsx             # Khởi tạo real-time updates
```

## Lưu ý

1. **Polling Interval**: Mặc định 5 giây, có thể điều chỉnh trong `realTimeService.js`
2. **Cleanup**: Tự động cleanup khi component unmount
3. **Performance**: Chỉ cập nhật khi thực sự có thay đổi
4. **Error Handling**: Tự động xử lý lỗi và retry

## Troubleshooting

### Vấn đề thường gặp
1. **Dữ liệu không cập nhật**: Kiểm tra console log để xem real-time service có hoạt động không
2. **Performance chậm**: Giảm polling interval hoặc tối ưu hóa API calls
3. **Memory leak**: Đảm bảo cleanup function được gọi khi component unmount

### Debug
```jsx
// Thêm log để debug
console.log('🚀 Real-time updates initialized')
console.log('📊 Current transactions:', transactions)
console.log('🔔 Current notifications:', notifications)
```
