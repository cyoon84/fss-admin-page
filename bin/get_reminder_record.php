<?php

	include 'connection.php';
	
	$action =$_GET['action'];

	if ($action == 'all') {
	
		$id = $_GET['student_id'];
		$follow_up = $_GET['follow_up'];

		$rem_list_index = $_GET['rem_list_index'];


		//show the most up-to-date record only

		if ($follow_up == 'N') {
			if ($rem_list_index == '0') {
				$query="select * from studentreminder where studentId ='$id' and follow_up_ind = '$follow_up' order by remindDate asc";
			} else {
				$query="select * from studentreminder where studentId ='$id' and rem_list_index = '$rem_list_index' and follow_up_ind = '$follow_up' order by remindDate asc";
			}
		} else {
			if ($rem_list_index == '0') {
				$query="select * from studentreminder where studentId ='$id' and follow_up_ind = '$follow_up' order by follow_up_date asc";
			} else {
				$query="select * from studentreminder where studentId ='$id' and rem_list_index = '$rem_list_index' and follow_up_ind = '$follow_up' order by follow_up_date asc";
			}
		}

		
		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'reminderIndex' => $row['reminderIndex'],
				'studentId' => $row['studentId'],
				'remindDate' => $row['remindDate'],
				'remindReason' => $row['remindReason'],
				'rem_list_index' => $row['rem_list_index'],
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
		$query = "select count(*) as number_reminders from studentreminder a inner join studentinfo b on a.studentId = b.studentId where a.follow_up_ind = 'N' and b.active_indicator = 'Y' and a.remindDate between '$start_date' and '$end_date 23:59:59'";

		$result = mysql_query($query, $con);

		$result_out = array();
		$row = mysql_fetch_array($result);

		$query2 = "select count(*) as number_past_due from studentreminder a inner join studentinfo b on a.studentId = b.studentId where a.follow_up_ind = 'N' and a.remindDate < '$start_date' and b.active_indicator = 'Y'";

		$result2 = mysql_query($query2, $con);

		$row2 = mysql_fetch_array($result2);


		$result_out[] = array('number_reminders' => $row['number_reminders'], 'number_past_due' => $row2['number_past_due']);

		echo json_encode($result_out);
	}


	if ($action == 'by_date_contents') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];

		$remind_category = $_GET['remind_category'];

		$page = $_GET['page'];
		$per_page = $_GET['per_page'];
		$start = ($page-1)*$per_page;
		
		if ($remind_category == 'all') {
			$query = "select a.studentId, b.name_kor, b.name_eng, a.reminderIndex, a.remindReason, a.remindDate from studentreminder a inner join studentinfo b on a.studentId = b.studentId where a.follow_up_ind = 'N' and b.active_indicator = 'Y' and a.remindDate between '$start_date' and '$end_date 23:59:59' order by a.remindDate desc limit $start, $per_page";
		} else {
			$query = "select a.studentId, b.name_kor, b.name_eng, a.reminderIndex, a.remindReason, a.remindDate from studentreminder a inner join studentinfo b on a.studentId = b.studentId where a.rem_list_index = '$remind_category' and a.follow_up_ind = 'N' and b.active_indicator = 'Y' and a.remindDate between '$start_date' and '$end_date 23:59:59' order by a.remindDate desc limit $start, $per_page";
		}
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

		$page = $_GET['page'];
		$per_page = $_GET['per_page'];
		$start = ($page-1)*$per_page;

		$remind_category = $_GET['remind_category'];

		if ($remind_category == 'all') {		
			$query = "select a.studentId, b.name_kor, b.name_eng, a.reminderIndex, a.remindReason, a.remindDate from studentreminder a inner join studentinfo b on a.studentId = b.studentId where a.follow_up_ind = 'N' and b.active_indicator = 'Y' and a.remindDate < '$start_date' order by a.remindDate desc limit $start, $per_page";
		} else {
			$query = "select a.studentId, b.name_kor, b.name_eng, a.reminderIndex, a.remindReason, a.remindDate from studentreminder a inner join studentinfo b on a.studentId = b.studentId where a.rem_list_index = '$remind_category' and a.follow_up_ind = 'N' and b.active_indicator = 'Y' and a.remindDate < '$start_date' order by a.remindDate desc limit $start, $per_page";
		}
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

	if ($action == 'viewlist_pagination') {
		$start_date = $_GET['start_date'];
		$end_date = $_GET['end_date'];
		$per_page = $_GET['per_page'];
		$show_by = $_GET['show_by'];
		$remind_category = $_GET['remind_category'];

		if ($show_by == 'remind') {
			if ($remind_category == 'all') {
				$query = "select count(*) as count from studentreminder where follow_up_ind = 'N' and remindDate between '$start_date' and '$end_date 23:59:59'";
			} else {
				$query = "select count(*) as count from studentreminder where follow_up_ind = 'N' and rem_list_index = '$remind_category' and remindDate between '$start_date' and '$end_date 23:59:59'";
			}
		} 

		if ($show_by == 'remindPastDue') {
			if ($remind_category == 'all') {
				$query = "select count(*) as count from studentreminder where follow_up_ind = 'N' and remindDate < '$start_date'";
			} else {
				$query = "select count(*) as count from studentreminder where rem_list_index = '$remind_category' and follow_up_ind = 'N' and remindDate < '$start_date'";
			}
		}

		$result = mysql_query($query, $con);

		$row = mysql_fetch_array($result);

		$total_elem = $row['count'];

		$total_pages = ceil($total_elem/$per_page);

		$result_out[] = array('total_pages' => $total_pages);

		echo json_encode($result_out);
	}
	
	
	mysql_close($con);
?>   