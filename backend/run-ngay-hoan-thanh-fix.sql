-- Script để sửa trường ngay_hoan_thanh trong database
-- Chạy script này trên server Ubuntu để fix lỗi

USE quanlydiem;

-- Kiểm tra cấu trúc hiện tại của bảng giao_dich
DESCRIBE giao_dich;

-- Sửa trường ngay_hoan_thanh để cho phép NULL
ALTER TABLE `giao_dich` 
MODIFY COLUMN `ngay_hoan_thanh` timestamp NULL DEFAULT NULL;

-- Thêm comment để giải thích
ALTER TABLE `giao_dich` 
MODIFY COLUMN `ngay_hoan_thanh` timestamp NULL DEFAULT NULL 
COMMENT 'Thời gian hoàn thành giao dịch (NULL nếu chưa hoàn thành)';

-- Kiểm tra lại cấu trúc sau khi sửa
DESCRIBE giao_dich;

-- Hiển thị một số giao dịch để kiểm tra
SELECT id_giao_dich, trang_thai, ngay_hoan_thanh FROM giao_dich LIMIT 5;
