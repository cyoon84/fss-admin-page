<?php

	include 'connection.php';
		
	$prevSchoolIndex = $_POST['prevSchoolIndex'];
	$studentId = $_POST['studentId'];
	$student_info_ver = $_POST['student_info_ver'];
	
	$school_name = $_POST['prev_school_name'];
	$school_program = $_POST['prev_school_program'];
	$school_strt_dt = $_POST['prev_school_strt_dt'];
	$school_end_dt = $_POST['prev_school_end_dt'];
		
	$user_id = $_POST['user_id'];
	
	$query="update student_prev_school set prev_school_name = '$school_name', prev_school_program = '$school_program', prev_school_strt_dt = '$school_strt_dt', prev_school_end_dt = '$school_end_dt', user_id = '$user_id' where prevSchoolIndex = '$prevSchoolIndex'";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}


	if ($student_info_ver > 0) {
		$query2 = "update studentinfo set current_school = '$school_name', 
											current_program = '$school_program', 
											current_school_strt_dt = '$school_strt_dt', 
											current_school_end_dt = '$school_end_dt', 
											user_id = '$user_id' 
											where studentId = '$studentId' and version = '$student_info_ver'";

		if (!mysql_query($query2, $con)) {
			die('Error2: ' . mysql_error());
		}

	}
	echo "Update success";
	

	mysql_close($con);
?>