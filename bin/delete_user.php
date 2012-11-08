<?php

	include 'connection.php';

	$id = $_POST['student_id'];

	$query = "DELETE from studentinfo where studentID = '$id'";

	if (!mysql_query($query, $con)) {
		die('Error: ' . mysql_error());
	}


	$query = "DELETE from studentvisit where studentID = '$id'";
	
	if (!mysql_query($query, $con)) {
		die('Error2: ' . mysql_error());
	}
	
	$query = "DELETE from studentreminder where studentID = '$id'";
	
	if (!mysql_query($query, $con)) {
		die('Error3: ' . mysql_error());
	}

	$query = "DELETE from student_prev_school where studentID = '$id'";

	if (!mysql_query($query, $con)) {
		die('Error4: ' . mysql_error());
	}
	
	$query = "DELETE from student_prev_visa where studentID = '$id'";

	if (!mysql_query($query, $con)) {
		die('Error5: ' . mysql_error());
	}

	$query = "DELETE from student_point where studentId = '$id'";

	if (!mysql_query($query, $con)) {
		die('Error6: ' . mysql_error());
	}

	echo "Deleted successfully";

	mysql_close($con);
?>