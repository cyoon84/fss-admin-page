<?php

	include 'connection.php';
	
	$reminderIndex = $_POST['reminderIndex'];
	$follow_up_dt = $_POST['follow_up_date'];
	$updated_by = $_POST['updated_by'];
	
	//show the most up-to-date record only
	$query="update studentreminder set follow_up_ind = 'Y', follow_up_date = '$follow_up_dt', user_id = '$updated_by' where reminderIndex = '$reminderIndex'";
	
	$result = mysql_query($query, $con);

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	} else {
		echo "Follow up complete";
	}

	mysql_close($con);
?>   