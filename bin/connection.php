<?php
	
	$con = mysql_connect("localhost","root","raptors0");
	mysql_query("SET NAMES utf8");

	if (!con) {

		die('Could not connect: ' . mysql_error());
	}

	mysql_select_db('fss_toronto');

?>