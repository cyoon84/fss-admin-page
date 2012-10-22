<?php

	include 'connection.php';
	
	$action =$_GET['action'];

	if ($action == 'all') {
	
		$id = $_GET['student_id'];
		$follow_up = $_GET['follow_up'];


		//show the most up-to-date record only

		if ($follow_up == 'N') {
			$query="select * from studentreminder where studentId ='$id' and follow_up_ind = '$follow_up' order by remindDate asc";
		} else {
			$query="select * from studentreminder where studentId ='$id' and follow_up_ind = '$follow_up' order by follow_up_date asc";
		}

		
		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'reminderIndex' => $row['reminderIndex'],
				'studentId' => $row['studentId'],
				'remindDate' => $row['remindDate'],
				'remindReason' => $row['remindReason'],
				'follow_up_ind' => $row['follow_up_ind'],
				'follow_up_date' => $row['follow_up_date'],
				'user_id' => $row['user_id']
			);
		}
		echo json_encode($result_out);

	}	

	if ($action == 'by_date_count') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];
		$query = "select count(*) as number_reminders from studentreminder where follow_up_ind = 'N' and remindDate between '$start_date' and '$end_date 23:59:59'";

		$result = mysql_query($query, $con);

		$result_out = array();
		$row = mysql_fetch_array($result);

		$query2 = "select count(*) as number_past_due from studentreminder where follow_up_ind = 'N' and remindDate < '$start_date'";

		$result2 = mysql_query($query2, $con);

		$row2 = mysql_fetch_array($result2);


		$result_out[] = array('number_reminders' => $row['number_reminders'], 'number_past_due' => $row2['number_past_due']);

		echo json_encode($result_out);
	}


	if ($action == 'by_date_contents') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];
		$query = "select a.studentId, b.name_kor, b.name_eng, a.reminderIndex, a.remindReason, a.remindDate from studentreminder a inner join studentinfo b on a.studentId = b.studentId where a.follow_up_ind = 'N' and b.active_indicator = 'Y' and a.remindDate between '$start_date' and '$end_date' order by a.remindDate desc";

		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'reminderIndex' => $row['reminderIndex'],
				'studentId' => $row['studentId'],
				'name_kor' => $row['name_kor'],
				'name_eng' => $row['name_eng'],
				'remindDate' => $row['remindDate'],
				'remindReason' => $row['remindReason']
			);
		}
		echo json_encode($result_out);

	}

	if ($action == 'by_past_due_contents') {
		$start_date = $_GET['start_date'];
		$query = "select a.studentId, b.name_kor, b.name_eng, a.reminderIndex, a.remindReason, a.remindDate from studentreminder a inner join studentinfo b on a.studentId = b.studentId where a.follow_up_ind = 'N' and b.active_indicator = 'Y' and a.remindDate < '$start_date' order by a.remindDate desc";

		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'reminderIndex' => $row['reminderIndex'],
				'studentId' => $row['studentId'],
				'name_kor' => $row['name_kor'],
				'name_eng' => $row['name_eng'],
				'remindDate' => $row['remindDate'],
				'remindReason' => $row['remindReason']
			);
		}
		echo json_encode($result_out);
	}
	
	
	mysql_close($con);
?>   