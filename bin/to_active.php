<?php

	include 'connection.php';
	
	$id = $_POST['studentId'];
	$version = $_POST['version_latest'];
	
	if (!mysql_query("update studentinfo set active_indicator ='Y' where studentId = '$id' and version = '$version'")) {
		die ('Error' . mysql_error());
	}
	
	
	echo "update successful";

	mysql_close($con);
?>