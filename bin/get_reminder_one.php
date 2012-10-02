<?php

	include 'connection.php';
	
	$reminderIndex = $_GET['reminderIndex'];


	//show the most up-to-date record only

	$query="select * from studentreminder where reminderIndex = '$reminderIndex'";

	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'studentId' => $row['studentId'],
			'remindDate' => $row['remindDate'],
			'remindReason' => $row['remindReason'],
			'user_id' => $row['user_id']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   