
-- Tắt kiểm tra khóa ngoại tạm thời để cho phép tạo bảng theo bất kỳ thứ tự nào
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS vien (
    ma_vien INT AUTO_INCREMENT PRIMARY KEY,
    ten_vien VARCHAR(255) UNIQUE NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS phong_ban (
    ma_phong_ban INT AUTO_INCREMENT PRIMARY KEY,
    ten_phong_ban VARCHAR(255) UNIQUE NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS danh_muc_chuc_danh (
    ma_chuc_danh INT AUTO_INCREMENT PRIMARY KEY,
    ma_chuc_danh_code VARCHAR(50) UNIQUE NOT NULL,
    ten_chuc_danh VARCHAR(255) NOT NULL,
    cap_bac INT NULL,
    mo_ta TEXT NULL,
    trang_thai ENUM('active', 'inactive') DEFAULT 'active',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS nhan_su (
    ma_nhan_su INT AUTO_INCREMENT PRIMARY KEY,
    ma_nhan_su_code VARCHAR(50) UNIQUE NOT NULL,
    ho_ten VARCHAR(255) NOT NULL,
    ngay_sinh DATE NULL,
    gioi_tinh ENUM('Nam', 'Nu', 'Khac') NULL,
    email VARCHAR(255) UNIQUE NULL,
    so_dien_thoai VARCHAR(50) NULL,
    dia_chi VARCHAR(500) NULL,
    ma_vien INT NOT NULL,
    ma_phong_ban INT NULL,
    ma_chuc_danh INT NOT NULL,
    trang_thai ENUM('active', 'inactive') DEFAULT 'active',
    ho_so_nang_luc JSON NULL,
    tai_lieu_minh_chung JSON NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ma_phong_ban) REFERENCES phong_ban(ma_phong_ban) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_chuc_danh) REFERENCES danh_muc_chuc_danh(ma_chuc_danh) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS nguoi_dung (
    ma_nguoi_dung INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    mat_khau_hash VARCHAR(255) NOT NULL,
    vai_tro ENUM('Super Admin', 'Cap Phong', 'Admin Vien/Vien truong', 'Ke toan Vien') NOT NULL,
    trang_thai ENUM('active', 'locked') DEFAULT 'active',
    ma_vien INT NULL,
    ma_phong_ban INT NULL,
    ho_ten VARCHAR(255) NULL,
    lan_dang_nhap_cuoi TIMESTAMP NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_phong_ban) REFERENCES phong_ban(ma_phong_ban) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS danh_muc_loai_hinh (
    ma_loai_hinh INT AUTO_INCREMENT PRIMARY KEY,
    ma_loai_hinh_code VARCHAR(50) UNIQUE NOT NULL,
    ten_hien_thi VARCHAR(255) NOT NULL,
    nhom_loai_hinh VARCHAR(100) NOT NULL,
    trang_thai ENUM('active', 'inactive') DEFAULT 'active',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS de_tai_nckh (
    ma_de_tai INT AUTO_INCREMENT PRIMARY KEY,
    ma_de_tai_code VARCHAR(100) UNIQUE NOT NULL,
    ten_de_tai VARCHAR(500) NOT NULL,
    ma_truong_de_tai INT NOT NULL,
    nguon_von VARCHAR(255) NULL,
    ngay_bat_dau DATE NOT NULL,
    ngay_ket_thuc_du_kien DATE NULL,
    muc_tieu TEXT NULL,
    mo_ta_ngan TEXT NULL,
    kinh_phi_duoc_duyet DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    kinh_phi_da_giai_ngan DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    trang_thai ENUM('Dang thuc hien', 'Cho nghiem thu', 'Da nghiem thu') DEFAULT 'Dang thuc hien',
    phan_tram_hoan_thanh DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    ngay_nghiem_thu_du_kien DATE NULL,
    ngay_nghiem_thu_thuc_te DATE NULL,
    ket_qua_nghiem_thu ENUM('Dat', 'Khong dat') NULL,
    cap_quan_ly ENUM('Truong', 'Bo', 'Khac') NULL,
    linh_vuc_nghien_cuu VARCHAR(255) NULL,
    ma_vien INT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_truong_de_tai) REFERENCES nhan_su(ma_nhan_su) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS nhan_su_tham_gia_de_tai (
    ma_nhan_su_de_tai INT AUTO_INCREMENT PRIMARY KEY,
    ma_de_tai INT NOT NULL,
    ma_nhan_su INT NOT NULL,
    vai_tro_trong_de_tai ENUM('Chu nhiem', 'Thanh vien', 'Cong tac vien') NOT NULL,
    loai_vai_tro ENUM('chinh', 'phu') NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_de_tai) REFERENCES de_tai_nckh(ma_de_tai) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ma_nhan_su) REFERENCES nhan_su(ma_nhan_su) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY (ma_de_tai, ma_nhan_su, vai_tro_trong_de_tai)
);

CREATE TABLE IF NOT EXISTS san_pham_nghien_cuu (
    ma_san_pham INT AUTO_INCREMENT PRIMARY KEY,
    ma_de_tai INT NOT NULL,
    mo_ta TEXT NOT NULL,
    so_luong INT NOT NULL DEFAULT 1,
    tinh_trang_cong_bo VARCHAR(255) NULL,
    tai_lieu JSON NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_de_tai) REFERENCES de_tai_nckh(ma_de_tai) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS thiet_bi (
    ma_thiet_bi INT AUTO_INCREMENT PRIMARY KEY,
    ma_tai_san VARCHAR(100) UNIQUE NOT NULL,
    ten_thiet_bi VARCHAR(255) NOT NULL,
    loai_thiet_bi ENUM('van phong', 'phong thi nghiem', 'co so vat chat', 'khac') NOT NULL,
    nam_mua INT NULL,
    ngay_mua DATE NULL,
    gia_tri_ban_dau DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    gia_tri_con_lai DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    tinh_trang VARCHAR(100) NOT NULL,
    ma_vien_quan_ly INT NOT NULL,
    ma_phong_ban_quan_ly INT NULL,
    so_luong INT NOT NULL DEFAULT 1,
    vi_tri_lap_dat VARCHAR(500) NULL,
    ma_phong_ban_su_dung INT NULL,
    ngay_kiem_ke_cuoi DATE NULL,
    tai_lieu JSON NULL,
    ngay_cap DATE NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_vien_quan_ly) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ma_phong_ban_quan_ly) REFERENCES phong_ban(ma_phong_ban) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_phong_ban_su_dung) REFERENCES phong_ban(ma_phong_ban) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS hop_dong (
    ma_hop_dong INT AUTO_INCREMENT PRIMARY KEY,
    so_hop_dong VARCHAR(100) UNIQUE NOT NULL,
    ten_hop_dong VARCHAR(500) NOT NULL,
    doi_tac VARCHAR(255) NULL,
    ma_nhan_su_chu_tri INT NULL,
    ma_loai_hop_dong INT NOT NULL,
    gia_tri_truoc_thue DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    phan_tram_vat DECIMAL(5, 2) NULL,
    so_tien_vat DECIMAL(20, 2) NULL,
    ngay_ky DATE NOT NULL,
    ngay_thanh_toan_du_kien DATE NULL,
    trang_thai_tien_do ENUM('Moi', 'Dang thuc hien', 'Hoan thanh', 'Qua han', 'Dong') DEFAULT 'Moi',
    tai_lieu JSON NULL,
    ma_de_tai_lien_quan INT NULL,
    ma_vien INT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_nhan_su_chu_tri) REFERENCES nhan_su(ma_nhan_su) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_loai_hop_dong) REFERENCES danh_muc_loai_hinh(ma_loai_hinh) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ma_de_tai_lien_quan) REFERENCES de_tai_nckh(ma_de_tai) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS bao_cao_dinh_ky (
    ma_bao_cao INT AUTO_INCREMENT PRIMARY KEY,
    ky_bao_cao ENUM('H1', 'H2') NOT NULL,
    nam_bao_cao INT NOT NULL,
    ma_vien INT NOT NULL,
    loai_bao_cao ENUM('research_topics', 'financial', 'equipment') NOT NULL,
    trang_thai ENUM('Nhap', 'Dang duyet', 'Da duyet/Chot', 'Tra ve') DEFAULT 'Nhap',
    ma_nguoi_dung_gui INT NULL,
    ngay_gui TIMESTAMP NULL,
    ma_nguoi_dung_duyet INT NULL,
    ngay_duyet TIMESTAMP NULL,
    ly_do_tra_lai TEXT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ma_nguoi_dung_gui) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_nguoi_dung_duyet) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL ON UPDATE CASCADE,
    UNIQUE KEY (ky_bao_cao, nam_bao_cao, ma_vien, loai_bao_cao)
);

