<?php

	include 'connection.php';
	
	$id = $_GET['studentId'];

	$visit_id = $_GET['visit_recordId'];
	
	//show the most up-to-date record only
	$query="select * from studentvisit where studentId='$id' and visit_index='$visit_id'";
	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'visit_index' => $row['visit_index'],
			'student_id' => $row['studentId'],
			'visit_date' => $row['visit_date'],
			'visit_purpose' => $row['visit_purpose'],
			'visit_note' => $row['visit_note']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   