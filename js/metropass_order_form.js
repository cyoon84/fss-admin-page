$(function() {
	$('.error').hide();
	$('#phone').mask("999-999-9999");	

	$('#menuarea').load('menu.html');
	var current_id = $.session.get('session_userid');


	$('#submit').click(function() {
		$('.error').hide();
		var name_eng_last = $('#eng_last_name').val();
		var name_eng_first = $('#eng_first_name').val();
		var phone = $('#phone').val();
		var email = $('#email').val();
		var school_name = $('#school').val();
		var status_canada = $('#status').val();
		var order_month = $('#metropass_month').val();

		if (name_eng_last == '') {
			$('#nameEng_last_error').show();
			$('#eng_last_name').focus();
			return false;
		}

		if (name_eng_first == '') {
			$('#nameEng_first_error').show();
			$('#eng_first_name').focus();
			return false;			
		}

		if (phone == '') {
			$('#phone_error').show();
			$('#phone').focus();
			return false;			
		}

		if (email == '') {
			$('#email_error').show();
			$('#email').focus();
			return false;			
		}

		if (school_name == '') {
			$('#school_error').show();
			$('#school').focus();
			return false;			
		}	

		if (status_canada == '0') {
			$('#status_error').show();
			$('#status').focus();
			return false;				
		}

		var unique_id = $('#unique_id').val();

		var data_order = {"action": "add_new_order", 
						"unique_id": unique_id,  
						"metropass_month": order_month, 
						"eng_first_name" : name_eng_first, 
						"eng_last_name": name_eng_last, 
						"email": email, 
						"phone": phone, 
						"school": school_name, 
						"status": status_canada};	
		
		$.ajax({
			type:"POST",
			data:data_order,
			url:"bin/metropass.php",
			success:function(resp) {
				$('#orderSuccess').modal('toggle');
			}
		});
	});


});

