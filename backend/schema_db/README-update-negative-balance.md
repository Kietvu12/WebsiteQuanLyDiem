# Hướng dẫn cập nhật Database để hỗ trợ số âm

## Mục đích
Cập nhật bảng `nguoi_dung` để cho phép trường `so_du` và `diem` nhận giá trị âm, hỗ trợ hệ thống nợ/có.

## Các thay đổi cần thực hiện

### 1. Cập nhật cấu trúc bảng

```sql
-- Cập nhật trường so_du để cho phép số âm
ALTER TABLE nguoi_dung 
MODIFY COLUMN so_du DECIMAL(12,2) DEFAULT 0 COMMENT 'Số dư tài khoản (có thể âm - nợ, dương - có)';

-- Cập nhật trường diem để cho phép số âm  
ALTER TABLE nguoi_dung 
MODIFY COLUMN diem INT DEFAULT 0 COMMENT 'Số điểm tích lũy (có thể âm - nợ điểm, dương - có điểm)';
```

### 2. Kiểm tra cấu trúc sau khi cập nhật

```sql
-- Xem cấu trúc bảng
DESCRIBE nguoi_dung;

-- Xem thông tin chi tiết về các trường
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT,
    COLUMN_COMMENT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
AND TABLE_NAME = 'nguoi_dung'
AND COLUMN_NAME IN ('so_du', 'diem');
```

## Ý nghĩa của số âm

### Số dư (so_du)
- **Số dương**: Người dùng có tiền trong tài khoản
- **Số âm**: Người dùng nợ tiền (có thể do giao dịch giao lịch)

### Số điểm (diem)
- **Số dương**: Người dùng có điểm tích lũy
- **Số âm**: Người dùng nợ điểm (có thể do giao dịch giao lịch)

## Logic xử lý trong giao dịch

### Khi tạo giao dịch "Giao lịch":
- **Người gửi (giao lịch)**: Sẽ được cộng tiền và điểm khi giao dịch được xác nhận
- **Người nhận (nhận lịch)**: Sẽ bị trừ tiền và điểm khi xác nhận giao dịch

### Ví dụ:
- Giao dịch: 50,000 VNĐ và 10 điểm
- **Người giao lịch**: +50,000 VNĐ, +10 điểm
- **Người nhận lịch**: -50,000 VNĐ, -10 điểm

## Cách thực hiện cập nhật

### Phương pháp 1: Sử dụng MySQL command line
```bash
mysql -u root -p
USE quan_ly_diem;
# Chạy các lệnh ALTER TABLE ở trên
```

### Phương pháp 2: Sử dụng file SQL
```bash
mysql -u root -p quan_ly_diem < update-user-balance-negative.sql
```

### Phương pháp 3: Sử dụng phpMyAdmin hoặc MySQL Workbench
- Mở database `quan_ly_diem`
- Chọn bảng `nguoi_dung`
- Chỉnh sửa cấu trúc các trường `so_du` và `diem`
- Thêm comment tương ứng

## Kiểm tra sau khi cập nhật

### 1. Test tạo giao dịch với số âm
```bash
node test-negative-balance.js
```

### 2. Kiểm tra database trực tiếp
```sql
-- Xem số dư và điểm của tất cả users
SELECT id_nguoi_dung, ten_dang_nhap, so_du, diem 
FROM nguoi_dung 
ORDER BY id_nguoi_dung;

-- Xem giao dịch gần đây
SELECT * FROM giao_dich 
ORDER BY ngay_tao DESC 
LIMIT 5;
```

### 3. Test logic xác nhận giao dịch
- Tạo giao dịch giao lịch
- Xác nhận giao dịch
- Kiểm tra số dư và điểm của cả người gửi và người nhận

## Lưu ý quan trọng

1. **Backup database** trước khi thực hiện thay đổi
2. **Kiểm tra ứng dụng** sau khi cập nhật để đảm bảo hoạt động bình thường
3. **Test kỹ lưỡng** logic xử lý số âm
4. **Cập nhật frontend** để hiển thị số âm một cách rõ ràng (màu đỏ cho số âm, xanh cho số dương)

## Troubleshooting

### Lỗi thường gặp:
1. **Access denied**: Kiểm tra quyền của user MySQL
2. **Table doesn't exist**: Kiểm tra tên database và bảng
3. **Syntax error**: Kiểm tra cú pháp SQL

### Kiểm tra log:
- Xem log của backend để theo dõi quá trình cập nhật
- Kiểm tra console.log trong các method updateBalanceAndPoints
