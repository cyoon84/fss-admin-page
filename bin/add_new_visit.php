<?php

	include 'connection.php';
	
	$studentId = $_POST['studentId'];
	$visit_date = $_POST['date'];
	$visit_purpose = $_POST['purpose'];
	$visit_note = $_POST['note'];
	$updated_by = $_POST['updated_by'];

	$query="INSERT INTO studentvisit (studentId
									, visit_date
									, visit_purpose
									, visit_note
									, user_id) 
									VALUES 
									('$studentId'
									,'$visit_date'
									,'$visit_purpose'
									,'$visit_note'
									,'$updated_by')";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo "Record added successfully";
	

	mysql_close($con);
?>