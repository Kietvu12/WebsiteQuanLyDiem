-- Tạo bảng loai_xe nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS loai_xe (
    id_loai_xe INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai VARCHAR(50) NOT NULL,
    so_cho INT NOT NULL,
    mo_ta TEXT
);

-- Tạo bảng loai_tuyen nếu chưa tồn tại
CREATE TABLE IF NOT EXISTS loai_tuyen (
    id_loai_tuyen INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai VARCHAR(100) NOT NULL,
    la_khu_hoi BOOLEAN DEFAULT FALSE,
    mo_ta TEXT
);

-- Xóa dữ liệu cũ nếu có
DELETE FROM loai_xe;
DELETE FROM loai_tuyen;

-- Reset auto increment
ALTER TABLE loai_xe AUTO_INCREMENT = 1;
ALTER TABLE loai_tuyen AUTO_INCREMENT = 1;

-- Sample data cho bảng loai_xe
INSERT INTO loai_xe (ten_loai, so_cho, mo_ta) VALUES
('Xe khách 16 chỗ', 16, 'Xe khách nhỏ, phù hợp cho tuyến ngắn'),
('Xe khách 29 chỗ', 29, 'Xe khách trung bình, phù hợp cho tuyến trung bình'),
('Xe khách 45 chỗ', 45, 'Xe khách lớn, phù hợp cho tuyến dài'),
('Xe giường nằm', 40, 'Xe giường nằm, phù hợp cho tuyến đêm dài'),
('Xe limousine', 7, 'Xe cao cấp, phù hợp cho dịch vụ VIP');

-- Sample data cho bảng loai_tuyen
INSERT INTO loai_tuyen (ten_loai, la_khu_hoi, mo_ta) VALUES
('Hà Nội - TP.HCM', true, 'Tuyến Bắc Nam chính'),
('Hà Nội - Đà Nẵng', true, 'Tuyến Bắc Trung'),
('TP.HCM - Đà Nẵng', false, 'Tuyến Trung Nam một chiều'),
('Hà Nội - Hải Phòng', true, 'Tuyến Bắc Bộ'),
('Hà Nội - Quảng Ninh', true, 'Tuyến du lịch biển'),
('TP.HCM - Cần Thơ', true, 'Tuyến Đồng bằng sông Cửu Long'),
('Đà Nẵng - Huế', true, 'Tuyến di sản miền Trung');

-- Hiển thị dữ liệu đã insert
SELECT 'loai_xe' as table_name, COUNT(*) as count FROM loai_xe
UNION ALL
SELECT 'loai_tuyen' as table_name, COUNT(*) as count FROM loai_tuyen;
