<?php

	include 'connection.php';

	$action = '';
	
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$action = $_GET['action'];
	}

	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		$action = $_POST['action'];
	}

	


	if ($action == 'getHistory') {
		$studentId = $_GET['student_id'];
		$result_out = array();
		$point_history = array();

		$query = "SELECT a.studentId, a.student_pt_index, a.point_index, b.point_type, b.name, b.point_value, a.trans_date FROM student_point a inner join fss_point_list b on a.point_index = b.index where a.studentId = '$studentId' order by a.trans_date desc";
		
		$result = mysql_query($query, $con);
	
		if (!$result) {
			die('Error: ' . mysql_error());
		} else {
			
			while ($row = mysql_fetch_array($result)) {
				$point_history[] = array (
					'index' => $row['student_pt_index'],
					'studentId' => $row['studentId'],
					'point_type' => $row['point_type'],
					'point_index' => $row['point_index'],
					'trans_date' => $row['trans_date'],
					'name' => $row['name'],
					'point_value' => $row['point_value']
				);
				
			}
		}

		
		
		$result_out[] = array('point_history_list' => $point_history);

		echo json_encode($result_out);
	}

	if ($action == 'getPointLists') {
		$query = 'SELECT * FROM fss_point_list';
		$result_out = array();
		$result = mysql_query($query, $con);
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array (
				'index' => $row['index'],
				'name' => $row['name']
			);
				
		}

		echo json_encode($result_out);

	}

	if ($action == 'add_new_pt') {

		$query ="SELECT max(student_pt_index) as last_id from student_point";

		$result = mysql_query($query, $con);

		$last_id = 0;

		if (!$result) {
			$row = mysql_fetch_array($result);
			$last_id = $row['last_id'];

			$last_id++;

		}

		$student_id = $_POST['student_id'];
		$trans_date = $_POST['trans_date'];
		$trans_val = $_POST['trans_val'];
		$user_id = $_POST['user_id'];

		$query2 ="INSERT INTO student_point (studentId, point_index, user_id, trans_date) VALUES ('$student_id', '$trans_val', '$user_id', '$trans_date')";
		$result2 = mysql_query($query2, $con);

		if ($result2) {
			echo $last_id;
		} else {
			die('Error: ' . mysql_error());
		}

	}

	if ($action == 'add_new_pt') {

		$query ="SELECT max(index) as last_id from student_point";

		$result = mysql_query($query, $con);

		$last_id = 0;

		if (!$result) {
			$row = mysql_fetch_array($result);
			$last_id = $row['last_id'];

			$last_id++;

		}

		$student_id = $_POST['student_id'];
		$trans_date = $_POST['trans_date'];
		$trans_val = $_POST['trans_val'];
		$user_id = $_POST['user_id'];

		$query2 ="INSERT INTO student_point (studentId, point_index, user_id, trans_date) VALUES ('$student_id', '$trans_val', '$user_id', '$trans_date')";
		$result2 = mysql_query($query2, $con);

		if ($result2) {
			echo $last_id;
		} else {
			die('Error: ' . mysql_error());
		}

	}

	if ($action == 'update_pt') {
		$index = $_POST['index'];
		$trans_date = $_POST['trans_date'];
		$trans_val = $_POST['trans_val'];
		$user_id = $_POST['user_id'];

		$query = "UPDATE student_point set trans_date = '$trans_date', point_index = '$trans_val', user_id = '$user_id' where student_pt_index ='$index'";
		$result = mysql_query($query, $con);

		if ($result) {
			echo "update success";
		} else {
			die('Error: ' . mysql_error());
		}		
	}

	if ($action == 'delete_pt') {
		$index = $_POST['index'];

		$query = "DELETE from student_point where student_pt_index = '$index'";

		$result = mysql_query($query, $con);

		if ($result) {
			echo "delete success";
		} else {
			die('Error: ' . mysql_error());
		}	
	}
	mysql_close($con);
?>