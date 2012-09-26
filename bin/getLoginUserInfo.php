<?php

	include 'connection.php';
	
	$user_id = $_GET['user_id'];
	
	//show the most up-to-date record only
	$query="select * from userlist where user_id='$user_id'";
	
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'user_no' => $row['user_no'],
			'user_id' => $row['user_id'],
			'first_name' => $row['first_name'],
			'last_name' => $row['last_name'],
			'email' => $row['email']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   