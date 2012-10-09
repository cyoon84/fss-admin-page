<?php
	include 'connection.php';
	$action = $_GET['action'];

	if ($action == 'getLatest') {
		$query = 'SELECT * FROM announcements order by announcementIndex desc limit 3';
		$result = mysql_query($query, $con);

		$result_out = array();
		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array(
				'announcementIndex' => $row['announcementIndex'],
				'user_id' => $row['user_id'],
				'title' => $row['title'],
				'date_added' => $row['date_added']
			);

		}
		echo json_encode($result_out);

	}
	
	mysql_close($con);

?>