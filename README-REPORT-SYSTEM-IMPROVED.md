# Hệ Thống Báo Cáo Cải Tiến - Quản Lý Điểm

## Tổng Quan

Hệ thống báo cáo đã được cải tiến để xuất dữ liệu giao dịch và lịch xe dưới dạng file CSV (có thể mở bằng Excel) cho người dùng và nhóm. Các báo cáo được lưu trữ có tổ chức trong thư mục `reports` và được quản lý thông qua database.

## Những Cải Tiến Mới

### 1. **Sửa Lỗi CSV Header**
- **Trước**: Header hiển thị `[object Object]` thay vì tên cột
- **Sau**: Header hiển thị đúng tên cột tiếng Việt
- **Nguyên nhân**: Hàm `convertToCSV` sử dụng `header.key` thay vì `header.label`

### 2. **Hiển Thị Folder Báo Cáo Thực Tế**
- **Trước**: Sử dụng dữ liệu mock cố định
- **Sau**: Đọc thực tế từ hệ thống file và database
- **API mới**: `/api/reports/folders` để lấy danh sách folder

### 3. **Quản Lý File Theo Đường Dẫn**
- **Tải về**: API `/api/reports/download-by-path` 
- **Xóa**: API `/api/reports/delete-by-path`
- **Linh hoạt**: Không cần biết report ID, chỉ cần đường dẫn file

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
- **Quản lý folder**: Xem và quản lý các folder báo cáo thực tế

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
3. Xem danh sách các folder báo cáo thực tế
4. Click vào folder để xem các file bên trong
5. Sử dụng context menu (click chuột phải) để:
   - **Tải về**: Tải file CSV
   - **Xóa**: Xóa báo cáo
   - **Xem thông tin chi tiết**: Thông tin về báo cáo

## Định Dạng File CSV

### ✅ **Tại Sao CSV Thay Vì Excel?**
- **Không cần thư viện ngoài** - Sử dụng Node.js built-in modules
- **Tương thích cao** - Excel, Google Sheets, LibreOffice đều mở được
- **Encoding đúng** - UTF-8 với BOM để hiển thị tiếng Việt chính xác
- **Performance tốt** - Tạo file nhanh, nhẹ

### 📊 **Báo Cáo Giao Dịch**
- ID Giao dịch
- Ngày tạo
- Loại giao dịch
- Vai trò (Gửi/Nhận)
- Nội dung
- Số tiền (VNĐ)
- Điểm
- Trạng thái
- Nhóm

### 🚗 **Báo Cáo Lịch Xe**
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

### 🔧 **Xử Lý Ký Tự Đặc Biệt**
- **Tiếng Việt**: UTF-8 với BOM để Excel hiểu đúng
- **Dấu phẩy**: Được escape bằng dấu ngoặc kép
- **Dấu ngoặc kép**: Được escape bằng cách nhân đôi
- **Xuống dòng**: Được thay thế bằng dấu cách

## API Endpoints

### Xuất Báo Cáo
- `POST /api/reports/export-user-transactions` - Xuất báo cáo giao dịch người dùng
- `POST /api/reports/export-user-schedules` - Xuất báo cáo lịch xe người dùng
- `POST /api/reports/export-group` - Xuất báo cáo nhóm

### Quản Lý Báo Cáo
- `GET /api/reports/list` - Lấy danh sách báo cáo
- `GET /api/reports/download/:reportId` - Tải về báo cáo theo ID
- `DELETE /api/reports/:reportId` - Xóa báo cáo theo ID

### Quản Lý Folder và File
- `GET /api/reports/folders` - Lấy danh sách folder báo cáo
- `POST /api/reports/download-by-path` - Tải về file theo đường dẫn
- `DELETE /api/reports/delete-by-path` - Xóa file theo đường dẫn

### Tạo Thư Mục
- `POST /api/reports/create-user-directory` - Tạo thư mục cho người dùng mới
- `POST /api/reports/create-group-directory` - Tạo thư mục cho nhóm mới

## Lưu Ý Kỹ Thuật

1. **Không sử dụng ExcelJS**: Hệ thống tạo file CSV để tương thích với Excel
2. **Header CSV đúng**: Sử dụng `header.label` thay vì `header.key` để hiển thị tên cột
3. **Encoding UTF-8 với BOM**: Đảm bảo Excel hiểu đúng tiếng Việt
4. **Xử lý ký tự đặc biệt**: Escape dấu phẩy, ngoặc kép và xuống dòng
5. **Tự động tạo thư mục**: Khi tạo người dùng/nhóm mới, thư mục báo cáo sẽ được tạo tự động
6. **Xác thực**: Tất cả API đều yêu cầu xác thực JWT
7. **Lưu trữ**: Đường dẫn file được lưu trong bảng `bao_cao` của database
8. **Quản lý file linh hoạt**: Có thể tải về và xóa file theo đường dẫn mà không cần biết report ID

## Xử Lý Lỗi

- **File không tồn tại**: Hệ thống sẽ thông báo và không cho phép tải về
- **Lỗi tạo thư mục**: Được log nhưng không ảnh hưởng đến chức năng chính
- **Lỗi xuất báo cáo**: Hiển thị thông báo lỗi chi tiết cho người dùng
- **Header CSV sai**: Đã được sửa để hiển thị đúng tên cột

## Bảo Mật

- Chỉ admin và người dùng có quyền mới có thể xuất báo cáo
- File báo cáo được lưu trữ an toàn trong thư mục backend
- Đường dẫn file được mã hóa và không thể truy cập trực tiếp từ bên ngoài
- Tất cả API đều yêu cầu xác thực JWT

## Cách Test

1. **Khởi động backend**: `cd backend && npm start`
2. **Khởi động frontend**: `cd frontend && npm run dev`
3. **Đăng nhập** vào hệ thống
4. **Tạo báo cáo** từ GroupsPage hoặc UsersPage
5. **Kiểm tra file CSV** trong thư mục `backend/reports`
6. **Xem danh sách folder** trong ReportsPage
7. **Test tải về và xóa file**

## Troubleshooting

### Vấn đề thường gặp

1. **File CSV hiển thị [object Object]**
   - **Nguyên nhân**: Hàm `convertToCSV` sử dụng sai key
   - **Giải pháp**: Đã sửa để sử dụng `header.label`

2. **Ký tự tiếng Việt bị hỏng (NgÃ y táº¡o)**
   - **Nguyên nhân**: Thiếu BOM, Excel không nhận diện UTF-8
   - **Giải pháp**: Đã thêm BOM (`\uFEFF`) và xử lý encoding đúng

3. **Không hiển thị folder thực tế**
   - **Nguyên nhân**: Sử dụng dữ liệu mock
   - **Giải pháp**: Đã thay thế bằng API `/api/reports/folders`

4. **Không thể tải về file**
   - **Nguyên nhân**: API cũ chỉ hỗ trợ report ID
   - **Giải pháp**: Đã thêm API `/api/reports/download-by-path`

5. **Lỗi khi xóa file**
   - **Nguyên nhân**: Không có API xóa theo đường dẫn
   - **Giải pháp**: Đã thêm API `/api/reports/delete-by-path`

6. **File CSV không mở được trong Excel**
   - **Nguyên nhân**: Encoding không đúng hoặc thiếu BOM
   - **Giải pháp**: Sử dụng UTF-8 với BOM, hoặc import thủ công vào Excel
