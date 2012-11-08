<?php

	include 'connection.php';
	
	$action = $_POST['action'];

	if ($action == 'edit') {
		$visit_index = $_POST['visit_index'];
		$visit_date = $_POST['visit_date'];
		$visit_purpose = $_POST['visit_purpose'];
		$visit_note = $_POST['visit_note'];
		$user_id = $_POST['user_id'];

		$query="update studentvisit 
					set visit_date = '$visit_date'
						, visit_purpose = '$visit_purpose'
						, visit_note = '$visit_note'
						, user_id = '$user_id' 
					where visit_index = '$visit_index'";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		} else {
			echo "update success";
		}

	}

	if ($action == 'del') {
		$visit_index = $_POST['visit_index'];

		$query = "DELETE from studentvisit where visit_index = '$visit_index'";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		} else {
			echo "delete success";
		}
	}
	

	mysql_close($con);
?>