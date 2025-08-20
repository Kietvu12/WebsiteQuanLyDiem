# Backend Quản Lý Điểm - Models

## Cấu trúc thư mục

```
backend/
├── config/
│   └── database.js          # Cấu hình kết nối database
├── models/                  # Các model chính
│   ├── User.js             # Quản lý người dùng
│   ├── Group.js            # Quản lý nhóm
│   ├── VehicleSchedule.js  # Quản lý lịch xe
│   ├── Transaction.js      # Quản lý giao dịch
│   ├── Notification.js     # Quản lý thông báo
│   ├── Report.js           # Quản lý báo cáo
│   └── index.js            # Export tất cả model
├── routes/                  # API routes (sẽ tạo sau)
├── controllers/             # Controllers (sẽ tạo sau)
├── middleware/              # Middleware (sẽ tạo sau)
├── test-models.js          # File test các model
├── index.js                # Server chính
└── README.md               # Hướng dẫn này
```

## Các Model đã triển khai

### 1. User Model (`models/User.js`)
Quản lý người dùng với các chức năng:
- `getAll()` - Lấy tất cả người dùng
- `getById(id)` - Lấy người dùng theo ID
- `getByUsername(username)` - Lấy người dùng theo tên đăng nhập
- `getByEmail(email)` - Lấy người dùng theo email
- `create(userData)` - Tạo người dùng mới
- `update(id, userData)` - Cập nhật thông tin người dùng
- `updatePassword(id, newPasswordHash)` - Cập nhật mật khẩu
- `updateBalanceAndPoints(id, so_du, diem)` - Cập nhật số dư và điểm
- `delete(id)` - Xóa người dùng
- `getGroups(id)` - Lấy danh sách nhóm của người dùng

### 2. Group Model (`models/Group.js`)
Quản lý nhóm với các chức năng:
- `getAll()` - Lấy tất cả nhóm
- `getById(id)` - Lấy nhóm theo ID
- `create(groupData)` - Tạo nhóm mới
- `update(id, groupData)` - Cập nhật thông tin nhóm
- `delete(id)` - Xóa nhóm
- `getMembers(id)` - Lấy danh sách thành viên trong nhóm
- `addMember(groupId, userId)` - Thêm thành viên vào nhóm
- `removeMember(groupId, userId)` - Xóa thành viên khỏi nhóm
- `isMember(groupId, userId)` - Kiểm tra người dùng có trong nhóm không
- `getMemberCount(id)` - Lấy số lượng thành viên trong nhóm

### 3. VehicleSchedule Model (`models/VehicleSchedule.js`)
Quản lý lịch xe với các chức năng:
- `getAll()` - Lấy tất cả lịch xe
- `getById(id)` - Lấy lịch xe theo ID
- `getByGroup(groupId)` - Lấy lịch xe theo nhóm
- `getByCreator(userId)` - Lấy lịch xe theo người tạo
- `getByStatus(status)` - Lấy lịch xe theo trạng thái
- `create(scheduleData)` - Tạo lịch xe mới
- `update(id, scheduleData)` - Cập nhật lịch xe
- `updateStatus(id, status)` - Cập nhật trạng thái lịch xe
- `delete(id)` - Xóa lịch xe
- `getByDate(date)` - Lấy lịch xe theo ngày

### 4. Transaction Model (`models/Transaction.js`)
Quản lý giao dịch với các chức năng:
- `getAll()` - Lấy tất cả giao dịch
- `getById(id)` - Lấy giao dịch theo ID
- `getByGroup(groupId)` - Lấy giao dịch theo nhóm
- `getBySender(userId)` - Lấy giao dịch theo người gửi
- `getByReceiver(userId)` - Lấy giao dịch theo người nhận
- `getByStatus(status)` - Lấy giao dịch theo trạng thái
- `create(transactionData)` - Tạo giao dịch mới
- `updateStatus(id, status)` - Cập nhật trạng thái giao dịch
- `delete(id)` - Xóa giao dịch
- `getByType(typeId)` - Lấy giao dịch theo loại
- `getByDate(date)` - Lấy giao dịch theo ngày

### 5. Notification Model (`models/Notification.js`)
Quản lý thông báo với các chức năng:
- `getAll()` - Lấy tất cả thông báo
- `getById(id)` - Lấy thông báo theo ID
- `getByUser(userId)` - Lấy thông báo theo người dùng
- `getUnreadByUser(userId)` - Lấy thông báo chưa đọc
- `create(notificationData)` - Tạo thông báo mới
- `markAsRead(id)` - Đánh dấu thông báo đã đọc
- `markAllAsRead(userId)` - Đánh dấu tất cả thông báo đã đọc
- `delete(id)` - Xóa thông báo
- `deleteAllByUser(userId)` - Xóa tất cả thông báo của người dùng
- `getUnreadCount(userId)` - Lấy số lượng thông báo chưa đọc
- `getByTransaction(transactionId)` - Lấy thông báo theo giao dịch
- `getByDate(date)` - Lấy thông báo theo ngày

### 6. Report Model (`models/Report.js`)
Quản lý báo cáo với các chức năng:
- `getAll()` - Lấy tất cả báo cáo
- `getById(id)` - Lấy báo cáo theo ID
- `getByGroup(groupId)` - Lấy báo cáo theo nhóm
- `create(reportData)` - Tạo báo cáo mới
- `update(id, reportData)` - Cập nhật báo cáo
- `delete(id)` - Xóa báo cáo
- `getByDate(date)` - Lấy báo cáo theo ngày
- `getByDateRange(startDate, endDate)` - Lấy báo cáo theo khoảng thời gian
- `getByMonth(year, month)` - Lấy báo cáo theo tháng
- `getByYear(year)` - Lấy báo cáo theo năm
- `getCountByGroup(groupId)` - Lấy số lượng báo cáo theo nhóm
- `getLatestByGroup(groupId)` - Lấy báo cáo mới nhất theo nhóm

## Cách sử dụng

### 1. Import model
```javascript
const { User, Group, VehicleSchedule } = require('./models');
```

### 2. Sử dụng các method
```javascript
// Lấy tất cả người dùng
const users = await User.getAll();

// Tạo người dùng mới
const newUserId = await User.create({
  ten_dang_nhap: 'user123',
  mat_khau_hash: 'hashedPassword',
  email: 'user@example.com',
  ho_ten: 'Nguyễn Văn A',
  so_dien_thoai: '0123456789'
});

// Lấy thông tin người dùng
const user = await User.getById(newUserId);
```

## Test Models

Để test các model, chạy lệnh:

```bash
cd backend
node test-models.js
```

## Cấu hình Database

Cập nhật thông tin kết nối database trong `config/database.js`:

```javascript
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'quan_ly_diem',
  // ... các cấu hình khác
};
```

## Lưu ý

- Tất cả các method đều là async/await
- Sử dụng prepared statements để tránh SQL injection
- Có xử lý lỗi chi tiết với try-catch
- Các model sử dụng connection pool để tối ưu hiệu suất
- Dữ liệu trả về đã được join với các bảng liên quan để có thông tin đầy đủ

## Tiếp theo

Các bước tiếp theo sẽ là:
1. Tạo Controllers để xử lý business logic
2. Tạo Routes để định nghĩa API endpoints
3. Tạo Middleware để xác thực và phân quyền
4. Tích hợp với frontend
