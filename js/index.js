$(function () {
	var seven_days_later = Date.parse('+7 days');
	var thirty_days_later = Date.parse('+30 days');

	var last_seven_days = Date.parse('-7 days');

	var seven_days_later_date = getTodayDateString(seven_days_later);
	var thirty_days_later_date = getTodayDateString(thirty_days_later);

	var last_seven_days_date = getTodayDateString(last_seven_days);

	var today_str = getTodayDateString(new Date());
	
	var date_range = {"start_date": today_str, "end_date": seven_days_later_date, "action": "by_date_count"};
	var date_range_allUser = {"start_date": today_str, "end_date": thirty_days_later_date, "last_seven_days": last_seven_days_date, "action": "index_page_daterange_count"};
	
	$.ajax({
		type:"GET",
		url:"bin/get_reminder_record.php",
		data: date_range,
		cache:false,
		dataType: "json",
		success: function(resp) {
			var reminders = resp[0].number_reminders;
			var reminder_past_due = resp[0].number_past_due;
			
			if (reminders > 0)
			{
				$('#reminderNumber').append("<h1><a href='viewlist.html?by=remind'>"+reminders+"</a></h1>");
				$('#reminderMessage').append("<a href='viewlist.html?by=remind'>"+reminders+" student(s) need to be followed up within the next 7 days!</a>");
			} else {
				$('#reminderNumber').append("<h1>"+reminders+"</h1>");
				$('#reminderMessage').append("You have no reminder due within the next 7 days!");
			}

			if (reminder_past_due > 0)
			{				
				$('#reminderPastDueNumber').append("<h1><a href='viewlist.html?by=remindPastDue' class='pastDue'>"+reminder_past_due+"</a></h1>");
				$('#reminderPastDueMessage').append("<a href='viewlist.html?by=remindPastDue' class='pastDue'>"+reminder_past_due+" reminder(s) are past due");
			} else {
				$('#reminderPastDueNumber').append("<h1>"+reminder_past_due+"</h1>");
				$('#reminderPastDueMessage').append("You have no outstanding reminders!");
			}


		}
	
	});

	$.ajax({
		type:"GET",
		url:"bin/getAllUser.php",
		data: date_range_allUser,
		dataType: "json",
		cache:false,
		success: function(resp) {
			var visa_count = resp[0].visa_expiry_count;


			if (visa_count > 0)
			{
				$('#visaNumber').append("<h1><a href='viewlist.html?by=visadate'>"+visa_count+"</a></h1>");
				$('#visaMessage').append("<a href='viewlist.html?by=visadate'>"+visa_count+" student(s) visa is expiring within the next 30 days!</a>");
			} else {
				$('#visaNumber').append("<h1>"+visa_count+"</h1>");
				$('#visaMessage').append("No students have visa expiring within next 30 days!");
			}


			var new_student_added = resp[0].new_student_added;


			if (new_student_added > 0)
			{
				$('#newAddedNumber').append("<h1><a href='viewlist.html?by=newAdd'>"+new_student_added+"</a></h1>");
				$('#newAddedMessage').append("<a href='viewlist.html?by=newAdd'>"+new_student_added+" new student(s) registered within the last 7 days</a>");
			} else {
				$('#newAddedNumber').append("<h1>"+new_student_added+"</h1>");
				$('#newAddedMessage').append("No new students registered within the last 7 days");
			}

			var new_visit_added = resp[0].new_visit_added;

			if (new_visit_added > 0)
			{
				$('#newVisitNumber').append("<h1><a href='viewlist.html?by=newVisit'>"+new_visit_added+"</a></h1>");
				$('#newVisitMessage').append("<a href='viewlist.html?by=newVisit'>"+new_visit_added+" student(s) visited within the last 7 days</a>");
			} else {
				$('#newVisitNumber').append("<h1>"+new_visit_added+"</h1>");
				$('#newVisitMessage').append("No new visits within the last 7 days");
			}
		}

	});


	$.ajax({
		type:"GET",
		url:"bin/getAnnouncement.php",
		data:{"action":"getLatest"},
		dataType: "json",
		cache:false,
		success: function(resp) {
			if (resp.length > 0) {
				for (var i=0;i!=resp.length ;i++ )
					{
						$('#announcementArea').append("<h3><a href='viewAnnouncement.html?id="+resp[i].announcementIndex+"'>"+resp[i].title +"</a> <small> by " +resp[i].user_id+" - posted at " + resp[i].date_added+" </small></h3>");
					}
			} else {
				$('#announcementArea').append("<h3>No new announcements </h3>");
			}
			

		}
	});
});