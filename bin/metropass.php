<?php
	include 'connection.php';
	$action = '';


	
	if ($_SERVER['REQUEST_METHOD'] === 'GET') {
		$action = $_GET['action'];
	}

	if ($_SERVER['REQUEST_METHOD'] === 'POST') {
		$action = $_POST['action'];
	}

	if ($action == 'add_new_sale') {
		$month = $_POST['month'];
		$year = $_POST['year'];
		$max_qty = $_POST['max_qty'];
		$price = $_POST['price'];

		$sale_id = $month.substr($year,2);

		$sql_query = "INSERT into metropass_sale_admin (sale_id
										, sale_year
										, sale_month
										, price_per_pass
										, maximum_sale
										, active_sale_ind)
									VALUES ('$sale_id'
										,'$year'
										,'$month'
										,'$price'
										,'$max_qty'
										,'Y')";

		if (mysql_query($sql_query, $con)) {
			echo "success";
		} else {
			die('Error1: ' . mysql_error());
		}
	}

	if ($action == 'update') {
		$max_qty = $_POST['max_qty'];
		$price = $_POST['price'];
		$sale_id = $_POST['sale_id'];

		$query = "UPDATE metropass_sale_admin set maximum_sale = '$max_qty', price_per_pass ='$price' where sale_id = '$sale_id'";

		if (mysql_query($query, $con)) {
			echo "success";
		} else {
			die('Error1: ' . mysql_error());
		}	
	}


	if ($action == 'add_new_order') {
		$korean_name = $_POST['korean_name'];
		$eng_first_name = $_POST['eng_first_name'];
		$eng_last_name = $_POST['eng_last_name'];
		$email = $_POST['email'];
		$phone = $_POST['phone'];
		$school = $_POST['school'];
		$status = $_POST['status'];
		$metropass_month = $_POST['metropass_month'];
		$unique_id = $_POST['unique_id'];	
		$today = date("Y-m-d");
		
		$english_name = $eng_last_name. " ". $eng_first_name;
		$sql_query = "INSERT into metropass_sale (unique_id
												, sale_id
												, name
												, phone
												, email
												, school_name
												, status
												, order_date)
											VALUES ('$unique_id'
												,'$metropass_month'
												,'$english_name'
												,'$phone'
												,'$email'
												,'$school'
												,'$status'
												,'$today')";
		if (mysql_query($sql_query, $con)) {
			echo "success";
		} else {
			die('Error1: ' . mysql_error());
		}	
	}

	if ($action == 'load') {
		$table_type = $_GET['table_type'];

		$sale_list = array();

		if ($table_type == 'active') {
			$query = "SELECT * FROM metropass_sale_admin where active_sale_ind = 'Y' order by sale_year, sale_month";
		} 
		if ($table_type == 'past') {
			$query = "SELECT * FROM metropass_sale_admin where active_sale_ind = 'N' order by sale_year, sale_month";
		}
		$result = mysql_query($query, $con);
	
		if (!$result) {
			die('Error: ' . mysql_error());
		} else {
			
			while ($row = mysql_fetch_array($result)) {

				$sale_id = $row['sale_id'];

				$query2 = "SELECT count(*) as count_actual_sale from metropass_sale where sale_id = '$sale_id'";

				$result2 = mysql_query($query2, $con);

				$row2 = mysql_fetch_array($result2);

				$sale_count = $row2['count_actual_sale'];

				$sale_list[] = array (
					'sIndex' => $row['sIndex'],
					'sale_id' => $sale_id,
					'sale_year' => $row['sale_year'],
					'sale_month' => $row['sale_month'],
					'price_per_pass' => $row['price_per_pass'],
					'maximum_sale' => $row['maximum_sale'],
					'actual_sale' => $sale_count

				);
				
			}

			echo json_encode($sale_list);
		}
	}

	if ($action == 'load_report') {
		$sale_id = $_GET['sale_id'];

		$report_data = array();

		$purchased_list = array();
		$query = "SELECT price_per_pass, maximum_sale, sale_year, sale_month from metropass_sale_admin where sale_id = '$sale_id'";
		$result = mysql_query($query, $con);
		$row = mysql_fetch_array($result);

		$query2 = "SELECT oid, name, phone,email, school_name,status, paid_ind, paid_date from metropass_sale where sale_id = '$sale_id' order by name";

		$result2 = mysql_query($query2, $con);

		while ($row2 = mysql_fetch_array($result2)) {
			$purchased_list[] = array (
				'oId' => $row2['oid'],
				'name' => $row2['name'],
				'phone' => $row2['phone'],
				'email' => $row2['email'],
				'school_name' => $row2['school_name'],
				'status' => $row2['status'],
				'paid_ind' => $row2['paid_ind'],
				'paid_date' => $row2['paid_date']

			);
			
		}

		//how many purchased
		$query3 = "select count(*) as purchased from metropass_sale where sale_id = '$sale_id'";

		$result3 = mysql_query($query3, $con);

		$row3 = mysql_fetch_array($result3);

		//how many paid
		$query4 = "select count(*) as paid from metropass_sale where sale_id = '$sale_id' and paid_ind = 'Y'";

		$result4 = mysql_query($query4, $con);

		$row4 = mysql_fetch_array($result4);

		$report_data[] = array("purchased" => $row3['purchased'], "paid" => $row4['paid'], "price_per_pass" => $row['price_per_pass'], "maximum_sale" => $row['maximum_sale'], "sale_year" => $row['sale_year'], "sale_month" => $row['sale_month'], "purchased_list" => $purchased_list);
	
		echo json_encode($report_data);
	}

	if ($action == 'mark_paid') {
		$order_id = $_POST['order_id'];

		$paid = $_POST['paid'];

		if ($paid == 'Y') {
			$today = date("Y-m-d");
			$query = "update metropass_sale set paid_ind='$paid', paid_date = '$today' where oid = '$order_id'";
		} else {
			$query = "update metropass_sale set paid_ind='$paid' where oid = '$order_id'";
		}

		if (mysql_query($query, $con)) {
			echo "success";
		} else {
			die('Error1: ' . mysql_error());
		}
	}

	if ($action =='mark_done') {
		$sale_id = $_POST['sale_id'];
		$done_ind = $_POST['done'];

		$query = "update metropass_sale_admin set active_sale_ind='$done_ind' where sale_id = '$sale_id'";
		if (mysql_query($query, $con)) {
			echo "success";
		} else {
			die('Error1: ' . mysql_error());
		}
	}

	if ($action == 'delete') {
		$sale_id = $_POST['sale_id'];

		$query = "delete from metropass_sale_admin where sale_id = '$sale_id'";

		if (mysql_query($query, $con)) {
			$query2 = "delete from metropass_sale where sale_id = '$sale_id'";
			if (mysql_query($query2, $con)) {
				echo "success";
			} else {
				die('Error1: ' . mysql_error());
			}
		} else {
			die('Error1: ' . mysql_error());
		}	
	}

	if ($action == 'mass_change') {
		$action_type = $_POST['paid_unpaid'];
		$selected_list = $_POST['list'];
		$today = date("Y-m-d");
		if ($action_type == 'markPaid') {
			$query = "update metropass_sale set paid_ind ='Y', paid_date = '$today' where oId in (";
		}
		if ($action_type == 'markUnpaid') {
			$query = "update metropass_sale set paid_ind ='N', paid_date = '$today' where oId in (";
		}
		for ($i=0; $i!= count($selected_list); $i++) {
			$query = $query. $selected_list[$i]['value'].',';
		}
		$query = substr($query,0,-1);
		$query = $query.")";

		if (mysql_query($query, $con)) {
			echo "success";
		} else {
			die('Error1: ' . mysql_error());
		}		
	}

?>