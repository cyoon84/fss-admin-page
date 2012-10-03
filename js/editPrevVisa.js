10/2/2012/**
* editPrevVisa.js - edit / delete previous visa record for each students
*
*/
	
	$(function() {
		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}
		$('.error').hide();
		$('#afterDelete').hide();

		var current_userid = $.session.get('session_userid');

		var version = 0;


		var student_id = 0;
		var prev_visa_id = $.urlParam('id'); 	
		
		var existing_visa_type ='';
		var existing_issue_date = '';
		var existing_expiry_date = '';
		
		var data_prev_visa_Parm = {"prevVisaIndex":prev_visa_id, "criteria": "one"};

		initializeDateSelector("#new_visaIssueDay","#new_visaIssueMonth");
		initializeDateSelector("#new_visaExpiryDay","#new_visaExpiryMonth");

		$.ajax({
				type:"GET",
				url: "bin/get_prev_visa.php",
				cache: false,
				dataType: "json",
				data:data_prev_visa_Parm,
				success: function(resp) {
					student_id = resp[0].studentId;
					existing_visa_type = resp[0].prev_visa_type;
					existing_issue_date = resp[0].prev_visa_issue_date;
					existing_expiry_date = resp[0].prev_visa_expiry_date;
					$('#existing_visa_type').append(existing_visa_type);
					$('#existing_visa_issue_date').append(existing_issue_date);
					$('#existing_visa_expiry_date').append(existing_expiry_date);

				}		
		});

		$('#backButton').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;
		});

		$('#delVisaTrigger').click(function() {
			$('#prevVisaModal').modal('toggle');
		});

		//when user wants to update visit date

		$('#savePrevVisaEdit').click(function() {
			var newVisaIssueDay  = $('#new_visaIssueDay').val();
			var newVisaIssueMonth= $('#new_visaIssueMonth').val();
			var newVisaIssueYear = $('#new_visaIssueYear').val();

			var newVisaExpiryDay  = $('#new_visaExpiryDay').val();
			var newVisaExpiryMonth= $('#new_visaExpiryMonth').val();
			var newVisaExpiryYear = $('#new_visaExpiryYear').val();

			var newVisaType = $('#newVisaType').val();

			if (newVisaType == '0')
			{
				newVisaType = existing_visa_type;
			}

			var new_visa_issue_date = newVisaIssueYear+"-"+newVisaIssueMonth+"-"+newVisaIssueDay;

			var new_visa_expiry_date = newVisaExpiryYear+"-"+newVisaExpiryMonth+"-"+newVisaExpiryDay;

			//check user selected all date values (date, month, year)
			//if user selected all date values, new_school_start_date string will look like YYYY-MM-DD

			//if new_school_start_date.length is not 10, that means the user did not give full date detail, then don't update start date

			if (new_visa_issue_date.length != 10)
			{
				new_visa_issue_date = existing_issue_date ;
				
			}

			if (new_visa_expiry_date.length != 10)
			{
				new_visa_expiry_date = existing_expiry_date;
				
			}




			var prev_visa_updt = {"prevVisaIndex":prev_visa_id, "prev_visa_type": newVisaType, "prev_visa_issue_date": new_visa_issue_date, "prev_visa_expiry_date": new_visa_expiry_date, "user_id":current_userid, "action":"update"};

			$.ajax({
				type: "POST",
				url: "bin/edit_prev_visa.php",
				cache: false,
				data:prev_visa_updt,
				success: function(resp) {
					$('#myModalLabel').empty();
					$('#myModalLabel').append("Update previous visa record");
					$('#modal-body-msg').empty();
					$('#modal-body-msg').append(resp);
					$('#prevVisaModal').modal('toggle');
					$('#preConfirm').hide();
					$('#afterDelete').show();
					
				}
			});

				return false;

		});


		//delete this visit record (for sure) 

		$('#delProceed').click(function() {

			var prev_visa_del_info = {"prevVisaIndex":prev_visa_id, "studentId": student_id, 
									"student_info_ver": version, "user_id":current_userid, "action":"delete"};
			$.ajax( {
				type: "POST",
				url: "bin/edit_prev_visa.php",
				cache: false,
				data: prev_visa_del_info,
				success: function(resp) {
					$('#modal-body-msg').empty();
					$('#modal-body-msg').append(resp);
					$('#preConfirm').hide();
					$('#afterDelete').show();

				}
			});
	
		});

		$('#delSuccess').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;

		});
	});
