-- Bảng người dùng (2 phân quyền: admin và member)
CREATE TABLE nguoi_dung (
    id_nguoi_dung INT PRIMARY KEY AUTO_INCREMENT,
    ten_dang_nhap VARCHAR(50) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    ho_ten VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(20),
    dia_chi TEXT,
    so_du DECIMAL(12,2) DEFAULT 0 COMMENT 'Số dư tài khoản (có thể âm - nợ, dương - có)',
    diem INT DEFAULT 0 COMMENT 'Số điểm tích lũy (có thể âm - nợ điểm, dương - có)',
    la_admin BOOLEAN DEFAULT FALSE, -- Chỉ có 2 quyền: TRUE là admin, FALSE là member
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng nhóm (không có quản trị nhóm)
CREATE TABLE nhom (
    id_nhom INT PRIMARY KEY AUTO_INCREMENT,
    ten_nhom VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng thành viên nhóm (không có quyền quản trị nhóm)
CREATE TABLE thanh_vien_nhom (
    id_thanh_vien INT PRIMARY KEY AUTO_INCREMENT,
    id_nguoi_dung INT NOT NULL,
    id_nhom INT NOT NULL,
    ngay_tham_gia TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id_nguoi_dung) ON DELETE CASCADE,
    FOREIGN KEY (id_nhom) REFERENCES nhom(id_nhom) ON DELETE CASCADE,
    UNIQUE (id_nguoi_dung, id_nhom)
);

-- Bảng loại xe
CREATE TABLE loai_xe (
    id_loai_xe INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai VARCHAR(50) NOT NULL,
    so_cho INT NOT NULL
);

-- Bảng loại tuyến
CREATE TABLE loai_tuyen (
    id_loai_tuyen INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai VARCHAR(100) NOT NULL,
    la_khu_hoi BOOLEAN DEFAULT FALSE
);

-- Bảng lịch xe
CREATE TABLE lich_xe (
    id_lich_xe INT PRIMARY KEY AUTO_INCREMENT,
    id_loai_xe INT NOT NULL,
    id_loai_tuyen INT NOT NULL,
    thoi_gian_bat_dau_don TIME NOT NULL,
    thoi_gian_ket_thuc_don TIME NOT NULL,
    thoi_gian_bat_dau_tra TIME,
    thoi_gian_ket_thuc_tra TIME,
    id_nguoi_tao INT NOT NULL,
    id_nhom INT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trang_thai ENUM('cho_xac_nhan', 'da_xac_nhan', 'hoan_thanh', 'da_huy') DEFAULT 'cho_xac_nhan',
    FOREIGN KEY (id_loai_xe) REFERENCES loai_xe(id_loai_xe),
    FOREIGN KEY (id_loai_tuyen) REFERENCES loai_tuyen(id_loai_tuyen),
    FOREIGN KEY (id_nguoi_tao) REFERENCES nguoi_dung(id_nguoi_dung),
    FOREIGN KEY (id_nhom) REFERENCES nhom(id_nhom)
);

-- Bảng loại giao dịch
CREATE TABLE loai_giao_dich (
    id_loai_giao_dich INT PRIMARY KEY AUTO_INCREMENT,
    ten_loai VARCHAR(50) NOT NULL,
    yeu_cau_xac_nhan BOOLEAN DEFAULT FALSE
);

-- Bảng giao dịch
CREATE TABLE giao_dich (
    id_giao_dich INT PRIMARY KEY AUTO_INCREMENT,
    id_loai_giao_dich INT NOT NULL,
    id_nguoi_gui INT NOT NULL,
    id_nguoi_nhan INT,
    id_nhom INT NOT NULL,
    id_lich_xe INT,
    so_tien DECIMAL(12,2),
    diem INT,
    noi_dung TEXT,
    trang_thai ENUM('cho_xac_nhan', 'hoan_thanh', 'da_huy') DEFAULT 'cho_xac_nhan',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_hoan_thanh TIMESTAMP,
    FOREIGN KEY (id_loai_giao_dich) REFERENCES loai_giao_dich(id_loai_giao_dich),
    FOREIGN KEY (id_nguoi_gui) REFERENCES nguoi_dung(id_nguoi_dung),
    FOREIGN KEY (id_nguoi_nhan) REFERENCES nguoi_dung(id_nguoi_dung),
    FOREIGN KEY (id_nhom) REFERENCES nhom(id_nhom),
    FOREIGN KEY (id_lich_xe) REFERENCES lich_xe(id_lich_xe)
);

-- Bảng thông báo
CREATE TABLE thong_bao (
    id_thong_bao INT PRIMARY KEY AUTO_INCREMENT,
    id_nguoi_dung INT NOT NULL,
    id_giao_dich INT,
    noi_dung TEXT NOT NULL,
    da_doc BOOLEAN DEFAULT FALSE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_nguoi_dung) REFERENCES nguoi_dung(id_nguoi_dung),
    FOREIGN KEY (id_giao_dich) REFERENCES giao_dich(id_giao_dich)
);

