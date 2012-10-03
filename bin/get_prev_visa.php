<?php

	include 'connection.php';
	
	

	$criteria = $_GET['criteria'];

	if ($criteria == 'all') {
		$student_id = $_GET['student_id'];
		//show the most up-to-date record only
		$query="select * from student_prev_visa where studentId='$student_id' order by prev_visa_issue_date desc";
	} 

	if ($criteria == 'one') {
		$index = $_GET['prevVisaIndex'];
		$query="select * from student_prev_visa where prevVisaIndex = '$index'";

	}
	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'studentId' => $row['studentId'],
			'prevVisaIndex' => $row['prevVisaIndex'],
			'prev_visa_type' => $row['prev_visa_type'],
			'prev_visa_issue_date' => $row['prev_visa_issue_date'],
			'prev_visa_expire_date' => $row['prev_visa_expire_date']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>   