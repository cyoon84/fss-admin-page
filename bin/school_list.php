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

		$query ="DELETE from school_list where school_index = '$school_index'";
		$result = mysql_query($query, $con);

		if ($result) {
			echo "delete success";
		} else {
			die('Error: ' . mysql_error());
		}		
	}
	if ($action == 'get_list') {
		$cond = $_GET['cond'];
		if ($cond == 'init') {
			$query = "SELECT * from school_list";
		} 

		if ($cond == 'LANGUAGE_SCHOOL' || $cond == 'UNIV/COLLEGE' || $cond == 'CREDIT_SCHOOL' || $cond == 'HIGH_SCHOOL') {
			$query = "SELECT * from school_list where school_type = '$cond'";
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
	mysql_close($con);
?>