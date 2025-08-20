# API Quản Lý Điểm - Hướng dẫn sử dụng

## 🔐 Xác thực

Tất cả API (trừ đăng nhập) đều yêu cầu xác thực JWT. Gửi token trong header:

```
Authorization: Bearer <your_jwt_token>
```

## 👥 API Users

### 1. Đăng nhập
```
POST /api/users/login
```

**Body:**
```json
{
  "ten_dang_nhap": "admin",
  "mat_khau": "Admin@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "id_nguoi_dung": 1,
      "ten_dang_nhap": "admin",
      "email": "admin@company.com",
      "ho_ten": "Trần Quản Trị",
      "la_admin": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Lấy thông tin cá nhân
```
GET /api/users/profile
```

### 3. Cập nhật thông tin cá nhân
```
PUT /api/users/profile
```

**Body:**
```json
{
  "ho_ten": "Tên mới",
  "so_dien_thoai": "0123456789",
  "dia_chi": "Địa chỉ mới"
}
```

### 4. Đổi mật khẩu
```
PUT /api/users/profile/password
```

**Body:**
```json
{
  "mat_khau_cu": "User@123",
  "mat_khau_moi": "NewPassword@123"
}
```

### 5. Lấy danh sách nhóm của người dùng
```
GET /api/users/:id/groups
```

### 6. Lấy lịch sử giao dịch của người dùng
```
GET /api/users/:id/transactions
```

### 7. Lấy lịch xe của người dùng
```
GET /api/users/:id/schedules
```

### 8. Lấy tất cả người dùng (Admin only)
```
GET /api/users
```

### 9. Tạo người dùng mới (Admin only)
```
POST /api/users
```

**Body:**
```json
{
  "ten_dang_nhap": "user123",
  "mat_khau": "Password@123",
  "email": "user@example.com",
  "ho_ten": "Tên người dùng",
  "so_dien_thoai": "0123456789",
  "dia_chi": "Địa chỉ"
}
```

## 👥 API Groups

### 1. Lấy tất cả nhóm
```
GET /api/groups
```

### 2. Lấy thông tin nhóm
```
GET /api/groups/:id
```

### 3. Lấy danh sách thành viên trong nhóm
```
GET /api/groups/:id/members
```

### 4. Lấy số lượng thành viên trong nhóm
```
GET /api/groups/:id/member-count
```

### 5. Lấy giao dịch trong nhóm
```
GET /api/groups/:id/transactions
```

### 6. Lấy lịch xe trong nhóm
```
GET /api/groups/:id/schedules
```

### 7. Tạo nhóm mới (Admin only)
```
POST /api/groups
```

**Body:**
```json
{
  "ten_nhom": "Tên nhóm mới",
  "mo_ta": "Mô tả nhóm"
}
```

### 8. Cập nhật nhóm (Admin only)
```
PUT /api/groups/:id
```

### 9. Xóa nhóm (Admin only)
```
DELETE /api/groups/:id
```

### 10. Thêm thành viên vào nhóm (Admin only)
```
POST /api/groups/add-member
```

**Body:**
```json
{
  "groupId": 1,
  "userId": 2
}
```

### 11. Xóa thành viên khỏi nhóm (Admin only)
```
POST /api/groups/remove-member
```

## 💰 API Transactions

### 1. Tạo giao dịch mới
```
POST /api/transactions
```

**Body:**
```json
{
  "id_loai_giao_dich": 1,
  "id_nguoi_nhan": 3,
  "id_nhom": 1,
  "id_lich_xe": 1,
  "so_tien": 500000,
  "diem": 50,
  "noi_dung": "Giao lịch xe sân bay 8h sáng"
}
```

**Loại giao dịch:**
- `1`: Giao lịch (cần xác nhận)
- `2`: Nhận lịch (cần xác nhận)
- `3`: Hủy lịch
- `4`: San cho (không cần xác nhận)
- `5`: Nhận san (không cần xác nhận)

### 2. Xác nhận giao dịch
```
PUT /api/transactions/:id/confirm
```

### 3. Hủy giao dịch
```
PUT /api/transactions/:id/cancel
```

### 4. Lấy giao dịch theo ID
```
GET /api/transactions/:id
```

### 5. Lấy giao dịch theo trạng thái
```
GET /api/transactions/status/:status
```

**Trạng thái:**
- `cho_xac_nhan`: Chờ xác nhận
- `hoan_thanh`: Hoàn thành
- `da_huy`: Đã hủy

### 6. Lấy giao dịch theo loại
```
GET /api/transactions/type/:typeId
```

### 7. Lấy giao dịch theo ngày
```
GET /api/transactions/date/:date
```

**Format ngày:** `YYYY-MM-DD`

### 8. Lấy tất cả giao dịch (Admin only)
```
GET /api/transactions
```

### 9. Xóa giao dịch (Admin only)
```
DELETE /api/transactions/:id
```

## 🚗 API Vehicle Schedules

### 1. Lấy tất cả lịch xe
```
GET /api/schedules
```

### 2. Lấy lịch xe theo ID
```
GET /api/schedules/:id
```

### 3. Tạo lịch xe mới
```
POST /api/schedules
```

**Body:**
```json
{
  "id_loai_xe": 2,
  "id_loai_tuyen": 1,
  "thoi_gian_bat_dau_don": "08:00:00",
  "thoi_gian_ket_thuc_don": "08:30:00",
  "thoi_gian_bat_dau_tra": "16:00:00",
  "thoi_gian_ket_thuc_tra": "16:30:00",
  "id_nhom": 1
}
```

**Loại xe:**
- `1`: 4 chỗ
- `2`: 5 chỗ
- `3`: 7 chỗ
- `4`: 16 chỗ
- `5`: 29 chỗ
- `6`: 45 chỗ

**Loại tuyến:**
- `1`: Đón Sân bay - Hà Nội
- `2`: Tiễn Hà Nội - Sân bay
- `3`: Đi tỉnh 1 chiều
- `4`: Đi tỉnh 2 chiều
- `5`: Đi huyện 1 chiều
- `6`: Đi huyện 2 chiều

### 4. Cập nhật lịch xe
```
PUT /api/schedules/:id
```

### 5. Cập nhật trạng thái lịch xe
```
PUT /api/schedules/:id/status
```

**Body:**
```json
{
  "trang_thai": "da_xac_nhan"
}
```

**Trạng thái:**
- `cho_xac_nhan`: Chờ xác nhận
- `da_xac_nhan`: Đã xác nhận
- `hoan_thanh`: Hoàn thành
- `da_huy`: Đã hủy

### 6. Xóa lịch xe
```
DELETE /api/schedules/:id
```

### 7. Lấy lịch xe theo nhóm
```
GET /api/schedules/group/:groupId
```

### 8. Lấy lịch xe theo người tạo
```
GET /api/schedules/creator/:userId
```

### 9. Lấy lịch xe theo trạng thái
```
GET /api/schedules/status/:status
```

### 10. Lấy lịch xe theo ngày
```
GET /api/schedules/date/:date
```

## 🔑 Phân quyền

### Admin (la_admin = true)
- Truy cập tất cả API
- Quản lý người dùng, nhóm
- Xem tất cả giao dịch
- Xóa giao dịch

### Member (la_admin = false)
- Chỉ xem thông tin cá nhân
- Chỉ xem nhóm mình thuộc về
- Tạo giao dịch trong nhóm
- Quản lý lịch xe của mình

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Thông báo thành công",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Mô tả lỗi"
}
```

## 🚀 Khởi chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy server:
```bash
npm start
```

3. Server sẽ chạy tại: `http://localhost:5000`

## 📝 Ghi chú

- Tất cả thời gian sử dụng format `HH:MM:SS`
- Tất cả ngày sử dụng format `YYYY-MM-DD`
- Mật khẩu được hash bằng bcrypt
- JWT token có thời hạn 24 giờ
- Sử dụng connection pool để tối ưu database
