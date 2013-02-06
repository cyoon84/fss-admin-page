<?php

	include 'connection.php';
		
	$action = '';
	
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$action = $_GET['action'];
	}

	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		$action = $_POST['action'];
	}


	if ($action == 'add') {
		$student_id = $_POST['student_id'];
		$school_index = $_POST['school_index'];
		$school_type = $_POST['school_type'];
		$other_school_name = $_POST['other_school_name'];
		$prev_school_program = $_POST['prev_school_program'];
		$prev_school_strt_dt = $_POST['prev_school_strt_dt'];
		$prev_school_end_dt = $_POST['prev_school_end_dt'];
		$user_id = $_POST['user_id'];

		if ($school_index == 'Other') {
			$school_type = $_POST['school_type'];
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
		$query="INSERT INTO student_prev_school (
									 studentId
									,prev_school_name
									,school_index
									,prev_school_program
									,prev_school_strt_dt
									,prev_school_end_dt
									,user_id)
					VALUES ('$student_id'
							,''
							,'$school_index'
							,'$prev_school_program'
							,'$prev_school_strt_dt'
							,'$prev_school_end_dt'
							,'$user_id')";
	
		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		} else { 

			echo "insert success";
		}
	}

	if ($action == 'update') {
		$prevSchoolIndex = $_POST['prevSchoolIndex'];
		$studentId = $_POST['studentId'];
		$student_info_ver = $_POST['student_info_ver'];
		
		$school_index = $_POST['school_index'];
		$school_type = $_POST['school_type'];
		$school_strt_dt = $_POST['prev_school_strt_dt'];
		$school_end_dt = $_POST['prev_school_end_dt'];

		$school_program = $_POST['prev_school_program'];
			
		$user_id = $_POST['user_id'];

		if ($school_index == 'Other') {
			$school_type = $_POST['school_type'];
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
		
		$query="update student_prev_school set prev_school_name = '', school_index = '$school_index', prev_school_program = '$school_program', prev_school_strt_dt = '$school_strt_dt', prev_school_end_dt = '$school_end_dt', user_id = '$user_id' where prevSchoolIndex = '$prevSchoolIndex'";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		}


		if ($student_info_ver > 0) {
			$query2 = "update studentinfo set school_index = '$school_index', 
												current_program = '$school_program', 
												current_school_strt_dt = '$school_strt_dt', 
												current_school_end_dt = '$school_end_dt', 
												user_id = '$user_id' 
												where studentId = '$studentId' and version = '$student_info_ver'";

			if (!mysql_query($query2, $con)) {
				die('Error2: ' . mysql_error());
			}

		}
		echo "Update success";		
	}

	if ($action == 'del') {
		$studentId = $_POST['studentId'];
		$prevSchoolIndex= $_POST['prev_school_index'];
		$version = $_POST['student_info_ver'];
		$user_id = $_POST['user_id'];

		$query="delete from student_prev_school where prevSchoolIndex = '$prevSchoolIndex'";

		if (!mysql_query($query, $con)) {
			die('Error: ' . mysql_error());
		}

		if ($version > 0) {
			$query2 = "update studentinfo set current_school = '', current_program = '', current_school_strt_dt = '',current_school_end_dt = '', user_id = '$user_id' where studentId = '$studentId' and  version = '$version'";
			if (!mysql_query($query2, $con)) {
				die('Error2: ' . mysql_error());
			}

		}

		echo "Record deleted successfully";
	}


	mysql_close($con);
?>