<?php

	include 'connection.php';
	
	$id = $_GET['studentId'];
	$action = $_GET['action'];
	$query = '';

	if ($action == 'prev') {
		$ver = $_GET['version'];

		//show the most up-to-date record only
		$query="select a.studentId
						, a.unique_id
						, a.version
						, a.name_eng
						, a.name_kor
						, a.date_birth
						, a.gender
						, a.email
						, a.phone_no
						, a.address
						, a.arrival_date
						, a.visa_type
						, a.visa_issue_date
						, a.visa_exp_date
						, a.korea_agency
						, a.how_hear_us
						, a.referred_by
						, a.current_school
						, a.school_index
						, a.current_program
						, a.current_school_strt_dt
						, a.current_school_end_dt
						, a.note
						, a.updt_reason
						, a.user_id
						, b.school_name
						 from studentinfo a inner join school_list b on a.school_index = b.school_index where studentId='$id' and version = '$ver'";
	
	}

	if ($action == 'latest') {
		$is_hidden = $_GET['is_hidden'];
		
		//show the most up-to-date record only
		if ($is_hidden == 'N') {
			$query="select a.studentId
						, a.unique_id
						, a.version
						, a.name_eng
						, a.name_kor
						, a.date_birth
						, a.gender
						, a.email
						, a.phone_no
						, a.address
						, a.arrival_date
						, a.visa_type
						, a.visa_issue_date
						, a.visa_exp_date
						, a.korea_agency
						, a.how_hear_us
						, a.referred_by
						, a.current_school
						, a.school_index
						, a.current_program
						, a.current_school_strt_dt
						, a.current_school_end_dt
						, a.note
						, a.updt_reason
						, a.user_id
						, b.school_name
						from studentinfo a inner join school_list b on a.school_index = b.school_index where a.studentId='$id' and a.active_indicator = 'Y'";
		} else {
			
			$last_ver = mysql_query("select max(version) from studentinfo where studentId = '$id'");
			$last_ver = mysql_fetch_array($last_ver,MYSQL_BOTH);
			$last_ver = $last_ver[0];

			$query="select a.studentId
						, a.unique_id
						, a.version
						, a.name_eng
						, a.name_kor
						, a.date_birth
						, a.gender
						, a.email
						, a.phone_no
						, a.address
						, a.arrival_date
						, a.visa_type
						, a.visa_issue_date
						, a.visa_exp_date
						, a.korea_agency
						, a.how_hear_us
						, a.referred_by
						, a.current_school
						, a.school_index
						, a.current_program
						, a.current_school_strt_dt
						, a.current_school_end_dt
						, a.note
						, a.updt_reason
						, a.user_id
						, b.school_name
						from studentinfo a inner join school_list b on a.school_index = b.school_index where a.studentId='$id' and a.version = '$last_ver'";
			
		}
	}
	
	$result = mysql_query($query, $con);

	if ($result) {

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'student_id' => $row['studentId'],
				'unique_id' => $row['unique_id'],
				'version' => $row['version'],
				'name_eng' => $row['name_eng'],
				'name_kor' => $row['name_kor'],
				'birthdate' => $row['date_birth'],
				'gender' => $row['gender'],
				'email' => $row['email'],
				'phone' => $row['phone_no'],
				'address' => $row['address'],
				'arrival_dt' => $row['arrival_date'],
				'visa_type' => $row['visa_type'],
				'visa_issue_date' => $row['visa_issue_date'],
				'visa_exp_date' => $row['visa_exp_date'],
				'korea_agency' => $row['korea_agency'],
				'how_hear_us' => $row['how_hear_us'],
				'referred_by' => $row['referred_by'],
				'current_school' => $row['current_school'],
				'school_index' => $row['school_index'],
				'school_name' => $row['school_name'],
				'current_program' => $row['current_program'],
				'current_school_strt_dt' => $row['current_school_strt_dt'],
				'current_school_end_dt' => $row['current_school_end_dt'],
				'note' => $row['note'],
				'updt_reason' => $row['updt_reason'],
				'user_id' => $row['user_id']
			);
		}

		echo json_encode($result_out);
	} else {
		die ('Error :'.mysql_errno());
	}
	mysql_close($con);
?>   