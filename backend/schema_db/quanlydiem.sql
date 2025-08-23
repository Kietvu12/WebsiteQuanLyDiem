-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 23, 2025 at 04:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
  `diem` int(11) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `trang_thai` enum('cho_xac_nhan','hoan_thanh','da_huy') DEFAULT 'cho_xac_nhan',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_hoan_thanh` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `giao_dich`
--

INSERT INTO `giao_dich` (`id_giao_dich`, `id_loai_giao_dich`, `id_nguoi_gui`, `id_nguoi_nhan`, `id_nhom`, `id_lich_xe`, `so_tien`, `diem`, `noi_dung`, `trang_thai`, `ngay_tao`, `ngay_hoan_thanh`) VALUES
(1, 1, 2, 3, 1, 1, 500000.00, 10, NULL, 'hoan_thanh', '2025-08-20 08:32:05', '0000-00-00 00:00:00'),
(2, 2, 3, 2, 1, 1, 500000.00, 10, NULL, 'hoan_thanh', '2025-08-20 08:32:05', '0000-00-00 00:00:00'),
(3, 4, 2, 4, 1, NULL, NULL, 5, NULL, 'hoan_thanh', '2025-08-20 08:32:05', '0000-00-00 00:00:00'),
(4, 1, 1, 2, 1, 4, 23131.00, 312313, '1312', 'cho_xac_nhan', '2025-08-21 11:25:52', '0000-00-00 00:00:00'),
(5, 1, 1, 3, 1, 5, 132.00, 32131, '1231', 'hoan_thanh', '2025-08-21 13:17:00', '2025-08-21 15:06:45'),
(6, 1, 1, 3, 1, 6, 12121.00, 12112, '32133', 'hoan_thanh', '2025-08-21 14:27:15', '2025-08-21 15:49:42'),
(7, 1, 1, 3, 1, 7, 121313.00, 31123213, 'qewe', 'hoan_thanh', '2025-08-21 14:37:57', '2025-08-21 14:58:37'),
(8, 1, 1, 3, 1, 8, 11111.00, 3332, '132', 'da_huy', '2025-08-21 23:23:12', '2025-08-21 23:27:10'),
(9, 4, 1, 3, 1, NULL, 121444.00, 1211, '12212', 'cho_xac_nhan', '2025-08-21 23:28:49', '0000-00-00 00:00:00'),
(10, 1, 1, 3, 1, 9, 343222.00, 1212, 'adads', 'hoan_thanh', '2025-08-21 23:37:48', '2025-08-21 23:38:01'),
(11, 1, 1, 3, 1, 10, 3213.00, 13123, '12221', 'da_huy', '2025-08-22 03:17:13', '2025-08-23 02:41:50'),
(12, 2, 3, 1, 1, 10, -3213.00, -13123, 'Nhận lịch: 12221', 'da_huy', '2025-08-22 03:17:13', '2025-08-23 02:41:50'),
(13, 1, 1, 3, 1, 11, 113244.00, 31213, 'qưewqeqe', 'hoan_thanh', '2025-08-22 03:48:30', '2025-08-22 03:48:38'),
(14, 2, 3, 1, 1, 11, -113244.00, -31213, 'Nhận lịch: qưewqeqe', 'hoan_thanh', '2025-08-22 03:48:30', '2025-08-22 03:48:38'),
(15, 4, 1, 3, 1, NULL, 400000.00, 12212, '13122131', 'hoan_thanh', '2025-08-22 08:24:04', '0000-00-00 00:00:00'),
(16, 5, 3, 1, 1, NULL, -400000.00, -12212, 'Nhận san: 13122131', 'hoan_thanh', '2025-08-22 08:24:05', '0000-00-00 00:00:00'),
(17, 4, 1, 3, 1, NULL, 300000.00, 1, '122', 'hoan_thanh', '2025-08-22 08:25:21', '0000-00-00 00:00:00'),
(18, 5, 3, 1, 1, NULL, -300000.00, -1, 'Nhận san: 122', 'hoan_thanh', '2025-08-22 08:25:21', '0000-00-00 00:00:00'),
(19, 4, 1, 3, 1, NULL, 300000.00, 1, '111', 'hoan_thanh', '2025-08-22 08:34:11', '0000-00-00 00:00:00'),
(20, 5, 3, 1, 1, NULL, -300000.00, -1, 'Nhận san: 111', 'hoan_thanh', '2025-08-22 08:34:11', '0000-00-00 00:00:00'),
(21, 1, 1, 3, 1, NULL, 500000.00, 1, '`11132', 'hoan_thanh', '2025-08-23 02:26:56', '2025-08-23 02:29:18'),
(22, 2, 3, 1, 1, NULL, -500000.00, -1, 'Nhận lịch: `11132', 'hoan_thanh', '2025-08-23 02:26:56', '2025-08-23 02:29:18'),
(23, 1, 1, 3, 1, NULL, 502000.00, 1, '123131', 'cho_xac_nhan', '2025-08-23 02:34:53', '0000-00-00 00:00:00'),
(24, 2, 3, 1, 1, NULL, -502000.00, -1, 'Nhận lịch: 123131', 'cho_xac_nhan', '2025-08-23 02:34:53', '0000-00-00 00:00:00'),
(25, 1, 1, 3, 1, NULL, 400000.00, 1, '1112', 'cho_xac_nhan', '2025-08-23 02:38:01', '0000-00-00 00:00:00'),
(26, 2, 3, 1, 1, NULL, -400000.00, -1, 'Nhận lịch: 1112', 'cho_xac_nhan', '2025-08-23 02:38:01', '0000-00-00 00:00:00'),
(27, 3, 1, NULL, 1, 10, 0.00, 0, 'Hủy lịch xe - Hoàn tiền/điểm cho người nhận lịch', 'hoan_thanh', '2025-08-23 02:41:50', '0000-00-00 00:00:00');

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

