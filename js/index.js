$(function () {
	var seven_days_later = Date.parse('+7 days');
	var thirty_days_later = Date.parse('+30 days');

	var last_seven_days = Date.parse('-7 days');

	var seven_days_later_date = getTodayDateString(seven_days_later);
	var thirty_days_later_date = getTodayDateString(thirty_days_later);

	var last_seven_days_date = getTodayDateString(last_seven_days);

	var today_str = getTodayDateString(new Date());
	
	var date_range = {"start_date": today_str, "end_date": seven_days_later_date, "action": "by_date_count"};
	var date_range_visa = {"start_date": today_str, "end_date": thirty_days_later_date, "action": "visa_expiry_daterange_count"};

	var last_seven_days = {"start_date": last_seven_days_date, "end_date": today_str, "action": "get_new_student_list"};
	
	$.ajax({
		type:"GET",
		url:"bin/get_reminder_record.php",
		data: date_range,
		dataType: "json",
		success: function(resp) {
			var reminders = resp[0].number_reminders;

			
			if (reminders > 0)
			{
				$('#reminderNumber').append("<h1><a href='viewlist.html?by=remind'>"+reminders+"</a></h1>");
				$('#reminderMessage').append("<a href='viewlist.html?by=remind'>"+reminders+" student(s) need to be followed up within the next 7 days!</a>");
			} else {
				$('#reminderNumber').append("<h1>"+reminders+"</h1>");
				$('#reminderMessage').append("You have no reminder due within next 7 days!");
			}
		}
	
	});

	$.ajax({
		type:"GET",
		url:"bin/getAllUser.php",
		data: date_range_visa,
		dataType: "json",
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
		}

	});


	$.ajax({
		type:"GET",
		url:"bin/getAnnouncement.php",
		data:{"action":"getLatest"},
		dataType: "json",
		success: function(resp) {
			for (var i=0;i!=resp.length ;i++ )
			{
				$('#announcementArea').append("<h3><a href='viewAnnouncement.html?id="+resp[i].announcementIndex+"'>"+resp[i].title +"</a> <small> by " +resp[i].user_id+" - posted at " + resp[i].date_added+" </small></h3>");
			}
			

		}
	});
});