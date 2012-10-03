<?php

	include 'connection.php';
		
	$action = $_POST['action'];

	if ($action == 'update') {
		$prevVisaIndex = $_POST['prevVisaIndex'];
		$prev_visa_type = $_POST['prev_visa_type'];
		$prev_visa_issue_date = $_POST['prev_visa_issue_date'];
		$prev_visa_expiry_date = $_POST['prev_visa_expiry_date'];
			
		$user_id = $_POST['user_id'];
		
		$query="update student_prev_visa set prev_visa_type = '$prev_visa_type', prev_visa_issue_date = '$prev_visa_issue_date', prev_visa_expire_date = '$prev_visa_expiry_date',  user_id = '$user_id' where prevVisaIndex = '$prevVisaIndex'";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		}

		echo "Update success";
	}

	if ($action == 'delete') {
		$prevVisaIndex = $_POST['prevVisaIndex'];
		$studentId = $_POST['studentId'];
		$student_info_ver = $_POST['student_info_ver'];

		$query = "delete from student_prev_visa where prevVisaIndex = '$prevVisaIndex'";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		}

		
		$query2 = "update studentinfo set visa_type = '', visa_issue_date = '', visa_exp_date = '', user_id = '$user_id' where studentId = '$studentId' and version = '$student_info_ver'";

		if (!mysql_query($query2, $con)) {
			die('Error: ' . mysql_error());
		}
		
		echo "Delete success";

	}

	
	

	mysql_close($con);
?>