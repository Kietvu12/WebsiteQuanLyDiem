-- Migration: Thêm cột id_nguoi_nhan vào bảng lich_xe
-- Để xác định tài xế (người nhận lịch)

-- Tắt kiểm tra foreign key tạm thời
SET FOREIGN_KEY_CHECKS = 0;

-- Thêm cột id_nguoi_nhan vào bảng lich_xe
ALTER TABLE lich_xe 
ADD COLUMN id_nguoi_nhan INT NULL AFTER id_nguoi_tao,
ADD CONSTRAINT fk_lich_xe_nguoi_nhan 
FOREIGN KEY (id_nguoi_nhan) REFERENCES nguoi_dung(id_nguoi_dung);

-- Bật lại kiểm tra foreign key
SET FOREIGN_KEY_CHECKS = 1;

-- Cập nhật dữ liệu hiện có: lấy id_nguoi_nhan từ bảng giao_dich
-- Chỉ lấy những giao dịch "Nhận lịch" (id_loai_giao_dich = 2) và có id_lich_xe
UPDATE lich_xe lx
INNER JOIN giao_dich gd ON lx.id_lich_xe = gd.id_lich_xe
SET lx.id_nguoi_nhan = gd.id_nguoi_nhan
WHERE gd.id_loai_giao_dich = 2 AND gd.id_lich_xe IS NOT NULL;

-- Hiển thị kết quả
SELECT 
    lx.id_lich_xe,
    lx.id_nguoi_tao,
    lx.id_nguoi_nhan,
    nd1.ho_ten as ten_nguoi_tao,
    nd2.ho_ten as ten_nguoi_nhan
FROM lich_xe lx
LEFT JOIN nguoi_dung nd1 ON lx.id_nguoi_tao = nd1.id_nguoi_dung
LEFT JOIN nguoi_dung nd2 ON lx.id_nguoi_nhan = nd2.id_nguoi_dung
ORDER BY lx.id_lich_xe;
