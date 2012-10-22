/**
* viewlist.js - view list of students in attention
*
*/
	$(function() {
		
		var current_userid = $.session.get('session_userid');
		var newId = 0;

		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}

		var show_by = $.urlParam('by');

		var today_str = getTodayDateString(new Date());
		var end_date_str = '';
		var end_date = '';
		var start_date = '';
		var start_date_str = '';

		if (show_by == 'remind' || show_by == 'remindPastDue') {

				if (show_by == 'remind') {
					$('#title').append("<h3>Students needs to follow up within 7 days</h3>");
					end_date = Date.parse('+7 days');
					end_date_str = getTodayDateString(end_date);
					var date_range = {"start_date": today_str, "end_date": end_date_str, "action": "by_date_contents"};
				}

				if (show_by == 'remindPastDue') {
					$('#title').append("<h3>Past due reminders</h3>");
					
					var date_range = {"start_date": today_str, "action": "by_past_due_contents"};

				}

				$('#result thead').append("<tr><th style='width:20%'>Student Name </th> <th style='width:50%'>Remind Reason</th> <th style='width:15%'> Follow up by date </th> <th style='15%'>Follow up</th></tr>");

				

				$.ajax({
					type:"GET",
					url:"bin/get_reminder_record.php",
					data: date_range,
					dataType: "json",
					success: function(resp) {
						for (i=0; i!= resp.length ; i++ )
						{
							if (resp[i].name_eng == '')
							{
								$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].remindReason+"</td><td>"+resp[i].remindDate+"</td><td><input type='button' value='Mark follow up' class='follow_up' id='"+resp[i].reminderIndex+"'></td></tr>");
							} else {
								$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"<br>("+resp[i].name_eng+")</a></td><td>"+resp[i].remindReason+"</td><td>"+resp[i].remindDate+"</td><td><input type='button' value='Mark follow up' class='follow_up' id='"+resp[i].reminderIndex+"'></td></tr>");

							}
						}
					}
			
				});
		}


		if (show_by == 'visadate')
		{
			$('#title').append("<h3>List of students whose visas are expiring within 30 days</h3>");
			end_date = Date.parse('+30 days');
			end_date_str = getTodayDateString(end_date);
			var date_range = {"start_date": today_str, "end_date": end_date_str, "action": "visa_expiry_daterange_contents"};
			$('#result thead').append("<tr><th style='width:20%'>Student Name </th> <th style='width:40%'>Visa Type</th> <th style='width:20%'> Visa Issue Date </th><th style='width:20%'>Visa Expiry Date</th> </tr>");
		
			$.ajax({
				type:"GET",
				url:"bin/getAllUser.php",
				data: date_range,
				dataType: "json",
				success: function(resp) {
					for (i=0; i!= resp.length ; i++ )
					{
						if (resp[i].name_eng == '')
						{
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].visa_type+"</td><td>"+resp[i].visa_issue_date+"</td><td>"+resp[i].visa_exp_date+"</td></tr>");
						} else {
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"<br>("+resp[i].name_eng+")</a></td><td>"+resp[i].visa_type+"</td><td>"+resp[i].visa_issue_date+"</td><td>"+resp[i].visa_exp_date+"</td></tr>");

						}
					}
				}
		
			});		
		}

		if (show_by == 'newAdd')
		{
			$('#title').append("<h3>List of newly added students</h3>");
			start_date = Date.parse('-7 days');
			start_date_str = getTodayDateString(start_date);
			var date_range = {"start_date": start_date_str, "end_date": today_str, "action": "new_added_students_contents"};

			$('#result thead').append("<tr><th style='width:30%'>Student Name </th> <th style='width:15%'>Date of Birth</th> <th style='width:40%'> Email </th><th style='width:20%'>Added Date</th> </tr>");
		
			$.ajax({
				type:"GET",
				url:"bin/getAllUser.php",
				data: date_range,
				dataType: "json",
				success: function(resp) {
					for (i=0; i!= resp.length ; i++ )
					{
						var date_add_dates = resp[i].date_added.substring(0,10);
						if (resp[i].name_eng == '')
						{
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].date_birth+"</td><td><a href='send_email.html?email="+resp[i].email+"'>"+resp[i].email+"</a></td><td>"+date_add_dates+"</td></tr>");
						} else {
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"<br>("+resp[i].name_eng+")</a></td><td>"+resp[i].date_birth+"</td><td><a href='send_email.html?email="+resp[i].email+"'>"+resp[i].email+"</a></td><td>"+date_add_dates+"</td></tr>");

						}
					}
				}
		
			});
		}

		if (show_by == 'newVisit')
		{
			$('#title').append("<h3>List of visited students</h3>");
			start_date = Date.parse('-7 days');
			start_date_str = getTodayDateString(start_date);
			var date_range = {"start_date": start_date_str, "end_date": today_str, "action": "new_visit_contents"};

			$('#result thead').append("<tr><th style='width:30%'>Student Name </th>  <th style='width:55%'> Visit Purpose </th><th style='width:15%'>Visit Date</th></tr>");
		
			$.ajax({
				type:"GET",
				url:"bin/getAllUser.php",
				data: date_range,
				dataType: "json",
				success: function(resp) {
					for (i=0; i!= resp.length ; i++ )
					{
						if (resp[i].name_eng == '')
						{
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].visit_purpose+"</td><td>"+resp[i].visit_date+"</td></tr>");
						} else {
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"<br>("+resp[i].name_eng+")</a></td><td>"+resp[i].visit_purpose+"</td><td>"+resp[i].visit_date+"</td></tr>");
						}
					}
				}
		
			});
		}
		
		if (show_by != 'newAdd' && show_by != 'newVisit')
		{
			if (show_by != 'remindPastDue')
			{
				$('#daterange').append("From: " + today_str+ " To: " + end_date_str);
			} else {
				$('#daterange').append("As of: " +today_str);
			}
			
		} else {
				$('#daterange').append("From: " + start_date_str+ " To: " +today_str);
		}
		


		$('#result').on('click','.follow_up', function () {
			var remindId = this.id;

			var row = $(this).parent().parent();
							
			$.ajax({
				type:"POST",
				url:"bin/update_reminder_record.php",
				cache: false,
				data:{"reminderIndex": remindId, "follow_up_date": today_str,"updated_by": current_userid},
				success:function(resp) {												
					row.remove();
											
				}
			});
		});

	});