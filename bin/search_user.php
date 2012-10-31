<?php

	include 'connection.php';
	
	$name = $_GET['name'];
	$lang = $_GET['language_name'];
	$school = $_GET['school_name'];
	$email = $_GET['email'];
	$phone = $_GET['phone'];
	$unique_id = $_GET['unique_id'];
	$status = $_GET['status'];


	if ($status == 'active') {
		$query = "select * from studentinfo where active_indicator = 'Y'";
	}
	if ($status == 'inactive') {
		$query = "select * from studentinfo a inner join 
					(select distinct `studentId`, max(`version`) as max_version 
					from studentinfo where `studentId` not in (
						SELECT `studentId` FROM `studentinfo` WHERE `active_indicator`= 'Y' group by `studentId`) group by `studentId`) b 
					on a.`studentId` = b.`studentId` and a.`version` = b.`max_version` ";
	}

	if ($name != '') {
		if ($lang == 'Korean') {
			$query= $query." and name_kor like '%$name%'";
		} 
		if ($lang == 'English') {
			$query= $query." and name_eng like '%$name%'";
		}
	}

	if ($school != '') {
		$query = $query." and current_school like '%$school%'";
	}

	if ($email != '') {
		$query = $query." and email like '%$email%'";
	}

	if ($phone != '') {
		$query = $query." and phone_no like '%$phone%'";
	}

	if ($unique_id != '') {
		$query = $query." and unique_id like '%$unique_id%'";	
	}

	$query = $query.";";

	$result = mysql_query($query, $con);

	if (!$result) {
		die('Error2: ' . mysql_error());
	} else {



		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'student_id' => $row['studentId'],
				'unique_id' => $row['unique_id'],
				'version' => $row['version'],
				'name_eng' => $row['name_eng'],
				'name_kor' => $row['name_kor'],
				'email' => $row['email'],
				'phone_no' => $row['phone_no']
			);
		}

		echo json_encode($result_out);
	}
	
	mysql_close($con);
?>