<?php

	include 'connection.php';

	$engName = $_POST['name_eng'];

	$korName = $_POST['name_kor'];

	$gender = $_POST['gender'];

	$date_birth = $_POST['date_birth'];

	$email = $_POST['email'];

	$phone_no = $_POST['phone_no'];

	$address = $_POST['address'];

	$arrival_date = $_POST['arrival_date'];

	$visa_type = $_POST['visa_type'];

	$visa_issue_date = $_POST['visa_issue_date'];

	$visa_expiry_date = $_POST['visa_exp_date'];

	$korean_agency = $_POST['korean_agency'];

	$schoolName = $_POST['current_school'];

	$school_strt_dt = $_POST['current_school_strt_dt'];

	$school_end_dt = $_POST ['current_school_end_dt'];


	$last_id = mysql_query("select max(studentId) from studentinfo");
	$last_id = mysql_fetch_array($last_id,MYSQL_BOTH);
	$last_id = $last_id[0];

	$new_id = $last_id + 1;

	$query="INSERT INTO studentinfo (studentId
									, version
									, active_indicator
									, name_eng
									, name_kor
									, gender
									, date_birth
									, email
									, phone_no
									, address
									, arrival_date
									, visa_type
									, visa_issue_date
									, visa_exp_date
									, korea_agency
									, current_school
									, current_school_strt_dt
									, current_school_end_dt
									, updt_reason) 
									VALUES 
									('$new_id'
									,'0'
									,'Y'
									, '$engName'
									,'$korName'
									,'$gender'
									,'$date_birth'
									,'$email'
									,'$phone_no'
									,'$address'
									,'$arrival_date'
									,'$visa_type'
									,'$visa_issue_date'
									,'$visa_expiry_date'
									,'$korean_agency'
									,'$schoolName'
									,'$school_strt_dt'
									,'$school_end_dt'
									,'Initial record')";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo $new_id;
	

	mysql_close($con);
?>