<?php

	include 'connection.php';
	
	$reminderIndex = $_POST['reminderIndex'];
	$student_id = $_POST['student_id'];
	
	//show the most up-to-date record only
	$query="update studentreminder set follow_up_ind = 'N', follow_up_date = '0000-00-00' where studentId = '$student_id' and reminderIndex = '$reminderIndex'";
	
	$result = mysql_query($query, $con);

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	} else {
		echo "Removed from the database";
	}

	mysql_close($con);
?>   