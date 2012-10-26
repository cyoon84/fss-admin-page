<?php

	include 'connection.php';
	
	$name = $_GET['name'];
	$lang = $_GET['language_name'];
	$school = $_GET['school_name'];
	$email = $_GET['email'];
	$phone = $_GET['phone'];

	//one of 3 entered
	if ($name != '' and $school == '' and $email == '' and $phone == '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor like '%$name%' and active_indicator ='Y'";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng like '%$name%' and active_indicator ='Y'";
		}
	}

	if ($school != '' and $name == '' and $email == '' and $phone == '') {
		$query = "select * from studentinfo where current_school like '%$school%' and active_indicator ='Y'";
	}

	if ($email != '' and $name == '' and $school == '' and $phone == '') {
		$query = "select * from studentinfo where email like '%$email%' and active_indicator ='Y'";
	}

	if ($phone != '' and $email == '' and $name == '' and $school == '') {
		$query = "select * from studentinfo where phone_no like '%$phone%' and active_indicator ='Y'";
	}

	//when user entered more than one selection criterias
	//name & school
	if ($name != '' and $school != '' and $email == '' and $phone == '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng like '%$name%' ";
		}
		$query = $query. "and current_school like '%$school%' and active_indicator ='Y'";
	}

	//name & email
	if ($name != '' and $email != '' and $school == '' and $phone == '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng like '%$name%' ";
		}
		$query = $query. "and email like '%$email%' and active_indicator ='Y'";

	}

	//school & email
	if ($name == '' and $email != '' and $school != '' and $phone == '') {
		$query = "select * from studentinfo where email like '%$email%' and current_school like '%$school%' and active_indicator ='Y'";
	}

	//phone & school
	if ($name == '' and $email == '' and $school != '' and $phone != '') {
		$query = "select * from studentinfo where phone_no like '%$phone%' and current_school like '%$school%' and active_indicator ='Y'";
	}

	//phone & name
	if ($name != '' and $phone != '' and $school == '' and $email == '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng like '%$name%' ";
		}
		$query = $query. "and phone_no like '%$phone%' and active_indicator ='Y'";

	}
	//phone & email
	if ($name == '' and $email != '' and $school == '' and $phone != '') {
		$query = "select * from studentinfo where email like '%$email%' and phone_no like '%$phone%' and active_indicator ='Y'";
	}


	//3 out of 4 entered

	//name email school (no phone)
	if ($name != '' and $email != '' and $school != '' and $phone == '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng like '%$name%' ";
		}
		$query = $query. "and email like '%$email%' and current_school like '%$school%' and active_indicator ='Y'";

	}

	//name email phone (no school)
	if ($name != '' and $email != '' and $school == '' and $phone != '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng like '%$name%' ";
		}
		$query = $query. "and email like '%$email%' and phone_no like '%$phone%' and active_indicator = 'Y'";

	}

	//name phone school (no email)
	if ($name != '' and $email == '' and $school != '' and $phone != '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng like '%$name%' ";
		}
		$query = $query. "and current_school like '%$school%' and phone_no like '%$phone%' and active_indicator ='Y'";

	}

	//phone school email (no name)
	if ($name == '' and $email != '' and $school != '' and $phone != '') {
		$query = "select * from studentinfo where phone_no like '%$phone%' and current_school like '%$school%' and email like '%$email%' and active_indicator ='Y'";
	}


	//all 4 entered
	if ($name != '' and $email != '' and $school != '' and $phone != '') {
		if ($lang == 'Korean') {
			$query="select * from studentinfo where name_kor like '%$name%' ";
		} 
		if ($lang == 'English') {
			$query="select * from studentinfo where name_eng like '%$name%' ";
		}
		$query = $query. "and email = '$email' and current_school like '%$school%' and phone_no like '%$phone%' and active_indicator ='Y'";
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