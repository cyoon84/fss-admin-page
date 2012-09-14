<?php

	include 'connection.php';
	

	$visit_record_id = $_POST['visit_record_id'];
	$studentId = $_POST['studentId'];
	$visit_date = $_POST['date'];
	$visit_purpose = $_POST['purpose'];
	$visit_note = $_POST['note'];

	$query="INSERT INTO studentvisit (studentId
									, visit_date
									, visit_purpose
									, visit_note) 
									VALUES 
									('$studentId'
									,'$visit_date'
									,'$visit_purpose'
									,'$visit_note')";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo "Record added successfully";
	

	mysql_close($con);
?>