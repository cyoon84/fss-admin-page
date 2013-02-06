<?php

	include 'connection.php';
		
	$action = $_POST['action'];

	if ($action == 'update') {
		$reminderIndex = $_POST['reminderIndex'];
		$remindDate = $_POST['remindDate'];
		$remindReason = $_POST['remindReason'];
		$rem_list_index = $_POST['rem_list_index'];
			
		$user_id = $_POST['user_id'];
		
		$query="update studentreminder set remindDate = '$remindDate', rem_list_index = '$rem_list_index', remindReason = '$remindReason', user_id = '$user_id' where reminderIndex = '$reminderIndex'";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		}
		echo "Update success";
	}

	if ($action == 'delete') {
		$reminderIndex = $_POST['reminderIndex'];

		$query = "delete from studentreminder where reminderIndex = '$reminderIndex'";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		}
		echo "Delete success";

	}

	
	

	mysql_close($con);
?>