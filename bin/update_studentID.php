<?php
	
	include 'connection.php';

	$query = "select * from studentinfo where unique_id not like 'FSS%'";

	$result = mysql_query($query, $con);

	if (!$result) {
		die('Error: '. mysql_error());
	} else {
		$result_out = array();

		while ($row = mysql_fetch_array($result)) {
			$fss_id = $row['unique_id'];
			$student_id = $row['studentId'];
			$new_fss_id = substr($fss_id,0,4).substr($fss_id,6);
			echo $student_id.'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$fss_id.'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'.$new_fss_id."<br>";

			$query2 = "update studentinfo set unique_id = '$new_fss_id' where studentId = '$student_id'";

			$result2 = mysql_query($query2,$con);

			if (!$result2) {
				die('Error: '. mysql_error());
			}
		}
	}

	echo 'succesfully updated all student id';

	mysql_close($con);
?>