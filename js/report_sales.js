$(function() {

	$('#menuarea').load('menu.html');

	$.urlParam = function(name){
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
		return results[1] || 0;
	}

	var sale_id = $.urlParam('id');
	$('#time_period').append(sale_id.substring(0,2) +"/20" + sale_id.substring(2));

	load_report(sale_id);

	$('#purchase_report tbody').on('click','.markPaid', function() {
		var order_id = this.id;
		mark_paid(order_id, sale_id, 'Y');
	});

	$('#purchase_report tbody').on('click','.undoPaid', function() {
		var order_id = this.id;
		mark_paid(order_id, sale_id, 'N');
	});

	$('#selectAll').click(function() {
		if (this.checked) {
			$('.selectedOrder').each(function() {
				this.checked = true;
			});
		} else {
			$('.selectedOrder').each(function() {
				this.checked = false;
			});
		}
	});

	$('#purchase_report tbody').on('click', '.selectedOrder', function() {
		$('#selectAll').removeAttr('checked');
	});

	$('#proceedAction').click(function(){
		var action = $('#actionMass').val();
		var selectedArr = $('.selectedOrder:checked').serializeArray();
		var selectedOid = {"action": "mass_change", "paid_unpaid": action, "list": selectedArr};

		$.ajax({
			type:"POST",
			cache:false,
			data:selectedOid,
			url:"bin/metropass.php",
			success:function(resp) {
				$('#selectAll').removeAttr('checked');
				$('#actionMass').prop('selectedIndex', 0);
				load_report(sale_id);

			}
		})
		return false;
	});

});

function load_report(sale_id) {
	$('#purchase_report tbody').empty();
	$('.display').empty();
	$.ajax({
		type:"GET",
		data:{"action": "load_report", "sale_id": sale_id},
		dataType: "json",
		cache:false,
		url:"bin/metropass.php",
		success: function(resp) {
			
			$('#price_pass').append("$"+resp[0].price_per_pass);
			$('#max').append(resp[0].maximum_sale);
			$('#bought').append(resp[0].purchased);
			$('#paid').append(resp[0].paid);

			var purchased_list = resp[0].purchased_list;
			if (purchased_list.length == 0) {
				$('#purchase_report tbody').append("<tr><td colspan='9' style='text-align:center'><h3>No orders placed </h3></td></tr>");
			}

			for (var i =0; i!= purchased_list.length; i++) {
				if (purchased_list[i].paid_ind == 'N') {
					$('#purchase_report tbody').append("<tr><td><input type='checkbox' class='selectedOrder' name='selectedOrder' value='"+purchased_list[i].oId+"'></td><td>"+purchased_list[i].name+"</td><td>"+purchased_list[i].email+"</td><td>"+purchased_list[i].phone+"</td><td>"+purchased_list[i].school_name+"</td><td>"+purchased_list[i].status+"</td><td>"+purchased_list[i].paid_ind+"</td><td></td><td><button class='markPaid btn btn-primary btn-small' id='"+purchased_list[i].oId+"'>Mark Paid</button></td></tr>");
				} else {
					$('#purchase_report tbody').append("<tr><td><input type='checkbox' class='selectedOrder' name='selectedOrder' value='"+purchased_list[i].oId+"'></td><td>"+purchased_list[i].name+"</td><td>"+purchased_list[i].email+"</td><td>"+purchased_list[i].phone+"</td><td>"+purchased_list[i].school_name+"</td><td>"+purchased_list[i].status+"</td><td>"+purchased_list[i].paid_ind+"</td><td>"+purchased_list[i].paid_date+"</td><td><button class='undoPaid btn btn-primary btn-small' id='"+purchased_list[i].oId+"'>Undo</button></td></tr>");
				}
			}

		}
	});
	return false;
}

function mark_paid(order_id, sale_id, ind) {
	$.ajax({
		type:"POST",
		data:{"action": "mark_paid", "paid": ind, "order_id": order_id},
		url:"bin/metropass.php",
		success:function(resp) {
			if (resp == 'success') {
				load_report(sale_id);
			} else {
				alert (resp);
			}
		}
	});
	return false;
}

function PrintElem(elem)
{
    Popup($(elem).html());
}

function Popup(data) 
{
    var mywindow = window.open('', 'my div', 'height=800,width=1050');
    mywindow.document.write('<!DOCTYPE html><html><head><title>Metropass sale report</title>');
    mywindow.document.write('<link rel="stylesheet" href="css/page-style.css">');
    mywindow.document.write('<link href="css/bootstrap.css" rel="stylesheet">');
    mywindow.document.write('<link href="css/page-style.css" rel="stylesheet">');
	mywindow.document.write('<link href="css/bootstrap-responsive.css" rel="stylesheet">');
	mywindow.document.write('<script src="js/bootstrap.js"></script>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<h3>Metropass sale report</h3>');
    mywindow.document.write('<br>');
    mywindow.document.write(data);
    mywindow.document.write('</body></html>');

    mywindow.print();
    mywindow.close();

    return true;
}