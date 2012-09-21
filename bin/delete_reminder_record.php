<?php

	include 'connection.php';
	
	$reminderIndex = $_POST['reminderIndex'];
	$student_id = $_POST['student_id'];
	
	//show the most up-to-date record only
	$query="delete from studentreminder where studentId = '$student_id' and reminderIndex = '$reminderIndex'";
	
	$result = mysql_query($query, $con);

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	} else {
		echo "Follow up complete";
	}

	mysql_close($con);
?>   