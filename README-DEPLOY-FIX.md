# Hướng dẫn Fix lỗi Deploy - ngay_hoan_thanh không thể NULL

## Vấn đề
Khi deploy lên server Ubuntu, gặp lỗi `ngay_hoan_thanh cannot be null` khi tạo giao dịch.

## Nguyên nhân
- Database schema có trường `ngay_hoan_thanh` với `NOT NULL DEFAULT current_timestamp()`
- Code đang cố gắng set `ngay_hoan_thanh = NULL` khi tạo giao dịch mới
- Server Ubuntu có cấu hình MySQL nghiêm ngặt hơn local

## Giải pháp

### Bước 1: Sửa Database Schema
Chạy script SQL trên server Ubuntu:

```bash
# Kết nối vào MySQL
mysql -u root -p

# Hoặc nếu dùng database user khác
mysql -u [username] -p quanlydiem
```

Sau đó chạy script:
```sql
USE quanlydiem;

-- Sửa trường ngay_hoan_thanh để cho phép NULL
ALTER TABLE `giao_dich` 
MODIFY COLUMN `ngay_hoan_thanh` timestamp NULL DEFAULT NULL;

-- Thêm comment để giải thích
ALTER TABLE `giao_dich` 
MODIFY COLUMN `ngay_hoan_thanh` timestamp NULL DEFAULT NULL 
COMMENT 'Thời gian hoàn thành giao dịch (NULL nếu chưa hoàn thành)';
```

Hoặc chạy file script đã tạo:
```bash
mysql -u [username] -p < backend/run-ngay-hoan-thanh-fix.sql
```

### Bước 2: Deploy Code Mới
Code đã được cập nhật để:
- Không truyền `ngay_hoan_thanh` trong INSERT statement
- Sử dụng logic CASE WHEN để set NULL cho giao dịch chưa hoàn thành
- Set CURRENT_TIMESTAMP cho giao dịch đã hoàn thành

### Bước 3: Kiểm tra
Sau khi deploy:
1. Kiểm tra database schema:
```sql
DESCRIBE giao_dich;
```

2. Test tạo giao dịch mới
3. Kiểm tra dữ liệu:
```sql
SELECT id_giao_dich, trang_thai, ngay_hoan_thanh FROM giao_dich ORDER BY id_giao_dich DESC LIMIT 5;
```

## Files đã thay đổi
1. `backend/models/Transaction.js` - Sửa logic INSERT
2. `backend/run-ngay-hoan-thanh-fix.sql` - Script fix database
3. `backend/migrations/fix-ngay-hoan-thanh-null.sql` - Migration file

## Lưu ý
- Backup database trước khi chạy migration
- Test kỹ trên môi trường staging trước khi deploy production
- Kiểm tra tất cả các API tạo giao dịch hoạt động bình thường
