/**
* viewStudent.js - for viewStudent.html - which shows detailed information about the student and user can choose actions to take - e.g. update, delete, add new visit / reminder
*
*/
	
	$(function() {
		$('#viewArea').empty();
		//function to get parameter (id #) from the url
		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}


		var student_id = $.urlParam('id');

		var is_hidden = $.urlParam('hidden');

		var visit_id = 0;

		var reminder_count = 0;
		
		var data_studentID = {"studentId": student_id, "is_hidden": is_hidden};
		var new_reminder_date ='';

		var today_date = new Date();

		//gets general information from the database 

		$.ajax({
				type:"GET",
				url: "bin/view_user.php",
				dataType: "json",
				data:data_studentID,
				success: function(resp) {
						$('#viewArea').append("<table class='table'><tr><td style='width:25%'> Name (English)</td><td>"+resp[0].name_eng+"</td></tr>"
										+"<tr><td> Name (Korean) </td><td>"+resp[0].name_kor+"</td></tr>"
										+"<tr><td> Gender </td><td>"+resp[0].gender+"</td></tr>"
										+"<tr><td> Date of birth</td><td>"+resp[0].birthdate+"</td></tr>"
										+"<tr><td> E-mail address</td><td>"+resp[0].email+"</td></tr>"
										+"<tr><td> Phone</td><td>"+resp[0].phone+"</td></tr>"
										+"<tr><td> Current Address</td><td>"+resp[0].address+"</td></tr>"
										+"<tr><td> Date of Arrival</td><td>"+resp[0].arrival_dt+"</td></tr>"
										+"<tr><td> Visa Type</td><td>"+resp[0].visa_type+"</td></tr>"
										+"<tr><td> Visa Issue Date</td><td>"+resp[0].visa_issue_date+"</td></tr>"
										+"<tr><td> Visa Expiry Date</td><td>"+resp[0].visa_exp_date+"</td></tr>"
										+"<tr><td> Name of Agency in Korea</td><td>"+resp[0].korea_agency+"</td></tr>"
										+"<tr><td> Current School</td><td>"+resp[0].current_school+"</td></tr>"
										+"<tr><td> Current School Start Date</td><td>"+resp[0].current_school_strt_dt+"</td></tr>"
										+"<tr><td> Current School End Date</td><td>"+resp[0].current_school_end_dt+"</td></tr>"
										+"<tr><td> Note</td><td>"+resp[0].updt_reason+"</td></tr></table>");
						var version_latest = resp[0].version;
						for (i=version_latest; i!= -1 ; i-- )
						{
							if (i == version_latest)
							{
								$('#prev_ver').append('<option value='+i+'>'+i+' (the latest record) </option>');
							} else {
								$('#prev_ver').append('<option value='+i+'>'+i+'</option>');
							}
						}
				}
		
		});


		//gets list of visit records from the database
		$.ajax({
				type:"GET",
				url:"bin/get_visit_record.php",
				dataType:"json",
				data:data_studentID,
				success: function(resp) {
					if (resp.length > 0) {
						$('#viewVisitRecord').append('<table class="table table-bordered" id="visitRecordTable"><tbody>');

						for (i=0;i!=resp.length ;i++ )
						{
							var visitNum = i+1;
							$('#visitRecordTable tbody').append('<tr><td rowspan="4" width="10%">'+visitNum+ '</td><td width="20%"> Visit Date </td><td>' + resp[i].visit_date+ '</td></tr>'
							+'<tr><td> Visit Purpose</td><td>'+ resp[i].visit_purpose+ '</tr><tr><td> Notes<td>' + resp[i].visit_note + '</td></tr>' 
							+'<tr><td colspan="2"><a href="editVisitRecord.html?visit_id='+resp[i].visit_index+'&student_id='+student_id+'">Edit / Delete this record</a> </td></tr>');
						}
		

						$('#viewVisitRecord').append('</tbody></table>');
					} else {
						$('#viewVisitRecord').append('<center><h3>No visit record found for this student</h3></center>');
					}
				}
		});

		$.ajax({
				type:"GET",
				url:"bin/get_reminder_record.php",
				dataType: "json",
				data:data_studentID,
				success:function(resp) {
					$('#viewReminders').empty();
					var ONE_DAY = 1000 * 60 * 60 * 24;

					$('#viewReminders').append("<table class='table' id='remindTable'><thead><tr><td>Days left</td><td>Reason</td><td> Follow up by </td> <td>Followed up </td> <td> Mark follow up</td></tr></thead><tbody>");

					reminder_count = resp.length;

					if (resp.length > 0)
					{
						for (i=0;i!=resp.length ;i++ )
						{
							var encode_row = $.toJSON(resp[i]);
							var remindDate_str = $.evalJSON(encode_row).remindDate;
							var remindReason = $.evalJSON(encode_row).remindReason;
							var follow_up_ind = $.evalJSON(encode_row).follow_up_ind;
							var remindDate = $.evalJSON(encode_row).remindDate;

							var remind_year = remindDate_str.substring(0,4);

							var remind_month = parseInt(remindDate_str.substring(5,7),10) - 1;
							var remind_day = parseInt(remindDate_str.substring(8),10);
						
						
							var remind_date_obj=new Date(remind_year, remind_month, remind_day);
						
							var today_ms = today_date.getTime();
							var remind_ms = remind_date_obj.getTime();
						
							var diff_ms = Math.abs(remind_ms - today_ms);

							var diff_days = Math.round(diff_ms / ONE_DAY);
						
							$('#remindTable tbody').append("<tr><td>"+ diff_days + "</td><td>" + remindReason+ "</td><td>" +remindDate+ "</td><td>"+follow_up_ind+"</td><td><input type='button' value='followed up' class='follow_up' id='"+resp[i].reminderIndex+"'></td></tr>"); 
						}
					} else {
						$('#remindTable tbody').append("<tr><td colspan='5'><center><h3>There is no reminder for this student</h3></center></td></tr>");
					}

					
					$('#viewReminders').append("</tbody></table>");

				}


		});

		$('.follow_up').live('click',function() {
			var remindId = this.id;
			$(this).parent().parent().remove();
			var today_year = today_date.getFullYear();
			var today_month = today_date.getMonth()+1;
			var today_day = today_date.getDate();

			if (today_month >= 10)
			{
				var today_str = today_year + "-"+today_month+ "-"+today_day;
			} else {
				var today_str = today_year + "-0"+today_month + "-"+today_day;

			}
			

			$.ajax({
				type:"POST",
				url:"bin/update_reminder_record.php",
				data:{"reminderIndex": remindId, "follow_up_date": today_str},
				success:function(resp) {
						alert(resp);
						$(this).parent().parent().remove(); 
						reminder_count --;
						if (reminder_count == 0)
						{			
							$('#remindTable tbody').append("<tr><td colspan='5'><center><h3>There is no reminder for this student</h3></center></td></tr>");
						}
				}
			});

		});



		$('#updButton').click(function() {
			var url = "updateStudent.html?id="+student_id;
			window.location = url;
		});

		$('#delButton').click(function() {
			$('#deleteModal').modal('toggle');
		});


		$('#deletePermanent').click(function() {
			var delId = {"student_id": student_id};
			$.ajax({
				type:"POST",
				url:"bin/delete_user.php",
				data:delId,
				success:function(resp) {
					$('#modal-body2').empty();
					$('#modal-body2').append(resp);
					$('#deletechoice').hide();
					$('#afterdelete').show();
				}

			});
			
		});

		$('#recInactive').click(function() {
			var delId = {"student_id": student_id};
			$.ajax({
				type:"POST",
				url:"bin/hide_user.php",
				data:delId,
				success:function(resp) {
					$('#modal-body2').empty();
					$('#modal-body2').append(resp);
					$('#deletechoice').hide();
					$('#afterdelete').show();
				}

			});
		});

		$('#addVisit').click(function() {
			var url = "studentVisit.html?id="+student_id;
			window.location = url;
		});

		//add reminder 
		$('#addReminder').click(function() {
			$('#remindAt').empty();
			$('#remindDays').val('');
			$('#remindreason').val('');
			$('#myModal').modal('toggle');
		});

		//for 'add reminder' - user will enter # of days for reminder - e.g. if user enters 30 (days), it will calculate the date after 30 days from today.
		$('#remindDays').change(function() {
			$('#remindAt').empty();
			var enteredDay = $('#remindDays').val();
			var addBy = parseInt(enteredDay,10);
			var date =new Date();

			date.setDate(date.getDate() + addBy);
			
			var month = date.getMonth() + 1;
			if (month < 10)
			{
				
				var month_string  = "0"+month;
			} else {
				var month_string = month;
			}

			if (date.getDate() < 10)
			{
				var string_date = "0"+date.getDate();
			} else {
				var string_date = date.getDate();
			}

			

			new_reminder_date = date.getFullYear() + "-"+ month_string +"-"+ string_date;



			$('#remindAt').append(new_reminder_date);
			
		});
	
		//save new reminder record to the database
		$('#saveReminder').click(function() {
			var reason_replaced = $('#remindreason').val().replace(/\r\n|\r|\n/g,"<br />");
			var data_reminder = {"studentId": student_id, "reminder_date": new_reminder_date, "reason": reason_replaced};

			$.ajax({
				type: "POST",
				url: "bin/add_reminder.php",
				data: data_reminder,
				success: function(resp) {
					alert(resp);
					var url = "viewStudent.html?id="+student_id;
					window.location = url;
				}
			});

		});


		//it enables user to view previous record (detailed information only, not visit / reminder) for that student
		$('#prev_ver').change(function() {
			var select_ver = $('#prev_ver').val();
			var data_studentID = {"studentId": student_id,
								  "version": select_ver
								};
			$.ajax({
				type:"GET",
				url: "bin/view_user_prev.php",
				dataType: "json",
				data:data_studentID,
				success: function(resp) {
					$('#viewArea').empty();
					$('#viewArea').append("<table class='table'><tr><td style='width:25%'> Name (English)</td><td>"+resp[0].name_eng+"</td></tr>"
										+"<tr><td> Name (Korean) </td><td>"+resp[0].name_kor+"</td></tr>"
										+"<tr><td> Gender </td><td>"+resp[0].gender+"</td></tr>"
										+"<tr><td> Date of birth</td><td>"+resp[0].birthdate+"</td></tr>"
										+"<tr><td> E-mail address</td><td>"+resp[0].email+"</td></tr>"
										+"<tr><td> Phone</td><td>"+resp[0].phone+"</td></tr>"
										+"<tr><td> Current Address</td><td>"+resp[0].address+"</td></tr>"
										+"<tr><td> Date of Arrival</td><td>"+resp[0].arrival_dt+"</td></tr>"
										+"<tr><td> Visa Type</td><td>"+resp[0].visa_type+"</td></tr>"
										+"<tr><td> Visa Issue Date</td><td>"+resp[0].visa_issue_date+"</td></tr>"
										+"<tr><td> Visa Expiry Date</td><td>"+resp[0].visa_exp_date+"</td></tr>"
										+"<tr><td> Name of Agency in Korea</td><td>"+resp[0].korea_agency+"</td></tr>"
										+"<tr><td> Current School</td><td>"+resp[0].current_school+"</td></tr>"
										+"<tr><td> Current School Start Date</td><td>"+resp[0].current_school_strt_dt+"</td></tr>"
										+"<tr><td> Current School End Date</td><td>"+resp[0].current_school_end_dt+"</td></tr>"
										+"<tr><td> Note</td><td>"+resp[0].updt_reason+"</td></tr></table>");

				}
			});


		});



	});
