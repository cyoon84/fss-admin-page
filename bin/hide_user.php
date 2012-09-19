<?php

	include 'connection.php';

	$id = $_POST['student_id'];

	$result = mysql_query("select version from studentinfo where studentId = '$id' and active_indicator = 'Y'");

	$last_ver = mysql_fetch_array($result);
	$last_ver= $last_ver['version'];

	
	$query="update studentinfo set active_indicator ='N' where studentId = '$id' and version = '$last_ver'";

	if (!mysql_query($query, $con)) {
		die('Error 2: ' . mysql_error());
	}
	
	echo "This student record is now inactive";
	

	mysql_close($con);
?>