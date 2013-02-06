<?php

	include 'connection.php';

	$action = '';
	
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$action = $_GET['action'];
	}

	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		$action = $_POST['action'];
	}

	


	if ($action == 'add_new') {

		$school_name = $_POST['school_name'];
		$school_type = $_POST['school_type'];
		$user_id = $_POST['user_id'];

		$query ="INSERT INTO school_list (school_name, school_type, user_id) VALUES ('$school_name', '$school_type', '$user_id')";
		$result = mysql_query($query, $con);

		if ($result) {
			echo "add success";
		} else {
			die('Error: ' . mysql_error());
		}

	}

	if ($action == 'update') {
		$school_index = $_POST['school_index'];
		$school_name = $_POST['school_name'];
		$school_type = $_POST['school_type'];
		$user_id = $_POST['user_id'];

		$query ="UPDATE school_list set school_name = '$school_name', school_type = '$school_type', user_id = '$user_id' where school_index = '$school_index'";
		$result = mysql_query($query, $con);

		if ($result) {
			echo "update success";
		} else {
			die('Error: ' . mysql_error());
		}		
	}

	if ($action == 'delete') {
		$school_index = $_POST['school_index'];
		$count = $_POST['count'];

		$query_get_name = "SELECT school_name from school_list where school_index = '$school_index'";

		$result_name = mysql_query($query_get_name, $con);

		$row_name = mysql_fetch_array($result_name);

		$school_name = $row_name['school_name'];

		$query ="DELETE from school_list where school_index = '$school_index'";
		$result = mysql_query($query, $con);

		if (!$result) {
			die('Error: ' . mysql_error());
		}

		if ($count > 0) {
			$query2 = "update studentinfo set school_index = 0, current_school = '$school_name' where school_index = '$school_index'";
			$result2 = mysql_query($query2, $con);

			if (!$result2) {
				die('Error: ' . mysql_error());
			} 
		}

		$query3 = "update student_prev_school set school_index = 0, prev_school_name = '$school_name' where school_index = '$school_index'";
		$result3 = mysql_query($query3, $con);

		if (!$result3) {
			die('Error: '. mysql_error());
		}

		echo "delete success";
	}
	if ($action == 'get_list') {
		$cond = $_GET['cond'];
		if ($cond == 'init') {
			$query = "SELECT * from school_list order by school_name";
		} else {
			$query = "SELECT * from school_list where school_type = '$cond' order by school_name";
		}

		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'school_index' => $row['school_index'],
				'school_name'  => $row['school_name'],
				'school_type'  => $row['school_type']
			);
		}
		echo json_encode($result_out);
	}

	if ($action == 'get_type') {
		$query = "SELECT DISTINCT school_type from school_list";

		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'school_type'  => $row['school_type']
			);
		}
		echo json_encode($result_out);
	}

	if ($action == 'get_count') {
		$school_index = $_GET['school_index'];
		$query = "SELECT count(*) as count from studentinfo where school_index = '$school_index'";
		$result = mysql_query($query, $con);

		$row = mysql_fetch_array($result);

		echo $row['count'];
	}
	mysql_close($con);
?>