-- Migration: Thêm cột trang_thai vào bảng giao_dich
-- Chạy lệnh này nếu cột trang_thai chưa tồn tại

-- Kiểm tra xem cột trang_thai đã tồn tại chưa
SET @sql = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() 
   AND TABLE_NAME = 'giao_dich' 
   AND COLUMN_NAME = 'trang_thai') > 0,
  'SELECT "Cột trang_thai đã tồn tại" as message;',
  'ALTER TABLE giao_dich ADD COLUMN trang_thai ENUM("cho_xac_nhan", "hoan_thanh", "da_huy") DEFAULT "cho_xac_nhan" AFTER noi_dung;'
));

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Cập nhật dữ liệu cũ nếu cần
UPDATE giao_dich SET trang_thai = 'hoan_thanh' WHERE trang_thai IS NULL;

-- Thêm cột ngay_hoan_thanh nếu chưa có
SET @sql2 = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
   WHERE TABLE_SCHEMA = DATABASE() 
   AND TABLE_NAME = 'giao_dich' 
   AND COLUMN_NAME = 'ngay_hoan_thanh') > 0,
  'SELECT "Cột ngay_hoan_thanh đã tồn tại" as message;',
  'ALTER TABLE giao_dich ADD COLUMN ngay_hoan_thanh TIMESTAMP NULL AFTER ngay_tao;'
));

PREPARE stmt2 FROM @sql2;
EXECUTE stmt2;
DEALLOCATE PREPARE stmt2;

-- Hiển thị kết quả
SELECT 'Migration hoàn thành' as status;
