<?php

	include 'connection.php';
	
	$id = $_GET['studentId'];
	
	//show the most up-to-date record only
	$query="select * from studentreminder where studentId='$id' order by remindDate asc";
	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'reminderIndex' => $row['reminderIndex'],
			'studentId' => $row['studentId'],
			'remindDate' => $row['remindDate'],
			'remindReason' => $row['remindReason'],
			'follow_up_ind' => $row['follow_up_ind']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   