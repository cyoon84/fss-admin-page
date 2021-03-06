<?php

	include 'connection.php';

	$action = $_GET['action'];


	if ($action == 'all') {

		$category = $_GET['category'];

		if ($category == 'All') {

			$query = "SELECT * from studentinfo a inner join 
				(SELECT `studentId`,max(`version`)  as max_version FROM `studentinfo` group by `studentId`) e 
				where a.studentId = e.studentId and a.version = e.max_version ";

		} else {
			$query = "SELECT * from studentinfo a inner join 
				(SELECT `studentId`,max(`version`)  as max_version FROM `studentinfo` group by `studentId`) e 
				where a.studentId = e.studentId and a.version = e.max_version  and  a.visa_type = '$category'";

		}
	
		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {

			$result_out[] = array(
				'student_id' => $row['studentId'],
				'unique_id' => $row['unique_id'],
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
	}



	if ($action == 'index_page_daterange_count') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];

		$last_seven_days = $_GET['last_seven_days'];


		$query = "SELECT count(*) as visa_expiry_count from studentinfo where active_indicator = 'Y' and visa_exp_date between '$start_date' and '$end_date 23:59:59'";

		$result = mysql_query($query, $con);

		$result_out = array();
		$row = mysql_fetch_array($result);

		$query2 = "SELECT count(*) as new_student_count from studentinfo where version = 0 and date_added between '$last_seven_days' and '$start_date 23:59:59'";

		$result2 = mysql_query($query2, $con);

		$row2 = mysql_fetch_array($result2);


		$query3 = "SELECT count(*) as new_visit from studentvisit where visit_date between '$last_seven_days' and '$start_date 23:59:59'";

		$result3 = mysql_query($query3, $con);

		$row3 = mysql_fetch_array($result3);

		$result_out[] = array('visa_expiry_count' => $row['visa_expiry_count'], 'new_student_added' => $row2['new_student_count'], 'new_visit_added' => $row3['new_visit']);


	}

	if ($action == 'visa_expiry_daterange_contents') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];

		$page = $_GET['page'];
		$per_page = $_GET['per_page'];
		$start = ($page-1)*$per_page;

		$query = "SELECT studentId, name_eng, name_kor, visa_type, visa_issue_date, visa_exp_date from studentinfo where active_indicator = 'Y' and visa_exp_date between '$start_date' and '$end_date 23:59:59' limit $start, $per_page";
		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {

			$result_out[] = array(
				'studentId' => $row['studentId'],
				'name_eng' => $row['name_eng'],
				'name_kor' => $row['name_kor'],
				'visa_type' => $row['visa_type'],
				'visa_issue_date' => $row['visa_issue_date'],
				'visa_exp_date' => $row['visa_exp_date']
			);
		}


	}

	if ($action == 'new_added_students_contents') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];

		$page = $_GET['page'];
		$per_page = $_GET['per_page'];
		$start = ($page-1)*$per_page;

		$query = "SELECT studentId, unique_id, name_eng, name_kor, email, date_birth, date_added from studentinfo where version = 0 and active_indicator = 'Y' and date_added between '$start_date' and '$end_date 23:59:59' order by date_added desc limit $start, $per_page";

		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {

			$result_out[] = array(
				'studentId' => $row['studentId'],
				'unique_id' => $row['unique_id'],
				'name_eng' => $row['name_eng'],
				'name_kor' => $row['name_kor'],
				'email' => $row['email'],
				'date_birth' => $row['date_birth'],
				'date_added' => $row['date_added']
			);
		}




	}

	if ($action == 'new_visit_contents') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];

		$page = $_GET['page'];
		$per_page = $_GET['per_page'];
		$start = ($page-1)*$per_page;
		
		$query = "SELECT a.studentId, a.visit_date, a.visit_purpose, b.name_eng, b.name_kor from studentvisit a inner join 
				(select studentId, name_eng, name_kor from studentinfo where active_indicator = 'Y') b on a.studentId = b.studentId 
					where a.visit_date between '$start_date' and '$end_date 23:59:59' order by a.visit_date desc limit $start, $per_page";

		$result = mysql_query($query, $con);

		$result_out = array();

		while ($row = mysql_fetch_array($result)) {

			$result_out[] = array(
				'studentId' => $row['studentId'],
				'name_eng' => $row['name_eng'],
				'name_kor' => $row['name_kor'],
				'visit_date' => $row['visit_date'],
				'visit_purpose' => $row['visit_purpose']
			);
		}

	}

	if ($action == 'check_duplicate_init') {
		$name_kor = $_GET['name_kor'];


		$query = "SELECT name_kor, date_birth from studentinfo where name_kor = '$name_kor'";

		$result = mysql_query($query, $con);

		$num_rows = mysql_num_rows ($result);


		$row = mysql_fetch_array($result);

		$result_out[] = array('count'=> $num_rows, 'name_kor' => $row['name_kor'], 'date_birth' => $row['date_birth']);
	}

	if ($action == 'viewlist_pagination') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];
		$per_page = $_GET['per_page'];
		$show_by = $_GET['show_by'];

		if ($show_by == 'newAdd') {
			$query = "SELECT count(*) as count from studentinfo where version = 0 and date_added between '$start_date' and '$end_date 23:59:59'";
		}


		if ($show_by == 'newVisit') {
			$query = "SELECT count(*) as count from studentvisit where visit_date between '$start_date' and '$end_date 23:59:59'";
		}


		if ($show_by == 'visadate') {
			$query = "SELECT count(*) as count from studentinfo where active_indicator = 'Y' and visa_exp_date between '$start_date' and '$end_date 23:59:59'";
		}
		
		$result = mysql_query($query, $con);

		$row = mysql_fetch_array($result);

		$total_elem = $row['count'];

		$total_pages = ceil($total_elem/$per_page);

		$result_out[] = array('total_pages' => $total_pages);


	}

	if ($action == 'get_all_active_email') {
		$query = "SELECT name_kor, email from studentinfo where active_indicator ='Y' and email <> '' order by name_kor";
		$result = mysql_query($query, $con);

		$result_out = array();

		while ($row = mysql_fetch_array($result)) {

			$result_out[] = array(
				'name_kor' => $row['name_kor'],
				'email' => $row['email']
			);
		}
	}

	echo json_encode($result_out);
	
	mysql_close($con);
?>