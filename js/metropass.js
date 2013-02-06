$(function() {
	$('#menuarea').load('menu.html');
	$('.error').hide();

	load_table("active"); 
	load_table("past"); 

	var sale_id_clicked = '';
	var month_year = '';


	$('#active tbody').on('click','.markDone', function() {
		var sale_id = this.id;
		mark_done(sale_id,"N");
		return false;
	});

	$('#past tbody').on('click','.doneUndo', function() {
		var sale_id = this.id;
		mark_done(sale_id,"Y");
		return false;
	});

	$('#active tbody').on('click','.update',function() {
		month_year = $(this).parent().parent().find("td").eq(0).html();
		var price = $(this).parent().parent().find("td").eq(1).html();
		var qty = $(this).parent().parent().find("td").eq(2).html();

		sale_id_clicked = this.id;

		$('#new_price_pass').val('');
		$('#new_maximum_sale').val('');
		$('#month_year_to_upd').empty();

		$('#month_year_to_upd').append(month_year);
		$('#new_price_pass').val(price);
		$('#new_maximum_sale').val(qty);
		$('#metropassUpdate').modal('toggle');
		return false;
	});

	$('#saveUpdate').click(function() {
		var price = $('#new_price_pass').val();
		var qty = $('#new_maximum_sale').val();

		if (isNaN(price)) {
			$('#new_price_error').show();
			$('#new_price_pass').focus();
			return false;
		}

		if (isNaN(qty)) {
			$('#new_max_sale_error').show();
			$('#new_maximum_sale').focus();
			return false;			
		}

		$.ajax({
			type:"POST",
			url:"bin/metropass.php",
			cache:false,
			data:{"action":"update", "max_qty": qty, "price": price, "sale_id": sale_id_clicked },
			success:function(resp) {
				if (resp == 'success') {
					load_table("active");
					$('#metropassUpdate').modal('hide');					
				} else {
					alert(resp);
				}
			}
		});
		return false;
	});

	$('#deleteSaleRecord').click(function() {
		$('#metropassUpdate').modal('hide');
		$('#deletePeriod').empty();
		$('#deletePeriod').append(month_year);
		$('#delConfirm').modal('toggle');
	});

	$('#deleteProceed').click(function() {
		$.ajax({
			url:"bin/metropass.php",
			type:"POST",
			cache:false,
			data:{"action": "delete", "sale_id":sale_id_clicked},
			success:function(resp) {
				if (resp == 'success') {
					$('#delConfirm').modal('hide');
					load_table("active");
				} else {
					alert(resp);
				}
				
			}
		})
	});

	$('#newSale').click(function() {
		$('.error').hide();
		var newsale_month = $('#sale_month').val();
		var newsale_year = $('#sale_year').val();

		var metropass_price = $('#metropass_price').val();

		var max_sale= $('#max_sale').val();

		if (newsale_year == '') {
			$('#sale_year_error2').show();
			$('#sale_year').focus();
			return false;			
		} else {

			if (isNaN(newsale_year)) {
				$('#sale_year_error').show();
				$('#sale_year').focus();
				return false;
			}
		}


		if (metropass_price == '') {
			$('#metropass_price_error2').show();
			$('#metropass_price').focus();
			return false;
		} else {		
			if (isNaN(metropass_price)) {
				$('#metropass_price_error').show();
				$('#metropass_price').focus();
				return false;
			} 
		}

		if (max_sale == '') {
			$('#max_sale_error2').show();
			$('#max_sale').focus();
			return false;			
		} else {
			if (isNaN(max_sale)) {
				$('#max_sale_error').show();
				$('#max_sale').focus();
				return false;			
			}

		}
		var data_sale = {"action": "add_new_sale",  "month": newsale_month, "year": newsale_year, "max_qty": max_sale, "price": metropass_price};

		$.ajax({
			type: "POST",
			data:data_sale,
			url:"bin/metropass.php",
			cache:false,
			success:function (resp) {
				if (resp == 'success') {
					$('#sale_month').prop('selectedIndex',0);
					$('.field').val('');
					load_table("active");
					$('#addnewSale').removeAttr('disabled');
				} else {
					alert(resp);
				}
			}
		});
		return false;
	});

	$('#addnewSale').click(function() {
		var url = "metropass_order_form.php";
		window.location = url;
	});
});

function load_table(table_type) {
	var data_load = {"action": "load", "table_type" : table_type};

	if (table_type == 'active') {
		$('#active tbody').empty();
	}

	if (table_type == 'past') {
		$('#past tbody').empty();
	}

	$.ajax({
		type: "GET",
		data:data_load,
		url:"bin/metropass.php",
		dataType:"json",
		cache:false,
		success:function (resp) {
			var metropass_list = resp;
			if (metropass_list.length == 0) {
				if (table_type == 'active') {
					$('#addnewSale').attr('disabled','disabled');
					$('#active tbody').append("<tr><td colspan='5' style='text-align:center'><h3>No records found</h3></td></tr>");
				}
				if (table_type == 'past') {
					$('#past tbody').append("<tr><td colspan='5' style='text-align:center'><h3>No records found</h3></td></tr>");
				}
			}
			for (i =0; i != metropass_list.length; i++) {
				if (table_type == 'active') {
					$('#active tbody').append("<tr><td>"+metropass_list[i].sale_month+"/"+metropass_list[i].sale_year+"</td><td>"+metropass_list[i].price_per_pass+"</td><td>"+metropass_list[i].actual_sale+"</td><td>"+metropass_list[i].maximum_sale+"</td><td><a class='viewReport btn btn-primary btn-small' href=view_report_sales.html?id="+metropass_list[i].sale_id+">View report</a>&nbsp;<button class='markDone btn btn-info btn-small' id='"+metropass_list[i].sale_id+"'>Mark done</button>&nbsp;<button class='update btn btn-warning btn-small' id='"+metropass_list[i].sale_id+"'>Update / Delete </button></td></tr>");
				}
				if (table_type == 'past') {
					$('#past tbody').append("<tr><td>"+metropass_list[i].sale_month+"/"+metropass_list[i].sale_year+"</td><td>"+metropass_list[i].price_per_pass+"</td><td>"+metropass_list[i].maximum_sale+"</td><td><a class='viewReport btn btn-primary btn-small' href=view_report_sales.html?id="+metropass_list[i].sale_id+">View report</a>&nbsp;<button class='doneUndo btn btn-info btn-small' id='"+metropass_list[i].sale_id+"'>Undo done</button></td></tr>");
				}
			} 
		}
	});
	return false;	
}

function mark_done(sale_id, done_ind) {
	$.ajax({
		type:"POST",
		data:{"action": "mark_done", "done": done_ind, "sale_id": sale_id},
		url:"bin/metropass.php",
		cache:false,
		success:function(resp) {
			if (resp == 'success'){
				load_table("active");
				load_table("past");
			} else {
				alert(resp);
			}
		}
	});
	return false;
}