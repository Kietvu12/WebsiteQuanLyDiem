-- Fix lịch xe datetime fields
-- Thay đổi các trường TIME thành DATETIME để lưu đầy đủ ngày giờ

USE quan_ly_diem;

-- Backup dữ liệu hiện tại trước khi thay đổi
CREATE TEMPORARY TABLE temp_lich_xe AS SELECT * FROM lich_xe;

-- Thay đổi cấu trúc bảng
ALTER TABLE lich_xe 
MODIFY COLUMN thoi_gian_bat_dau_don DATETIME NOT NULL,
MODIFY COLUMN thoi_gian_ket_thuc_don DATETIME NOT NULL,
MODIFY COLUMN thoi_gian_bat_dau_tra DATETIME,
MODIFY COLUMN thoi_gian_ket_thuc_tra DATETIME;

-- Cập nhật dữ liệu hiện tại với ngày hôm nay
UPDATE lich_xe 
SET 
    thoi_gian_bat_dau_don = CONCAT(CURDATE(), ' ', TIME(thoi_gian_bat_dau_don)),
    thoi_gian_ket_thuc_don = CONCAT(CURDATE(), ' ', TIME(thoi_gian_ket_thuc_don)),
    thoi_gian_bat_dau_tra = CASE 
        WHEN thoi_gian_bat_dau_tra IS NOT NULL 
        THEN CONCAT(CURDATE(), ' ', TIME(thoi_gian_bat_dau_tra))
        ELSE NULL 
    END,
    thoi_gian_ket_thuc_tra = CASE 
        WHEN thoi_gian_ket_thuc_tra IS NOT NULL 
        THEN CONCAT(CURDATE(), ' ', TIME(thoi_gian_ket_thuc_tra))
        ELSE NULL 
    END;

-- Thêm cột id_nguoi_nhan nếu chưa có
ALTER TABLE lich_xe ADD COLUMN IF NOT EXISTS id_nguoi_nhan INT,
ADD CONSTRAINT FK_lich_xe_nguoi_nhan 
FOREIGN KEY (id_nguoi_nhan) REFERENCES nguoi_dung(id_nguoi_dung);

SELECT 'Migration completed successfully' as status;
