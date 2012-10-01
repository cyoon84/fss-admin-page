<?php

	include 'connection.php';
	
	$studentId = $_POST['studentId'];
	$prevSchoolIndex= $_POST['prevSchoolIndex'];
	$version = $_POST['student_info_ver'];
	$user_id = $_POST['user_id'];

	$query="delete from student_prev_school where prevSchoolIndex = '$prevSchoolIndex'";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}

	if ($version > 0) {
		$query2 = "update studentinfo set current_school = '', current_program = '', current_school_strt_dt = '',current_school_end_dt = '', user_id = '$user_id' where studentId = '$studentId' and  version = '$version'";
		if (!mysql_query($query2, $con)) {
			die('Error2: ' . mysql_error());
		}
	
	}
	
	echo "Record deleted successfully";
	

	mysql_close($con);
?>