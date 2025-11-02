-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2025 at 04:00 PM
-- Server version: 11.4.8-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spk_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `alternatif`
--

CREATE TABLE `alternatif` (
  `id_alternatif` int(11) NOT NULL,
  `nama_obat` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `alternatif`
--

INSERT INTO `alternatif` (`id_alternatif`, `nama_obat`) VALUES
(1, 'Amlodipine'),
(2, 'Captopril'),
(3, 'Lisinopril'),
(4, 'Enalapril'),
(5, 'Losartan'),
(6, 'Valsartan'),
(7, 'Candesartan'),
(8, 'Telmisartan'),
(9, 'Olmesartan'),
(10, 'Hydrochlorothiazide (HCTZ)'),
(11, 'Furosemide'),
(12, 'Spironolactone'),
(13, 'Bisoprolol'),
(14, 'Metoprolol'),
(15, 'Atenolol'),
(16, 'Propranolol'),
(17, 'Clonidine'),
(18, 'Doxazosin'),
(19, 'Hydralazine'),
(20, 'Nifedipine');

-- --------------------------------------------------------

--
-- Table structure for table `kriteria`
--

CREATE TABLE `kriteria` (
  `id_kriteria` int(11) NOT NULL,
  `nama_kriteria` varchar(100) DEFAULT NULL,
  `bobot` float DEFAULT NULL,
  `tipe` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `kriteria`
--

INSERT INTO `kriteria` (`id_kriteria`, `nama_kriteria`, `bobot`, `tipe`) VALUES
(1, 'Efektivitas', 0.35, 'benefit'),
(2, 'Efek Samping', 0.25, 'cost'),
(3, 'Harga', 0.2, 'cost'),
(4, 'Ketersediaan', 0.1, 'benefit'),
(5, 'Kemudahan Konsumsi', 0.1, 'benefit');

-- --------------------------------------------------------

--
-- Table structure for table `laporan_wp`
--

CREATE TABLE `laporan_wp` (
  `id` int(11) NOT NULL,
  `tanggal` date NOT NULL,
  `nama_alternatif` varchar(100) DEFAULT NULL,
  `nilai_preferensi` float DEFAULT NULL,
  `saran_terbaik` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `laporan_wp`
--

INSERT INTO `laporan_wp` (`id`, `tanggal`, `nama_alternatif`, `nilai_preferensi`, `saran_terbaik`) VALUES
(1, '2025-10-22', 'Furosemide', 0.251469, NULL),
(2, '2025-10-22', 'Captopril', 0.249854, NULL),
(3, '2025-10-22', 'Losartan', 0.249383, NULL),
(4, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(5, '2025-10-22', 'Furosemide', 0.251469, NULL),
(6, '2025-10-22', 'Captopril', 0.249854, NULL),
(7, '2025-10-22', 'Losartan', 0.249383, NULL),
(8, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(9, '2025-10-22', 'Furosemide', 0.251469, NULL),
(10, '2025-10-22', 'Captopril', 0.249854, NULL),
(11, '2025-10-22', 'Losartan', 0.249383, NULL),
(12, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(13, '2025-10-22', 'Furosemide', 0.251469, NULL),
(14, '2025-10-22', 'Captopril', 0.249854, NULL),
(15, '2025-10-22', 'Losartan', 0.249383, NULL),
(16, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(17, '2025-10-22', 'Furosemide', 0.251469, NULL),
(18, '2025-10-22', 'Captopril', 0.249854, NULL),
(19, '2025-10-22', 'Losartan', 0.249383, NULL),
(20, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(21, '2025-10-22', 'Furosemide', 0.251469, NULL),
(22, '2025-10-22', 'Captopril', 0.249854, NULL),
(23, '2025-10-22', 'Losartan', 0.249383, NULL),
(24, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(25, '2025-10-22', 'Furosemide', 0.251469, NULL),
(26, '2025-10-22', 'Captopril', 0.249854, NULL),
(27, '2025-10-22', 'Losartan', 0.249383, NULL),
(28, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(29, '2025-10-22', 'Furosemide', 0.251469, NULL),
(30, '2025-10-22', 'Captopril', 0.249854, NULL),
(31, '2025-10-22', 'Losartan', 0.249383, NULL),
(32, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(33, '2025-10-22', 'Furosemide', 0.251469, NULL),
(34, '2025-10-22', 'Captopril', 0.249854, NULL),
(35, '2025-10-22', 'Losartan', 0.249383, NULL),
(36, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(37, '2025-10-22', 'Furosemide', 0.251469, NULL),
(38, '2025-10-22', 'Captopril', 0.249854, NULL),
(39, '2025-10-22', 'Losartan', 0.249383, NULL),
(40, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(41, '2025-10-22', 'Furosemide', 0.251469, NULL),
(42, '2025-10-22', 'Captopril', 0.249854, NULL),
(43, '2025-10-22', 'Losartan', 0.249383, NULL),
(44, '2025-10-22', 'Amlodipine', 0.249294, NULL),
(45, '2025-10-23', 'Furosemide', 0.251469, NULL),
(46, '2025-10-23', 'Captopril', 0.249854, NULL),
(47, '2025-10-23', 'Losartan', 0.249383, NULL),
(48, '2025-10-23', 'Amlodipine', 0.249294, NULL),
(49, '2025-10-23', 'Furosemide', 0.252506, NULL),
(50, '2025-10-23', 'Losartan', 0.250411, NULL),
(51, '2025-10-23', 'Amlodipine', 0.250321, NULL),
(52, '2025-10-23', 'Captopril', 0.246762, NULL),
(53, '2025-10-23', 'Furosemide', 0.252506, NULL),
(54, '2025-10-23', 'Losartan', 0.250411, NULL),
(55, '2025-10-23', 'Amlodipine', 0.250321, NULL),
(56, '2025-10-23', 'Captopril', 0.246762, NULL),
(57, '2025-10-23', 'Furosemide', 0.252506, NULL),
(58, '2025-10-23', 'Losartan', 0.250411, NULL),
(59, '2025-10-23', 'Amlodipine', 0.250321, NULL),
(60, '2025-10-23', 'Captopril', 0.246762, NULL),
(61, '2025-10-27', 'Furosemide', 0.252506, NULL),
(62, '2025-10-27', 'Losartan', 0.250411, NULL),
(63, '2025-10-27', 'Amlodipine', 0.250321, NULL),
(64, '2025-10-27', 'Captopril', 0.246762, NULL),
(65, '2025-10-27', 'Furosemide', 0.252506, NULL),
(66, '2025-10-27', 'Losartan', 0.250411, NULL),
(67, '2025-10-27', 'Amlodipine', 0.250321, NULL),
(68, '2025-10-27', 'Captopril', 0.246762, NULL),
(69, '2025-10-27', 'Furosemide', 0.252513, NULL),
(70, '2025-10-27', 'Losartan', 0.250412, NULL),
(71, '2025-10-27', 'Amlodipine', 0.250322, NULL),
(72, '2025-10-27', 'Captopril', 0.246753, NULL),
(73, '2025-10-27', 'Furosemide', 0.252517, NULL),
(74, '2025-10-27', 'Losartan', 0.250413, NULL),
(75, '2025-10-27', 'Amlodipine', 0.250322, NULL),
(76, '2025-10-27', 'Captopril', 0.246747, NULL),
(77, '2025-10-27', 'Furosemide', 0.252517, NULL),
(78, '2025-10-27', 'Losartan', 0.250413, NULL),
(79, '2025-10-27', 'Amlodipine', 0.250322, NULL),
(80, '2025-10-27', 'Captopril', 0.246747, NULL),
(81, '2025-10-29', 'Furosemide', 0.252511, 'Furosemide'),
(82, '2025-10-29', 'Losartan', 0.250412, 'Furosemide'),
(83, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(84, '2025-10-29', 'Captopril', 0.246755, 'Furosemide'),
(85, '2025-10-29', 'Furosemide', 0.252511, 'Furosemide'),
(86, '2025-10-29', 'Losartan', 0.250412, 'Furosemide'),
(87, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(88, '2025-10-29', 'Captopril', 0.246755, 'Furosemide'),
(89, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(90, '2025-10-29', 'Losartan', 0.250412, 'Furosemide'),
(91, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(92, '2025-10-29', 'Captopril', 0.246753, 'Furosemide'),
(93, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(94, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(95, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(96, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(97, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(98, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(99, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(100, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(101, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(102, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(103, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(104, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(105, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(106, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(107, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(108, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(109, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(110, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(111, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(112, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(113, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(114, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(115, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(116, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(117, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(118, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(119, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(120, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(121, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(122, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(123, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(124, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(125, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(126, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(127, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(128, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(129, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(130, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(131, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(132, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(133, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(134, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(135, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(136, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(137, '2025-10-29', 'Furosemide', 0.252513, 'Furosemide'),
(138, '2025-10-29', 'Losartan', 0.250413, 'Furosemide'),
(139, '2025-10-29', 'Amlodipine', 0.250322, 'Furosemide'),
(140, '2025-10-29', 'Captopril', 0.246752, 'Furosemide'),
(141, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(142, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(143, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(144, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(145, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(146, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(147, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(148, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(149, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(150, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(151, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(152, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(153, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(154, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(155, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(156, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(157, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(158, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(159, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(160, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(161, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(162, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(163, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(164, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(165, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(166, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(167, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(168, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(169, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(170, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(171, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(172, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(173, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(174, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(175, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(176, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(177, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(178, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(179, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(180, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(181, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(182, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(183, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(184, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(185, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(186, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(187, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(188, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(189, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(190, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(191, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(192, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(193, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(194, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(195, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(196, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(197, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(198, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(199, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(200, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(201, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(202, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(203, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(204, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(205, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(206, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(207, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(208, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(209, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(210, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(211, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(212, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(213, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(214, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(215, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(216, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(217, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(218, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(219, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(220, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(221, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(222, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(223, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(224, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(225, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(226, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(227, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(228, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(229, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(230, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(231, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(232, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(233, '2025-10-30', 'Furosemide', 0.252513, 'Furosemide'),
(234, '2025-10-30', 'Losartan', 0.250413, 'Furosemide'),
(235, '2025-10-30', 'Amlodipine', 0.250322, 'Furosemide'),
(236, '2025-10-30', 'Captopril', 0.246752, 'Furosemide'),
(237, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(238, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(239, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(240, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(241, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(242, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(243, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(244, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(245, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(246, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(247, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(248, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(249, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(250, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(251, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(252, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(253, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(254, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(255, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(256, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(257, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(258, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(259, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(260, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(261, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(262, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(263, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(264, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(265, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(266, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(267, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(268, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(269, '2025-10-31', 'Furosemide', 0.252513, 'Furosemide'),
(270, '2025-10-31', 'Losartan', 0.250413, 'Furosemide'),
(271, '2025-10-31', 'Amlodipine', 0.250322, 'Furosemide'),
(272, '2025-10-31', 'Captopril', 0.246752, 'Furosemide'),
(273, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(274, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(275, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(276, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(277, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(278, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(279, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(280, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(281, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(282, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(283, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(284, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(285, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(286, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(287, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(288, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(289, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(290, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(291, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(292, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)'),
(293, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(294, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(295, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(296, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(297, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(298, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(299, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(300, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(301, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(302, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(303, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(304, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(305, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(306, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(307, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(308, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(309, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(310, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(311, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(312, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)'),
(313, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(314, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(315, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(316, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(317, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(318, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(319, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(320, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(321, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(322, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(323, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(324, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(325, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(326, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(327, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(328, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(329, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(330, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(331, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(332, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)'),
(333, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(334, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(335, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(336, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(337, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(338, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(339, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(340, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(341, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(342, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(343, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(344, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(345, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(346, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(347, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(348, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(349, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(350, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(351, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(352, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)'),
(353, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(354, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(355, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(356, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(357, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(358, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(359, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(360, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(361, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(362, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(363, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(364, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(365, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(366, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(367, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(368, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(369, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(370, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(371, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(372, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)'),
(373, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(374, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(375, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(376, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(377, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(378, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(379, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(380, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(381, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(382, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(383, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(384, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(385, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(386, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(387, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(388, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(389, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(390, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(391, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(392, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)'),
(393, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(394, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(395, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(396, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(397, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(398, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(399, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(400, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(401, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(402, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(403, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(404, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(405, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(406, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(407, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(408, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(409, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(410, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(411, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(412, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)'),
(413, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(414, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(415, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(416, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(417, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(418, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(419, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(420, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(421, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(422, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(423, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(424, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(425, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(426, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(427, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(428, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(429, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(430, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(431, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(432, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)'),
(433, '2025-11-01', 'Hydrochlorothiazide (HCTZ)', 0.0699062, 'Hydrochlorothiazide (HCTZ)'),
(434, '2025-11-01', 'Losartan', 0.0689468, 'Hydrochlorothiazide (HCTZ)'),
(435, '2025-11-01', 'Furosemide', 0.0627965, 'Hydrochlorothiazide (HCTZ)'),
(436, '2025-11-01', 'Spironolactone', 0.058297, 'Hydrochlorothiazide (HCTZ)'),
(437, '2025-11-01', 'Telmisartan', 0.0573662, 'Hydrochlorothiazide (HCTZ)'),
(438, '2025-11-01', 'Nifedipine', 0.0570948, 'Hydrochlorothiazide (HCTZ)'),
(439, '2025-11-01', 'Clonidine', 0.055325, 'Hydrochlorothiazide (HCTZ)'),
(440, '2025-11-01', 'Doxazosin', 0.0528258, 'Hydrochlorothiazide (HCTZ)'),
(441, '2025-11-01', 'Enalapril', 0.0528053, 'Hydrochlorothiazide (HCTZ)'),
(442, '2025-11-01', 'Olmesartan', 0.052713, 'Hydrochlorothiazide (HCTZ)'),
(443, '2025-11-01', 'Propranolol', 0.0501756, 'Hydrochlorothiazide (HCTZ)'),
(444, '2025-11-01', 'Captopril', 0.0495881, 'Hydrochlorothiazide (HCTZ)'),
(445, '2025-11-01', 'Amlodipine', 0.0477473, 'Hydrochlorothiazide (HCTZ)'),
(446, '2025-11-01', 'Metoprolol', 0.0464746, 'Hydrochlorothiazide (HCTZ)'),
(447, '2025-11-01', 'Candesartan', 0.0457824, 'Hydrochlorothiazide (HCTZ)'),
(448, '2025-11-01', 'Valsartan', 0.0415028, 'Hydrochlorothiazide (HCTZ)'),
(449, '2025-11-01', 'Bisoprolol', 0.0374721, 'Hydrochlorothiazide (HCTZ)'),
(450, '2025-11-01', 'Atenolol', 0.0336708, 'Hydrochlorothiazide (HCTZ)'),
(451, '2025-11-01', 'Hydralazine', 0.0326213, 'Hydrochlorothiazide (HCTZ)'),
(452, '2025-11-01', 'Lisinopril', 0.0268885, 'Hydrochlorothiazide (HCTZ)');

-- --------------------------------------------------------

--
-- Table structure for table `nilai`
--

CREATE TABLE `nilai` (
  `id_nilai` int(11) NOT NULL,
  `id_alternatif` int(11) DEFAULT NULL,
  `id_kriteria` int(11) DEFAULT NULL,
  `nilai` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `nilai`
--

INSERT INTO `nilai` (`id_nilai`, `id_alternatif`, `id_kriteria`, `nilai`) VALUES
(57, 1, 1, 3),
(58, 1, 2, 4),
(59, 1, 3, 4),
(60, 1, 4, 4),
(61, 1, 5, 5),
(62, 2, 1, 3),
(63, 2, 2, 3),
(64, 2, 3, 3),
(65, 2, 4, 2),
(66, 2, 5, 4),
(67, 3, 1, 1),
(68, 3, 2, 4),
(69, 3, 3, 4),
(70, 3, 4, 1),
(71, 3, 5, 3),
(72, 4, 1, 5),
(73, 4, 2, 5),
(74, 4, 3, 5),
(75, 4, 4, 5),
(76, 4, 5, 5),
(77, 5, 1, 4),
(78, 5, 2, 1),
(79, 5, 3, 4),
(80, 5, 4, 3),
(81, 5, 5, 3),
(82, 6, 1, 2),
(83, 6, 2, 5),
(84, 6, 3, 3),
(85, 6, 4, 4),
(86, 6, 5, 5),
(87, 7, 1, 3),
(88, 7, 2, 3),
(89, 7, 3, 5),
(90, 7, 4, 2),
(91, 7, 5, 5),
(92, 8, 1, 4),
(93, 8, 2, 5),
(94, 8, 3, 2),
(95, 8, 4, 4),
(96, 8, 5, 5),
(97, 9, 1, 5),
(98, 9, 2, 4),
(99, 9, 3, 4),
(100, 9, 4, 3),
(101, 9, 5, 3),
(102, 10, 1, 3),
(103, 10, 2, 2),
(104, 10, 3, 1),
(105, 10, 4, 2),
(106, 10, 5, 5),
(107, 11, 1, 4),
(108, 11, 2, 2),
(109, 11, 3, 4),
(110, 11, 4, 5),
(111, 11, 5, 4),
(112, 12, 1, 5),
(113, 12, 2, 3),
(114, 12, 3, 4),
(115, 12, 4, 3),
(116, 12, 5, 4),
(117, 13, 1, 2),
(118, 13, 2, 5),
(119, 13, 3, 5),
(120, 13, 4, 4),
(121, 13, 5, 5),
(122, 14, 1, 3),
(123, 14, 2, 5),
(124, 14, 3, 3),
(125, 14, 4, 5),
(126, 14, 5, 3),
(127, 15, 1, 1),
(128, 15, 2, 4),
(129, 15, 3, 3),
(130, 15, 4, 4),
(131, 15, 5, 4),
(132, 16, 1, 4),
(133, 16, 2, 4),
(134, 16, 3, 4),
(135, 16, 4, 3),
(136, 16, 5, 4),
(137, 17, 1, 5),
(138, 17, 2, 3),
(139, 17, 3, 3),
(140, 17, 4, 2),
(141, 17, 5, 2),
(142, 18, 1, 3),
(143, 18, 2, 5),
(144, 18, 3, 1),
(145, 18, 4, 2),
(146, 18, 5, 3),
(147, 19, 1, 2),
(148, 19, 2, 5),
(149, 19, 3, 5),
(150, 19, 4, 5),
(151, 19, 5, 1),
(152, 20, 1, 5),
(153, 20, 2, 4),
(154, 20, 3, 4),
(155, 20, 4, 5),
(156, 20, 5, 4),
(157, 1, 1, 3),
(158, 1, 2, 4),
(159, 1, 3, 4),
(160, 1, 4, 4),
(161, 1, 5, 5),
(162, 2, 1, 3),
(163, 2, 2, 3),
(164, 2, 3, 3),
(165, 2, 4, 2),
(166, 2, 5, 4),
(167, 3, 1, 1),
(168, 3, 2, 4),
(169, 3, 3, 4),
(170, 3, 4, 1),
(171, 3, 5, 3),
(172, 4, 1, 5),
(173, 4, 2, 5),
(174, 4, 3, 5),
(175, 4, 4, 5),
(176, 4, 5, 5),
(177, 5, 1, 4),
(178, 5, 2, 1),
(179, 5, 3, 4),
(180, 5, 4, 3),
(181, 5, 5, 3),
(182, 6, 1, 2),
(183, 6, 2, 5),
(184, 6, 3, 3),
(185, 6, 4, 4),
(186, 6, 5, 5),
(187, 7, 1, 3),
(188, 7, 2, 3),
(189, 7, 3, 5),
(190, 7, 4, 2),
(191, 7, 5, 5),
(192, 8, 1, 4),
(193, 8, 2, 5),
(194, 8, 3, 2),
(195, 8, 4, 4),
(196, 8, 5, 5),
(197, 9, 1, 5),
(198, 9, 2, 4),
(199, 9, 3, 4),
(200, 9, 4, 3),
(201, 9, 5, 3),
(202, 10, 1, 3),
(203, 10, 2, 2),
(204, 10, 3, 1),
(205, 10, 4, 2),
(206, 10, 5, 5),
(207, 11, 1, 4),
(208, 11, 2, 2),
(209, 11, 3, 4),
(210, 11, 4, 5),
(211, 11, 5, 4),
(212, 12, 1, 5),
(213, 12, 2, 3),
(214, 12, 3, 4),
(215, 12, 4, 3),
(216, 12, 5, 4),
(217, 13, 1, 2),
(218, 13, 2, 5),
(219, 13, 3, 5),
(220, 13, 4, 4),
(221, 13, 5, 5),
(222, 14, 1, 3),
(223, 14, 2, 5),
(224, 14, 3, 3),
(225, 14, 4, 5),
(226, 14, 5, 3),
(227, 15, 1, 1),
(228, 15, 2, 4),
(229, 15, 3, 3),
(230, 15, 4, 4),
(231, 15, 5, 4),
(232, 16, 1, 4),
(233, 16, 2, 4),
(234, 16, 3, 4),
(235, 16, 4, 3),
(236, 16, 5, 4),
(237, 17, 1, 5),
(238, 17, 2, 3),
(239, 17, 3, 3),
(240, 17, 4, 2),
(241, 17, 5, 2),
(242, 18, 1, 3),
(243, 18, 2, 5),
(244, 18, 3, 1),
(245, 18, 4, 2),
(246, 18, 5, 3),
(247, 19, 1, 2),
(248, 19, 2, 5),
(249, 19, 3, 5),
(250, 19, 4, 5),
(251, 19, 5, 1),
(252, 20, 1, 5),
(253, 20, 2, 4),
(254, 20, 3, 4),
(255, 20, 4, 5),
(256, 20, 5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `stok_obat`
--

CREATE TABLE `stok_obat` (
  `id` int(11) NOT NULL,
  `id_alternatif` int(11) NOT NULL,
  `nama_obat` varchar(150) DEFAULT NULL,
  `golongan` varchar(150) DEFAULT NULL,
  `nama_dagang` varchar(255) DEFAULT NULL,
  `produsen` varchar(255) DEFAULT NULL,
  `jumlah_stok` int(11) DEFAULT 0,
  `tanggal_update` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `stok_obat`
--

INSERT INTO `stok_obat` (`id`, `id_alternatif`, `nama_obat`, `golongan`, `nama_dagang`, `produsen`, `jumlah_stok`, `tanggal_update`) VALUES
(1, 1, 'Amlodipine', 'Calcium Channel Blocker (CCB)', 'Norvasc, Amlodipin Hexpharm', 'Pfizer, Hexpharm Jaya', 0, '2025-10-31 14:30:50'),
(2, 2, 'Captopril', 'ACE Inhibitor', 'Capoten, Captopril Dexa', 'Bristol Myers Squibb, Dexa Medica', 0, '2025-10-31 14:30:50'),
(3, 3, 'Lisinopril', 'ACE Inhibitor', 'Zestril, Prinivil', 'AstraZeneca, Merck', 0, '2025-10-31 14:30:50'),
(4, 4, 'Enalapril', 'ACE Inhibitor', 'Renitec, Enapril Dexa', 'Merck, Dexa Medica', 0, '2025-10-31 14:30:50'),
(5, 5, 'Losartan', 'ARB', 'Cozaar, Losartan Novell', 'Merck Sharp & Dohme, Novell Pharma', 0, '2025-10-31 14:30:50'),
(6, 6, 'Valsartan', 'ARB', 'Diovan, Valsartan Novell', 'Novartis, Novell Pharma', 0, '2025-10-31 14:30:50'),
(7, 7, 'Candesartan', 'ARB', 'Atacand', 'AstraZeneca', 0, '2025-10-31 14:30:50'),
(8, 8, 'Telmisartan', 'ARB', 'Micardis', 'Boehringer Ingelheim', 0, '2025-10-31 14:30:50'),
(9, 9, 'Olmesartan', 'ARB', 'Benicar', 'Daiichi Sankyo', 0, '2025-10-31 14:30:50'),
(10, 10, 'Hydrochlorothiazide (HCTZ)', 'Thiazide Diuretic', 'Hydrex', 'Sanbe Farma', 0, '2025-10-31 14:30:50'),
(11, 11, 'Furosemide', 'Loop Diuretic', 'Lasix', 'Sanofi', 0, '2025-10-31 14:30:50'),
(12, 12, 'Spironolactone', 'Potassium-sparing Diuretic', 'Aldactone', 'Pfizer', 0, '2025-10-31 14:30:50'),
(13, 13, 'Bisoprolol', 'Beta Blocker', 'Concor', 'Merck', 0, '2025-10-31 14:30:50'),
(14, 14, 'Metoprolol', 'Beta Blocker', 'Lopressor, Betaloc', 'AstraZeneca', 0, '2025-10-31 14:30:50'),
(15, 15, 'Atenolol', 'Beta Blocker', 'Tenormin', 'AstraZeneca', 0, '2025-10-31 14:30:50'),
(16, 16, 'Propranolol', 'Beta Blocker', 'Inderal', 'ICI Pharma', 0, '2025-10-31 14:30:50'),
(17, 17, 'Clonidine', 'Alpha-2 Adrenergic Agonist', 'Catapres', 'Boehringer Ingelheim', 0, '2025-10-31 14:30:50'),
(18, 18, 'Doxazosin', 'Alpha-1 Blocker', 'Cardura', 'Pfizer', 0, '2025-10-31 14:30:50'),
(19, 19, 'Hydralazine', 'Vasodilator langsung', 'Apresoline', 'Novartis', 0, '2025-10-31 14:30:50'),
(20, 20, 'Nifedipine', 'Calcium Channel Blocker (CCB)', 'Adalat, Nifedipin Dexa', 'Bayer, Dexa Medica', 0, '2025-10-31 14:30:50');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `nama` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('admin','super-admin') DEFAULT 'admin',
  `foto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `nama`, `email`, `password`, `role`, `foto`) VALUES
(4, 'admin', NULL, 'admin@gmail.com', '$2b$10$sxdQa2uZAQ420SJKWmP7VeBjRVpeaOZsxoJuVh3FC8OA8mbtAzZJi', 'super-admin', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alternatif`
--
ALTER TABLE `alternatif`
  ADD PRIMARY KEY (`id_alternatif`);

--
-- Indexes for table `kriteria`
--
ALTER TABLE `kriteria`
  ADD PRIMARY KEY (`id_kriteria`);

--
-- Indexes for table `laporan_wp`
--
ALTER TABLE `laporan_wp`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nilai`
--
ALTER TABLE `nilai`
  ADD PRIMARY KEY (`id_nilai`),
  ADD KEY `id_alternatif` (`id_alternatif`),
  ADD KEY `id_kriteria` (`id_kriteria`);

--
-- Indexes for table `stok_obat`
--
ALTER TABLE `stok_obat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_alternatif` (`id_alternatif`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alternatif`
--
ALTER TABLE `alternatif`
  MODIFY `id_alternatif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id_kriteria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `laporan_wp`
--
ALTER TABLE `laporan_wp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=453;

--
-- AUTO_INCREMENT for table `nilai`
--
ALTER TABLE `nilai`
  MODIFY `id_nilai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- AUTO_INCREMENT for table `stok_obat`
--
ALTER TABLE `stok_obat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `nilai`
--
ALTER TABLE `nilai`
  ADD CONSTRAINT `nilai_ibfk_1` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`),
  ADD CONSTRAINT `nilai_ibfk_2` FOREIGN KEY (`id_kriteria`) REFERENCES `kriteria` (`id_kriteria`);

--
-- Constraints for table `stok_obat`
--
ALTER TABLE `stok_obat`
  ADD CONSTRAINT `stok_obat_ibfk_1` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
