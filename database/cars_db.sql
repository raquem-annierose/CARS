-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 29, 2025 at 08:58 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cars_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `user_id`, `last_name`, `first_name`, `middle_name`, `created_by`) VALUES
(1, 1, 'Admin', 'Head', 'System', 1);

-- --------------------------------------------------------

--
-- Table structure for table `amenity`
--

CREATE TABLE `amenity` (
  `amenity_id` int(11) NOT NULL,
  `amenity_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `attendee`
--

CREATE TABLE `attendee` (
  `attendee_id` int(11) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `attendee_type` enum('Resident','Guest') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `basketballcourtreservation`
--

CREATE TABLE `basketballcourtreservation` (
  `basketball_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `date_reserved` date NOT NULL,
  `time_reserved` time DEFAULT NULL,
  `rate_daytime` decimal(10,2) DEFAULT NULL,
  `rate_nighttime` decimal(10,2) DEFAULT NULL,
  `conforme_by` int(11) DEFAULT NULL,
  `conforme_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `basketballcourt_attendee`
--

CREATE TABLE `basketballcourt_attendee` (
  `basketball_id` int(11) NOT NULL,
  `attendee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `functionareacaterer`
--

CREATE TABLE `functionareacaterer` (
  `caterer_id` int(11) NOT NULL,
  `functionarea_id` int(11) NOT NULL,
  `caterer_company_name` varchar(100) DEFAULT NULL,
  `caterer_in_charge_name` varchar(100) DEFAULT NULL,
  `caterer_office_address` text DEFAULT NULL,
  `caterer_contact_number` varchar(50) DEFAULT NULL,
  `caterer_in_charge_signature` tinyint(1) DEFAULT NULL,
  `signature_image_path` varchar(100) DEFAULT NULL,
  `caterer_in_charge_signature_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `functionareareservation`
--

CREATE TABLE `functionareareservation` (
  `functionarea_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `area_type` enum('pavilion','clubhouse','activity center') NOT NULL,
  `function_datetime` datetime NOT NULL,
  `function_type` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `functionareasponsoredoutsiderdetails`
--

CREATE TABLE `functionareasponsoredoutsiderdetails` (
  `outsiderdetail_id` int(11) NOT NULL,
  `functionarea_id` int(11) NOT NULL,
  `sponsored_outsider_name` varchar(100) DEFAULT NULL,
  `sponsored_outsider_contact_numbers` varchar(100) DEFAULT NULL,
  `relation_to_owner` varchar(100) DEFAULT NULL,
  `sponsored_outsider_address` text DEFAULT NULL,
  `sponsored_outsider_signature` tinyint(1) DEFAULT NULL,
  `signature_image_path` varchar(230) DEFAULT NULL,
  `sponsored_outsider_signature_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `reservation_id` int(11) DEFAULT NULL,
  `payment_status` enum('pending','fully paid','50% down','billed') NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `official_receipt_no` varchar(50) DEFAULT NULL,
  `date_of_payment` date DEFAULT NULL,
  `payment_received_by` int(11) DEFAULT NULL,
  `payment_type` enum('Reservation Fee','Additional Charges','Guarantee Deposit') NOT NULL,
  `payment_method` enum('Cash','Online') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `reservation_id` int(11) NOT NULL,
  `amenity_id` int(11) NOT NULL,
  `resident_id` int(11) NOT NULL,
  `purpose_of_use` text DEFAULT NULL,
  `reservation_date` date NOT NULL,
  `conforme_by_resident` int(11) NOT NULL,
  `conforme_date_resident` date NOT NULL,
  `security_personnel_id` int(11) DEFAULT NULL,
  `approved_by` int(11) DEFAULT NULL,
  `approval_date` date DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resident`
--

CREATE TABLE `resident` (
  `resident_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL,
  `unit_number` varchar(20) NOT NULL,
  `building` varchar(50) NOT NULL,
  `contact_number` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `securitypersonnel`
--

CREATE TABLE `securitypersonnel` (
  `security_id` int(11) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `middle_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `swimmingpoolpermit`
--

CREATE TABLE `swimmingpoolpermit` (
  `swimmingpool_id` int(11) NOT NULL,
  `reservation_id` int(11) NOT NULL,
  `date_of_use` date NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `date_approved` date DEFAULT NULL,
  `comments_or_deficiencies` text DEFAULT NULL,
  `num_registered_residents` int(11) DEFAULT NULL,
  `num_guests` int(11) DEFAULT NULL,
  `charges_200` decimal(10,2) DEFAULT NULL,
  `charges_300` decimal(10,2) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `date_prepared` date DEFAULT NULL,
  `charges_conforme_by` int(11) DEFAULT NULL,
  `charges_date_conforme` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `swimmingpool_attendee`
--

CREATE TABLE `swimmingpool_attendee` (
  `swimmingpool_id` int(11) NOT NULL,
  `attendee_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('resident','admin') NOT NULL,
  `profile_image_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password_hash`, `role`, `profile_image_path`, `created_at`) VALUES
(1, 'headadmin', 'headadmin@gmail.com', '$2b$12$VvDMi7WrmWHxVMU.xyqa2u9k39KIEGo7sJVA6B4t.4QEnY./NTamy', 'admin', NULL, '2025-05-29 14:56:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `amenity`
--
ALTER TABLE `amenity`
  ADD PRIMARY KEY (`amenity_id`),
  ADD UNIQUE KEY `amenity_name` (`amenity_name`);

--
-- Indexes for table `attendee`
--
ALTER TABLE `attendee`
  ADD PRIMARY KEY (`attendee_id`);

--
-- Indexes for table `basketballcourtreservation`
--
ALTER TABLE `basketballcourtreservation`
  ADD PRIMARY KEY (`basketball_id`),
  ADD UNIQUE KEY `reservation_id` (`reservation_id`),
  ADD KEY `conforme_by` (`conforme_by`);

--
-- Indexes for table `basketballcourt_attendee`
--
ALTER TABLE `basketballcourt_attendee`
  ADD PRIMARY KEY (`basketball_id`,`attendee_id`),
  ADD KEY `attendee_id` (`attendee_id`);

--
-- Indexes for table `functionareacaterer`
--
ALTER TABLE `functionareacaterer`
  ADD PRIMARY KEY (`caterer_id`),
  ADD KEY `functionarea_id` (`functionarea_id`);

--
-- Indexes for table `functionareareservation`
--
ALTER TABLE `functionareareservation`
  ADD PRIMARY KEY (`functionarea_id`),
  ADD UNIQUE KEY `reservation_id` (`reservation_id`);

--
-- Indexes for table `functionareasponsoredoutsiderdetails`
--
ALTER TABLE `functionareasponsoredoutsiderdetails`
  ADD PRIMARY KEY (`outsiderdetail_id`),
  ADD KEY `functionarea_id` (`functionarea_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `payment_received_by` (`payment_received_by`),
  ADD KEY `reservation_id` (`reservation_id`);

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`reservation_id`),
  ADD KEY `amenity_id` (`amenity_id`),
  ADD KEY `resident_id` (`resident_id`),
  ADD KEY `security_personnel_id` (`security_personnel_id`),
  ADD KEY `approved_by` (`approved_by`),
  ADD KEY `conforme_by_resident` (`conforme_by_resident`);

--
-- Indexes for table `resident`
--
ALTER TABLE `resident`
  ADD PRIMARY KEY (`resident_id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `securitypersonnel`
--
ALTER TABLE `securitypersonnel`
  ADD PRIMARY KEY (`security_id`);

--
-- Indexes for table `swimmingpoolpermit`
--
ALTER TABLE `swimmingpoolpermit`
  ADD PRIMARY KEY (`swimmingpool_id`),
  ADD UNIQUE KEY `reservation_id` (`reservation_id`),
  ADD KEY `charges_conforme_by` (`charges_conforme_by`);

--
-- Indexes for table `swimmingpool_attendee`
--
ALTER TABLE `swimmingpool_attendee`
  ADD PRIMARY KEY (`swimmingpool_id`,`attendee_id`),
  ADD KEY `attendee_id` (`attendee_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `amenity`
--
ALTER TABLE `amenity`
  MODIFY `amenity_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `attendee`
--
ALTER TABLE `attendee`
  MODIFY `attendee_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `basketballcourtreservation`
--
ALTER TABLE `basketballcourtreservation`
  MODIFY `basketball_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `functionareacaterer`
--
ALTER TABLE `functionareacaterer`
  MODIFY `caterer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `functionareareservation`
--
ALTER TABLE `functionareareservation`
  MODIFY `functionarea_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `functionareasponsoredoutsiderdetails`
--
ALTER TABLE `functionareasponsoredoutsiderdetails`
  MODIFY `outsiderdetail_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `reservation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resident`
--
ALTER TABLE `resident`
  MODIFY `resident_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `securitypersonnel`
--
ALTER TABLE `securitypersonnel`
  MODIFY `security_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `swimmingpoolpermit`
--
ALTER TABLE `swimmingpoolpermit`
  MODIFY `swimmingpool_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `admin_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `basketballcourtreservation`
--
ALTER TABLE `basketballcourtreservation`
  ADD CONSTRAINT `basketballcourtreservation_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`),
  ADD CONSTRAINT `basketballcourtreservation_ibfk_2` FOREIGN KEY (`conforme_by`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `basketballcourt_attendee`
--
ALTER TABLE `basketballcourt_attendee`
  ADD CONSTRAINT `basketballcourt_attendee_ibfk_1` FOREIGN KEY (`basketball_id`) REFERENCES `basketballcourtreservation` (`basketball_id`),
  ADD CONSTRAINT `basketballcourt_attendee_ibfk_2` FOREIGN KEY (`attendee_id`) REFERENCES `attendee` (`attendee_id`);

--
-- Constraints for table `functionareacaterer`
--
ALTER TABLE `functionareacaterer`
  ADD CONSTRAINT `functionareacaterer_ibfk_1` FOREIGN KEY (`functionarea_id`) REFERENCES `functionareareservation` (`functionarea_id`);

--
-- Constraints for table `functionareareservation`
--
ALTER TABLE `functionareareservation`
  ADD CONSTRAINT `functionareareservation_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`);

--
-- Constraints for table `functionareasponsoredoutsiderdetails`
--
ALTER TABLE `functionareasponsoredoutsiderdetails`
  ADD CONSTRAINT `functionareasponsoredoutsiderdetails_ibfk_1` FOREIGN KEY (`functionarea_id`) REFERENCES `functionareareservation` (`functionarea_id`);

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`payment_received_by`) REFERENCES `admin` (`admin_id`),
  ADD CONSTRAINT `payment_ibfk_2` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`);

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`amenity_id`) REFERENCES `amenity` (`amenity_id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`resident_id`) REFERENCES `resident` (`resident_id`),
  ADD CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`security_personnel_id`) REFERENCES `securitypersonnel` (`security_id`),
  ADD CONSTRAINT `reservation_ibfk_4` FOREIGN KEY (`approved_by`) REFERENCES `admin` (`admin_id`),
  ADD CONSTRAINT `reservation_ibfk_5` FOREIGN KEY (`conforme_by_resident`) REFERENCES `resident` (`resident_id`);

--
-- Constraints for table `resident`
--
ALTER TABLE `resident`
  ADD CONSTRAINT `resident_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `swimmingpoolpermit`
--
ALTER TABLE `swimmingpoolpermit`
  ADD CONSTRAINT `swimmingpoolpermit_ibfk_1` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`reservation_id`),
  ADD CONSTRAINT `swimmingpoolpermit_ibfk_2` FOREIGN KEY (`charges_conforme_by`) REFERENCES `admin` (`admin_id`);

--
-- Constraints for table `swimmingpool_attendee`
--
ALTER TABLE `swimmingpool_attendee`
  ADD CONSTRAINT `swimmingpool_attendee_ibfk_1` FOREIGN KEY (`swimmingpool_id`) REFERENCES `swimmingpoolpermit` (`swimmingpool_id`),
  ADD CONSTRAINT `swimmingpool_attendee_ibfk_2` FOREIGN KEY (`attendee_id`) REFERENCES `attendee` (`attendee_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
