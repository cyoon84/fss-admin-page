<?php

	include 'connection.php';
	
	$prevSchoolIndex = $_GET['prevSchoolIndex'];

	$query="select * from student_prev_school where prevSchoolIndex = '$prevSchoolIndex'";
	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'studentId' => $row['studentId'],
			'student_info_ver' => $row['student_info_ver'],
			'prev_school_name' => $row['prev_school_name'],
			'prev_school_program' => $row['prev_school_program'],
			'prev_school_strt_dt' => $row['prev_school_strt_dt'],
			'prev_school_end_dt' => $row['prev_school_end_dt'],
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   