CREATE TABLE IF NOT EXISTS chi_tiet_bao_cao_de_tai (
    ma_chi_tiet_bao_cao INT AUTO_INCREMENT PRIMARY KEY,
    ma_bao_cao INT NOT NULL,
    ma_de_tai INT NULL,
    ma_de_tai_bao_cao VARCHAR(100) NOT NULL,
    ten_de_tai_bao_cao VARCHAR(500) NOT NULL,
    ma_truong_de_tai_bao_cao INT NULL,
    cap_quan_ly_bao_cao ENUM('Truong', 'Bo', 'Khac') NULL,
    linh_vuc_bao_cao VARCHAR(255) NULL,
    nam_bat_dau_bao_cao INT NULL,
    nam_ket_thuc_bao_cao INT NULL,
    trang_thai_bao_cao ENUM('Dang thuc hien', 'Cho nghiem thu', 'Da nghiem thu') NULL,
    phan_tram_tien_do_bao_cao DECIMAL(5, 2) NULL,
    ngay_nghiem_thu_du_kien_bao_cao DATE NULL,
    ngay_nghiem_thu_thuc_te_bao_cao DATE NULL,
    kinh_phi_duoc_duyet_bao_cao DECIMAL(20, 2) NULL,
    nguon_tai_tro_bao_cao VARCHAR(255) NULL,
    so_tien_giai_ngan_bao_cao DECIMAL(20, 2) NULL,
    mo_ta_san_pham_bao_cao TEXT NULL,
    so_luong_san_pham_bao_cao INT NULL,
    tinh_trang_cong_bo_bao_cao VARCHAR(255) NULL,
    tai_lieu JSON NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_bao_cao) REFERENCES bao_cao_dinh_ky(ma_bao_cao) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ma_de_tai) REFERENCES de_tai_nckh(ma_de_tai) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_truong_de_tai_bao_cao) REFERENCES nhan_su(ma_nhan_su) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS nhan_su_bao_cao_de_tai (
    ma_nhan_su_bao_cao_de_tai INT AUTO_INCREMENT PRIMARY KEY,
    ma_chi_tiet_bao_cao INT NOT NULL,
    ma_nhan_su INT NULL,
    ho_ten_bao_cao VARCHAR(255) NOT NULL,
    chuc_danh_bao_cao VARCHAR(255) NULL,
    vai_tro_trong_de_tai_bao_cao ENUM('Chu nhiem', 'Thanh vien', 'Cong tac vien') NOT NULL,
    loai_vai_tro_bao_cao ENUM('chinh', 'phu') NULL,
    don_vi_cong_tac_bao_cao VARCHAR(255) NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_chi_tiet_bao_cao) REFERENCES chi_tiet_bao_cao_de_tai(ma_chi_tiet_bao_cao) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ma_nhan_su) REFERENCES nhan_su(ma_nhan_su) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS danh_muc_loai_thue (
    ma_loai_thue INT AUTO_INCREMENT PRIMARY KEY,
    ma_thue VARCHAR(50) UNIQUE NOT NULL,
    ten_thue VARCHAR(255) NOT NULL,
    cong_thuc_tinh TEXT NULL,
    trang_thai ENUM('active', 'inactive') DEFAULT 'active',
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chi_tiet_bao_cao_tai_chinh (
    ma_bao_cao_tai_chinh INT AUTO_INCREMENT PRIMARY KEY,
    ma_bao_cao INT NOT NULL,
    ma_loai_doanh_thu INT NOT NULL,
    so_tien_doanh_thu_bao_cao DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    so_tien_nop_ve_truong_bao_cao DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_bao_cao) REFERENCES bao_cao_dinh_ky(ma_bao_cao) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ma_loai_doanh_thu) REFERENCES danh_muc_loai_hinh(ma_loai_hinh) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY (ma_bao_cao, ma_loai_doanh_thu)
);

