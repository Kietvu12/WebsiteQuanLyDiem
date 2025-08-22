-- Cập nhật bảng nguoi_dung để cho phép số âm cho so_du và diem
-- File: update-user-balance-negative.sql

-- 1. Cập nhật trường so_du để cho phép số âm
ALTER TABLE nguoi_dung 
MODIFY COLUMN so_du DECIMAL(12,2) DEFAULT 0;

-- 2. Cập nhật trường diem để cho phép số âm  
ALTER TABLE nguoi_dung 
MODIFY COLUMN diem INT DEFAULT 0;

-- 3. Thêm comment để giải thích ý nghĩa
ALTER TABLE nguoi_dung 
MODIFY COLUMN so_du DECIMAL(12,2) DEFAULT 0 COMMENT 'Số dư tài khoản (có thể âm - nợ, dương - có)';

ALTER TABLE nguoi_dung 
MODIFY COLUMN diem INT DEFAULT 0 COMMENT 'Số điểm tích lũy (có thể âm - nợ điểm, dương - có điểm)';

-- 4. Kiểm tra cấu trúc bảng sau khi cập nhật
DESCRIBE nguoi_dung;

-- 5. Hiển thị thông tin về các ràng buộc
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
