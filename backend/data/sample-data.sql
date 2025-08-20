-- Dữ liệu mẫu cho hệ thống Quản Lý Điểm
-- Mật khẩu gốc: Admin@123 cho admin, User@123 cho các user khác

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM thong_bao;
DELETE FROM giao_dich;
DELETE FROM lich_xe;
DELETE FROM thanh_vien_nhom;
DELETE FROM nguoi_dung;
DELETE FROM nhom;
DELETE FROM loai_xe;
DELETE FROM loai_tuyen;
DELETE FROM loai_giao_dich;

-- Thêm loại xe
INSERT INTO loai_xe (ten_loai, so_cho) VALUES
('4 chỗ', 4),
('5 chỗ', 5),
('7 chỗ', 7),
('16 chỗ', 16),
('29 chỗ', 29),
('45 chỗ', 45);

-- Thêm loại tuyến
INSERT INTO loai_tuyen (ten_loai, la_khu_hoi) VALUES
('Đón Sân bay - Hà Nội', FALSE),
('Tiễn Hà Nội - Sân bay', FALSE),
('Đi tỉnh 1 chiều', FALSE),
('Đi tỉnh 2 chiều', TRUE),
('Đi huyện 1 chiều', FALSE),
('Đi huyện 2 chiều', TRUE);

-- Thêm loại giao dịch
INSERT INTO loai_giao_dich (ten_loai, yeu_cau_xac_nhan) VALUES
('Giao lịch', TRUE),
('Nhận lịch', TRUE),
('Hủy lịch', FALSE),
('San cho', FALSE),
('Nhận san', FALSE);

-- Thêm admin (mật khẩu: Admin@123)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, la_admin, so_du, diem) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'admin@company.com', 'Trần Quản Trị', '0987654321', TRUE, 10000000, 1000);

-- Thêm thành viên (mật khẩu: User@123)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, so_du, diem) VALUES
('nguyenvanA', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'nguyenvana@gmail.com', 'Nguyễn Văn An', '0912345678', 5000000, 500),
('tranthiB', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'tranthib@yahoo.com', 'Trần Thị Bình', '0923456789', 3000000, 300),
('phamvanC', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'phamvanc@gmail.com', 'Phạm Văn Cường', '0934567890', 4000000, 400),
('levanD', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'levand@hotmail.com', 'Lê Văn Dũng', '0945678901', 6000000, 600),
('hoangthiE', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'hoangthie@outlook.com', 'Hoàng Thị Em', '0956789012', 2500000, 250);

-- Thêm nhóm
INSERT INTO nhom (ten_nhom, mo_ta) VALUES 
('Nhóm Xe Sân Bay', 'Chuyên phục vụ các chuyến xe sân bay - Hà Nội'),
('Nhóm Xe Tỉnh', 'Chuyên phục vụ các chuyến xe đi tỉnh'),
('Nhóm Xe Nội Thành', 'Chuyên phục vụ các chuyến xe nội thành Hà Nội'),
('Nhóm Xe Huyện', 'Chuyên phục vụ các chuyến xe đi huyện');

-- Thêm thành viên vào nhóm
INSERT INTO thanh_vien_nhom (id_nguoi_dung, id_nhom) VALUES
(2, 1), (2, 2), -- Nguyễn Văn An thuộc 2 nhóm
(3, 1), (3, 3), -- Trần Thị Bình thuộc 2 nhóm
(4, 2), (4, 4), -- Phạm Văn Cường thuộc 2 nhóm
(5, 1), (5, 3), -- Lê Văn Dũng thuộc 2 nhóm
(6, 2), (6, 4); -- Hoàng Thị Em thuộc 2 nhóm

-- Thêm lịch xe
INSERT INTO lich_xe (id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don, thoi_gian_bat_dau_tra, thoi_gian_ket_thuc_tra, id_nguoi_tao, id_nhom, trang_thai) VALUES
(2, 1, '08:00:00', '08:30:00', '16:00:00', '16:30:00', 2, 1, 'da_xac_nhan'),
(3, 2, '14:00:00', '14:30:00', '22:00:00', '22:30:00', 3, 1, 'cho_xac_nhan'),
(1, 3, '07:00:00', '07:30:00', NULL, NULL, 4, 2, 'da_xac_nhan'),
(4, 4, '06:00:00', '06:30:00', '18:00:00', '18:30:00', 5, 2, 'hoan_thanh'),
(2, 5, '09:00:00', '09:30:00', NULL, NULL, 6, 4, 'cho_xac_nhan');

-- Thêm giao dịch
INSERT INTO giao_dich (id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, id_lich_xe, so_tien, diem, noi_dung, trang_thai) VALUES
(1, 2, 3, 1, 1, 500000, 50, 'Giao lịch xe sân bay 8h sáng', 'hoan_thanh'),
(2, 3, 2, 1, 1, 500000, 50, 'Nhận lịch xe sân bay 8h sáng', 'hoan_thanh'),
(4, 2, 4, 1, NULL, NULL, 25, 'San cho 25 điểm', 'hoan_thanh'),
(5, 4, 2, 1, NULL, NULL, 25, 'Nhận san 25 điểm', 'hoan_thanh'),
(1, 4, 5, 2, 3, 300000, 30, 'Giao lịch xe tỉnh 7h sáng', 'cho_xac_nhan'),
(4, 5, 6, 2, NULL, NULL, 20, 'San cho 20 điểm', 'hoan_thanh'),
(5, 6, 5, 2, NULL, NULL, 20, 'Nhận san 20 điểm', 'hoan_thanh');

-- Thêm thông báo
INSERT INTO thong_bao (id_nguoi_dung, id_giao_dich, noi_dung, da_doc) VALUES
(3, 1, 'Bạn có lịch xe mới từ nguyenvanA', FALSE),
(2, 2, 'Lịch xe của bạn đã được xác nhận', FALSE),
(4, 3, 'Bạn được nhận 25 điểm từ nguyenvanA', FALSE),
(5, 4, 'Bạn có lịch xe mới từ phamvanC', FALSE),
(6, 6, 'Bạn được nhận 20 điểm từ phamvanC', FALSE);

-- Thêm báo cáo
INSERT INTO bao_cao (id_nhom, ngay_bao_cao, duong_dan_file) VALUES
(1, CURDATE(), '/reports/nhom-san-bay-2024-01-15.xlsx'),
(2, CURDATE(), '/reports/nhom-tinh-2024-01-15.xlsx'),
(3, CURDATE(), '/reports/nhom-noi-thanh-2024-01-15.xlsx'),
(4, CURDATE(), '/reports/nhom-huyen-2024-01-15.xlsx');

-- Hiển thị thông tin đã tạo
SELECT 'Dữ liệu mẫu đã được tạo thành công!' as message;

-- Hiển thị thống kê
SELECT 
    (SELECT COUNT(*) FROM nguoi_dung) as total_users,
    (SELECT COUNT(*) FROM nhom) as total_groups,
    (SELECT COUNT(*) FROM lich_xe) as total_schedules,
    (SELECT COUNT(*) FROM giao_dich) as total_transactions,
    (SELECT COUNT(*) FROM thong_bao) as total_notifications;