CREATE TABLE IF NOT EXISTS chi_tiet_thue_bao_cao (
    ma_bao_cao_thue_tai_chinh INT AUTO_INCREMENT PRIMARY KEY,
    ma_bao_cao INT NOT NULL,
    ma_loai_thue INT NOT NULL,
    so_tien_thue_bao_cao DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    tai_lieu_bien_lai_thue JSON NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_bao_cao) REFERENCES bao_cao_dinh_ky(ma_bao_cao) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ma_loai_thue) REFERENCES danh_muc_loai_thue(ma_loai_thue) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY (ma_bao_cao, ma_loai_thue)
);

CREATE TABLE IF NOT EXISTS chi_tiet_hop_dong_bao_cao (
    ma_bao_cao_hop_dong_tai_chinh INT AUTO_INCREMENT PRIMARY KEY,
    ma_bao_cao INT NOT NULL,
    ma_hop_dong INT NULL,
    ten_hop_dong_bao_cao VARCHAR(500) NOT NULL,
    so_hop_dong_bao_cao VARCHAR(100) NOT NULL,
    chu_tri_bao_cao VARCHAR(255) NULL,
    gia_tri_bao_cao DECIMAL(20, 2) NULL,
    ngay_thanh_toan_bao_cao DATE NULL,
    doanh_thu_truoc_thue_bao_cao DECIMAL(20, 2) NULL,
    vat_bao_cao DECIMAL(20, 2) NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_bao_cao) REFERENCES bao_cao_dinh_ky(ma_bao_cao) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ma_hop_dong) REFERENCES hop_dong(ma_hop_dong) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS chi_tiet_cong_no_bao_cao (
    ma_bao_cao_cong_no_tai_chinh INT AUTO_INCREMENT PRIMARY KEY,
    ma_bao_cao INT NOT NULL,
    ma_hop_dong INT NULL,
    no_phai_thu_bao_cao DECIMAL(20, 2) NULL,
    da_thu_bao_cao DECIMAL(20, 2) NULL,
    con_no_bao_cao DECIMAL(20, 2) NULL,
    han_thanh_toan_bao_cao DATE NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_bao_cao) REFERENCES bao_cao_dinh_ky(ma_bao_cao) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ma_hop_dong) REFERENCES hop_dong(ma_hop_dong) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS chi_tiet_chung_tu_bao_cao (
    ma_bao_cao_chung_tu_tai_chinh INT AUTO_INCREMENT PRIMARY KEY,
    ma_bao_cao INT NOT NULL,
    loai_chung_tu VARCHAR(100) NULL,
    duong_dan_file VARCHAR(500) NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_bao_cao) REFERENCES bao_cao_dinh_ky(ma_bao_cao) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS chi_tiet_thiet_bi_bao_cao (
    ma_bao_cao_thiet_bi INT AUTO_INCREMENT PRIMARY KEY,
    ma_bao_cao INT NOT NULL,
    ma_thiet_bi INT NULL,
    ma_tai_san_bao_cao VARCHAR(100) NOT NULL,
    ten_thiet_bi_bao_cao VARCHAR(255) NOT NULL,
    nam_mua_bao_cao INT NULL,
    gia_tri_ban_dau_bao_cao DECIMAL(20, 2) NULL,
    gia_tri_con_lai_bao_cao DECIMAL(20, 2) NULL,
    tinh_trang_bao_cao VARCHAR(100) NULL,
    ma_vien_quan_ly_bao_cao INT NULL,
    ma_phong_ban_quan_ly_bao_cao INT NULL,
    ngay_cap_bao_cao DATE NULL,
    vi_tri_lap_dat_bao_cao VARCHAR(500) NULL,
    ma_phong_ban_su_dung_bao_cao INT NULL,
    tai_lieu JSON NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_bao_cao) REFERENCES bao_cao_dinh_ky(ma_bao_cao) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ma_thiet_bi) REFERENCES thiet_bi(ma_thiet_bi) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_vien_quan_ly_bao_cao) REFERENCES vien(ma_vien) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_phong_ban_quan_ly_bao_cao) REFERENCES phong_ban(ma_phong_ban) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_phong_ban_su_dung_bao_cao) REFERENCES phong_ban(ma_phong_ban) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS doanh_thu (
    ma_doanh_thu INT AUTO_INCREMENT PRIMARY KEY,
    ma_hop_dong INT NULL,
    ma_de_tai INT NULL,
    ma_loai_doanh_thu INT NOT NULL,
    so_tien_truoc_thue DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    so_tien_vat DECIMAL(20, 2) NULL,
    ngay_ghi_nhan_doanh_thu DATE NOT NULL,
    nguon_doanh_thu ENUM('contract', 'research_topic', 'other_mobilization') NOT NULL,
    tai_lieu JSON NULL,
    ma_vien INT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_hop_dong) REFERENCES hop_dong(ma_hop_dong) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_de_tai) REFERENCES de_tai_nckh(ma_de_tai) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_loai_doanh_thu) REFERENCES danh_muc_loai_hinh(ma_loai_hinh) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS thue (
    ma_thue INT AUTO_INCREMENT PRIMARY KEY,
    ma_hop_dong INT NULL,
    ma_doanh_thu INT NULL,
    ma_loai_thue INT NOT NULL,
    so_tien_thue DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    ngay_nop_thue DATE NOT NULL,
    tai_lieu_bien_lai_thue JSON NULL,
    ma_vien INT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_hop_dong) REFERENCES hop_dong(ma_hop_dong) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_doanh_thu) REFERENCES doanh_thu(ma_doanh_thu) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (ma_loai_thue) REFERENCES danh_muc_loai_thue(ma_loai_thue) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS cong_no (
    ma_cong_no INT AUTO_INCREMENT PRIMARY KEY,
    ma_hop_dong INT NOT NULL,
    loai_cong_no ENUM('receivable', 'payable') NOT NULL,
    tong_so_tien DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    so_tien_da_thanh_toan DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    so_tien_con_no DECIMAL(20, 2) AS (tong_so_tien - so_tien_da_thanh_toan) STORED,
    han_thanh_toan DATE NULL,
    trang_thai ENUM('due', 'overdue', 'paid', 'partially_paid') DEFAULT 'due',
    ma_vien INT NOT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_hop_dong) REFERENCES hop_dong(ma_hop_dong) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS lich_su_thanh_toan_cong_no (
    ma_thanh_toan_cong_no INT AUTO_INCREMENT PRIMARY KEY,
    ma_cong_no INT NOT NULL,
    ngay_thanh_toan DATE NOT NULL,
    so_tien_thanh_toan DECIMAL(20, 2) NOT NULL,
    tai_lieu_thanh_toan JSON NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_cong_no) REFERENCES cong_no(ma_cong_no) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS ngan_sach (
    ma_ngan_sach INT AUTO_INCREMENT PRIMARY KEY,
    ma_vien INT NOT NULL,
    ky_ngan_sach ENUM('H1', 'H2') NOT NULL,
    nam_ngan_sach INT NOT NULL,
    tong_ngan_sach_duoc_duyet DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    hang_muc_chi_phi VARCHAR(255) NOT NULL,
    so_tien_du_toan DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    so_tien_thuc_chi DECIMAL(20, 2) NOT NULL DEFAULT 0.00,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_vien) REFERENCES vien(ma_vien) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY (ma_vien, ky_ngan_sach, nam_ngan_sach, hang_muc_chi_phi)
);

