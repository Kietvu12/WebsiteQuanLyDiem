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
