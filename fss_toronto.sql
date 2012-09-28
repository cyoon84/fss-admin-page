-- phpMyAdmin SQL Dump
-- version 3.5.2.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Sep 13, 2012 at 08:01 PM
-- Server version: 5.5.27
-- PHP Version: 5.3.15

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `fss_toronto`
--

-- --------------------------------------------------------

--
-- Table structure for table `studentinfo`
--

CREATE TABLE IF NOT EXISTS `studentinfo` (
  `studentId` int(5) NOT NULL,
  `version` int(5) NOT NULL DEFAULT '0',
  `active_indicator` char(1) NOT NULL,
  `name_eng` varchar(50) NOT NULL,
  `name_kor` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `gender` varchar(10) NOT NULL,
  `date_birth` varchar(10) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone_no` varchar(20) NOT NULL,
  `address` varchar(150) NOT NULL,
  `arrival_date` varchar(10) NOT NULL,
  `visa_type` varchar(20) NOT NULL,
  `visa_issue_date` varchar(10) NOT NULL,
  `visa_exp_date` varchar(10) NOT NULL,
  `how_hear_us` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `referred_by` varchar(20) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `korea_agency` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `current_school` varchar(50) NOT NULL,
  `current_program` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `current_school_strt_dt` varchar(10) NOT NULL,
  `current_school_end_dt` varchar(10) NOT NULL,
  `updt_reason` varchar(100) DEFAULT NULL,
  `user_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `date_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`studentId`,`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- --------------------------------------------------------

--
-- Table structure for table `studentreminder`
--

CREATE TABLE IF NOT EXISTS `studentreminder` (
  `reminderIndex` int(5) NOT NULL AUTO_INCREMENT,
  `studentId` int(5) NOT NULL,
  `remindDate` varchar(10) CHARACTER SET utf8 NOT NULL,
  `remindReason` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `follow_up_ind` char(1) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'N',
  `follow_up_date` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `date_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reminderIndex`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;


--
-- Table structure for table `studentvisit`
--

CREATE TABLE IF NOT EXISTS `studentvisit` (
  `visit_index` int(5) NOT NULL AUTO_INCREMENT,
  `studentId` int(5) NOT NULL,
  `visit_date` varchar(10) CHARACTER SET utf8 NOT NULL,
  `visit_purpose` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `visit_note` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `add_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`visit_index`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=0 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

--
-- Table structure for table `student_prev_school`
--

CREATE TABLE IF NOT EXISTS `student_prev_school` (
  `prevSchoolIndex` int(5) NOT NULL AUTO_INCREMENT,
  `studentId` int(5) NOT NULL,
  `student_info_ver` int(5) NOT NULL DEFAULT '0',
  `prev_school_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `prev_school_program` varchar(50) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `prev_school_strt_dt` varchar(10) NOT NULL,
  `prev_school_end_dt` varchar(10) NOT NULL,
  `user_id` varchar(15) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `date_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prevSchoolIndex`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=0 ;