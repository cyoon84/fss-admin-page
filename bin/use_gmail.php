<?php

// example on using PHPMailer with GMAIL

include("class.phpmailer.php");
//include("class.smtp.php"); // note, this is optional - gets called from main class if not already loaded


$body = $_POST['body'];
$email = $_POST['recipient'];
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

$mail->AddAddress($email);
$mail->AddAddress("chulhee.y@gmail.com","Test2");

$mail->IsHTML(true); // send as HTML

if(!$mail->Send()) {
  echo "Mailer Error: " . $mail->ErrorInfo;
} else {
  echo "Message has been sent";
}

?>
