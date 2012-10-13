<?php
	include 'connection.php';

	$action = $_POST['action'];

	if ($action == 'new_post') {
	
		$title = $_POST['title'];
		$body = $_POST['body'];
		$user_id = $_POST['user_id'];
		

		$query = "INSERT INTO announcements (title, body, user_id) values ('$title', '$body', '$user_id')";

		if (!mysql_query($query, $con)) {
			die('Error1: ' . mysql_error());
		} 
		
		echo "added successfully";

	}

	if ($action == 'new_comment') {
		$announcementIndex = $_POST['announcementIndex'];
		$body = $_POST['body'];
		$user_id = $_POST['user_id'];
		

		$last_id = mysql_query("select max(comment_index) from announcements_comments");
		$last_id = mysql_fetch_array($last_id,MYSQL_BOTH);
		$last_id = $last_id[0];

		$new_id = $last_id + 1;

		$query = "INSERT INTO announcements_comments (comment_index, announcementIndex, comment_body, user_id) values ('$new_id', '$announcementIndex', '$body', '$user_id')";

		if (!mysql_query($query, $con)) {
			die('Error1: ' . mysql_error());
		}

		echo $new_id;


	}

	if ($action == 'delete_comment') {
		$comment_index = $_POST['comment_index'];

		$query = "DELETE from announcements_comments where comment_index = '$comment_index'";

		if (!mysql_query($query, $con)) {
			die('Error1: ' . mysql_error());
		}

		echo "delete success";
	}

	if ($action == 'edit_comment') {
		$comment_index = $_POST['comment_index'];

		$body = $_POST['comment_body'];


		$query = "UPDATE announcements_comments set comment_body = '$body' where comment_index = '$comment_index'";

		if (!mysql_query($query, $con)) {
			die('Error1: ' . mysql_error());
		}

		echo "update success";
	}

	if ($action == 'delete_announcement') {
		$announcementIndex = $_POST['announcementIndex'];

		$query = "DELETE from announcements where announcementIndex = '$announcementIndex'";
		
		if (!mysql_query($query, $con)) {
			die('Error1: ' . mysql_error());
		} else {
			$query2 = "DELETE from announcements_comments where announcementIndex = '$announcementIndex'";
			if (!mysql_query($query2, $con)) {
				die('Error1: ' . mysql_error());
			}

			echo "delete success";
		}

	}

	if ($action == 'update_announcement') {
		$announcementIndex = $_POST['announcementId'];
		$title = $_POST['title'];
		$body = $_POST['body'];

		$query = "UPDATE announcements set title = '$title', body = '$body' where announcementIndex = '$announcementIndex'";

		if (!mysql_query($query, $con)) {
			die('Error1: ' . mysql_error());
		}

		echo "update success";
		
	}

?>