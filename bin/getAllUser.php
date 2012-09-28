<?php

	include 'connection.php';

	$category = $_GET['category'];

	if ($category == 'All') {

		$query = "SELECT * from studentinfo a inner join 
			(SELECT `studentId`,max(`version`)  as max_version FROM `studentinfo` group by `studentId`) e 
			where a.studentId = e.studentId and a.version = e.max_version  ";

	} else {
		$query = "SELECT * from studentinfo a inner join 
			(SELECT `studentId`,max(`version`)  as max_version FROM `studentinfo` group by `studentId`) e 
			where a.studentId = e.studentId and a.version = e.max_version  and  a.how_hear_us = '$category'";

	}
	

	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {

		$result_out[] = array(
			'student_id' => $row['studentId'],
			'version' => $row['version'],
			'date_birth' => $row['date_birth'],
			'name_eng' => $row['name_eng'],
			'name_kor' => $row['name_kor'],
			'active_indicator' => $row['active_indicator'],
			'email' => $row['email'],
			'phone_no' => $row['phone_no'],
			'date_added' => $row['date_added']

		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>