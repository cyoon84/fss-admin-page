/**
* editReminder.js - edit / delete visit record for each students
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

		var existing_remind_date = '';

		var version = 0;

		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
		$('#new_remindMonth').append('<option value=0>-----------------</option>');
		$('#new_remindDay').append('<option value=0>-----------</option>');
		
		for (i=0; i!= months.length ; i++ )
		{
			var actualmonth = i+1;
			if (actualmonth < 10)
			{
				$('#new_remindMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			} else {
				$('#new_remindMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
			}
		}

		for (i=1; i!= 32  ; i++ )
		{
			if (i < 10)
			{
				$('#new_remindDay').append('<option>0'+i+'</option>');
			} else {
				$('#new_remindDay').append('<option>'+i+'</option>');
			}
		}

		var student_id = 0;
		var reminder_id = $.urlParam('id'); 		
		
		var data_reminder_index = {"reminderIndex":reminder_id};


		$.ajax({
				type:"GET",
				url: "bin/get_reminder_one.php",
				cache: false,
				dataType: "json",
				data:data_reminder_index,
				success: function(resp) {
					student_id = resp[0].studentId;
					var existing_remindReason = resp[0].remindReason;

					existing_remindReason = existing_remindReason.replace(/<br\s*[\/]?>/gi, "\n");
					existing_remind_date = resp[0].remindDate;
					$('#existing_remind_date').append(existing_remind_date); 					
					$('#newRemindReason').val(existing_remindReason);

				}		
		});

		$('#backButton').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;
		});

		$('#delReminderTrigger').click(function() {
			$('#reminderModal').modal('toggle');
		});

		//when user wants to update visit date

		$('#saveReminderEdit').click(function() {
			$('.error').hide();
			var newRemindDay  = $('#new_remindDay').val();
			var newRemindMonth= $('#new_remindMonth').val();
			var newRemindYear = $('#new_remindYear').val();

			var visit_date = '';

			var new_remind_date = newRemindYear+"-"+newRemindMonth+"-"+newRemindDay;

			//check user selected all date values (date, month, year)
			//if user selected all date values, new_school_start_date string will look like YYYY-MM-DD

			//if new_school_start_date.length is not 10, that means the user did not give full date detail, then don't update start date

			
			if (new_remind_date.length != 10)
			{
				if (new_remind_date != '-0-0') { //if -0-0 then user did not choose any new date values
					$('label#remind_error').show();
 					 return false;
 				} else {
 					new_remind_date = existing_remind_date;
 				}
			}

			var remind_reason = $('#newRemindReason').val();

			var reminder_updt = {"reminderIndex": reminder_id, "remindDate": new_remind_date, "remindReason": remind_reason, "user_id":current_userid, "action":"update"};

			$.ajax({
				type: "POST",
				url: "bin/edit_reminder.php",
				cache: false,
				data:reminder_updt,
				success: function(resp) {
					$('#myModalLabel').empty();
					$('#myModalLabel').append("Update previous school record");
					$('#modal-body-msg').empty();
					$('#modal-body-msg').append(resp);
					$('#reminderModal').modal('toggle');
					$('#preConfirm').hide();
					$('#afterDelete').show();
					
				}
			});

				return false;

		});


		//delete this visit record (for sure) 

		$('#delProceed').click(function() {

			var reminder_del = {"reminderIndex": reminder_id, "action":"delete"};
			$.ajax( {
				type: "POST",
				url: "bin/edit_reminder.php",
				cache: false,
				data: reminder_del,
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
