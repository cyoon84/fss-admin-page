<?php

	include 'connection.php';
	
	$name = $_GET['name'];
	$lang = $_GET['language_name'];
	$school = $_GET['school_name'];
	$email = $_GET['email'];
	
	//if nothing entered, show all students in the database
	if ($name == '' and $school == '' and $email == '') {
		$query="select * from studentinfo where active_indicator ='Y'";
	}

	//one of 3 entered
	if ($name != '' and $school == '' and $email == '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor = '$name' and active_indicator ='Y'";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng = '$name' and active_indicator ='Y'";
		}
	}

	if ($school != '' and $name == '' and $email == '') {
		$query = "select * from studentinfo where current_school = '$school' and active_indicator ='Y'";
	}

	if ($email != '' and $name == '' and $school == '') {
		$query = "select * from studentinfo where email = '$email' and active_indicator ='Y'";
	}

	//when user entered more than one selection criterias
	//name & school
	if ($name != '' and $school != '' and $email == '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor = '$name' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng = '$name' ";
		}
		$query = $query. "and current_school = '$school' and active_indicator ='Y'";
	}

	//name & email
	if ($name != '' and $email != '' and $school == '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor = '$name' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng = '$name' ";
		}
		$query = $query. "and email = '$email' and active_indicator ='Y'";

	}

	//school & email
	if ($name == '' and $email != '' and $school != '') {
		$query = "select * from studentinfo where email = '$email' and current_school = '$school' and active_indicator ='Y'";
	}

	//all 3 entered
	if ($name != '' and $email != '' and $school != '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor = '$name' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng = '$name' ";
		}
		$query = $query. "and email = '$email' and current_school = '$school' and active_indicator ='Y'";
	}

	$result = mysql_query($query, $con);

	$result_out = array();
	while ($row = mysql_fetch_array($result)) {
		$result_out[] = array(
			'student_id' => $row['studentId'],
			'version' => $row['version'],
			'name_eng' => $row['name_eng'],
			'name_kor' => $row['name_kor'],
			'email' => $row['email']
		);
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>