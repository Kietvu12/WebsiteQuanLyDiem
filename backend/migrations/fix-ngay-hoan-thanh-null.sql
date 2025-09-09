-- Migration: Sửa trường ngay_hoan_thanh để cho phép NULL
-- Ngày: 2025-08-25

-- Sửa trường ngay_hoan_thanh để cho phép NULL
ALTER TABLE `giao_dich` 
MODIFY COLUMN `ngay_hoan_thanh` timestamp NULL DEFAULT NULL;

-- Thêm comment để giải thích
ALTER TABLE `giao_dich` 
MODIFY COLUMN `ngay_hoan_thanh` timestamp NULL DEFAULT NULL 
COMMENT 'Thời gian hoàn thành giao dịch (NULL nếu chưa hoàn thành)';
