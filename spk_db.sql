-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 26, 2025 at 09:56 PM
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
(20, 'Nifedipine'),
(25, '	Amlodipine'),
(26, 'Captopril');

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
(1, 'Efektivitas Penurunan TD', 0.3, 'benefit'),
(2, 'Kontraindikasi & Interaksi', 0.25, 'cost'),
(3, 'Profil Efek Samping', 0.2, 'cost'),
(4, 'Dosis harian', 0.15, 'cost'),
(5, 'Biaya Terapi Bulanan', 0.1, 'cost');

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
(8550, '2025-12-27', 'Bisoprolol', 0.0404219, 'Telmisartan'),
(8551, '2025-12-27', 'Metoprolol', 0.0404219, 'Telmisartan'),
(8552, '2025-12-27', 'Atenolol', 0.0404219, 'Telmisartan'),
(8553, '2025-12-27', 'Propranolol', 0.0404219, 'Telmisartan'),
(8554, '2025-12-27', 'Enalapril', 0.0389503, 'Telmisartan'),
(8555, '2025-12-27', 'Furosemide', 0.0337911, 'Telmisartan'),
(8556, '2025-12-27', 'Spironolactone', 0.0337911, 'Telmisartan'),
(8557, '2025-12-27', 'Clonidine', 0.0337911, 'Telmisartan'),
(8558, '2025-12-27', 'Hydralazine', 0.0337911, 'Telmisartan'),
(8559, '2025-12-27', 'Lisinopril', 0.0296845, 'Telmisartan');

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
(7, 3, 1, 1),
(8, 3, 2, 3),
(9, 3, 3, 5),
(10, 3, 4, 5),
(11, 3, 5, 3),
(13, 4, 1, 2),
(14, 4, 2, 4),
(15, 4, 3, 3),
(16, 4, 4, 4),
(17, 4, 5, 3),
(19, 5, 1, 1),
(20, 5, 2, 1),
(21, 5, 3, 1),
(22, 5, 4, 1),
(23, 5, 5, 1),
(25, 6, 1, 1),
(26, 6, 2, 1),
(27, 6, 3, 1),
(28, 6, 4, 1),
(29, 6, 5, 1),
(31, 7, 1, 1),
(32, 7, 2, 1),
(33, 7, 3, 1),
(34, 7, 4, 1),
(35, 7, 5, 5),
(37, 8, 1, 5),
(38, 8, 2, 1),
(39, 8, 3, 1),
(40, 8, 4, 5),
(41, 8, 5, 5),
(43, 9, 1, 5),
(44, 9, 2, 1),
(45, 9, 3, 1),
(46, 9, 4, 5),
(47, 9, 5, 5),
(49, 10, 1, 4),
(50, 10, 2, 3),
(51, 10, 3, 3),
(52, 10, 4, 5),
(53, 10, 5, 5),
(55, 11, 1, 2),
(56, 11, 2, 4),
(57, 11, 3, 4),
(58, 11, 4, 5),
(59, 11, 5, 5),
(61, 12, 1, 2),
(62, 12, 2, 4),
(63, 12, 3, 4),
(64, 12, 4, 5),
(65, 12, 5, 5),
(67, 13, 1, 3),
(68, 13, 2, 4),
(69, 13, 3, 3),
(70, 13, 4, 5),
(71, 13, 5, 5),
(73, 14, 1, 3),
(74, 14, 2, 4),
(75, 14, 3, 3),
(76, 14, 4, 5),
(77, 14, 5, 5),
(79, 15, 1, 3),
(80, 15, 2, 4),
(81, 15, 3, 3),
(82, 15, 4, 5),
(83, 15, 5, 5),
(85, 16, 1, 3),
(86, 16, 2, 4),
(87, 16, 3, 3),
(88, 16, 4, 5),
(89, 16, 5, 5),
(91, 17, 1, 2),
(92, 17, 2, 4),
(93, 17, 3, 4),
(94, 17, 4, 5),
(95, 17, 5, 5),
(97, 18, 1, 3),
(98, 18, 2, 3),
(99, 18, 3, 3),
(100, 18, 4, 5),
(101, 18, 5, 5),
(103, 19, 1, 2),
(104, 19, 2, 4),
(105, 19, 3, 4),
(106, 19, 4, 5),
(107, 19, 5, 5),
(109, 20, 1, 4),
(110, 20, 2, 2),
(111, 20, 3, 2),
(112, 20, 4, 5),
(113, 20, 5, 5),
(2343, 25, 1, 5),
(2344, 25, 2, 4),
(2345, 25, 3, 5),
(2346, 25, 4, 3),
(2347, 25, 5, 5),
(2348, 26, 1, 4),
(2349, 26, 2, 2),
(2350, 26, 3, 3),
(2351, 26, 4, 3),
(2352, 26, 5, 5);

