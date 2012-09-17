<?php

	include 'connection.php';

	$id = $_POST['student_id'];

	$query = "DELETE from studentinfo where studentID = '$id'";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}


	$query = "DELETE from studentvisit where studentID = '$id'";
	
	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	$query = "DELETE from studentreminder where studentID = '$id'";
	
	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}

	echo "Record deleted successfully";
	

	mysql_close($con);
?>