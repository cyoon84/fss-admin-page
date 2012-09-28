<?php

	include 'connection.php';
	
	$student_id = $_GET['student_id'];
	
	//show the most up-to-date record only
	$query="select * from student_prev_school where studentId='$student_id' order by prev_school_strt_dt desc";
	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'prev_school_name' => $row['prev_school_name'],
			'prev_school_program' => $row['prev_school_program'],
			'prev_school_strt_dt' => $row['prev_school_strt_dt'],
			'prev_school_end_dt' => $row['prev_school_end_dt'],
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   