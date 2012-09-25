<?php
	include 'connection.php';

	if ($_POST) {

		$user_id = mysql_real_escape_string($_REQUEST['id']);
		$pwd = mysql_real_escape_string($_REQUEST['pwd']);
		
		$pwd_md5 = md5($pwd);

		$sql = mysql_query("select * from userlist where user_id = '$user_id' and pwd = '$pwd_md5'");

		if (mysql_num_rows($sql) > 0) {
			echo "0";		
		} else {
			echo "1";
		}
	}
?>