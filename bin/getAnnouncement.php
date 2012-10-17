<?php
	include 'connection.php';
	$action = $_GET['action'];


	if ($action == 'getPageNumber') {

		$per_page = $_GET['per_page'];

		$query = 'SELECT * from announcements';
		$result = mysql_query($query, $con);
		$count = mysql_num_rows($result);
		$pages = ceil($count/$per_page);

		echo $pages;

	}

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

	if ($action == 'page') {
		$page = $_GET['page'];

		$per_page = $_GET['per_page'];
		$start = ($page-1)*$per_page;

		$result_out = array();

		

		$query = "SELECT * from announcements order by announcementIndex desc limit $start, $per_page";
		$result = mysql_query($query, $con);

		while ($row = mysql_fetch_array($result)) {

			$body = array();	
			$body[] = array(
					'announcementIndex' => $row['announcementIndex'],
					'user_id' => $row['user_id'],
					'title' => $row['title'],
					'body' => $row['body'],
					'date_added' => $row['date_added']
			);

			$id = $row['announcementIndex'];

			$query2 = "SELECT * from announcements_comments where announcementIndex ='$id' order by date_added asc";

			$comment_list = array();

			$result2 = mysql_query($query2,$con);

			while ($row2 = mysql_fetch_array($result2)) {
				$comment_list[] = array(
					'announcementIndex' => $row2['announcementIndex'],
					'comment_index' => $row2['comment_index'],
					'user_id' => $row2['user_id'],
					'comment_body' => $row2['comment_body'],
					'date_added' => $row2['date_added']
				
				);

			}

			$record = array();
			$record[] = array('body' => $body, 'comments' => $comment_list);

			$result_out[] = array('announcement' => $record);
		}

		
		echo json_encode($result_out);


	}


	if ($action == 'one') {
		$id = $_GET['id'];


		$result_out = array();

		

		$query = "SELECT * from announcements where announcementIndex = '$id'";
		$result = mysql_query($query, $con);

		$row = mysql_fetch_array($result);

		$body = array();	
		$body[] = array(
				'announcementIndex' => $row['announcementIndex'],
				'user_id' => $row['user_id'],
				'title' => $row['title'],
				'body' => $row['body'],
				'date_added' => $row['date_added']
		);

		$id = $row['announcementIndex'];

		$query2 = "SELECT * from announcements_comments where announcementIndex ='$id' order by date_added asc";

		$comment_list = array();

		$result2 = mysql_query($query2,$con);

		while ($row2 = mysql_fetch_array($result2)) {
			$comment_list[] = array(
				'announcementIndex' => $row2['announcementIndex'],
				'comment_index' => $row2['comment_index'],
				'user_id' => $row2['user_id'],
				'comment_body' => $row2['comment_body'],
				'date_added' => $row2['date_added']
			
			);

		}

		$record = array();
		$record[] = array('body' => $body, 'comments' => $comment_list);

		$result_out[] = array('announcement' => $record);
	

		
		echo json_encode($result_out);

	}
	
	mysql_close($con);

?>