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

		$reminder_name = $_POST['reminder_name'];
		$user_id = $_POST['user_id'];

		$query = "INSERT into reminder_list (rem_list_name, user_id) values ('$reminder_name', '$user_id')";

		$result=mysql_query($query, $con);

		if ($result) {
			echo "add success";
		} else {
			die('Error: ' . mysql_error());
		}

	}

	if ($action == 'update') {
		$rem_list_index = $_POST['rem_list_index'];
		$reminder_name = $_POST['remind_name'];
		$user_id = $_POST['user_id'];

		$query ="UPDATE reminder_list set rem_list_name = '$reminder_name', user_id = '$user_id' where rem_list_index = '$rem_list_index'";
		$result = mysql_query($query, $con);

		if ($result) {
			echo "update success";
		} else {
			die('Error: ' . mysql_error());
		}		
	}

	if ($action == 'delete') {
		$rem_list_index = $_POST['rem_list_index'];

		$query = "DELETE from reminder_list where rem_list_index = '$rem_list_index'";

		$result = mysql_query($query,$con);

		if ($result) {
			echo "delete success";
		} else {
			die('Error: '.mysql_error());
		}
	}
	if ($action == 'get_category') {
		$query = "SELECT * FROM reminder_list order by rem_list_index asc ";

		$result = mysql_query($query, $con);
		$result_out = array();

		if ($result) {
			while ($row = mysql_fetch_array($result)) {
				$result_out[] = array (
					'rem_list_index' => $row['rem_list_index'],
					'rem_list_name' => $row['rem_list_name']
				);
				
			}

		} else {
			die('Error: '. mysql_error());
		}

		echo json_encode($result_out);
	}


	if ($action == 'get_count') {

	}
	mysql_close($con);
?>