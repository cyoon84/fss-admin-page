<?php

// example on using PHPMailer with GMAIL

include("class.phpmailer.php");
//include("class.smtp.php"); // note, this is optional - gets called from main class if not already loaded

include 'connection.php';

$body = $_POST['body'];
$opt = $_POST['opt'];


$subject = $_POST['subject'];

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


//$mail->AddAttachment("/path/to/file.zip");             // attachment
//$mail->AddAttachment("/path/to/image.jpg", "new.jpg"); // attachment


if ($opt == 'individual') {
	$email = $_POST['recipient'];
	$mail->AddAddress($email);
	$filename = $_FILES['attach']['name'];
	$source = $_FILES['attach']['tmp_name'];
	if ($filename != '') { 
		$mail->AddAttachment($source,$filename); 
	}
	$mail->AddBCC("fssseminar@gmail.com", "FSS Seminar");       
} 

if ($opt == 'mass') {
	$action = $_POST['emailRecOpt'];

	if ($action == 'allactive') {
		$query = "SELECT name_kor, email from studentinfo where active_indicator ='Y' and email <> '' order by name_kor";
		$result = mysql_query($query, $con);

		$result_out = array();

		while ($row = mysql_fetch_array($result)) {
			$mail->AddBCC($row['email'], $row['name_kor']);
		}
	}

	if ($action == 'select') {
		foreach ($_POST['recipients'] as $selectedAddress) {
			$bracketpos = strrpos($selectedAddress,"(");
			$name = substr($selectedAddress, 0,$bracketpos);
			$email = str_replace(")","",substr($selectedAddress, $bracketpos+1));
			$mail -> AddBCC($email,$name);
			
		}
	}
	$mail->AddAddress("fssseminar@gmail.com", "FSS Seminar");
}

$mail->IsHTML(true); // send as HTML

if(!$mail->Send()) {
  echo "Mailer Error: " . $mail->ErrorInfo;
} else {
	echo "<!DOCTYPE HTML><html><head>";
	echo "<link href='../css/bootstrap.css' rel='stylesheet'>";
	echo "<link href='../css/bootstrap-responsive.css' rel='stylesheet'>";
	echo "<link href='../css/page-style.css' rel='stylesheet'>";
	echo "<script src='http://code.jquery.com/jquery-1.8.0.js'></script>";
	echo "<script src='../js/bootstrap.js'></script>";
	echo "</head><body><div class='span12'>";

  	echo "<div id='msgsuccess' class='hero-unit span9' style='margin:20px auto'> <h1>Message has been sent</h1>";
	echo" <br><br><a class='btn btn-primary' href='../index.html'>Go back to main </a></p></div>";

 	echo "</div></body></html>";
}

?>
