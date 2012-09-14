<?php

	include 'connection.php';
		
	$visit_record_id = $_POST['visit_record_id'];
	$studentId = $_POST['studentId'];
	$visit_purpose = $_POST['visit_purpose'];

	$query="update studentvisit set visit_purpose ='$visit_purpose' where studentId = '$studentId' and visit_index = '$visit_record_id'" ;

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo "Update success";
	

	mysql_close($con);
?>