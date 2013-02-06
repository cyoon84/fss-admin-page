<?php

	include 'connection.php';
	

	$studentId = $_POST['studentId'];
	$reminder_date = $_POST['reminder_date'];
	$reason = $_POST['reason'];
	$added_by = $_POST['added_by'];
	$rem_list_index = $_POST['rem_list_index'];

	$query="INSERT INTO studentreminder (studentId
									, remindDate
									, remindReason
									, rem_list_index
									, follow_up_date
									, user_id) 
									VALUES 
									('$studentId'
									,'$reminder_date'
									,'$reason'
									,'$rem_list_index'
									,'0000-00-00'
									,'$added_by')";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo "Record added successfully";
	

	mysql_close($con);
?>