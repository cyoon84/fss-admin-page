<?php
	include 'connection.php';
	
	$title = $_POST['title'];
	$body = $_POST['body'];
	$user_id = $_POST['user_id'];
	

	$query = "INSERT INTO announcements (title, body, user_id) values ('$title', '$body', '$user_id')";

	if (!mysql_query($query, $con)) {
		die('Error1: ' . mysql_error());
	} 
	
	echo "added successfully";



?>