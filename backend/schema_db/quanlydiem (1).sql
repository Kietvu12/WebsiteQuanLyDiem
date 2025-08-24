-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 23, 2025 at 12:12 PM
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
  `diem` decimal(12,2) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `trang_thai` enum('cho_xac_nhan','hoan_thanh','da_huy') DEFAULT 'cho_xac_nhan',
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_hoan_thanh` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `giao_dich`
--

INSERT INTO `giao_dich` (`id_giao_dich`, `id_loai_giao_dich`, `id_nguoi_gui`, `id_nguoi_nhan`, `id_nhom`, `id_lich_xe`, `so_tien`, `diem`, `noi_dung`, `trang_thai`, `ngay_tao`, `ngay_hoan_thanh`) VALUES
(80, 1, 1, 3, 1, 51, 600000.00, 1, 'qưeqewqewqeq', 'hoan_thanh', '2025-08-23 08:53:55', '2025-08-23 08:54:01'),
(81, 2, 3, 1, 1, 51, -600000.00, -1, 'Nhận lịch: qưeqewqewqeq', 'hoan_thanh', '2025-08-23 08:53:55', '2025-08-23 08:54:01'),
(82, 3, 1, NULL, 1, 51, -600000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 08:54:57', '2025-08-23 08:54:57'),
(83, 1, 1, 3, 1, 52, 4000000.00, 1, 'HAHA', 'hoan_thanh', '2025-08-23 09:00:04', '2025-08-23 09:00:25'),
(84, 2, 3, 1, 1, 52, -4000000.00, -1, 'Nhận lịch: HAHA', 'hoan_thanh', '2025-08-23 09:00:04', '2025-08-23 09:00:25'),
(85, 3, 1, NULL, 1, 52, -4000000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:00:30', '2025-08-23 09:00:30'),
(86, 1, 1, 3, 1, 53, 1000000.00, 1, 'qewewe', 'hoan_thanh', '2025-08-23 09:06:14', '2025-08-23 09:21:56'),
(87, 2, 3, 1, 1, 53, -1000000.00, -1, 'Nhận lịch: qewewe', 'hoan_thanh', '2025-08-23 09:06:14', '2025-08-23 09:21:56'),
(88, 1, 1, 3, 1, 54, 600000.00, 1, 'ưqeqqqwe', 'hoan_thanh', '2025-08-23 09:12:33', '2025-08-23 09:12:44'),
(89, 2, 3, 1, 1, 54, -600000.00, -1, 'Nhận lịch: ưqeqqqwe', 'hoan_thanh', '2025-08-23 09:12:33', '2025-08-23 09:12:44'),
(90, 3, 1, NULL, 1, 54, -600000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:13:07', '2025-08-23 09:13:07'),
(91, 3, 1, NULL, 1, 53, -1000000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:23:09', '2025-08-23 09:23:09'),
(92, 1, 1, 3, 1, 55, 1000000.00, 1, 'ưqeqe', 'hoan_thanh', '2025-08-23 09:24:39', '2025-08-23 09:24:46'),
(93, 2, 3, 1, 1, 55, -1000000.00, -1, 'Nhận lịch: ưqeqe', 'hoan_thanh', '2025-08-23 09:24:39', '2025-08-23 09:24:46'),
(94, 3, 1, NULL, 1, 55, -1000000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:25:00', '2025-08-23 09:25:00'),
(95, 1, 1, 3, 1, 56, 400000.00, 1, '20000', 'hoan_thanh', '2025-08-23 09:28:48', '2025-08-23 09:28:56'),
(96, 2, 3, 1, 1, 56, -400000.00, -1, 'Nhận lịch: 20000', 'hoan_thanh', '2025-08-23 09:28:48', '2025-08-23 09:28:56'),
(97, 3, 1, NULL, 1, 56, -400000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:29:10', '2025-08-23 09:29:10'),
(98, 1, 1, 3, 1, 57, 400000.00, 1, 'aaaa', 'hoan_thanh', '2025-08-23 09:34:33', '2025-08-23 09:34:40'),
(99, 2, 3, 1, 1, 57, -400000.00, -1, 'Nhận lịch: aaaa', 'hoan_thanh', '2025-08-23 09:34:33', '2025-08-23 09:34:40'),
(100, 3, 1, NULL, 1, 57, -400000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:34:48', '2025-08-23 09:34:48'),
(101, 3, NULL, 1, 1, 57, 400000.00, 1, 'Hủy lịch xe - Cộng tiền/điểm cho người nhận', 'hoan_thanh', '2025-08-23 09:34:48', '2025-08-23 09:34:48'),
(102, 1, 1, 4, 3, 58, 1000000.00, 1, 'aaaa', 'cho_xac_nhan', '2025-08-23 09:36:38', '2025-08-23 09:36:38'),
(103, 2, 4, 1, 3, 58, -1000000.00, -1, 'Nhận lịch: aaaa', 'cho_xac_nhan', '2025-08-23 09:36:38', '2025-08-23 09:36:38'),
(104, 1, 1, 3, 3, 59, 1000000.00, 1, '11111', 'hoan_thanh', '2025-08-23 09:38:08', '2025-08-23 09:38:15'),
(105, 2, 3, 1, 3, 59, -1000000.00, -1, 'Nhận lịch: 11111', 'hoan_thanh', '2025-08-23 09:38:08', '2025-08-23 09:38:15'),
(106, 3, 1, NULL, 3, 59, -1000000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:38:33', '2025-08-23 09:38:33'),
(107, 3, NULL, 1, 3, 59, 1000000.00, 1, 'Hủy lịch xe - Cộng tiền/điểm cho người nhận', 'hoan_thanh', '2025-08-23 09:38:33', '2025-08-23 09:38:33'),
(108, 1, 1, 3, 1, 60, 1000000.00, 1, 'qqqq', 'hoan_thanh', '2025-08-23 09:49:12', '2025-08-23 09:49:29'),
(109, 2, 3, 1, 1, 60, -1000000.00, -1, 'Nhận lịch: qqqq', 'hoan_thanh', '2025-08-23 09:49:12', '2025-08-23 09:49:29'),
(110, 3, 1, NULL, 1, 60, -1000000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:49:34', '2025-08-23 09:49:34'),
(111, 3, NULL, 1, 1, 60, 1000000.00, 1, 'Hủy lịch xe - Cộng tiền/điểm cho người nhận', 'hoan_thanh', '2025-08-23 09:49:34', '2025-08-23 09:49:34'),
(112, 1, 1, 2, 1, 61, 300000.00, 1, 'qqqq', 'cho_xac_nhan', '2025-08-23 09:53:07', '2025-08-23 09:53:07'),
(113, 2, 2, 1, 1, 61, -300000.00, -1, 'Nhận lịch: qqqq', 'cho_xac_nhan', '2025-08-23 09:53:07', '2025-08-23 09:53:07'),
(114, 1, 1, 3, 1, 62, 400000.00, 1, '11q111', 'hoan_thanh', '2025-08-23 09:53:46', '2025-08-23 09:53:54'),
(115, 2, 3, 1, 1, 62, -400000.00, -1, 'Nhận lịch: 11q111', 'hoan_thanh', '2025-08-23 09:53:46', '2025-08-23 09:53:54'),
(116, 3, 1, NULL, 1, 62, -400000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:54:05', '2025-08-23 09:54:05'),
(117, 3, NULL, 1, 1, 62, 400000.00, 1, 'Hủy lịch xe - Cộng tiền/điểm cho người nhận', 'hoan_thanh', '2025-08-23 09:54:05', '2025-08-23 09:54:05'),
(118, 1, 1, 3, 1, 63, 400000.00, 1, 'aa', 'hoan_thanh', '2025-08-23 09:58:46', '2025-08-23 09:58:54'),
(119, 2, 3, 1, 1, 63, -400000.00, -1, 'Nhận lịch: aa', 'hoan_thanh', '2025-08-23 09:58:46', '2025-08-23 09:58:54'),
(120, 3, 1, NULL, 1, 63, -400000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 09:59:21', '2025-08-23 09:59:21'),
(121, 3, NULL, 1, 1, 63, 400000.00, 1, 'Hủy lịch xe - Cộng tiền/điểm cho người nhận', 'hoan_thanh', '2025-08-23 09:59:21', '2025-08-23 09:59:21'),
(122, 1, 1, 3, 1, 64, 400000.00, 1, 'a', 'hoan_thanh', '2025-08-23 10:03:18', '2025-08-23 10:03:32'),
(123, 2, 3, 1, 1, 64, -400000.00, -1, 'Nhận lịch: a', 'hoan_thanh', '2025-08-23 10:03:18', '2025-08-23 10:03:32'),
(124, 3, 1, NULL, 1, 64, -400000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 10:03:42', '2025-08-23 10:03:42'),
(125, 3, NULL, 1, 1, 64, 400000.00, 1, 'Hủy lịch xe - Cộng tiền/điểm cho người nhận', 'hoan_thanh', '2025-08-23 10:03:43', '2025-08-23 10:03:43'),
(126, 1, 1, 3, 1, 65, 1000000.00, 1, 'aaa', 'hoan_thanh', '2025-08-23 10:11:46', '2025-08-23 10:11:53'),
(127, 2, 3, 1, 1, 65, -1000000.00, -1, 'Nhận lịch: aaa', 'hoan_thanh', '2025-08-23 10:11:46', '2025-08-23 10:11:53'),
(128, 3, 1, NULL, 1, 65, -1000000.00, -1, 'Hủy lịch xe - Trừ tiền/điểm của người gửi', 'hoan_thanh', '2025-08-23 10:11:57', '2025-08-23 10:11:57'),
(129, 3, NULL, 1, 1, 65, 1000000.00, 1, 'Hủy lịch xe - Cộng tiền/điểm cho người nhận', 'hoan_thanh', '2025-08-23 10:11:57', '2025-08-23 10:11:57');

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
(51, 3, 1, '2025-08-23 16:52:00', '2025-08-23 16:52:00', '2025-08-23 18:52:00', '2025-08-23 18:52:00', 1, 1, '2025-08-23 08:53:55', 'da_huy', 3),
(52, 3, 1, '2025-08-23 18:59:00', '2025-08-23 18:59:00', '2025-08-23 23:59:00', '2025-08-23 23:59:00', 1, 1, '2025-08-23 09:00:04', 'da_huy', 3),
(53, 3, 1, '2025-08-23 17:04:00', '2025-08-23 17:04:00', '2025-08-23 20:04:00', '2025-08-23 20:04:00', 1, 1, '2025-08-23 09:06:14', 'da_huy', 3),
(54, 3, 1, '2025-08-23 16:12:00', '2025-08-23 16:12:00', '2025-08-23 18:12:00', '2025-08-23 18:12:00', 1, 1, '2025-08-23 09:12:33', 'da_huy', 3),
(55, 3, 1, '2025-08-23 18:24:00', '2025-08-23 18:24:00', '2025-08-23 22:24:00', '2025-08-23 22:24:00', 1, 1, '2025-08-23 09:24:38', 'da_huy', 3),
(56, 3, 1, '2025-08-23 17:28:00', '2025-08-23 17:28:00', '2025-08-23 17:28:00', '2025-08-23 17:28:00', 1, 1, '2025-08-23 09:28:48', 'da_huy', 3),
(57, 3, 1, '2025-08-23 16:34:00', '2025-08-23 16:34:00', '2025-08-23 20:34:00', '2025-08-23 20:34:00', 1, 1, '2025-08-23 09:34:33', 'da_huy', 3),
(58, 3, 1, '2025-08-23 17:36:00', '2025-08-23 17:36:00', '2025-08-23 18:36:00', '2025-08-23 18:36:00', 1, 3, '2025-08-23 09:36:38', 'cho_xac_nhan', 4),
(59, 3, 1, '2025-08-23 16:37:00', '2025-08-23 16:37:00', '2025-08-23 17:37:00', '2025-08-23 17:37:00', 1, 3, '2025-08-23 09:38:08', 'da_huy', 3),
(60, 3, 1, '2025-08-23 17:48:00', '2025-08-23 17:48:00', '2025-08-23 19:48:00', '2025-08-23 19:48:00', 1, 1, '2025-08-23 09:49:12', 'da_huy', 3),
(61, 3, 1, '2025-08-23 17:52:00', '2025-08-23 17:52:00', '2025-08-23 17:52:00', '2025-08-23 17:52:00', 1, 1, '2025-08-23 09:53:07', 'cho_xac_nhan', 2),
(62, 3, 1, '2025-08-23 17:53:00', '2025-08-23 17:53:00', '2025-08-23 17:53:00', '2025-08-23 17:53:00', 1, 1, '2025-08-23 09:53:46', 'da_huy', 3),
(63, 3, 1, '2025-08-23 17:58:00', '2025-08-23 17:58:00', '2025-08-23 17:58:00', '2025-08-23 17:58:00', 1, 1, '2025-08-23 09:58:46', 'da_huy', 3),
(64, 3, 1, '2025-08-23 18:03:00', '2025-08-23 18:03:00', '2025-08-23 22:03:00', '2025-08-23 22:03:00', 1, 1, '2025-08-23 10:03:18', 'da_huy', 3),
(65, 3, 1, '2025-08-23 19:11:00', '2025-08-23 19:11:00', '2025-08-23 22:11:00', '2025-08-23 22:11:00', 1, 1, '2025-08-23 10:11:46', 'da_huy', 3);

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
  `diem` decimal(12,2) DEFAULT 0.00,
  `la_admin` tinyint(1) DEFAULT 0,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id_nguoi_dung`, `ten_dang_nhap`, `mat_khau_hash`, `email`, `ho_ten`, `so_dien_thoai`, `dia_chi`, `so_du`, `diem`, `la_admin`, `ngay_tao`, `ngay_cap_nhat`) VALUES
