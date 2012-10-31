/**
* viewlist.js - view list of students in attention
*
*/
var page_no = 0;

	$(function() {
		
		$('#menuarea').load('menu.html');

		var current_userid = $.session.get('session_userid');
		var newId = 0;
		var action_view_by = ''

		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}

		var show_by = $.urlParam('by');


		page_no = $.urlParam('page');		

		var today_str = getTodayDateString(new Date());
		var end_date_str = '';
		var end_date = '';
		var start_date = '';
		var start_date_str = '';

		var per_page = $('#numberPerPage').val();

		if (show_by == 'remind' || show_by == 'remindPastDue') {

			if (show_by == 'remind') {
				$('#title').append("<h3>Students needs to follow up within 7 days</h3>");
				start_date_str = today_str;
				end_date = Date.parse('+7 days');
				end_date_str = getTodayDateString(end_date);
				action_view_by = "by_date_contents";	
			}

			if (show_by == 'remindPastDue') {
				$('#title').append("<h3>Past due reminders</h3>");

				start_date_str = today_str;

				end_date_str= '0000-00-00';

				action_view_by = "by_past_due_contents";


			}

			loadPagination(show_by, start_date_str,end_date_str,per_page);

			

			loadPage(show_by, action_view_by, start_date_str, end_date_str, page_no, per_page);

			$('#result thead').append("<tr><th style='width:20%'>Student Name </th> <th style='width:50%'>Remind Reason</th> <th style='width:15%'> Follow up by date </th> <th style='15%'>Follow up</th></tr>");


		}


		if (show_by == 'visadate')
		{
			$('#title').append("<h3>List of students whose visas are expiring within 30 days</h3>");
			start_date_str = today_str;
			end_date = Date.parse('+30 days');
			end_date_str = getTodayDateString(end_date);
			
			$('#result thead').append("<tr><th style='width:20%'>Student Name </th> <th style='width:40%'>Visa Type</th> <th style='width:20%'> Visa Issue Date </th><th style='width:20%'>Visa Expiry Date</th> </tr>");
		
			loadPagination(show_by, start_date_str, end_date_str, per_page);

			action_view_by = 'visa_expiry_daterange_contents';

			loadPage(show_by, action_view_by, start_date_str, end_date_str, page_no, per_page);
		}

		if (show_by == 'newAdd')
		{
			$('#title').append("<h3>List of newly added students</h3>");
			start_date = Date.parse('-7 days');
			start_date_str = getTodayDateString(start_date);
			end_date_str = today_str;
			

			$('#result thead').append("<tr><th style='width:20%'>Student Name </th> <th style='width:20%'>FSS Student ID </th> <th style='width:15%'>Date of Birth</th> <th style='width:30%'> Email </th><th style='width:15%'>Added Date</th> </tr>");
		
			
			loadPagination(show_by, start_date_str, end_date_str, per_page);

			action_view_by = "new_added_students_contents";


			loadPage(show_by, action_view_by, start_date_str, end_date_str, page_no, per_page);

		}

		if (show_by == 'newVisit')
		{
			$('#title').append("<h3>List of visited students</h3>");
			start_date = Date.parse('-7 days');
			start_date_str = getTodayDateString(start_date);
			end_date_str = today_str;

			$('#result thead').append("<tr><th style='width:30%'>Student Name </th>  <th style='width:55%'> Visit Purpose </th><th style='width:15%'>Visit Date</th></tr>");

			loadPagination(show_by, start_date_str, end_date_str, per_page);

			action_view_by = "new_visit_contents";

			loadPage(show_by, action_view_by, start_date_str, end_date_str, page_no, per_page);

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

		$('#numberPerPage').change(function() {
			per_page = $('#numberPerPage').val();
			$('#pageList').empty();
			loadPagination(show_by, start_date_str, end_date_str, per_page);
			loadPage(show_by,action_view_by, start_date_str, end_date_str, 1, per_page);
		})

	});


	function loadPagination(show_by,start_date, end_date, per_page) {
		var urlPHP = '';

		if (show_by != 'remind' && show_by != 'remindPastDue') {
			urlPHP = "bin/getAllUser.php";
		} else {
			urlPHP = "bin/get_reminder_record.php";
		}

		var data_range = {"start_date": start_date, "end_date": end_date, "action": "viewlist_pagination", "per_page": per_page, "show_by": show_by}; 

		$.ajax({
			type:"GET",
			url:urlPHP,
			data: data_range,
			dataType:"json",
			success:function(resp) {
				var total_page_no = resp[0].total_pages;

				if (page_no != 1) {
					var prev_page_no = page_no - 1; 
					$('#pageList').append('<li><a href="viewlist.html?by='+show_by+'&page='+prev_page_no+'">&laquo;</a></li>');
				} else {
					$('#pageList').append('<li><a href="#">&laquo;</a></li>');
				}

				for (var i=0; i!= total_page_no; i++) {
					var pageNo = i+1;
					$('#pageList').append('<li><a href="viewlist.html?by='+show_by+'&page='+pageNo+'">'+pageNo+'</a></li>');

				}
				if (page_no != total_page_no) {	
					var next_page = total_page_no + 1;
					$('#pageList').append('<li><a href="viewlist.html?by='+show_by+'&page='+next_page+'">&raquo;</a></li>');
				} else {
					$('#pageList').append('<li><a href="#">&raquo;</a></li>');
				}
			}

		});
	}


	function loadPage(show_by, action, start_date, end_date, page_no, per_page) {

		var date_range = {"start_date": start_date, "end_date": end_date, "action": action, "page": page_no, "per_page": per_page};
		var urlPHP = '';

		if (show_by != 'remind' && show_by != 'remindPastDue') {
			urlPHP = "bin/getAllUser.php";
		} else {
			urlPHP = "bin/get_reminder_record.php";
		}

		$.ajax({
			type:"GET",
			url:urlPHP,
			data: date_range,
			dataType: "json",
			success: function(resp) {
				for (i=0; i!= resp.length ; i++ )
				{
					if (show_by == 'newAdd') {
						var date_add_dates = resp[i].date_added.substring(0,10);
						if (resp[i].name_eng == '')
						{
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].unique_id+"</td><td>"+resp[i].date_birth+"</td><td><a href='send_email.html?email="+resp[i].email+"'>"+resp[i].email+"</a></td><td>"+date_add_dates+"</td></tr>");
						} else {
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"<br>("+resp[i].name_eng+")</a></td><td>"+resp[i].unique_id+"</td><td>"+resp[i].date_birth+"</td><td><a href='send_email.html?email="+resp[i].email+"'>"+resp[i].email+"</a></td><td>"+date_add_dates+"</td></tr>");

						}
					}

					if (show_by == 'newVisit') {
						if (resp[i].name_eng == '')
						{
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].visit_purpose+"</td><td>"+resp[i].visit_date+"</td></tr>");
						} else {
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"<br>("+resp[i].name_eng+")</a></td><td>"+resp[i].visit_purpose+"</td><td>"+resp[i].visit_date+"</td></tr>");
						}
					}

					if (show_by == 'visadate') {
						if (resp[i].name_eng == '')
						{
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].visa_type+"</td><td>"+resp[i].visa_issue_date+"</td><td>"+resp[i].visa_exp_date+"</td></tr>");
						} else {
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"<br>("+resp[i].name_eng+")</a></td><td>"+resp[i].visa_type+"</td><td>"+resp[i].visa_issue_date+"</td><td>"+resp[i].visa_exp_date+"</td></tr>");

						}
					}

					if (show_by == 'remind' || show_by == 'remindPastDue') {
						if (resp[i].name_eng == '')
						{
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"</td><td>"+resp[i].remindReason+"</td><td>"+resp[i].remindDate+"</td><td><input type='button' value='Mark follow up' class='follow_up' id='"+resp[i].reminderIndex+"'></td></tr>");
						} else {
							$('#result tbody').append("<tr><td><a href='viewStudent.html?id="+resp[i].studentId+"&hidden=N'>"+resp[i].name_kor+"<br>("+resp[i].name_eng+")</a></td><td>"+resp[i].remindReason+"</td><td>"+resp[i].remindDate+"</td><td><input type='button' value='Mark follow up' class='follow_up' id='"+resp[i].reminderIndex+"'></td></tr>");

						}
					}
				}
		}

		});
	}
