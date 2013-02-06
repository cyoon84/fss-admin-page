<?php

	include 'connection.php';
	include("class.phpmailer.php");

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

		$query = "SELECT a.studentId, a.student_pt_index, a.point_index, b.point_type, b.name, a.point_value, a.trans_date FROM student_point a inner join fss_point_list b on a.point_index = b.pointList_index where a.studentId = '$studentId' order by a.trans_date desc";
		
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
				'pointList_index' => $row['pointList_index'],
				'point_type' => $row['point_type'],
				'name' => $row['name'],
				'point_value' => $row['point_value']
			);
				
		}

		echo json_encode($result_out);

	}


	if ($action == 'getPointOne') {
		$id = $_GET['id'];
		$query = "SELECT * FROM fss_point_list where pointList_index ='$id'";
		$result_out = array();
		$result = mysql_query($query, $con);

		while ($row = mysql_fetch_array($result)) {
			$result_out[] = array (
				'point_type' => $row['point_type'],
				'name' => $row['name'],
				'point_value' => $row['point_value']
			);
				
		}

		echo json_encode($result_out, $con);

	}

	if ($action == 'updPointList') {
		$pointList_index = $_POST['pointList_index'];
		$name = $_POST['name'];
		$point_type = $_POST['point_type'];
		$point_value = $_POST['point_value'];
		$user_id = $_POST['user_id'];

		$query = "UPDATE fss_point_list set name = '$name', point_type = '$point_type', point_value = '$point_value', user_id = '$user_id' where pointList_index = '$pointList_index'";
		$result = mysql_query($query, $con);

		if (!$result) {
			die('Error: ' . mysql_error());
		} else {
			echo "update success";
		}
	}

	if ($action == 'addPointList') {
		$name = $_POST['name'];
		$point_type = $_POST['point_type'];
		$point_value = $_POST['point_value'];
		$user_id = $_POST['user_id'];

		$query = "INSERT INTO fss_point_list (name, point_type, point_value, user_id) values ('$name', '$point_type','$point_value', '$user_id')";
		$result = mysql_query($query, $con);

		if (!$result) {
			die('Error: ' . mysql_error());
		} else {
			echo "add success";
		}
	}

	if ($action == 'delPointList') {
		$pointList_index = $_POST['pointList_index'];

		$query = "DELETE from fss_point_list where pointList_index = '$pointList_index'";
		$result = mysql_query($query, $con);

		if (!$result) {
			die('Error: ' . mysql_error());
		} else {
			echo "delete success";
		}
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
		$point_val = $_POST['point_val'];

		$query2 ="INSERT INTO student_point (studentId, point_index, point_value, user_id, trans_date) VALUES ('$student_id', '$trans_val', '$point_val', '$user_id', '$trans_date')";
		$result2 = mysql_query($query2, $con);

		if ($result2) {

			send_notification($student_id,$con);

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
		$student_id = $_POST['student_id'];
		$new_point_index = $_POST['pointList_index'];


		$query = "UPDATE student_point set trans_date = '$trans_date', point_index = '$new_point_index', point_value = '$trans_val', user_id = '$user_id' where student_pt_index ='$index'";
		$result = mysql_query($query, $con);

		if ($result) {
			send_notification($student_id,$con);

			echo "update success";
		} else {
			die('Error: ' . mysql_error());
		}		
	}

	if ($action == 'delete_pt') {
		$index = $_POST['index'];
		$student_id = $_POST['student_id'];

		$query = "DELETE from student_point where student_pt_index = '$index'";

		$result = mysql_query($query, $con);

		if ($result) {
			send_notification($student_id,$con);

			echo "delete success";
		} else {
			die('Error: ' . mysql_error());
		}	
	}
	mysql_close($con);


	function send_notification($student_id, $con) {

		$query3 = "select a.point_value, b.point_type from student_point a inner join fss_point_list b on a.point_index = b.pointList_index where studentId = '$student_id'";


		$result3 = mysql_query($query3, $con);

		if (!$result3) {
			die('Error:' . mysql_error());
		}
		$total = 0;
		
		while ($row2 = mysql_fetch_array($result3)) {
			if ($row2['point_type'] == 'accumulate') {
				$total += $row2['point_value'];
			} 

			if ($row2['point_type'] == 'deduct') {
				$total -= $row2['point_value'];
			}
		}		


		$email_get_query = "select email, name_kor, unique_id from studentinfo where studentId = '$student_id' and active_indicator = 'Y'";

		$result4 = mysql_query($email_get_query, $con);

		$row3 = mysql_fetch_array($result4);

		$email = $row3['email'];
		$korName = $row3['name_kor'];
		$unique_id = $row3['unique_id'];

		if ($email != '') {
			$subject = "귀하의 FSS 포인트가 업데이트 되었습니다.";
			$body = $korName." 님의 FSS Point는 현재 ". $total. " 입니다. FSS ID: ". $unique_id. " 로 <a href='http://www.fsstoronto.com/student'>www.fsstoronto.com/student</a> 로그인 하셔서 확인하시기 바랍니다.";
						
			$mail             = new PHPMailer();

			//$body             = $mail->getFile('contents.html');
			//$body             = eregi_replace("[\]",'',$body);

			$mail->IsSMTP();
			$mail->CharSet = 'UTF-8';
			$mail->SMTPDebug  = 1;
			$mail->SMTPAuth   = true;                  // enable SMTP authentication
			$mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
			$mail->Host       = "hp112.hostpapa.com";      // sets GMAIL as the SMTP server
			$mail->Port       = 465;                   // set the SMTP port

			$mail->Username   = "fssadmin+fsstoronto.com";  // GMAIL username
			$mail->Password   = "Fsstoronto123";            // GMAIL password

			$mail->From       = "fssadmin@fsstoronto.com";
			$mail->FromName   = "FSS Toronto";
			$mail->Subject    = $subject;
			$mail->AltBody    = "This is the body when user views in plain text format"; //Text Body
			$mail->WordWrap   = 50; // set word wrap

			$mail->MsgHTML($body);

			$mail->AddReplyTo("fsstoronto@gmail.com","FSS Toronto");
			$mail->AddBCC("fssseminar@gmail.com", "FSS Seminar");

			$mail->AddAddress($email);
			
			$mail->IsHTML(true); // send as HTML

			if(!$mail->Send()) {
  				echo "Mailer Error: " . $mail->ErrorInfo;
			}				
		}

	}
?>