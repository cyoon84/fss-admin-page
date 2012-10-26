<?php

	include 'connection.php';
	
	$name = $_GET['name'];
	$lang = $_GET['language_name'];
	$school = $_GET['school_name'];
	$email = $_GET['email'];
	$phone = $_GET['phone'];
	

	$query_text = "select * from studentinfo a inner join 
					(select distinct `studentId`, max(`version`) as max_version 
					from studentinfo where `studentId` not in (
						SELECT `studentId` FROM `studentinfo` WHERE `active_indicator`= 'Y' group by `studentId`) group by `studentId`) b 
					on a.`studentId` = b.`studentId` and a.`version` = b.`max_version` ";


	//one of 3 entered
	if ($name != '' and $school == '' and $email == '' and $phone == '') {
		if ($lang == 'Korean') {
			$query= $query_text. " where name_kor like '%$name%'";
		} 
		if ($lang == 'English') {
			$query=$query_text. " where name_eng like '%$name%'";
		}
	}

	if ($school != '' and $name == '' and $email == '' and $phone == '') {
		$query = $query_text. " where current_school like '%$school%'";
	}

	if ($email != '' and $name == '' and $school == '' and $phone == '') {
		$query = $query_text. " where email like '%$email%'";
	}

	if ($phone != '' and $email == '' and $name == '' and $school == '') {
		$query = $query_text. " where phone_no like '%$phone%'";
	}

	//when user entered more than one selection criterias
	//name & school
	if ($name != '' and $school != '' and $email == '' and $phone == '') {
		if ($lang == 'Korean') {
			$query=$query_text. " where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query=$query_text. " where name_eng like '%$name%' ";
		}
		$query = $query. "and current_school like '%$school%'";
	}

	//name & email
	if ($name != '' and $email != '' and $school == '' and $phone == '') {
		if ($lang == 'Korean') {
			$query=$query_text. " where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query=$query_text. " where name_eng like '%$name%' ";
		}
		$query = $query. "and email like '%$email%'";

	}

	//school & email
	if ($name == '' and $email != '' and $school != '' and $phone == '') {
		$query = $query_text." where email like '%$email%' and current_school = '%$school%'";
	}

	//phone & school
	if ($name == '' and $email == '' and $school != '' and $phone != '') {
		$query = $query_text. " where phone_no = '%$phone%' and current_school = '%$school%'";
	}

	//phone & name
	if ($name != '' and $phone != '' and $school == '' and $email == '') {
		if ($lang == 'Korean') {
			$query=$query_text. " where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query=$query_text. " where name_eng like '%$name%' ";
		}
		$query = $query. "and phone_no like '%$phone%'";

	}
	//phone & email
	if ($name == '' and $email != '' and $school == '' and $phone != '') {
		$query = $query_text. " where email like '%$email%' and phone_no like '%$phone%'";
	}


	//3 out of 4 entered

	//name email school (no phone)
	if ($name != '' and $email != '' and $school != '' and $phone == '') {
		if ($lang == 'Korean') {
			$query=$query_text. " where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query=$query_text. " where name_eng like '%$name%' ";
		}
		$query = $query. "and email like '%$email%' and current_school like '%$school%'";

	}

	//name email phone (no school)
	if ($name != '' and $email != '' and $school == '' and $phone != '') {
		if ($lang == 'Korean') {
			$query=$query_text. " where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query=$query_text. " where name_eng like '%$name%' ";
		}
		$query = $query. "and email like '%$email%' and phone_no like '%$phone%'";

	}

	//name phone school (no email)
	if ($name != '' and $email == '' and $school != '' and $phone != '') {
		if ($lang == 'Korean') {
			$query=$query_text. " where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query=$query_text. " where name_eng like '%$name%' ";
		}
		$query = $query. "and current_school like '%$school%' and phone_no like '%$phone%'";

	}

	//phone school email (no name)
	if ($name == '' and $email != '' and $school != '' and $phone != '') {
		$query = $query_text. " where phone_no like '%$phone%' and current_school like '%$school%' and email like '%$email%'";
	}


	//all 4 entered
	if ($name != '' and $email != '' and $school != '' and $phone != '') {
		if ($lang == 'Korean') {
			$query=$query_text. " where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query=$query_text. " where name_eng like '%$name%' ";
		}
		$query = $query. "and email like '%$email%' and current_school like '%$school%' and phone_no like '%$phone%'";
	}

	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'student_id' => $row['studentId'],
			'version' => $row['version'],
			'name_eng' => $row['name_eng'],
			'name_kor' => $row['name_kor'],
			'email' => $row['email'],
			'phone_no' => $row['phone_no']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>