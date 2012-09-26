<?php

	include 'connection.php';
		
	$visit_record_id = $_POST['visit_record_id'];
	$studentId = $_POST['studentId'];
	$visit_date = $_POST['date'];
	$updated_by = $_POST['updated_by'];

	$query="update studentvisit set visit_date ='$visit_date' where studentId = '$studentId' and visit_index = '$visit_record_id' and user_id = '$updated_by' ;

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}
	
	echo "Update success";
	

	mysql_close($con);
?>