(1, 'admin', '$2a$12$Mte75pD0aoir0x7kYMGs0uG1YGvjIrtC7gR4uCLhhq.RKTCSpYE4S', 'admin@company.com', 'Trần Quản Trị', '0987654321', NULL, 1000000.00, 14, 1, '2025-08-20 08:32:05', '2025-08-23 10:11:57'),
(2, 'nguyenvanA', '$2a$12$dzWcobCrPlIA04tAEx.3m.WkjI3y56SoFL.L4CXgAYIJy6Y9/o7i.', 'nguyenvana@gmail.com', 'Nguyễn Văn A', '0912345678', NULL, 0.00, 0, 0, '2025-08-20 08:32:05', '2025-08-21 11:28:54'),
(3, 'tranthiB', '$2a$12$dzWcobCrPlIA04tAEx.3m.WkjI3y56SoFL.L4CXgAYIJy6Y9/o7i.', 'tranthib@yahoo.com', 'Trần Thị B', '0923456789', NULL, 100000.00, 7, 0, '2025-08-20 08:32:05', '2025-08-23 10:12:38'),
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
(30, 3, 80, 'Bạn có lịch xe mới từ admin - nhận 600.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 08:53:55'),
(31, 1, 80, 'Bạn đã giao lịch xe cho người dùng - nhận 600.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 08:53:55'),
(32, 1, 80, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 600000.00 VNĐ và 1 điểm.', 1, '2025-08-23 08:54:01'),
(33, 3, 83, 'Bạn có lịch xe mới từ admin - nhận 4.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:00:04'),
(34, 1, 83, 'Bạn đã giao lịch xe cho người dùng - nhận 4.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:00:04'),
(35, 1, 83, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 4000000.00 VNĐ và 1 điểm.', 1, '2025-08-23 09:00:25'),
(36, 3, 86, 'Bạn có lịch xe mới từ admin - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:06:14'),
(37, 1, 86, 'Bạn đã giao lịch xe cho người dùng - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:06:14'),
(38, 3, 88, 'Bạn có lịch xe mới từ admin - nhận 600.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:12:33'),
(39, 1, 88, 'Bạn đã giao lịch xe cho người dùng - nhận 600.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:12:33'),
(40, 1, 88, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 600000.00 VNĐ và 1 điểm.', 1, '2025-08-23 09:12:44'),
(41, 1, 86, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 1000000.00 VNĐ và 1 điểm.', 1, '2025-08-23 09:21:57'),
(42, 3, 92, 'Bạn có lịch xe mới từ admin - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:24:39'),
(43, 1, 92, 'Bạn đã giao lịch xe cho người dùng - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:24:39'),
(44, 1, 92, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 1000000.00 VNĐ và 1 điểm.', 1, '2025-08-23 09:24:46'),
(45, 3, 95, 'Bạn có lịch xe mới từ admin - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:28:48'),
(46, 1, 95, 'Bạn đã giao lịch xe cho người dùng - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:28:48'),
(47, 1, 95, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 400000.00 VNĐ và 1 điểm.', 1, '2025-08-23 09:28:56'),
(48, 3, 98, 'Bạn có lịch xe mới từ admin - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:34:33'),
(49, 1, 98, 'Bạn đã giao lịch xe cho người dùng - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:34:33'),
(50, 1, 98, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 400000.00 VNĐ và 1 điểm.', 1, '2025-08-23 09:34:40'),
(51, 4, 102, 'Bạn có lịch xe mới từ admin - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 09:36:38'),
(52, 1, 102, 'Bạn đã giao lịch xe cho người dùng - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:36:38'),
(53, 3, 104, 'Bạn có lịch xe mới từ admin - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:38:08'),
(54, 1, 104, 'Bạn đã giao lịch xe cho người dùng - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:38:08'),
(55, 1, 104, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 1000000.00 VNĐ và 1 điểm.', 1, '2025-08-23 09:38:15'),
(56, 3, 108, 'Bạn có lịch xe mới từ admin - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:49:12'),
(57, 1, 108, 'Bạn đã giao lịch xe cho người dùng - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 09:49:12'),
(58, 1, 108, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 1000000.00 VNĐ và 1 điểm.', 0, '2025-08-23 09:49:29'),
(59, 2, 112, 'Bạn có lịch xe mới từ admin - nhận 300.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 09:53:07'),
(60, 1, 112, 'Bạn đã giao lịch xe cho người dùng - nhận 300.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 09:53:07'),
(61, 3, 114, 'Bạn có lịch xe mới từ admin - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:53:46'),
(62, 1, 114, 'Bạn đã giao lịch xe cho người dùng - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 09:53:46'),
(63, 1, 114, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 400000.00 VNĐ và 1 điểm.', 0, '2025-08-23 09:53:54'),
(64, 1, 117, 'Lịch xe đã bị hủy - Hoàn lại 400,000 VNĐ và 1 điểm', 0, '2025-08-23 09:54:05'),
(65, 1, 116, 'Lịch xe đã bị hủy - Hoàn lại 400,000 VNĐ và 1 điểm', 0, '2025-08-23 09:54:05'),
(66, 3, 118, 'Bạn có lịch xe mới từ admin - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 09:58:46'),
(67, 1, 118, 'Bạn đã giao lịch xe cho người dùng - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 09:58:46'),
(68, 1, 118, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 400000.00 VNĐ và 1 điểm.', 0, '2025-08-23 09:58:54'),
(69, 1, 121, 'Lịch xe đã bị hủy - Hoàn lại 400,000 VNĐ và 1 điểm', 0, '2025-08-23 09:59:21'),
(70, 1, 120, 'Lịch xe đã bị hủy - Hoàn lại 400,000 VNĐ và 1 điểm', 0, '2025-08-23 09:59:21'),
(71, 3, 121, 'Lịch xe từ tranthiB đã bị hủy', 0, '2025-08-23 09:59:21'),
(72, 1, 120, 'Lịch xe của bạn đã được hủy bởi tranthiB', 0, '2025-08-23 09:59:21'),
(73, 3, 122, 'Bạn có lịch xe mới từ admin - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 10:03:18'),
(74, 1, 122, 'Bạn đã giao lịch xe cho người dùng - nhận 400.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 10:03:18'),
(75, 1, 122, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 400000.00 VNĐ và 1 điểm.', 0, '2025-08-23 10:03:32'),
(76, 1, 125, 'Lịch xe đã bị hủy - Hoàn lại 400,000 VNĐ và 1 điểm', 0, '2025-08-23 10:03:43'),
(77, 1, 124, 'Lịch xe đã bị hủy - Hoàn lại 400,000 VNĐ và 1 điểm', 0, '2025-08-23 10:03:43'),
(78, 3, 125, 'Lịch xe từ tranthiB đã bị hủy', 0, '2025-08-23 10:03:43'),
(79, 1, 124, 'Lịch xe của bạn đã được hủy bởi tranthiB', 0, '2025-08-23 10:03:43'),
(80, 3, 126, 'Bạn có lịch xe mới từ admin - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 1, '2025-08-23 10:11:46'),
(81, 1, 126, 'Bạn đã giao lịch xe cho người dùng - nhận 1.000.000 VNĐ và nhận 1 điểm (có lịch xe đi kèm)', 0, '2025-08-23 10:11:46'),
(82, 1, 126, 'Lịch xe của bạn đã được xác nhận bởi tranthiB. Bạn đã nhận 1000000.00 VNĐ và 1 điểm.', 0, '2025-08-23 10:11:53'),
(83, 1, 129, 'Lịch xe đã bị hủy - Hoàn lại 1,000,000 VNĐ và 1 điểm', 0, '2025-08-23 10:11:57'),
(84, 1, 128, 'Lịch xe đã bị hủy - Hoàn lại 1,000,000 VNĐ và 1 điểm', 0, '2025-08-23 10:11:57'),
(85, 3, 129, 'Lịch xe từ tranthiB đã bị hủy', 0, '2025-08-23 10:11:57'),
(86, 1, 128, 'Lịch xe của bạn đã được hủy bởi tranthiB', 0, '2025-08-23 10:11:57');

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
  MODIFY `id_giao_dich` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT for table `lich_xe`
--
ALTER TABLE `lich_xe`
  MODIFY `id_lich_xe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

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
  MODIFY `id_thong_bao` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

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
