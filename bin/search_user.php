<?php

	include 'connection.php';
	
	$name = $_GET['name'];
	$lang = $_GET['language_name'];
	$school_type = $_GET['school_type'];
	$school_index = $_GET['school_index'];
	$email = $_GET['email'];
	$phone = $_GET['phone'];
	$unique_id = $_GET['unique_id'];
	$note = $_GET['note'];
	$status = $_GET['status'];

	if ($status == 'active') {
		if ($school_type == '0') {
			$query = "select * from studentinfo where active_indicator = 'Y'";
		} else {
			$query = "select * from studentinfo a inner join (select school_index as school_index2 from school_list where school_type = '$school_type') b on a.school_index = b.school_index2 where a.active_indicator = 'Y'";
		}
	}

	if ($status == 'inactive') {
		if ($school_type != 0 && $school_index == 0) {
			$query = "select * from studentinfo a inner join 
					(select distinct `studentId`, max(`version`) as max_version 
					from studentinfo where `studentId` not in (
						SELECT `studentId` FROM `studentinfo` WHERE `active_indicator`= 'Y' group by `studentId`) group by `studentId`) b 
					on a.`studentId` = b.`studentId` and a.`version` = b.`max_version`
					inner join (select school_index, school_name from school_list where school_type = '$school_type') c on a.`school_index` = c.`school_index`";
		} else {
			$query = "select * from studentinfo a inner join 
					(select distinct `studentId`, max(`version`) as max_version 
					from studentinfo where `studentId` not in (
						SELECT `studentId` FROM `studentinfo` WHERE `active_indicator`= 'Y' group by `studentId`) group by `studentId`) b 
					on a.`studentId` = b.`studentId` and a.`version` = b.`max_version` ";
		}
	}

	if ($name != '') {
		if ($lang == 'Korean') {
			$query= $query." and name_kor like '%$name%'";
		} 
		if ($lang == 'English') {
			$query= $query." and name_eng like '%$name%'";
		}
	}

	if ($school_type != '0' && $school_index != 0)
	$query = $query." and school_index = '$school_index'";
	
	if ($email != '') {
		$query = $query." and email like '%$email%'";
	}

	if ($phone != '') {
		$query = $query." and phone_no like '%$phone%'";
	}

	if ($unique_id != '') {
		$query = $query." and unique_id like '%$unique_id%'";	
	}

	if ($note != '') {
		$query = $query." and note like '%$note%'";	
	}

	$query = $query." order by name_kor;";

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