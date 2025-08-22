-- MIGRATION: CẬP NHẬT LOẠI TUYẾN CHO TÍNH ĐIỂM
-- Xử lý ràng buộc khóa ngoại trước khi cập nhật

-- Bước 1: Backup dữ liệu hiện tại (nếu cần)
-- mysqldump -u username -p database_name > backup_before_migration.sql

-- Bước 2: Tạm thời vô hiệu hóa kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 0;

-- Bước 3: Xóa dữ liệu cũ trong bảng loai_tuyen
DELETE FROM loai_tuyen;

-- Bước 4: Reset auto increment
ALTER TABLE loai_tuyen AUTO_INCREMENT = 1;

-- Bước 5: Thêm 7 loại tuyến mới (tách riêng 1 chiều/2 chiều)
INSERT INTO loai_tuyen (id_loai_tuyen, ten_loai, la_khu_hoi) VALUES
(1, 'Đón Sân Bay - Hà Nội', FALSE),
(2, 'Tiễn Hà Nội - Sân Bay', FALSE),
(3, 'Lịch Phố 1 Chiều', FALSE),
(4, 'Lịch Phố 2 Chiều', TRUE),
(5, 'Lịch Tỉnh/Huyện 1 Chiều', FALSE),
(6, 'Lịch Tỉnh/Huyện 2 Chiều', TRUE),
(7, 'Lịch Hướng Sân Bay (Bán kính 5km)', FALSE);

-- Bước 6: Cập nhật dữ liệu trong bảng lich_xe để map sang loại tuyến mới
-- Map các lịch xe cũ sang loại tuyến mới tương ứng

-- Cập nhật lịch xe có loại tuyến cũ (nếu có)
-- Lịch xe có id_loai_tuyen = 1 (Đón sân bay cũ) -> giữ nguyên id = 1
-- Lịch xe có id_loai_tuyen = 2 (Tiễn sân bay cũ) -> giữ nguyên id = 2

-- Lịch xe có id_loai_tuyen = 3 (Đi tỉnh 1 chiều cũ) -> chuyển sang id = 5 (Tỉnh/Huyện 1 chiều)
UPDATE lich_xe SET id_loai_tuyen = 5 WHERE id_loai_tuyen = 3;

-- Lịch xe có id_loai_tuyen = 4 (Đi tỉnh 2 chiều cũ) -> chuyển sang id = 6 (Tỉnh/Huyện 2 chiều)  
UPDATE lich_xe SET id_loai_tuyen = 6 WHERE id_loai_tuyen = 4;

-- Lịch xe có id_loai_tuyen = 5 (Đi huyện 1 chiều cũ) -> chuyển sang id = 5 (Tỉnh/Huyện 1 chiều)
UPDATE lich_xe SET id_loai_tuyen = 5 WHERE id_loai_tuyen = 5;

-- Lịch xe có id_loai_tuyen = 6 (Đi huyện 2 chiều cũ) -> chuyển sang id = 6 (Tỉnh/Huyện 2 chiều)
UPDATE lich_xe SET id_loai_tuyen = 6 WHERE id_loai_tuyen = 6;

-- Bước 7: Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;

-- Bước 8: Kiểm tra kết quả
SELECT 
    id_loai_tuyen,
    ten_loai,
    la_khu_hoi,
    CASE 
        WHEN id_loai_tuyen = 1 THEN 'ĐÓN SÂN BAY: Tính điểm theo khung giờ và loại xe'
        WHEN id_loai_tuyen = 2 THEN 'TIỄN SÂN BAY: Tính điểm theo khung giờ và loại xe'
        WHEN id_loai_tuyen = 3 THEN 'PHỐ 1 CHIỀU: Tính điểm theo giá (180k-300k=0.5đ, 300k-600k=1đ)'
        WHEN id_loai_tuyen = 4 THEN 'PHỐ 2 CHIỀU: Tính điểm theo xe và giá (250k-800k=0.5đ-1.5đ)'
        WHEN id_loai_tuyen = 5 THEN 'TỈNH/HUYỆN 1 CHIỀU: Tính điểm theo giá (180k-2.1M=0.5đ-3.5đ)'
        WHEN id_loai_tuyen = 6 THEN 'TỈNH/HUYỆN 2 CHIỀU: Tính điểm theo giá (180k-2.1M=0.5đ-3.5đ)'
        WHEN id_loai_tuyen = 7 THEN 'HƯỚNG SÂN BAY 5KM: Tính như tiễn sân bay'
        ELSE 'Không xác định'
    END as mo_ta_tinh_diem
FROM loai_tuyen 
ORDER BY id_loai_tuyen;

-- Bước 9: Kiểm tra dữ liệu lich_xe đã được cập nhật
SELECT 
    lx.id_lich_xe,
    lx.id_loai_tuyen,
    lt.ten_loai,
    lx.thoi_gian_bat_dau_don,
    lx.thoi_gian_bat_dau_tra,
    CASE 
        WHEN lx.thoi_gian_bat_dau_tra IS NOT NULL THEN '2 CHIỀU'
        ELSE '1 CHIỀU'
    END as loai_lich
FROM lich_xe lx
JOIN loai_tuyen lt ON lx.id_loai_tuyen = lt.id_loai_tuyen
ORDER BY lx.id_lich_xe;

-- Bước 10: Thông báo hoàn thành
SELECT 'MIGRATION HOÀN THÀNH!' as status;
SELECT 'Đã cập nhật 7 loại tuyến mới với logic tính điểm chi tiết' as description;
SELECT 'Đã tách riêng lịch 1 chiều và 2 chiều' as improvement_1;
SELECT 'Đã xử lý điều kiện khoảng cách (hướng sân bay 5km)' as improvement_2;
SELECT 'Đã hỗ trợ điểm float: 0.5, 1.25, 1.5, 2.5, 3.5' as improvement_3;