-- Bảng báo cáo
CREATE TABLE bao_cao (
    id_bao_cao INT PRIMARY KEY AUTO_INCREMENT,
    id_nhom INT,
    ngay_bao_cao DATE NOT NULL,
    duong_dan_file VARCHAR(255) NOT NULL,
    ngay_tao_bao_cao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_nhom) REFERENCES nhom(id_nhom)
);

-- Thêm loại xe
INSERT INTO loai_xe (ten_loai, so_cho) VALUES
('4 chỗ', 4), ('5 chỗ', 5), ('7 chỗ', 7), ('16 chỗ', 16), ('29 chỗ', 29), ('45 chỗ', 45);

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
('Giao lịch', TRUE), ('Nhận lịch', TRUE), ('Hủy lịch', FALSE), ('San cho', FALSE), ('Nhận san', FALSE);

-- Thêm admin (mật khẩu: Admin@123)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai, la_admin) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'admin@company.com', 'Trần Quản Trị', '0987654321', TRUE);

-- Thêm thành viên (mật khẩu: User@123)
INSERT INTO nguoi_dung (ten_dang_nhap, mat_khau_hash, email, ho_ten, so_dien_thoai) VALUES
('nguyenvanA', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'nguyenvana@gmail.com', 'Nguyễn Văn A', '0912345678'),
('tranthiB', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'tranthib@yahoo.com', 'Trần Thị B', '0923456789'),
('phamvanC', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'phamvanc@gmail.com', 'Phạm Văn C', '0934567890');

-- Thêm nhóm
INSERT INTO nhom (ten_nhom) VALUES 
('Nhóm Xe Sân Bay'), ('Nhóm Xe Tỉnh'), ('Nhóm Xe Nội Thành');

-- Thêm thành viên vào nhóm
INSERT INTO thanh_vien_nhom (id_nguoi_dung, id_nhom) VALUES
(2, 1), (2, 2), (3, 1), (3, 3), (4, 2), (4, 3);

-- Thêm lịch xe
INSERT INTO lich_xe (id_loai_xe, id_loai_tuyen, thoi_gian_bat_dau_don, thoi_gian_ket_thuc_don, id_nguoi_tao, id_nhom) VALUES
(2, 1, '08:00:00', '08:30:00', 2, 1),
(3, 2, '14:00:00', '14:30:00', 3, 1),
(1, 3, '07:00:00', '07:30:00', 4, 2);

-- Thêm giao dịch
INSERT INTO giao_dich (id_loai_giao_dich, id_nguoi_gui, id_nguoi_nhan, id_nhom, id_lich_xe, so_tien, diem, trang_thai) VALUES
(1, 2, 3, 1, 1, 500000, 10, 'hoan_thanh'),
(2, 3, 2, 1, 1, 500000, 10, 'hoan_thanh'),
(4, 2, 4, 1, NULL, NULL, 5, 'hoan_thanh');