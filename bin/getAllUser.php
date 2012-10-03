<?php

	include 'connection.php';

	$action = $_GET['action'];

	if ($action == 'all') {

		$category = $_GET['category'];

		if ($category == 'All') {

			$query = "SELECT * from studentinfo a inner join 
				(SELECT `studentId`,max(`version`)  as max_version FROM `studentinfo` group by `studentId`) e 
				where a.studentId = e.studentId and a.version = e.max_version ";

		} else {
			$query = "SELECT * from studentinfo a inner join 
				(SELECT `studentId`,max(`version`)  as max_version FROM `studentinfo` group by `studentId`) e 
				where a.studentId = e.studentId and a.version = e.max_version  and  a.how_hear_us = '$category'";

		}
	
		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {

			$result_out[] = array(
				'student_id' => $row['studentId'],
				'version' => $row['version'],
				'date_birth' => $row['date_birth'],
				'name_eng' => $row['name_eng'],
				'name_kor' => $row['name_kor'],
				'active_indicator' => $row['active_indicator'],
				'email' => $row['email'],
				'phone_no' => $row['phone_no'],
				'date_added' => $row['date_added']

			);
		}
	}

	if ($action == 'visa_expiry_daterange_count') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];
		$query = "SELECT count(*) as visa_expiry_count from studentinfo where active_indicator = 'Y' and visa_exp_date between '$start_date' and '$end_date'";

		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {

			$result_out[] = array(
				'visa_expiry_count' => $row['visa_expiry_count']
			);
		}
	}


	echo json_encode($result_out);
	
	mysql_close($con);
?>