<?php

	include 'connection.php';
	
	$id = $_POST['id'];
	$new_eng_name = $_POST['name_eng'];
	$new_kor_name = $_POST['name_kor'];
	$new_email = $_POST['email'];
	$new_address = $_POST['address'];
	$new_dob = $_POST['dob'];
	$new_gender = $_POST['gender'];
	$new_phone = $_POST['phone'];
	$new_visa_type = $_POST['visa_type'];
	$new_arrival_date = $_POST['arrival_date'];
	$new_visa_issue_date = $_POST['visa_issue_date'];
	$new_visa_exp_date = $_POST['visa_exp_date'];
	$new_how_hear_us = $_POST['how_hear_us'];
	$new_referred_by = $_POST['referred_by'];
	$new_korea_agency = $_POST['korea_agency'];
	$new_school_name = $_POST['school_name'];
	$new_program_name = $_POST['current_program'];

	$new_school_start_date = $_POST['school_start_dt'];
	$new_school_end_date = $_POST['school_end_dt'];
	$update_reason = $_POST['update_reason'];
	$updated_by = $_POST['updated_by'];

	$active_row = mysql_fetch_array(mysql_query("select * from studentinfo where studentId='$id' and active_indicator = 'Y'"));
	
	$latest_version = $active_row['version'];

	mysql_query("update studentinfo set active_indicator ='N' where studentId = '$id' and version = '$latest_version'");

	if ($new_dob == '') {
		$new_dob = $active_row['date_birth'];
	}

	if ($new_arrival_date == '') {
		$new_arrival_date = $active_row['arrival_date'];
	}
	
	if ($new_visa_issue_date == '') {
		$new_visa_issue_date = $active_row['visa_issue_date'];
	}

	if ($new_visa_exp_date == '') {
		$new_visa_exp_date = $active_row['visa_exp_date'];
	}

	if ($new_school_start_date == '') {
		$new_school_start_date = $active_row['current_school_strt_dt'];
	}

	if ($new_school_end_date == '') {
		$new_school_end_date = $active_row['current_school_end_dt'];
	}

	if ((($new_school_name != $active_row['current_school']) || 
		 ($new_program_name != $active_row['current_program']) ||
		 ($new_school_start_date != $active_row['current_school_strt_dt'])  || 
		 ($new_school_end_date != $active_row['current_school_end_dt'])) && 
		 ($active_row['current_school'] != '')) {
		
		$current_school = $active_row['current_school'];
		$current_prgm = $active_row['current_program'];
		$current_strt_dt = $active_row['current_school_strt_dt'];
		$current_end_dt = $active_row['current_school_end_dt'];

		$query="INSERT INTO student_prev_school (studentId
									,student_info_ver
									,prev_school_name
									,prev_school_program
									,prev_school_strt_dt
									,prev_school_end_dt
									,user_id)
									VALUES 
									('$id'
									,'$latest_version'
									,'$current_school'
									,'$current_prgm'
									,'$current_strt_dt'
									,'$current_end_dt'
									,'$updated_by')";
		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		}
	}

	if ($new_visa_issue_date != $active_row['visa_issue_date'] ||
		$new_visa_exp_date != $active_row['visa_exp_date'] ||
		$new_visa_type != $active_row['visa_type']) {
		

		$current_visa_type = $active_row['visa_type'];
		$current_visa_issue_date = $active_row['visa_issue_date'];
		$current_visa_exp_date = $active_row['visa_exp_date'];

		$query = "INSERT INTO student_prev_visa (studentId, student_info_ver, prev_visa_type, prev_visa_issue_date, prev_visa_expire_date, user_id) 
					VALUES ('$id','$latest_version','$current_visa_type','$current_visa_issue_date','$current_visa_exp_date', '$updated_by')";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		}

	}

	$new_version = $latest_version + 1;

	$insert_query="INSERT INTO studentinfo (studentId
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
									, how_hear_us 
									, referred_by
									, korea_agency
									, current_school
									, current_program
									, current_school_strt_dt
									, current_school_end_dt
									, updt_reason
									, user_id) 
									VALUES 
									('$id'
									,'$new_version'
									,'Y'
									,'$new_eng_name'
									,'$new_kor_name'
									,'$new_gender'
									,'$new_dob'
									,'$new_email'
									,'$new_phone'
									,'$new_address'
									,'$new_arrival_date'
									,'$new_visa_type'
									,'$new_visa_issue_date'
									,'$new_visa_exp_date'
									,'$new_how_hear_us'
									,'$new_referred_by'
									,'$new_korea_agency'
									,'$new_school_name'
									,'$new_program_name'
									,'$new_school_start_date'
									,'$new_school_end_date'
									,'$update_reason'
									,'$updated_by')";

	if (!mysql_query($insert_query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo "Record updated successfully";
	

	mysql_close($con);
?>