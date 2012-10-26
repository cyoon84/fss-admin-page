<?php

	include 'connection.php';
		
	$action = $_POST['action'];

	if ($action == 'add') {
		$student_id = $_POST['student_id'];
		$prev_school_name = $_POST['prev_school_name'];
		$prev_school_program = $_POST['prev_school_program'];
		$prev_school_strt_dt = $_POST['prev_school_strt_dt'];
		$prev_school_end_dt = $_POST['prev_school_end_dt'];
		$user_id = $_POST['user_id'];

		$query="INSERT INTO student_prev_school (
									 studentId
									,prev_school_name
									,prev_school_program
									,prev_school_strt_dt
									,prev_school_end_dt
									,user_id)
					VALUES ('$student_id'
							,'$prev_school_name'
							,'$prev_school_program'
							,'$prev_school_strt_dt'
							,'$prev_school_end_dt'
							,'$user_id')";
	
		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		} else { 

			echo "insert success";
		}
	}


	mysql_close($con);
?>