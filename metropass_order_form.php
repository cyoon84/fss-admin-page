<!--Metropass order page for students, students submit the order for metropass by entering all necessary information  -->

<!DOCTYPE html>
<html>
<head>
<link href="css/bootstrap.css" rel="stylesheet">
<link href="css/bootstrap-responsive.css" rel="stylesheet">
<link href="css/page-style.css" rel="stylesheet">
<script src="http://code.jquery.com/jquery-1.8.0.js"></script>
<script src="js/bootstrap.js"></script>
<script src="js/jquery.session.js"></script>
<script src="js/checklogin.js"></script>
<script src="js/common_functions.js"></script>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script src="js/jquery.maskedinput-1.3.js"></script>
<script src="js/date.js"></script>
<script src="js/metropass_order_form.js"></script>


</head>

<body>

<div class="span12" style="margin-top:10px" id="top-header">
		<div style="float:left">
			<h3>FSS Toronto</h3>
		</div>
		


		<div id="logoffarea" style="float:right">
			Logout&nbsp;<a tabindex="-1" href="#" id="logout"><i class="icon-off"></i></a></li>
		</div>

</div>


<div class="modal hide fade" id="plzlogin" tabindex="-1" role="dialog" aria-labelledby="myModalLabel3" aria-hidden="true">
	<div class="modal-header">
		<h3 id="myModalLabel3">Log in Required</h3>
	</div>
	<div class="modal-body" id="modal-body3">
	Please log in first
	</div>
	<div class="modal-footer">
		<button class="btn btn-primary" id="goToLogin">Log In</button>
	</div>
</div>	

<div class="modal hide fade" id="logoutWindow" tabindex="-1" role="dialog" aria-labelledby="myModalLabel4" aria-hidden="true">
	<div class="modal-header">
		<h3 id="myModalLabel4">Logout</h3>
	</div>
	<div class="modal-body" id="modal-body4">
		User will logout from this site.
	</div>
	<div class="modal-footer">
		<button class="btn" data-dismiss="modal" aria-hidden="true">Cancel logout</button>
		<button class="btn btn-primary" id="goToLogout">Logout</button>
	</div>
</div>	

<div class="modal hide fade" id="orderSuccess" tabindex="-1" role="dialog" aria-labelledby="myModalLabel5" aria-hidden="true">
	<div class="modal-header">
		<h3 id="myModalLabel3">Order placed</h3>
	</div>
	<div class="modal-body" id="modal-body3">
	Order placed. 
	</div>
	<div class="modal-footer">
		<a class="btn btn-primary" href="metropass.html">Go back</a>
	</div>
</div>	

<div class="span12">
	<div class="row">
		<div class="span3" style="margin-top:10px" id="menuarea">


		</div>
		<div class="span9" style="margin-top:10px;margin-left:0px">
			<h1>Metropass Order form <small>아래 모든 내용을 다 입력 해 주세요 </small> </h1> 
			<br>
			<div class="span9 well" style="margin-left:0px">
			<h2>Student information </h2> <br>
				<?php
					$unique_id = generateRandomString();
					function generateRandomString($length = 5) {
					    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
					    $randomString = '';
					    for ($i = 0; $i < $length; $i++) {
					        $randomString .= $characters[rand(0, strlen($characters) - 1)];
					    }
					    return $randomString;
					}
					echo '<input type="hidden" id="unique_id" name="unique_id" value="'.$unique_id.'">';
				?>
				<table class="table">
				<tr>
					<td class="desc_row"> Name 
					<td> Last Name: <input type="text" placeholder="enter last name" id="eng_last_name" name="eng_last_name">
						First Name: <input type="text" placeholder="enter first name" id="eng_first_name" name="eng_first_name">
						<label class="error" for="eng_last_name" id="nameEng_last_error"> This field is required </label>
						<label class="error" for="eng_first_name" id="nameEng_first_error"> This field is required </label>
				</tr>
				<tr>
					<td class="desc_row"> Metropass month
					<td> <select id="metropass_month" name="metropass_month">
						<?php
							include 'bin/connection.php';
							$query = "select sale_id, sale_year, sale_month from metropass_sale_admin where active_sale_ind = 'Y'"; 

							$result = mysql_query($query, $con);

							while ($row = mysql_fetch_array($result)) {
								echo "<option value='".$row['sale_id']."'>".$row['sale_month']." / ". $row['sale_year']."</option>";
							}

						?>

					</select>
				</tr>


				<tr>
					<td class="desc_row"> Phone
					<td> <input type="text" id="phone" name="phone">
						<label class="error" for="phone" id="phone_error"> This field is required </label>
				</tr>
				<tr>
					<td class="desc_row"> Email
					<td> <input type="text" id="email" placeholder="someone@somewhere.com" name="email">
						<label class="error" for="email" id="email_error"> This field is required </label>
				</tr>
				<tr>
					<td class="desc_row"> School
					<td> <input type="text" id="school" placeholder="enter school name" name="school">
						<label class="error" for="school" id="school_error"> This field is required </label>
				</tr>
				<tr>
					<td class="desc_row"> Current status in Canada
					<td> <select id="status" name="status"> 
							<option value="0">----------Choose one--------</option>
							<option value="study">Study permit</option>
							<option value="visitor">Visitor</option>
							<option value="workpermit">Work permit</option>
							<option value="PR">Permanent Resident</option>
							<option value="citizen">Canadian Citizen</option>
							<option value="none">None</option>
						 </select>
						 <label class="error" for="status" id="status_error"> This field is required </label>
				</tr>
			</table>

			<button class="btn btn-large btn-primary" id="submit">Submit</button>
		</div>
		</div>
	</div>
</div>

</body>

</html>