CREATE TABLE IF NOT EXISTS cau_hinh_ty_le_nop (
    ma_ty_le INT AUTO_INCREMENT PRIMARY KEY,
    ma_loai_doanh_thu INT NOT NULL,
    ty_le_phan_tram DECIMAL(5, 2) NOT NULL,
    ngay_bat_dau_hieu_luc DATE NOT NULL,
    ngay_ket_thuc_hieu_luc DATE NULL,
    ghi_chu TEXT NULL,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ma_loai_doanh_thu) REFERENCES danh_muc_loai_hinh(ma_loai_hinh) ON DELETE RESTRICT ON UPDATE CASCADE,
    UNIQUE KEY (ma_loai_doanh_thu, ngay_bat_dau_hieu_luc)
);

CREATE TABLE IF NOT EXISTS nhat_ky_hoat_dong (
    ma_nhat_ky INT AUTO_INCREMENT PRIMARY KEY,
    thoi_gian_ghi_nhan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ma_nguoi_dung INT NULL,
    dia_chi_ip VARCHAR(45) NULL,
    thong_tin_thiet_bi VARCHAR(255) NULL,
    loai_hanh_dong VARCHAR(100) NOT NULL,
    doi_tuong_tac_dong VARCHAR(100) NOT NULL,
    ma_ban_ghi_tac_dong INT NULL,
    gia_tri_cu JSON NULL,
    gia_tri_moi JSON NULL,
    mo_ta TEXT NULL,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS lich_su_import_export (
    ma_lich_su INT AUTO_INCREMENT PRIMARY KEY,
    thoi_gian_thuc_hien TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ma_nguoi_dung INT NULL,
    loai_thao_tac ENUM('import', 'export') NOT NULL,
    ten_module VARCHAR(100) NOT NULL,
    ten_file VARCHAR(255) NULL,
    dinh_dang_file ENUM('Excel', 'CSV', 'PDF') NULL,
    trang_thai ENUM('success', 'failed', 'processing') NOT NULL,
    so_ban_ghi_da_xu_ly INT NULL,
    chi_tiet_loi JSON NULL,
    ma_lo VARCHAR(255) NULL,
    tieu_chi_loc JSON NULL,
    FOREIGN KEY (ma_nguoi_dung) REFERENCES nguoi_dung(ma_nguoi_dung) ON DELETE SET NULL ON UPDATE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;