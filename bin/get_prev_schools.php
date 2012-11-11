<?php

	include 'connection.php';
	
	$student_id = $_GET['student_id'];
	
	//show the most up-to-date record only
	$query="select a.prevSchoolIndex, b.school_name, a.prev_school_program, a.prev_school_strt_dt, a.prev_school_end_dt from student_prev_school a inner join school_list b on a.school_index = b.school_index where studentId='$student_id' order by prev_school_strt_dt desc";
	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'prevSchoolIndex' => $row['prevSchoolIndex'],
			'prev_school_name' => $row['school_name'],
			'prev_school_program' => $row['prev_school_program'],
			'prev_school_strt_dt' => $row['prev_school_strt_dt'],
			'prev_school_end_dt' => $row['prev_school_end_dt'],
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   