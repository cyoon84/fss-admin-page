<?php

	include 'connection.php';
	
	$id = $_GET['student_id'];
	$follow_up = $_GET['follow_up'];


	//show the most up-to-date record only

	if ($follow_up == 'N') {
		$query="select * from studentreminder where studentId ='$id' and follow_up_ind = '$follow_up' order by remindDate asc";
	} else {
		$query="select * from studentreminder where studentId ='$id' and follow_up_ind = '$follow_up' order by follow_up_date asc";
	}

	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'reminderIndex' => $row['reminderIndex'],
			'studentId' => $row['studentId'],
			'remindDate' => $row['remindDate'],
			'remindReason' => $row['remindReason'],
			'follow_up_ind' => $row['follow_up_ind'],
			'follow_up_date' => $row['follow_up_date']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   