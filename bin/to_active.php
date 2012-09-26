<?php

	include 'connection.php';
	
	$id = $_POST['studentId'];
	$version = $_POST['version_latest'];
	$user_id = $_POST['active_by'];
	
	if (!mysql_query("update studentinfo set active_indicator ='Y', user_id = '$user_id' where studentId = '$id' and version = '$version'")) {
		die ('Error' . mysql_error());
	}
	
	
	echo "update successful";

	mysql_close($con);
?>