-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Aug 25, 2025 at 02:03 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quanlydiem`
--

-- --------------------------------------------------------

--
-- Table structure for table `bao_cao`
--

CREATE TABLE `bao_cao` (
  `id_bao_cao` int(11) NOT NULL,
  `id_nhom` int(11) DEFAULT NULL,
  `ngay_bao_cao` date NOT NULL,
  `duong_dan_file` varchar(255) NOT NULL,
  `ngay_tao_bao_cao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `giao_dich`
--

CREATE TABLE `giao_dich` (
  `id_giao_dich` int(11) NOT NULL,
  `id_loai_giao_dich` int(11) NOT NULL,
  `id_nguoi_gui` int(11) DEFAULT NULL,
  `id_nguoi_nhan` int(11) DEFAULT NULL,
  `id_nhom` int(11) NOT NULL,
  `id_lich_xe` int(11) DEFAULT NULL,
  `so_tien` decimal(12,2) DEFAULT NULL,
  `diem` decimal(12,4) DEFAULT 0.0000,
  `noi_dung` text DEFAULT NULL,
  `trang_thai` enum('cho_xac_nhan','hoan_thanh','da_huy') DEFAULT 'cho_xac_nhan',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_hoan_thanh` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `lich_xe`
--

CREATE TABLE `lich_xe` (
  `id_lich_xe` int(11) NOT NULL,
  `id_loai_xe` int(11) NOT NULL,
  `id_loai_tuyen` int(11) NOT NULL,
  `thoi_gian_bat_dau_don` datetime NOT NULL,
  `thoi_gian_ket_thuc_don` datetime NOT NULL,
  `thoi_gian_bat_dau_tra` datetime DEFAULT NULL,
  `thoi_gian_ket_thuc_tra` datetime DEFAULT NULL,
  `id_nguoi_tao` int(11) NOT NULL,
  `id_nhom` int(11) NOT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `trang_thai` enum('cho_xac_nhan','da_xac_nhan','hoan_thanh','da_huy') DEFAULT 'cho_xac_nhan',
  `id_nguoi_nhan` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `loai_giao_dich`
--

CREATE TABLE `loai_giao_dich` (
  `id_loai_giao_dich` int(11) NOT NULL,
  `ten_loai` varchar(50) NOT NULL,
  `yeu_cau_xac_nhan` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loai_giao_dich`
--

INSERT INTO `loai_giao_dich` (`id_loai_giao_dich`, `ten_loai`, `yeu_cau_xac_nhan`) VALUES
(1, 'Giao lịch', 1),
(2, 'Nhận lịch', 1),
(3, 'Hủy lịch', 0),
(4, 'San cho', 0),
(5, 'Nhận san', 0);

-- --------------------------------------------------------

--
-- Table structure for table `loai_tuyen`
--

CREATE TABLE `loai_tuyen` (
  `id_loai_tuyen` int(11) NOT NULL,
  `ten_loai` varchar(100) NOT NULL,
  `la_khu_hoi` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loai_tuyen`
--

INSERT INTO `loai_tuyen` (`id_loai_tuyen`, `ten_loai`, `la_khu_hoi`) VALUES
(1, 'Đón Sân bay - Hà Nội', 0),
(2, 'Tiễn Hà Nội - Sân bay', 0),
(3, 'Lịch Phố 1 Chiều', 0),
(4, 'Lịch Phố 2 Chiều', 1),
(5, 'Lịch Tỉnh/Huyện 1 Chiều', 0),
(6, 'Lịch Tỉnh/Huyện 2 Chiều', 1),
(7, 'Lịch Hướng Sân Bay (Bán kính 5km)', 0);

-- --------------------------------------------------------

--
-- Table structure for table `loai_xe`
--

CREATE TABLE `loai_xe` (
  `id_loai_xe` int(11) NOT NULL,
  `ten_loai` varchar(50) NOT NULL,
  `so_cho` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `loai_xe`
--

INSERT INTO `loai_xe` (`id_loai_xe`, `ten_loai`, `so_cho`) VALUES
(1, '4 chỗ', 4),
(2, '5 chỗ', 5),
(3, '7 chỗ', 7),
(4, '16 chỗ', 16),
(5, '29 chỗ', 29),
(6, '45 chỗ', 45);

-- --------------------------------------------------------

--
-- Table structure for table `nguoi_dung`
--

CREATE TABLE `nguoi_dung` (
  `id_nguoi_dung` int(11) NOT NULL,
  `ten_dang_nhap` varchar(50) NOT NULL,
  `mat_khau_hash` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `so_dien_thoai` varchar(20) DEFAULT NULL,
  `dia_chi` text DEFAULT NULL,
  `so_du` decimal(12,2) DEFAULT 0.00,
  `diem` decimal(12,4) DEFAULT 0.0000,
  `la_admin` tinyint(1) DEFAULT 0,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id_nguoi_dung`, `ten_dang_nhap`, `mat_khau_hash`, `email`, `ho_ten`, `so_dien_thoai`, `dia_chi`, `so_du`, `diem`, `la_admin`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'admin', '$2a$12$Mte75pD0aoir0x7kYMGs0uG1YGvjIrtC7gR4uCLhhq.RKTCSpYE4S', 'admin@company.com', 'Trần Quản Trị', '0987654321', NULL, 1000000.00, 10.0000, 1, '2025-08-20 08:32:05', '2025-08-24 15:49:46'),
(2, 'nguyenvanA', '$2a$12$dzWcobCrPlIA04tAEx.3m.WkjI3y56SoFL.L4CXgAYIJy6Y9/o7i.', 'nguyenvana@gmail.com', 'Nguyễn Văn A', '0912345678', NULL, 1000000.00, 10.0000, 0, '2025-08-20 08:32:05', '2025-08-25 00:03:42'),
(3, 'tranthiB', '$2a$12$dzWcobCrPlIA04tAEx.3m.WkjI3y56SoFL.L4CXgAYIJy6Y9/o7i.', 'tranthib@yahoo.com', 'Trần Thị B', '0923456789', NULL, 1000000.00, 10.0000, 0, '2025-08-20 08:32:05', '2025-08-24 15:49:46'),
(4, 'phamvanC', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'phamvanc@gmail.com', 'Phạm Văn C', '0934567890', NULL, 1000000.00, 10.0000, 0, '2025-08-20 08:32:05', '2025-08-25 00:03:32');

-- --------------------------------------------------------

--
-- Table structure for table `nhom`
--

CREATE TABLE `nhom` (
  `id_nhom` int(11) NOT NULL,
  `ten_nhom` varchar(100) NOT NULL,
  `mo_ta` text DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nhom`
--

INSERT INTO `nhom` (`id_nhom`, `ten_nhom`, `mo_ta`, `ngay_tao`) VALUES
(1, 'Nhóm Xe Sân Bay', NULL, '2025-08-20 08:32:05'),
(2, 'Nhóm Xe Tỉnh', NULL, '2025-08-20 08:32:05'),
(3, 'Nhóm Xe Nội Thành', NULL, '2025-08-20 08:32:05');

-- --------------------------------------------------------

--
-- Table structure for table `thanh_vien_nhom`
--

CREATE TABLE `thanh_vien_nhom` (
  `id_thanh_vien` int(11) NOT NULL,
  `id_nguoi_dung` int(11) NOT NULL,
  `id_nhom` int(11) NOT NULL,
  `ngay_tham_gia` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `thanh_vien_nhom`
--

INSERT INTO `thanh_vien_nhom` (`id_thanh_vien`, `id_nguoi_dung`, `id_nhom`, `ngay_tham_gia`) VALUES
(1, 2, 1, '2025-08-20 08:32:05'),
(3, 3, 1, '2025-08-20 08:32:05'),
(4, 3, 3, '2025-08-20 08:32:05'),
(5, 4, 2, '2025-08-20 08:32:05'),
(6, 4, 3, '2025-08-20 08:32:05');

-- --------------------------------------------------------

--
-- Table structure for table `thong_bao`
--

CREATE TABLE `thong_bao` (
  `id_thong_bao` int(11) NOT NULL,
  `id_nguoi_dung` int(11) NOT NULL,
  `id_giao_dich` int(11) DEFAULT NULL,
  `noi_dung` text NOT NULL,
  `da_doc` tinyint(1) DEFAULT 0,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bao_cao`
--
ALTER TABLE `bao_cao`
  ADD PRIMARY KEY (`id_bao_cao`),
  ADD KEY `id_nhom` (`id_nhom`);

--
-- Indexes for table `giao_dich`
--
ALTER TABLE `giao_dich`
  ADD PRIMARY KEY (`id_giao_dich`),
  ADD KEY `id_loai_giao_dich` (`id_loai_giao_dich`),
  ADD KEY `id_nguoi_gui` (`id_nguoi_gui`),
  ADD KEY `id_nguoi_nhan` (`id_nguoi_nhan`),
  ADD KEY `id_nhom` (`id_nhom`),
  ADD KEY `id_lich_xe` (`id_lich_xe`);

--
-- Indexes for table `lich_xe`
--
ALTER TABLE `lich_xe`
  ADD PRIMARY KEY (`id_lich_xe`),
  ADD KEY `id_loai_xe` (`id_loai_xe`),
  ADD KEY `id_loai_tuyen` (`id_loai_tuyen`),
  ADD KEY `id_nguoi_tao` (`id_nguoi_tao`),
  ADD KEY `id_nhom` (`id_nhom`),
  ADD KEY `idx_lich_xe_nguoi_nhan` (`id_nguoi_nhan`);

--
-- Indexes for table `loai_giao_dich`
--
ALTER TABLE `loai_giao_dich`
  ADD PRIMARY KEY (`id_loai_giao_dich`);

--
-- Indexes for table `loai_tuyen`
--
ALTER TABLE `loai_tuyen`
  ADD PRIMARY KEY (`id_loai_tuyen`);

--
-- Indexes for table `loai_xe`
--
ALTER TABLE `loai_xe`
  ADD PRIMARY KEY (`id_loai_xe`);

--
-- Indexes for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  ADD PRIMARY KEY (`id_nguoi_dung`),
  ADD UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `nhom`
--
ALTER TABLE `nhom`
  ADD PRIMARY KEY (`id_nhom`);

--
-- Indexes for table `thanh_vien_nhom`
--
ALTER TABLE `thanh_vien_nhom`
  ADD PRIMARY KEY (`id_thanh_vien`),
  ADD UNIQUE KEY `id_nguoi_dung` (`id_nguoi_dung`,`id_nhom`),
  ADD KEY `id_nhom` (`id_nhom`);

--
-- Indexes for table `thong_bao`
--
ALTER TABLE `thong_bao`
  ADD PRIMARY KEY (`id_thong_bao`),
  ADD KEY `id_nguoi_dung` (`id_nguoi_dung`),
  ADD KEY `id_giao_dich` (`id_giao_dich`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bao_cao`
--
ALTER TABLE `bao_cao`
  MODIFY `id_bao_cao` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `giao_dich`
--
ALTER TABLE `giao_dich`
  MODIFY `id_giao_dich` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT for table `lich_xe`
--
ALTER TABLE `lich_xe`
  MODIFY `id_lich_xe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `loai_giao_dich`
--
ALTER TABLE `loai_giao_dich`
  MODIFY `id_loai_giao_dich` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `loai_tuyen`
--
ALTER TABLE `loai_tuyen`
  MODIFY `id_loai_tuyen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `loai_xe`
--
ALTER TABLE `loai_xe`
  MODIFY `id_loai_xe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `nguoi_dung`
--
ALTER TABLE `nguoi_dung`
  MODIFY `id_nguoi_dung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `nhom`
--
ALTER TABLE `nhom`
  MODIFY `id_nhom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `thanh_vien_nhom`
--
ALTER TABLE `thanh_vien_nhom`
  MODIFY `id_thanh_vien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `thong_bao`
--
ALTER TABLE `thong_bao`
  MODIFY `id_thong_bao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=187;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bao_cao`
--
ALTER TABLE `bao_cao`
  ADD CONSTRAINT `bao_cao_ibfk_1` FOREIGN KEY (`id_nhom`) REFERENCES `nhom` (`id_nhom`);

--
-- Constraints for table `giao_dich`
--
ALTER TABLE `giao_dich`
  ADD CONSTRAINT `giao_dich_ibfk_1` FOREIGN KEY (`id_loai_giao_dich`) REFERENCES `loai_giao_dich` (`id_loai_giao_dich`),
  ADD CONSTRAINT `giao_dich_ibfk_2` FOREIGN KEY (`id_nguoi_gui`) REFERENCES `nguoi_dung` (`id_nguoi_dung`),
  ADD CONSTRAINT `giao_dich_ibfk_3` FOREIGN KEY (`id_nguoi_nhan`) REFERENCES `nguoi_dung` (`id_nguoi_dung`),
  ADD CONSTRAINT `giao_dich_ibfk_4` FOREIGN KEY (`id_nhom`) REFERENCES `nhom` (`id_nhom`),
  ADD CONSTRAINT `giao_dich_ibfk_5` FOREIGN KEY (`id_lich_xe`) REFERENCES `lich_xe` (`id_lich_xe`);

--
-- Constraints for table `lich_xe`
--
ALTER TABLE `lich_xe`
  ADD CONSTRAINT `fk_lich_xe_nguoi_nhan` FOREIGN KEY (`id_nguoi_nhan`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE SET NULL,
  ADD CONSTRAINT `lich_xe_ibfk_1` FOREIGN KEY (`id_loai_xe`) REFERENCES `loai_xe` (`id_loai_xe`),
  ADD CONSTRAINT `lich_xe_ibfk_2` FOREIGN KEY (`id_loai_tuyen`) REFERENCES `loai_tuyen` (`id_loai_tuyen`),
  ADD CONSTRAINT `lich_xe_ibfk_3` FOREIGN KEY (`id_nguoi_tao`) REFERENCES `nguoi_dung` (`id_nguoi_dung`),
  ADD CONSTRAINT `lich_xe_ibfk_4` FOREIGN KEY (`id_nhom`) REFERENCES `nhom` (`id_nhom`);

--
-- Constraints for table `thanh_vien_nhom`
--
ALTER TABLE `thanh_vien_nhom`
  ADD CONSTRAINT `thanh_vien_nhom_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE CASCADE,
  ADD CONSTRAINT `thanh_vien_nhom_ibfk_2` FOREIGN KEY (`id_nhom`) REFERENCES `nhom` (`id_nhom`) ON DELETE CASCADE;

--
-- Constraints for table `thong_bao`
--
ALTER TABLE `thong_bao`
  ADD CONSTRAINT `thong_bao_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`),
  ADD CONSTRAINT `thong_bao_ibfk_2` FOREIGN KEY (`id_giao_dich`) REFERENCES `giao_dich` (`id_giao_dich`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
