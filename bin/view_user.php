<?php

	include 'connection.php';
	
	$id = $_GET['studentId'];
	
	//show the most up-to-date record only
	$query="select * from studentinfo where studentId='$id' and active_indicator = 'Y'";
	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'student_id' => $row['studentId'],
			'version' => $row['version'],
			'name_eng' => $row['name_eng'],
			'name_kor' => $row['name_kor'],
			'birthdate' => $row['date_birth'],
			'gender' => $row['gender'],
			'email' => $row['email'],
			'phone' => $row['phone_no'],
			'address' => $row['address'],
			'arrival_dt' => $row['arrival_date'],
			'visa_type' => $row['visa_type'],
			'visa_issue_date' => $row['visa_issue_date'],
			'visa_exp_date' => $row['visa_exp_date'],
			'korea_agency' => $row['korea_agency'],
			'current_school' => $row['current_school'],
			'current_school_strt_dt' => $row['current_school_strt_dt'],
			'current_school_end_dt' => $row['current_school_end_dt'],
			'updt_reason' => $row['updt_reason']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   