--
-- Dumping data for table `lich_xe`
--

INSERT INTO `lich_xe` (`id_lich_xe`, `id_loai_xe`, `id_loai_tuyen`, `thoi_gian_bat_dau_don`, `thoi_gian_ket_thuc_don`, `thoi_gian_bat_dau_tra`, `thoi_gian_ket_thuc_tra`, `id_nguoi_tao`, `id_nhom`, `ngay_tao`, `trang_thai`, `id_nguoi_nhan`) VALUES
(1, 2, 1, '2025-08-22 08:00:00', '2025-08-22 08:30:00', NULL, NULL, 2, 1, '2025-08-20 08:32:05', 'da_huy', 3),
(2, 3, 2, '2025-08-22 14:00:00', '2025-08-22 14:30:00', NULL, NULL, 3, 1, '2025-08-20 08:32:05', 'da_huy', NULL),
(3, 1, 3, '2025-08-22 07:00:00', '2025-08-22 07:30:00', NULL, NULL, 4, 2, '2025-08-20 08:32:05', 'cho_xac_nhan', NULL),
(4, 4, 2, '2025-08-22 18:25:00', '2025-08-22 18:25:00', '2025-08-22 18:25:00', '2025-08-22 18:25:00', 1, 1, '2025-08-21 11:25:52', 'da_huy', 2),
(5, 4, 2, '2025-08-22 20:16:00', '2025-08-22 20:16:00', '2025-08-22 20:16:00', '2025-08-22 20:16:00', 1, 1, '2025-08-21 13:17:00', 'cho_xac_nhan', 3),
(6, 3, 2, '2025-08-22 21:27:00', '2025-08-22 21:27:00', '2025-08-22 21:27:00', '2025-08-22 21:27:00', 1, 1, '2025-08-21 14:27:15', 'cho_xac_nhan', 3),
(7, 4, 2, '2025-08-22 21:37:00', '2025-08-22 21:37:00', '2025-08-22 21:37:00', '2025-08-22 21:37:00', 1, 1, '2025-08-21 14:37:57', 'cho_xac_nhan', 3),
(8, 3, 5, '2025-08-22 06:22:00', '2025-08-22 06:22:00', '2025-08-22 06:22:00', '2025-08-22 06:23:00', 1, 1, '2025-08-21 23:23:12', 'cho_xac_nhan', 3),
(9, 4, 2, '2025-08-22 06:37:00', '2025-08-22 06:37:00', '2025-08-22 06:37:00', '2025-08-22 06:37:00', 1, 1, '2025-08-21 23:37:48', 'cho_xac_nhan', 3),
(10, 4, 2, '2025-08-22 10:16:00', '2025-08-22 10:16:00', '2025-08-23 00:16:00', '2025-08-23 10:17:00', 1, 1, '2025-08-22 03:17:13', 'cho_xac_nhan', 3),
(11, 3, 4, '2025-08-22 10:48:00', '2025-08-22 10:48:00', '2025-08-23 10:48:00', '2025-08-23 10:48:00', 1, 1, '2025-08-22 03:48:30', 'da_huy', 3),
(12, 2, 1, '2025-08-23 09:12:00', '2025-08-23 09:12:00', '2025-08-23 11:12:00', '2025-08-23 11:12:00', 1, 1, '2025-08-23 02:13:12', 'cho_xac_nhan', NULL),
(13, 2, 1, '2025-08-23 09:12:00', '2025-08-23 09:12:00', '2025-08-23 23:12:00', '2025-08-23 23:12:00', 1, 1, '2025-08-23 02:15:33', 'cho_xac_nhan', NULL),
(14, 2, 1, '2025-08-23 09:26:00', '2025-08-23 10:26:00', '2025-08-23 14:26:00', '2025-08-23 14:26:00', 1, 1, '2025-08-23 02:26:56', 'da_huy', 3),
(15, 2, 1, '2025-08-23 09:34:00', '2025-08-23 09:34:00', '2025-08-23 15:34:00', '2025-08-23 15:34:00', 1, 1, '2025-08-23 02:34:53', 'da_huy', 3),
(16, 2, 1, '2025-08-23 09:37:00', '2025-08-23 09:37:00', '2025-08-23 00:37:00', '2025-08-23 00:37:00', 1, 1, '2025-08-23 02:38:01', 'cho_xac_nhan', NULL);

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
  `diem` int(11) DEFAULT 0,
  `la_admin` tinyint(1) DEFAULT 0,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id_nguoi_dung`, `ten_dang_nhap`, `mat_khau_hash`, `email`, `ho_ten`, `so_dien_thoai`, `dia_chi`, `so_du`, `diem`, `la_admin`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'admin', '$2a$12$Mte75pD0aoir0x7kYMGs0uG1YGvjIrtC7gR4uCLhhq.RKTCSpYE4S', 'admin@company.com', 'Trần Quản Trị', '0987654321', NULL, 668587.00, 44537, 1, '2025-08-20 08:32:05', '2025-08-23 02:41:50'),
(2, 'nguyenvanA', '$2a$12$dzWcobCrPlIA04tAEx.3m.WkjI3y56SoFL.L4CXgAYIJy6Y9/o7i.', 'nguyenvana@gmail.com', 'Nguyễn Văn A', '0912345678', NULL, 0.00, 0, 0, '2025-08-20 08:32:05', '2025-08-21 11:28:54'),
(3, 'tranthiB', '$2a$12$dzWcobCrPlIA04tAEx.3m.WkjI3y56SoFL.L4CXgAYIJy6Y9/o7i.', 'tranthib@yahoo.com', 'Trần Thị B', '0923456789', NULL, -668587.00, -44537, 0, '2025-08-20 08:32:05', '2025-08-23 02:41:50'),
(4, 'phamvanC', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MQD/.G6QAIH9J5q7YJ3Y1sJQYJXvB1O', 'phamvanc@gmail.com', 'Phạm Văn C', '0934567890', NULL, 0.00, 0, 0, '2025-08-20 08:32:05', '2025-08-20 08:32:05');

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
(2, 2, 2, '2025-08-20 08:32:05'),
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
-- Dumping data for table `thong_bao`
--

INSERT INTO `thong_bao` (`id_thong_bao`, `id_nguoi_dung`, `id_giao_dich`, `noi_dung`, `da_doc`, `ngay_tao`) VALUES
(1, 2, 4, 'Bạn có lịch xe mới từ admin', 0, '2025-08-21 11:25:52'),
(2, 3, 5, 'Bạn có lịch xe mới từ admin', 1, '2025-08-21 13:17:00'),
(3, 3, 6, 'Bạn có lịch xe mới từ admin', 1, '2025-08-21 14:27:15'),
(4, 1, 6, 'Bạn đã tạo giao dịch giao lịch thành công', 1, '2025-08-21 14:27:15'),
(5, 3, 7, 'Bạn có lịch xe mới từ admin', 1, '2025-08-21 14:37:57'),
(6, 1, 7, 'Bạn đã tạo giao dịch giao lịch thành công', 1, '2025-08-21 14:37:58'),
(7, 1, 6, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 12121.00 VNĐ và 12112 điểm.', 1, '2025-08-21 15:49:42'),
(8, 3, 8, 'Bạn có lịch xe mới từ admin - nhận 11.111 VNĐ và nhận 3332 điểm (có lịch xe đi kèm)', 1, '2025-08-21 23:23:12'),
(9, 1, 8, 'Bạn đã tạo giao dịch giao lịch thành công - nhận 11.111 VNĐ và nhận 3332 điểm (có lịch xe đi kèm)', 1, '2025-08-21 23:23:12'),
(10, 3, 8, 'Giao dịch từ tranthiB đã bị hủy', 1, '2025-08-21 23:27:10'),
(11, 1, 8, 'Giao dịch giao lịch của bạn đã bị hủy bởi tranthiB. Lịch xe đã được xóa.', 1, '2025-08-21 23:27:10'),
(12, 3, 9, 'Bạn được nhận 121.444 VNĐ và nhận 1211 điểm từ admin', 1, '2025-08-21 23:28:49'),
(13, 1, 9, 'Bạn đã tạo giao dịch san cho thành công - nhận 121.444 VNĐ và nhận 1211 điểm', 1, '2025-08-21 23:28:49'),
(14, 3, 10, 'Bạn có lịch xe mới từ admin - nhận 343.222 VNĐ và nhận 1212 điểm (có lịch xe đi kèm)', 1, '2025-08-21 23:37:48'),
(15, 1, 10, 'Bạn đã tạo giao dịch giao lịch thành công - nhận 343.222 VNĐ và nhận 1212 điểm (có lịch xe đi kèm)', 1, '2025-08-21 23:37:48'),
(16, 1, 10, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 343222.00 VNĐ và 1212 điểm.', 1, '2025-08-21 23:38:01'),
(17, 3, 11, 'Bạn có lịch xe mới từ admin - nhận 3.213 VNĐ và nhận 13123 điểm (có lịch xe đi kèm)', 1, '2025-08-22 03:17:13'),
(18, 1, 11, 'Bạn đã giao lịch xe cho người dùng - nhận 3.213 VNĐ và nhận 13123 điểm (có lịch xe đi kèm)', 1, '2025-08-22 03:17:13'),
(19, 1, 11, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 3213.00 VNĐ và 13123 điểm.', 1, '2025-08-22 03:24:57'),
(20, 3, 13, 'Bạn có lịch xe mới từ admin - nhận 113.244 VNĐ và nhận 31213 điểm (có lịch xe đi kèm)', 1, '2025-08-22 03:48:30'),
(21, 1, 13, 'Bạn đã giao lịch xe cho người dùng - nhận 113.244 VNĐ và nhận 31213 điểm (có lịch xe đi kèm)', 1, '2025-08-22 03:48:30'),
(22, 1, 13, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 113244.00 VNĐ và 31213 điểm.', 1, '2025-08-22 03:48:38'),
(23, 3, 15, 'Bạn được nhận 400.000 VNĐ và nhận 12212 điểm từ admin (giao dịch đã hoàn thành)', 1, '2025-08-22 08:24:05'),
(24, 1, 15, 'Bạn đã san cho 400.000 VNĐ và san cho 12212 điểm cho người dùng (giao dịch đã hoàn thành)', 1, '2025-08-22 08:24:05'),
(25, 3, 17, 'Bạn được nhận 300.000 VNĐ và nhận 1 điểm từ admin (giao dịch đã hoàn thành)', 1, '2025-08-22 08:25:21'),
(26, 1, 17, 'Bạn đã san cho 300.000 VNĐ và san cho 1 điểm cho người dùng (giao dịch đã hoàn thành)', 1, '2025-08-22 08:25:21'),
(27, 3, 19, 'Bạn được nhận 300.000 VNĐ và nhận 1 điểm từ admin (giao dịch đã hoàn thành)', 1, '2025-08-22 08:34:11'),
(28, 1, 19, 'Bạn đã san cho 300.000 VNĐ và san cho 1 điểm cho người dùng (giao dịch đã hoàn thành)', 1, '2025-08-22 08:34:11'),
(29, 3, 21, 'Bạn có lịch xe mới từ admin - nhận 500.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 02:26:57'),
(30, 1, 21, 'Bạn đã giao lịch xe cho người dùng - nhận 500.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 02:26:57'),
(31, 1, 21, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 500000.00 VNĐ và 1 điểm.', 1, '2025-08-23 02:29:18'),
(32, 3, 23, 'Bạn có lịch xe mới từ admin - nhận 502.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 02:34:53'),
(33, 1, 23, 'Bạn đã giao lịch xe cho người dùng - nhận 502.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 02:34:53'),
(34, 3, 25, 'Bạn có lịch xe mới từ admin - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 02:38:01'),
(35, 1, 25, 'Bạn đã giao lịch xe cho người dùng - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 02:38:01');

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
  MODIFY `id_giao_dich` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `lich_xe`
--
ALTER TABLE `lich_xe`
  MODIFY `id_lich_xe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

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
  MODIFY `id_nguoi_dung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `nhom`
--
ALTER TABLE `nhom`
  MODIFY `id_nhom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `thanh_vien_nhom`
--
ALTER TABLE `thanh_vien_nhom`
  MODIFY `id_thanh_vien` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `thong_bao`
--
ALTER TABLE `thong_bao`
  MODIFY `id_thong_bao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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
