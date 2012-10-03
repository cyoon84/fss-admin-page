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
		

		if (show_by == 'remind')
		{
			$('#title').append("<h3>Students needs to follow up within 7 days</h3>");
			end_date = Date.parse('+7 days');
			end_date_str = getTodayDateString(end_date);
			$('#result thead').append("<tr><th style='width:20%'>Student Name </th> <th style='width:65%'>Remind Reason</th> <th style='width:15%'> Follow up by date </th> </tr>");

			var date_range = {"start_date": today_str, "end_date": end_date_str, "action": "by_date_contents"};

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
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].remindReason+"</td><td>"+resp[i].remindDate+"</td></tr>");
						} else {
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"("+resp[i].name_eng+")</a></td><td>"+resp[i].remindReason+"</td><td>"+resp[i].remindDate+"</td></tr>");

						}
					}
				}
		
			});
		}
		
		$('#daterange').append("From: " + today_str+ " To: " + end_date_str);


	});