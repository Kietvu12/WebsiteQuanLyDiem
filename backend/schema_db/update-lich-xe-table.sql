-- Script cập nhật cấu trúc bảng lich_xe để thêm thông tin người nhận lịch
-- Chạy script này để cập nhật database

-- Kiểm tra xem cột id_nguoi_nhan đã tồn tại chưa
SELECT COUNT(*) as column_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME = 'lich_xe' 
  AND COLUMN_NAME = 'id_nguoi_nhan';

-- Thêm cột id_nguoi_nhan nếu chưa tồn tại
ALTER TABLE lich_xe 
ADD COLUMN IF NOT EXISTS id_nguoi_nhan INT NULL,
ADD CONSTRAINT fk_lich_xe_nguoi_nhan 
FOREIGN KEY (id_nguoi_nhan) REFERENCES nguoi_dung(id_nguoi_dung) 
ON DELETE SET NULL;

-- Thêm index để tối ưu truy vấn
CREATE INDEX IF NOT EXISTS idx_lich_xe_nguoi_nhan ON lich_xe(id_nguoi_nhan);

-- Cập nhật dữ liệu hiện tại (nếu có) - lấy từ giao dịch giao lịch
UPDATE lich_xe lx
INNER JOIN giao_dich gd ON lx.id_lich_xe = gd.id_lich_xe
SET lx.id_nguoi_nhan = gd.id_nguoi_nhan
WHERE gd.id_loai_giao_dich = 1 
  AND gd.id_nguoi_nhan IS NOT NULL
  AND lx.id_nguoi_nhan IS NULL;

-- Hiển thị cấu trúc bảng sau khi cập nhật
DESCRIBE lich_xe;

-- Hiển thị dữ liệu mẫu
SELECT 
  lx.id_lich_xe,
  lx.id_nguoi_tao,
  lx.id_nguoi_nhan,
  nd_tao.ho_ten as ten_nguoi_tao,
  nd_nhan.ho_ten as ten_nguoi_nhan,
  lx.ngay_tao
FROM lich_xe lx
LEFT JOIN nguoi_dung nd_tao ON lx.id_nguoi_tao = nd_tao.id_nguoi_dung
LEFT JOIN nguoi_dung nd_nhan ON lx.id_nguoi_nhan = nd_nhan.id_nguoi_dung
ORDER BY lx.ngay_tao DESC
LIMIT 10;
