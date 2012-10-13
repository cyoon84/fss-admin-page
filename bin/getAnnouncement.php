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

	if ($action == 'all') {
		$query = 'SELECT * from announcements order by announcementIndex desc';
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

	if ($action == 'one') {
		$id = $_GET['id'];

		$result_out = array();

		$body = array();

		$query = "SELECT * from announcements where announcementIndex = '$id'";
		$result = mysql_query($query, $con);

		$row = mysql_fetch_array($result);
		$body[] = array(
				'announcementIndex' => $row['announcementIndex'],
				'user_id' => $row['user_id'],
				'title' => $row['title'],
				'body' => $row['body'],
				'date_added' => $row['date_added']
		);

		
		//get comments
		$query2 = "SELECT * from announcements_comments where announcementIndex = '$id' order by date_added asc";
		$result2 = mysql_query($query2,$con);

		$comment_list = array();


		while ($row2 = mysql_fetch_array($result2)) {
			$comment_list[] = array(
				'announcementIndex' => $row2['announcementIndex'],
				'comment_index' => $row2['comment_index'],
				'user_id' => $row2['user_id'],
				'comment_body' => $row2['comment_body'],
				'date_added' => $row2['date_added']
			);

		}		

		$result_out[] = array('body' => $body, 'comments' => $comment_list);

		
		echo json_encode($result_out);


	}
	
	mysql_close($con);

?>