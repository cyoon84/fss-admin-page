<?php

	include 'connection.php';
	
	$studentId = $_POST['studentId'];
	$visit_recordId = $_POST['visit_recordId'];

	$query="delete from studentvisit where studentId = '$studentId' and visit_index = '$visit_recordId'";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo "Record deleted successfully";
	

	mysql_close($con);
?>