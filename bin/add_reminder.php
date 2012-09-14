<?php

	include 'connection.php';
	

	$studentId = $_POST['studentId'];
	$reminder_date = $_POST['reminder_date'];
	$reason = $_POST['reason'];

	$query="INSERT INTO studentreminder (studentId
									, remindDate
									, remindReason
									, follow_up_date) 
									VALUES 
									('$studentId'
									,'$reminder_date'
									,'$reason'
									,'0000-00-00')";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo "Record added successfully";
	

	mysql_close($con);
?>