-- --------------------------------------------------------

--
-- Table structure for table `stok_obat`
--

CREATE TABLE `stok_obat` (
  `id_stok` int(11) NOT NULL,
  `id_alternatif` int(11) NOT NULL,
  `nama_obat` varchar(255) NOT NULL,
  `golongan` varchar(255) DEFAULT NULL,
  `fungsi` text DEFAULT NULL,
  `nama_dagang` varchar(255) DEFAULT NULL,
  `produsen` varchar(255) DEFAULT NULL,
  `efek_samping_teks` text DEFAULT NULL,
  `jumlah_stok` int(11) DEFAULT 0,
  `biaya_bulanan` int(11) DEFAULT 0 COMMENT 'Data mentah u/ kriteria Biaya (Cost)',
  `frekuensi_dosis` int(11) DEFAULT 1 COMMENT 'Data mentah u/ kriteria Frekuensi (Cost), misal: 1, 2, 3x sehari',
  `kontraindikasi_teks` text DEFAULT NULL COMMENT 'Catatan u/ kriteria Kontraindikasi (Manual)',
  `tanggal_update` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stok_obat`
--

INSERT INTO `stok_obat` (`id_stok`, `id_alternatif`, `nama_obat`, `golongan`, `fungsi`, `nama_dagang`, `produsen`, `efek_samping_teks`, `jumlah_stok`, `biaya_bulanan`, `frekuensi_dosis`, `kontraindikasi_teks`, `tanggal_update`) VALUES
(3, 3, 'Lisinopril', 'ACE Inhibitor', 'Menurunkan tekanan darah dengan menghambat sistem renin-angiotensin.', 'Zestril, Prinivil', 'AstraZeneca, Merck', 'Batuk, angioedema, hiperkalemia', 0, 0, 1, 'Kehamilan, riwayat angioedema', '2025-11-16 05:41:22'),
(4, 4, 'Enalapril', 'ACE Inhibitor', 'Melebarkan pembuluh darah, menurunkan tekanan darah.', 'Renitec, Enapril Dexa', 'Merck, Dexa Medica', 'Batuk, hiperkalemia, pusing', 0, 0, 1, 'Kehamilan, stenosis arteri renalis', '2025-11-16 05:41:22'),
(5, 5, 'Losartan', 'ARB', 'Menghambat reseptor angiotensin II untuk menurunkan tekanan darah.', 'Cozaar, Losartan Novell', 'Merck Sharp & Dohme, Novell Pharma', 'Pusing, hiperkalemia', 0, 0, 1, 'Kehamilan, stenosis arteri renalis', '2025-11-16 05:41:22'),
(6, 6, 'Valsartan', 'ARB', 'Melindungi jantung dan ginjal, menurunkan tekanan darah.', 'Diovan, Valsartan Novell', 'Novartis, Novell Pharma', 'Pusing, kelelahan', 0, 0, 1, 'Kehamilan', '2025-11-16 05:41:22'),
(7, 7, 'Candesartan', 'ARB', 'Mengontrol tekanan darah dan mencegah gagal jantung.', 'Atacand', 'AstraZeneca', 'Sakit kepala, pusing', 0, 0, 1, 'Kehamilan', '2025-11-16 05:41:22'),
(8, 8, 'Telmisartan', 'ARB', 'Menurunkan tekanan darah dan risiko stroke.', 'Micardis', 'Boehringer Ingelheim', 'Pusing, diare', 0, 0, 1, 'Kehamilan', '2025-11-16 05:41:22'),
(9, 9, 'Olmesartan', 'ARB', 'Mengontrol tekanan darah jangka panjang.', 'Benicar', 'Daiichi Sankyo', 'Pusing, hiperkalemia', 0, 0, 1, 'Kehamilan', '2025-11-16 05:41:22'),
(10, 10, 'Hydrochlorothiazide (HCTZ)', 'Thiazide Diuretic', 'Mengeluarkan garam & air untuk menurunkan tekanan darah.', 'Hydrex', 'Sanbe Farma', 'Hipokalemia, hiponatremia', 0, 0, 1, 'Gout, gagal ginjal berat', '2025-11-16 05:41:22'),
(11, 11, 'Furosemide', 'Loop Diuretic', 'Mengurangi volume cairan tubuh.', 'Lasix', 'Sanofi', 'Dehidrasi, hipokalemia', 0, 0, 1, 'Anuria, dehidrasi berat', '2025-11-16 05:41:22'),
(12, 12, 'Spironolactone', 'Potassium-sparing Diuretic', 'Mengurangi cairan tubuh tanpa kehilangan kalium.', 'Aldactone', 'Pfizer', 'Hiperkalemia, ginekomastia', 0, 0, 1, 'Hiperkalemia, gagal ginjal berat', '2025-11-16 05:41:22'),
(13, 13, 'Bisoprolol', 'Beta Blocker', 'Mengurangi denyut jantung dan tekanan darah.', 'Concor', 'Merck', 'Bradikardia, kelelahan', 0, 0, 1, 'Asma, bradikardia, gagal jantung dekompensasi', '2025-11-16 05:41:22'),
(14, 14, 'Metoprolol', 'Beta Blocker', 'Menurunkan tekanan darah dan menjaga ritme jantung.', 'Lopressor, Betaloc', 'AstraZeneca', 'Lelah, bradikardia', 0, 0, 1, 'Asma, gangguan konduksi jantung', '2025-11-16 05:41:22'),
(15, 15, 'Atenolol', 'Beta Blocker', 'Mengontrol tekanan darah dan detak jantung.', 'Tenormin', 'AstraZeneca', 'Lemas, dingin ekstremitas', 0, 0, 1, 'Asma, syok kardiogenik', '2025-11-16 05:41:22'),
(16, 16, 'Propranolol', 'Beta Blocker', 'Mengontrol tekanan darah dan kecemasan.', 'Inderal', 'ICI Pharma', 'Bronkospasme, kelelahan', 0, 0, 1, 'Asma, bradikardia, blok AV', '2025-11-16 05:41:22'),
(17, 17, 'Clonidine', 'Alpha-2 Adrenergic Agonist', 'Menurunkan aktivitas saraf simpatis, menurunkan tekanan darah.', 'Catapres', 'Boehringer Ingelheim', 'Mulut kering, sedasi', 0, 0, 1, 'Depresi berat, hipotensi berat', '2025-11-16 05:41:22'),
(18, 18, 'Doxazosin', 'Alpha-1 Blocker', 'Melebarkan pembuluh darah dan mengurangi tekanan darah.', 'Cardura', 'Pfizer', 'Hipotensi ortostatik', 0, 0, 1, 'Hipotensi berat', '2025-11-16 05:41:22'),
(19, 19, 'Hydralazine', 'Vasodilator langsung', 'Melebarkan otot pembuluh darah.', 'Apresoline', 'Novartis', 'Takikardia refleks, sakit kepala', 0, 0, 1, 'Lupus (SLE), penyakit jantung koroner', '2025-11-16 05:41:22'),
(20, 20, 'Nifedipine', 'Calcium Channel Blocker (CCB)', 'Mengendurkan pembuluh darah dan menurunkan tekanan darah cepat.', 'Adalat, Nifedipin Dexa', 'Bayer, Dexa Medica', 'Edema, palpitasi, sakit kepala', 0, 0, 1, 'Hipotensi berat, syok kardiogenik', '2025-11-16 05:41:22');

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
(8, 'spk', 'super-admin', 'super@gmail.com', '$2b$10$6ZJ9osNfGjta3Xs569XIwOtvb/6Wcm3fzTPNDdTX2W1GGx8lebdYm', 'super-admin', '/uploads/foto_1766777347596.jpg'),
(9, NULL, 'admin', 'admin@gmail.com', '$2b$10$2ZLAO8voyd0hnxZAMEZwTukpZa.XvRmSAdEFoF4bTSrMoE0d5kf92', 'admin', '/uploads/foto_1766779158724.jpg');

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
  ADD UNIQUE KEY `u_alt_kri` (`id_alternatif`,`id_kriteria`),
  ADD KEY `id_kriteria` (`id_kriteria`);

--
-- Indexes for table `stok_obat`
--
ALTER TABLE `stok_obat`
  ADD PRIMARY KEY (`id_stok`),
  ADD KEY `id_alternatif_fk` (`id_alternatif`);

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
  MODIFY `id_alternatif` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `kriteria`
--
ALTER TABLE `kriteria`
  MODIFY `id_kriteria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `laporan_wp`
--
ALTER TABLE `laporan_wp`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8560;

--
-- AUTO_INCREMENT for table `nilai`
--
ALTER TABLE `nilai`
  MODIFY `id_nilai` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2453;

--
-- AUTO_INCREMENT for table `stok_obat`
--
ALTER TABLE `stok_obat`
  MODIFY `id_stok` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

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
  ADD CONSTRAINT `id_alternatif_fk` FOREIGN KEY (`id_alternatif`) REFERENCES `alternatif` (`id_alternatif`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
