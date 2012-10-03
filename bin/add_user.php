<?php

	include 'connection.php';

	$engName = $_POST['name_eng'];

	$korName = $_POST['name_kor'];

	$gender = $_POST['gender'];

	$date_birth = $_POST['date_birth'];

	$email = $_POST['email'];

	$phone_no = $_POST['phone_no'];

	$address = $_POST['address'];

	$arrival_date = $_POST['arrival_date'];

	$visa_type = $_POST['visa_type'];

	$visa_issue_date = $_POST['visa_issue_date'];

	$visa_expiry_date = $_POST['visa_exp_date'];

	$source_to_FSS = $_POST['source_to_FSS'];

	$referrer_name = $_POST['referrer_name'];

	$korean_agency = $_POST['korean_agency'];

	$schoolName = $_POST['current_school'];

	$programName = $_POST['current_program'];

	$school_strt_dt = $_POST['current_school_strt_dt'];

	$school_end_dt = $_POST ['current_school_end_dt'];

	$user_id = $_POST['user_id'];

	$visitLists = $_POST['initial_visits'];

	$prev_schools = $_POST['prev_schools'];

	$prev_visas = $_POST['prev_visa'];

	$last_id = mysql_query("select max(studentId) from studentinfo");
	$last_id = mysql_fetch_array($last_id,MYSQL_BOTH);
	$last_id = $last_id[0];

	$new_id = $last_id + 1;

	$query="INSERT INTO studentinfo (studentId
									, version
									, active_indicator
									, name_eng
									, name_kor
									, gender
									, date_birth
									, email
									, phone_no
									, address
									, arrival_date
									, visa_type
									, visa_issue_date
									, visa_exp_date
									, how_hear_us
									, referred_by
									, korea_agency
									, current_school
									, current_program
									, current_school_strt_dt
									, current_school_end_dt
									, user_id
									, updt_reason) 
									VALUES 
									('$new_id'
									,'0'
									,'Y'
									, '$engName'
									,'$korName'
									,'$gender'
									,'$date_birth'
									,'$email'
									,'$phone_no'
									,'$address'
									,'$arrival_date'
									,'$visa_type'
									,'$visa_issue_date'
									,'$visa_expiry_date'
									,'$source_to_FSS'
									,'$referrer_name'
									,'$korean_agency'
									,'$schoolName'
									,'$programName'
									,'$school_strt_dt'
									,'$school_end_dt'
									,'$user_id'
									,'Initial record')";

	if (!mysql_query($query, $con)) {
		die('Error1: ' . mysql_error());
	} 


	$query="INSERT INTO student_prev_school (studentId
									,prev_school_name
									,prev_school_program
									,prev_school_strt_dt
									,prev_school_end_dt
									,user_id)
									VALUES ";

	$filledCount = 0;
	for ($i=0; $i!= 5; $i++) {
		$prev_school_name = $prev_schools[$i]['prev_school_name'];
		$prev_school_pgm = $prev_schools[$i]['prev_school_prgm'];
		$prev_school_strt = $prev_schools[$i]['prev_school_strt_dt'];
		$prev_school_end = $prev_schools[$i]['prev_school_end_dt'];
	
		if ($prev_school_name != '') {
			$query = $query."('$new_id','$prev_school_name','$prev_school_pgm','$prev_school_strt','$prev_school_end','$user_id'),";
			$filledCount ++;
		}

	}
	$query = substr($query,0,-1);

	if ($filledCount > 0) {
		if (!mysql_query($query, $con)) {
			die('Error2: ' . mysql_error());
		} 
	}

	$filledCount_visa = 0;

	$query3="INSERT INTO student_prev_visa (studentId
									,prev_visa_type
									,prev_visa_issue_date
									,prev_visa_expire_date
									,user_id)
									VALUES ";

	for ($i=0; $i!=5; $i++) {
		$prev_visa_type = $prev_visas[$i]['prev_visa_type'];
		$prev_visa_issue_date = $prev_visas[$i]['prev_issue_date'];
		$prev_visa_expire_date = $prev_visas[$i]['prev_expire_date'];

		if ($prev_visa_type != '' && $prev_visa_type != '0') {
			$query3 = $query3."('$new_id','$prev_visa_type','$prev_visa_issue_date','$prev_visa_expire_date','$user_id'),";
			$filledCount_visa ++;
		}

	}

	$query3 = substr($query3,0,-1);

	if ($filledCount_visa > 0) {
		if (!mysql_query($query3, $con)) {
			die('Error3: ' . mysql_error());
		} 
	}
	

	$init_visit_numbers = count($visitLists);
	$filledCount_visit = 0;

	if ($init_visit_numbers > 0) {
		$visit_date = $visitLists[0]['visitDate'];
		$visit_purpose = $visitLists[0]['visitPurpose'];
		$visit_note = $visitLists[0]['visitNote'];
		
		$query="INSERT INTO studentvisit (studentId
									, visit_date
									, visit_purpose
									, visit_note
									, user_id) 
									VALUES 
									('$new_id'
									,'$visit_date'
									,'$visit_purpose'
									,'$visit_note'
									,'$user_id')";
		for ($i = 1; $i != $init_visit_numbers; $i++) {

			$visit_date = $visitLists[$i]['visitDate'];
			$visit_purpose = $visitLists[$i]['visitPurpose'];
			$visit_note = $visitLists[$i]['visitNote'];

			if ($visit_date != '') {

				$query = $query. ",('$new_id','$visit_date','$visit_purpose','$visit_note','$user_id')";
				$filledCount_visit++;
			}
				
		}

		
		if ($filledCount_visit > 0) {
			if (!mysql_query($query, $con)) {
				die('Error4: ' . mysql_error());
			}
		}

	}
	
	echo $new_id;

	mysql_close($con);
?>