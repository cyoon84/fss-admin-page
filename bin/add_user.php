<?php

	include 'connection.php';

	include("class.phpmailer.php");

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

	$school_index = $_POST['school_index'];

	$programName = $_POST['current_program'];

	$school_strt_dt = $_POST['current_school_strt_dt'];

	$school_end_dt = $_POST ['current_school_end_dt'];

	$note = $_POST ['note'];
	
	$user_id = $_POST['user_id'];

	$visitLists = $_POST['initial_visits'];

	$prev_schools = $_POST['prev_schools'];

	$prev_visas = $_POST['prev_visa'];

	$unique_id = $_POST['uniqueId'];

	$last_id = mysql_query("select max(studentId) from studentinfo");
	$last_id = mysql_fetch_array($last_id,MYSQL_BOTH);
	$last_id = $last_id[0];

	$new_id = $last_id + 1;


	$checkUniqueId = mysql_query("select count(*) from studentinfo where unique_id = '$unique_id'");

	$checkUniqueId = mysql_fetch_array($checkUniqueId, MYSQL_BOTH);
	$checkUniqueId = $checkUniqueId[0];

	if ($checkUniqueId > 0) {
		$unique_id = $unique_id.$checkUniqueId;
	}

	if ($school_index == 'Other') {
		$school_type = $_POST['other_school_type'];
		$school_name = $_POST['other_school_name'];
		$query2 = "INSERT INTO school_list (school_name, school_type, user_id) values ('$school_name', '$school_type', '$user_id')";

		if (!mysql_query($query2, $con)) {
			die('Error2: ' . mysql_error());
		} else {
			$query3 = "SELECT school_index from school_list where school_type = '$school_type' and school_name = '$school_name'";
			$result = mysql_query($query3, $con);

			if (!$result) {
				die('Error3: '.mysql_error());
			}

			$row = mysql_fetch_array($result);

			$school_index = $row['school_index'];
		}
	}


	$query="INSERT INTO studentinfo (studentId
									, unique_id
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
									, school_index
									, current_school
									, current_program
									, current_school_strt_dt
									, current_school_end_dt
									, note
									, user_id
									, updt_reason) 
									VALUES 
									('$new_id'
									,'$unique_id'
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
									,'$school_index'
									,''
									,'$programName'
									,'$school_strt_dt'
									,'$school_end_dt'
									,'$note'
									,'$user_id'
									,'Initial record')";

	if (!mysql_query($query, $con)) {
		die('Error1: ' . mysql_error());
	} else {
		if ($email != '') {
			$subject = "FSS에 등록하심을 환영합니다.";
			$body = $korName." 님 FSS에 등록하심을 환영합니다. ". $korName. " 의 FSS ID는 ". $unique_id. "이고 등록 기념으로 50 FSS Point가 적립되었습니다. <br> 본인의 포인트는 <a href='http://www.fsstoronto.com/student'>http://www.fsstoronto.com/student</a> 에서 확인하실 수 있습니다. <br>"
					. " <br> FSS Blog: <a href='http://fsstoronto.blogspot.com'>http://fsstoronto.blogspot.com </a> & FSS Twitter: <a href='https://twitter.com/fsstoronto'>https://twitter.com/fsstoronto</a>";
						
			$mail             = new PHPMailer();

			//$body             = $mail->getFile('contents.html');
			//$body             = eregi_replace("[\]",'',$body);

			$mail->IsSMTP();
			$mail->CharSet = 'UTF-8';
			$mail->SMTPDebug  = 1;
			$mail->SMTPAuth   = true;                  // enable SMTP authentication
			$mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
			$mail->Host       = "hp112.hostpapa.com";      // sets GMAIL as the SMTP server
			$mail->Port       = 465;                   // set the SMTP port

			$mail->Username   = "fssadmin+fsstoronto.com";  // GMAIL username
			$mail->Password   = "Fsstoronto123";            // GMAIL password

			$mail->From       = "fssadmin@fsstoronto.com";
			$mail->FromName   = "FSS Toronto";
			$mail->Subject    = $subject;
			$mail->AltBody    = "This is the body when user views in plain text format"; //Text Body
			$mail->WordWrap   = 50; // set word wrap

			$mail->MsgHTML($body);

			$mail->AddReplyTo("fsstoronto@gmail.com","FSS Toronto");
			$mail->AddBCC("fssseminar@gmail.com", "FSS Seminar");

			$mail->AddAddress($email);
			
			$mail->IsHTML(true); // send as HTML

			if(!$mail->Send()) {
  				echo "Mailer Error: " . $mail->ErrorInfo;
			}			 

		}
	}



	$query="INSERT INTO student_prev_school (studentId
									,school_index
									,prev_school_name
									,prev_school_program
									,prev_school_strt_dt
									,prev_school_end_dt
									,user_id)
									VALUES ";

	$max = count($prev_schools);
	$filledCount_prev_school = 0;
	for ($i=0; $i!= $max; $i++) {
		$school_index = $prev_schools[$i]['school_index']; //reference to school_list table
		$prev_school_pgm = $prev_schools[$i]['prev_school_prgm'];
		$prev_school_strt = $prev_schools[$i]['prev_school_strt_dt'];
		$prev_school_end = $prev_schools[$i]['prev_school_end_dt'];

		if ($school_index == 'Other') {
			$school_type = $prev_schools[$i]['prev_other_school_type'];
			$school_name = $prev_schools[$i]['prev_other_school_name'];
			$query2 = "INSERT INTO school_list (school_name, school_type, user_id) values ('$school_name', '$school_type', '$user_id')";

			if (!mysql_query($query2, $con)) {
				die('Error2: ' . mysql_error());
			} else {
				$query3 = "SELECT school_index from school_list where school_type = '$school_type' and school_name = '$school_name'";
				$result = mysql_query($query3, $con);

				if (!$result) {
					die('Error3: '.mysql_error());
				}

				$row = mysql_fetch_array($result);

				$school_index = $row['school_index'];
			}			
		}
		
		if ($school_index != 0) {
			$query = $query."('$new_id','$school_index','not needed','$prev_school_pgm','$prev_school_strt','$prev_school_end','$user_id'),";
			$filledCount_prev_school++; 
		}
	}
	$query = substr($query,0,-1);

	if ($filledCount_prev_school  > 0) {
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
		if (!mysql_query($query, $con)) {
				die('Error4: ' . mysql_error());
		}
		

	}

	$today = date("Y-m-d"); 

	$query5 ="INSERT INTO student_point (studentId, point_index, user_id, point_value, trans_date) VALUES ('$new_id', '1', '$user_id', '50', '$today')";

	if (!mysql_query($query5, $con)) {
		die('Error5: ' . mysql_error());
	}

	
	echo $new_id;

	mysql_close($con);
?>