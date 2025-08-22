# KHẮC PHỤC LỖI RÀNG BUỘC KHÓA NGOẠI (FOREIGN KEY CONSTRAINT)

## Lỗi thường gặp

```
#1451 - Cannot delete or update a parent row: a foreign key constraint fails 
(`quanlydiem`.`lich_xe`, CONSTRAINT `lich_xe_ibfk_2` 
FOREIGN KEY (`id_loai_tuyen`) REFERENCES `loai_tuyen` (`id_loai_tuyen`))
```

## Nguyên nhân

Lỗi này xảy ra khi:
1. Bảng `lich_xe` có dữ liệu tham chiếu đến bảng `loai_tuyen`
2. Bạn cố gắng xóa hoặc cập nhật dữ liệu trong `loai_tuyen` mà không xử lý dữ liệu con trước
3. Ràng buộc khóa ngoại đang được bật (`FOREIGN_KEY_CHECKS = 1`)

## Giải pháp

### Giải pháp 1: Sử dụng migration script đã cập nhật (Khuyến nghị)

Migration script mới đã được cập nhật để xử lý vấn đề này:

```bash
# Chạy migration với PowerShell
.\run-migration.ps1

# Hoặc với Batch
.\run-migration.bat

# Hoặc chạy trực tiếp SQL
mysql -u username -p database_name < schema_db/update-route-types.sql
```

**Script này sẽ:**
1. Tạm thời vô hiệu hóa kiểm tra khóa ngoại (`SET FOREIGN_KEY_CHECKS = 0`)
2. Xóa dữ liệu cũ trong `loai_tuyen`
3. Thêm 7 loại tuyến mới
4. Cập nhật dữ liệu trong `lich_xe` để map sang loại tuyến mới
5. Bật lại kiểm tra khóa ngoại (`SET FOREIGN_KEY_CHECKS = 1`)

### Giải pháp 2: Xử lý thủ công

Nếu bạn muốn xử lý thủ công:

#### Bước 1: Kiểm tra dữ liệu hiện tại
```sql
-- Xem có bao nhiêu lịch xe đang sử dụng mỗi loại tuyến
SELECT 
    lx.id_loai_tuyen,
    lt.ten_loai,
    COUNT(*) as so_lich_xe
FROM lich_xe lx
JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
GROUP BY lx.id_loai_tuyen, lt.ten_loai
ORDER BY lx.id_loai_tuyen;
```

#### Bước 2: Vô hiệu hóa kiểm tra khóa ngoại
```sql
SET FOREIGN_KEY_CHECKS = 0;
```

#### Bước 3: Xóa dữ liệu cũ
```sql
DELETE FROM loai_tuyen;
ALTER TABLE loai_tuyen AUTO_INCREMENT = 1;
```

#### Bước 4: Thêm dữ liệu mới
```sql
INSERT INTO loai_tuyen (id_loai_tuyen, ten_loai, la_khu_hoi) VALUES
(1, 'Đón Sân Bay - Hà Nội', FALSE),
(2, 'Tiễn Hà Nội - Sân Bay', FALSE),
(3, 'Lịch Phố 1 Chiều', FALSE),
(4, 'Lịch Phố 2 Chiều', TRUE),
(5, 'Lịch Tỉnh/Huyện 1 Chiều', FALSE),
(6, 'Lịch Tỉnh/Huyện 2 Chiều', TRUE),
(7, 'Lịch Hướng Sân Bay (Bán kính 5km)', FALSE);
```

#### Bước 5: Cập nhật dữ liệu lịch xe
```sql
-- Map loại tuyến cũ sang mới
UPDATE lich_xe SET id_loai_tuyen = 5 WHERE id_loai_tuyen = 3; -- Tỉnh 1 chiều
UPDATE lich_xe SET id_loai_tuyen = 6 WHERE id_loai_tuyen = 4; -- Tỉnh 2 chiều
UPDATE lich_xe SET id_loai_tuyen = 5 WHERE id_loai_tuyen = 5; -- Huyện 1 chiều
UPDATE lich_xe SET id_loai_tuyen = 6 WHERE id_loai_tuyen = 6; -- Huyện 2 chiều
```

#### Bước 6: Bật lại kiểm tra khóa ngoại
```sql
SET FOREIGN_KEY_CHECKS = 1;
```

### Giải pháp 3: Xóa dữ liệu con trước

**⚠️ CẢNH BÁO: Cách này sẽ mất dữ liệu lịch xe!**

```sql
-- Xóa tất cả lịch xe trước
DELETE FROM lich_xe;

-- Sau đó xóa và thêm lại loại tuyến
DELETE FROM loai_tuyen;
-- Thêm dữ liệu mới...
```

## Kiểm tra sau khi migration

### 1. Kiểm tra bảng loai_tuyen
```sql
SELECT 
    id_loai_tuyen,
    ten_loai,
    la_khu_hoi
FROM loai_tuyen 
ORDER BY id_loai_tuyen;
```

### 2. Kiểm tra dữ liệu lịch xe
```sql
SELECT 
    lx.id_lich_xe,
    lx.id_loai_tuyen,
    lt.ten_loai,
    CASE 
        WHEN lx.thoi_gian_bat_dau_tra IS NOT NULL THEN '2 CHIỀU'
        ELSE '1 CHIỀU'
    END as loai_lich
FROM lich_xe lx
JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
ORDER BY lx.id_lich_xe;
```

### 3. Kiểm tra ràng buộc khóa ngoại
```sql
-- Xem các ràng buộc khóa ngoại
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = 'quanlydiem'
AND REFERENCED_TABLE_NAME = 'loai_tuyen';
```

## Test sau migration

### 1. Chạy test backend
```bash
cd backend
node test-route-types-integration.js
```

### 2. Chạy test frontend
```bash
cd frontend
node test-point-calculation-float.js
```

### 3. Test tạo giao dịch mới
- Mở frontend
- Tạo giao dịch "Giao lịch" mới
- Kiểm tra điểm được tính tự động

## Lưu ý quan trọng

### 1. Backup trước khi migration
```bash
mysqldump -u username -p database_name > backup_before_migration.sql
```

### 2. Test trên database test trước
- Luôn test migration trên database test trước khi chạy trên production
- Kiểm tra dữ liệu sau migration

### 3. Rollback plan
- Nếu migration thất bại, sử dụng backup để khôi phục
- Script migration đã có sẵn rollback tự động

### 4. Dữ liệu cũ
- Các lịch xe cũ sẽ được map sang loại tuyến mới tương ứng
- Không mất dữ liệu lịch xe

## Troubleshooting

### Lỗi "Access denied"
```bash
# Kiểm tra quyền user MySQL
mysql -u username -p -e "SHOW GRANTS;"
```

### Lỗi "Table doesn't exist"
```bash
# Kiểm tra tên database và bảng
mysql -u username -p -e "SHOW DATABASES;"
mysql -u username -p -e "USE quanlydiem; SHOW TABLES;"
```

### Lỗi "Syntax error"
```bash
# Kiểm tra cú pháp SQL
mysql -u username -p -e "SELECT 1;"
```

## Kết luận

**Giải pháp tốt nhất là sử dụng migration script đã cập nhật** vì:
1. ✅ Xử lý tự động ràng buộc khóa ngoại
2. ✅ Map dữ liệu cũ sang mới
3. ✅ Có rollback tự động
4. ✅ Kiểm tra kết quả sau migration
5. ✅ Hướng dẫn bước tiếp theo

Nếu gặp vấn đề, hãy kiểm tra log và sử dụng backup để khôi phục.
