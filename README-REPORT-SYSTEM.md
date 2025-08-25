# Hệ Thống Báo Cáo - Quản Lý Điểm

## Tổng Quan

Hệ thống báo cáo cho phép xuất dữ liệu giao dịch và lịch xe dưới dạng file CSV (có thể mở bằng Excel) cho người dùng và nhóm. Các báo cáo được lưu trữ có tổ chức trong thư mục `reports` và được quản lý thông qua database.

## Tính Năng Chính

### 1. Xuất Báo Cáo Người Dùng
- **Báo cáo giao dịch**: Xuất tất cả giao dịch của người dùng trong khoảng thời gian
- **Báo cáo lịch xe**: Xuất tất cả lịch xe của người dùng trong khoảng thời gian
- **Tự động tạo thư mục**: Mỗi người dùng mới sẽ có thư mục riêng trong `reports/Báo cáo người dùng [Tên]`

### 2. Xuất Báo Cáo Nhóm
- **Báo cáo tổng hợp**: Xuất cả giao dịch và lịch xe của nhóm trong khoảng thời gian
- **Tự động tạo thư mục**: Mỗi nhóm mới sẽ có thư mục riêng trong `reports/Báo cáo nhóm [Tên]`

### 3. Quản Lý Báo Cáo
- **Xem danh sách**: Hiển thị tất cả báo cáo đã tạo
- **Tải về**: Tải file CSV về máy
- **Xóa**: Xóa báo cáo không cần thiết
- **Xem chi tiết**: Thông tin chi tiết về báo cáo

## Cấu Trúc Thư Mục

```
backend/reports/
├── Báo cáo người dùng [Tên]/
│   ├── Báo cáo người dùng [Tên] từ [ngày] đến [ngày].csv
│   └── Báo cáo lịch xe người dùng [Tên] từ [ngày] đến [ngày].csv
└── Báo cáo nhóm [Tên]/
    └── Báo cáo nhóm [Tên] từ [ngày] đến [ngày].csv
```

## Cách Sử Dụng

### Xuất Báo Cáo Người Dùng

1. Vào trang **Quản lý Người dùng**
2. Click vào nút **Xuất báo cáo** (biểu tượng file) của người dùng cần xuất báo cáo
3. Chọn loại báo cáo:
   - **Báo cáo giao dịch**: Xuất lịch sử giao dịch
   - **Báo cáo lịch xe**: Xuất lịch sử lịch xe
4. Chọn khoảng thời gian (mặc định 30 ngày gần nhất)
5. Click **Xuất báo cáo**

### Xuất Báo Cáo Nhóm

1. Vào trang **Quản lý Nhóm**
2. Click vào nút **Xuất báo cáo** (biểu tượng file) của nhóm cần xuất báo cáo
3. Chọn khoảng thời gian (mặc định 30 ngày gần nhất)
4. Click **Xuất báo cáo**

### Xem và Quản Lý Báo Cáo

1. Vào trang **Báo cáo**
2. Xem danh sách các báo cáo gần đây
3. Sử dụng context menu (click chuột phải) để:
   - **Tải về**: Tải file CSV
   - **Xóa**: Xóa báo cáo
   - **Xem thông tin chi tiết**: Thông tin về báo cáo

## Định Dạng File CSV

### Báo Cáo Giao Dịch
- ID Giao dịch
- Ngày tạo
- Loại giao dịch
- Vai trò (Gửi/Nhận)
- Nội dung
- Số tiền (VNĐ)
- Điểm
- Trạng thái
- Nhóm

### Báo Cáo Lịch Xe
- ID Lịch xe
- Thời gian bắt đầu đón
- Thời gian kết thúc đón
- Thời gian bắt đầu trả
- Thời gian kết thúc trả
- Loại tuyến
- Loại xe
- Số chỗ
- Vai trò
- Trạng thái
- Nhóm
- Ngày tạo

## API Endpoints

### Xuất Báo Cáo
- `POST /api/reports/export-user-transactions` - Xuất báo cáo giao dịch người dùng
- `POST /api/reports/export-user-schedules` - Xuất báo cáo lịch xe người dùng
- `POST /api/reports/export-group` - Xuất báo cáo nhóm

### Quản Lý Báo Cáo
- `GET /api/reports/list` - Lấy danh sách báo cáo
- `GET /api/reports/download/:reportId` - Tải về báo cáo
- `DELETE /api/reports/:reportId` - Xóa báo cáo

### Tạo Thư Mục
- `POST /api/reports/create-user-directory` - Tạo thư mục cho người dùng mới
- `POST /api/reports/create-group-directory` - Tạo thư mục cho nhóm mới

## Lưu Ý Kỹ Thuật

1. **Không sử dụng ExcelJS**: Hệ thống tạo file CSV để tương thích với Excel
2. **Tự động tạo thư mục**: Khi tạo người dùng/nhóm mới, thư mục báo cáo sẽ được tạo tự động
3. **Xác thực**: Tất cả API đều yêu cầu xác thực JWT
4. **Lưu trữ**: Đường dẫn file được lưu trong bảng `bao_cao` của database

## Xử Lý Lỗi

- **File không tồn tại**: Hệ thống sẽ thông báo và không cho phép tải về
- **Lỗi tạo thư mục**: Được log nhưng không ảnh hưởng đến chức năng chính
- **Lỗi xuất báo cáo**: Hiển thị thông báo lỗi chi tiết cho người dùng

## Bảo Mật

- Chỉ admin và người dùng có quyền mới có thể xuất báo cáo
- File báo cáo được lưu trữ an toàn trong thư mục backend
- Đường dẫn file được mã hóa và không thể truy cập trực tiếp từ bên ngoài
