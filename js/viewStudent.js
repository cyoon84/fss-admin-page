/**
* viewStudent.js - for viewStudent.html - which shows detailed information about the student and user can choose actions to take - e.g. update, delete, add new visit / reminder
*
*/
	var today_date = new Date();
		
	var status = '';

	$(function() {

		var visitDateOpt = '';

		$('.error').hide();
		$('#chooseDate').hide();
		$('#saveVisitSuccess').hide();
		//function to get parameter (id #) from the url
		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}

		
		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
		
		$('#remindMonth').append('<option value=0>-----------------</option>');
		$('#remindDay').append('<option value=0>-----------</option>');
		

		//initialize month / day selector boxes
		for (i=0; i!= months.length ; i++ )
		{
			var actualmonth = i+1;
			if (actualmonth < 10)
			{
				$('#remindMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			} else {
				$('#remindMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
			}
		}

		for (i=1; i!= 32  ; i++ )
		{
			if (i < 10)
			{
				$('#remindDay').append('<option>0'+i+'</option>');
			} else {
				$('#remindDay').append('<option>'+i+'</option>');
			}
		}		

		var today_str = getTodayDateString(today_date);
		
		var current_userid = $.session.get('session_userid');
		

		$('#visitTodayDate').append("&nbsp;&nbsp;&nbsp;"+today_str);

		var student_id = $.urlParam('id');

		var is_hidden = $.urlParam('hidden');

		var visit_id = 0;

		var version_latest = 0;

		var reminder_count = 0;
		
		var data_studentID = {"studentId": student_id, "is_hidden": is_hidden};
		var new_reminder_date ='';

		initializeDateSelector("#visitDay","#visitMonth");
		
		if (is_hidden == 'Y')
		{
			$('#updButton').hide();
			$('#addVisit').hide();
			$('#addReminder').hide();
			$('#delButton').hide();
			status = 'Inactive';
		} else {
			$('#toActive').hide();
			$('#delPermanently').hide();
			status = 'Active';
		}

		//gets general information from the database 

		$.ajax({
				type:"GET",
				url: "bin/view_user.php",
				cache: false,
				dataType: "json",
				data:data_studentID,
				success: function(resp) {

						
						fillInfoTable(resp);

						version_latest = resp[0].version;
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
				cache: false,
				data:data_studentID,
				success: function(resp) {
					if (resp.length > 0) {
						$('#viewVisitRecord').append('<table class="table table-bordered" id="visitRecordTable"><tbody>');

						for (i=0;i!=resp.length ;i++ )
						{
							var visitNum = i+1;
							$('#visitRecordTable tbody').append('<tr><td rowspan="5" width="10%">'+visitNum+ '</td><td width="20%"> Visit Date </td><td>' + resp[i].visit_date+ '</td></tr>'
							+'<tr><td> Visit Purpose</td><td>'+ resp[i].visit_purpose+ '</tr><tr><td> Notes<td>' + resp[i].visit_note + '</td></tr>'
							+'<tr><td> Added by </td><td>'+ resp[i].user_id+ '</td></tr>' 
							+'<tr><td colspan="2"><a class="btn btn-small btn-primary" href="editVisitRecord.html?visit_id='+resp[i].visit_index+'&student_id='+student_id+'">Edit / Delete this record</a> </td></tr>');
						}
		

						$('#viewVisitRecord').append('</tbody></table>');
					} else {
						$('#viewVisitRecord').append('<center><h3>No visit record found for this student</h3></center>');
					}
				}
		});

		reminderLoad(student_id);
		reminder_old_Load(student_id);

		prevSchoolLoad(student_id);

		prevVisaLoad(student_id);
		
		$('.follow_up').live('click',function() {
			var remindId = this.id;
							
			$.ajax({
				type:"POST",
				url:"bin/update_reminder_record.php",
				cache: false,
				data:{"reminderIndex": remindId, "follow_up_date": today_str,"updated_by": current_userid},
				success:function(resp) {												
						
						reminderLoad(student_id);

						reminder_old_Load(student_id);
						
						
				}
			});

		});

		$('.clear_old_follow_up').live('click',function() {
			var remindId = this.id;
			$.ajax({
				type:"POST",
				url:"bin/delete_reminder_record.php",
				cache: false,
				data:{"reminderIndex": remindId, "student_id": student_id},
				success:function(resp) {
					
						reminder_old_Load(student_id);
						

						
				}
			});
		});

		$('#closewindow').click(function() {
			window.close();
			
		});

		$('.undo_old_follow_up').live('click',function() {
			var remindId = this.id;
			$.ajax({
				type:"POST",
				url:"bin/undo_reminder_record.php",
				cache: false,
				data:{"reminderIndex": remindId, "student_id": student_id},
				success:function(resp) {
					
						reminder_old_Load(student_id);
						reminderLoad(student_id);
						

						
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
				cache: false,
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
			var delId = {"student_id": student_id, "hide_by": current_userid };
			$.ajax({
				type:"POST",
				url:"bin/hide_user.php",
				cache: false,
				data:delId,
				success:function(resp) {
					$('#modal-body2').empty();
					$('#modal-body2').append(resp);
					$('#deletechoice').hide();
					$('#afterHide').show();
				}

			});
		});

		$('#hideConfirm').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=Y";
			window.location = url;	

		});

		$('#addVisit').click(function() {
			$('#addNewVisit').modal('toggle');
		});

		//add reminder 
		$('#addReminder').click(function() {
			$('#remindDays').val('');
			$('#remindreason').val('');
			$('#myModal').modal('toggle');
		});

	
		//save new reminder record to the database
		$('#saveReminder').click(function() {
			var reason_replaced = $('#remindreason').val().replace(/\r\n|\r|\n/g,"<br />");

			var remindYear = $('#remindYear').val();

			if (remindYear == '')
			{
				$('label#remindYear_error').show();
				$('input#remindYear').focus();
 				 return false;				
			} else {
				
				var remindMonth = $('#remindMonth').val();
				var remindDay = $('#remindDay').val();
				new_reminder_date = remindYear+"-"+remindMonth+"-"+remindDay;

				if (new_reminder_date.length < 10)
				{
					$('label#remind_error').show();
					$('input#remindMonth').focus();
 					 return false;
				}

			}


			var data_reminder = {"studentId": student_id, "reminder_date": new_reminder_date, "reason": reason_replaced,"added_by": current_userid};

			$.ajax({
				type: "POST",
				cache: false,
				url: "bin/add_reminder.php",
				data: data_reminder,
				success: function(resp) {
					var url = "viewStudent.html?id="+student_id+"&hidden=N";
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
				cache: false,
				dataType: "json",
				data:data_studentID,
				success: function(resp) {
					$('.viewTable_elem').empty();
					fillInfoTable(resp);
				}
			});


		});

		$('.dateVisitRadio').change(function() {
			visitDateOpt = $('input:radio[name=visitDate]:checked').val();
			if (visitDateOpt == 'chooseDate')
			{
				$('#chooseDate').show();
			} else {
				$('#chooseDate').hide();
			}

		});


		$('#toActive').click(function() {
			$('#makeActive').modal('toggle');
		
		});

		$('#activeProceed').click(function() {
			var to_active_info = {"studentId": student_id, "version_latest" : version_latest, "active_by": current_userid };
			
			$.ajax({
				type: "POST",
				cache: false,
				url: "bin/to_active.php",
				data: to_active_info,
				success: function(resp) {
					$('#modal-body3').empty();
					$('#modal-body3').append(resp);
					$('#activeChoice').hide();
					$('#afterActive').show();
										
				}
			});

		});

		$('#activeConfirm').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;
		});

		$('#delPermanently').click(function() {
			$('#modal-body2').empty();
			$('#recInactive').hide();
			$('#modal-body2').append("Do you want to remove this student record permanently? <br> WARNING : You can't restore this student after this operation");
			$('#deleteModal').modal('toggle');

		});

		$('#saveVisit').click(function() {
			$('.error').hide();

			var visit_purpose = $('#visit_purpose').val();
			var visit_note = $('#visit_note').val();
			
			if (visitDateOpt == 'today')
			{
				var visit_date = today_str;
			} else {
				var visit_date_month = $('#visitMonth').val();
				var visit_date_day = $('#visitDay').val();
				var visit_date_year = $('#visitYear').val();

				if (visit_date_year == '')
				{
					$('label#visitYear_error').show();
					$('input#visitYear').focus();
					return false;
				} else {
					var visit_date = visit_date_year+"-"+visit_date_month+"-"+visit_date_day;

					if (visit_date.length != 10)
					{
						$('label#visitDate_error').show();
						return false;
					} 
					
					

				}

			}
			

			if (visit_purpose == "")
			{
				$('label#visit_purpose_error').show();
				$('input#visit_purpose').focus();
				return false;
			}

			if (($.trim(visit_note).length) == 0)
			{
				$('label#visit_note_error').show();
				$('textarea#visit_note').focus();
				return false;
			} else {
				visit_note = visit_note.replace(/\r\n|\r|\n/g,"<br />");

			}


			var data_visit = {"studentId": student_id, "date": visit_date, "purpose": visit_purpose, "note" : visit_note,"updated_by": current_userid};

			$.ajax({
				type: "POST",
				cache: false,
				url: "bin/add_new_visit.php",
				data:data_visit,
				success: function(resp) {
					var url = "viewStudent.html?id="+student_id+"&hidden=N";
					window.location = url;
				}
			});


		});
	

		return false;


	});




	function fillInfoTable(resp) {
		var formatted_address = resp[0].address.replace(/\r\n|\r|\n/g,"<br />");
		var formatted_note = resp[0].note.replace(/\r\n|\r|\n/g,"<br />");

		$('#viewTable_korname').append(resp[0].name_kor);
		$('#viewTable_engname').append(resp[0].name_eng);
		$('#viewTable_gender').append(resp[0].gender);
		$('#viewTable_email').append(resp[0].email);
		$('#viewTable_birthdate').append(resp[0].birthdate);
		$('#viewTable_phone').append(resp[0].phone);
		$('#viewTable_address').append(formatted_address);
		$('#viewTable_arrival').append(resp[0].arrival_dt);
		$('#viewTable_visa').append(resp[0].visa_type);
		$('#viewTable_visa_issue').append(resp[0].visa_issue_date);
		$('#viewTable_visa_exp').append(resp[0].visa_exp_date);
		$('#viewTable_how_hear_us').append(resp[0].how_hear_us);
		$('#viewTable_referred_by').append(resp[0].referred_by);
		$('#viewTable_korea_agency').append(resp[0].korea_agency);
		$('#viewTable_current_school').append(resp[0].current_school);
		$('#viewTable_current_program').append(resp[0].current_program);
		$('#viewTable_school_strt_dt').append(resp[0].current_school_strt_dt);
		$('#viewTable_school_end_dt').append(resp[0].current_school_end_dt);
		$('#viewTable_act_status').append(status);
		$('#viewTable_note').append(formatted_note);
		$('#viewTable_updt_reason').append(resp[0].updt_reason);
		$('#viewTable_user_id').append(resp[0].user_id);

	};


	function reminderLoad(student_id) {

		$('#remindTable tbody').empty();

		var data_follow_up = {"student_id": student_id, "follow_up": 'N', "action": "all"};
		$.ajax({
				type:"GET",
				url:"bin/get_reminder_record.php",
				dataType: "json",
				cache: false,
				data:data_follow_up,
				success:function(resp) {
					$('#remindTable tbody').empty();
					var ONE_DAY = 1000 * 60 * 60 * 24;

					reminder_count = resp.length;

					if (resp.length > 0)
					{
						for (i=0;i!=resp.length ;i++ )
						{

							var encode_row = $.toJSON(resp[i]);
							var follow_up_ind = $.evalJSON(encode_row).follow_up_ind;
							var remindDate_str = $.evalJSON(encode_row).remindDate;
							var remindReason = $.evalJSON(encode_row).remindReason;
							var remindDate = $.evalJSON(encode_row).remindDate;
							var follow_up_date =  $.evalJSON(encode_row).follow_up_date;

								

								var remind_year = remindDate_str.substring(0,4);

								var remind_month = parseInt(remindDate_str.substring(5,7),10) - 1;
								var remind_day = parseInt(remindDate_str.substring(8),10);
														
								var remind_date_obj=new Date(remind_year, remind_month, remind_day);
							
								var diff_days = Math.ceil((remind_date_obj - today_date) / (1000*60*60*24));

								if (diff_days < 0)
								{
									$('#remindTable tbody').append("<tr><td><p style='color:red'>"+ (-1* diff_days) + " days passed</p></td><td>" + remindReason+ "</td><td>" +remindDate+ "</td><td><input type='button' value='followed up' class='follow_up' id='"+resp[i].reminderIndex+"'></td><td><a class='btn btn-small' href='editReminder.html?id="+resp[i].reminderIndex+"'>Edit/Delete</a></td></tr>"); 
								} else {
									$('#remindTable tbody').append("<tr'><td>"+ diff_days + "</td><td>" + remindReason+ "</td><td>" +remindDate+ "</td><td><input type='button' value='followed up' class='follow_up' id='"+resp[i].reminderIndex+"'></td><td><a class='btn btn-primary btn-small' href='editReminder.html?id="+resp[i].reminderIndex+"'>Edit/Delete</td></tr>"); 
								}
								
							
						}
					} else {
						$('#remindTable tbody').append("<tr><td colspan='5'><center><h3>There is no reminder for this student</h3></center></td></tr>");
					}

					
				}


		});
	}

	function reminder_old_Load(student_id) {

		$('#remindTable_old tbody').empty();

		var data_follow_up = {"student_id": student_id, "follow_up": 'Y', "action": "all"};
		$.ajax({
				type:"GET",
				url:"bin/get_reminder_record.php",
				dataType: "json",
				cache: false,
				data:data_follow_up,
				success:function(resp) {
					$('#remindTable_old tbody').empty();
					
					if (resp.length > 0)
					{
						for (i=0;i!=resp.length ;i++ )
						{

							var encode_row = $.toJSON(resp[i]);
							var follow_up_ind = $.evalJSON(encode_row).follow_up_ind;
							var remindDate_str = $.evalJSON(encode_row).remindDate;
							var remindReason = $.evalJSON(encode_row).remindReason;
							var remindDate = $.evalJSON(encode_row).remindDate;
							var follow_up_date =  $.evalJSON(encode_row).follow_up_date;
							var follow_up_userid = $.evalJSON(encode_row).user_id;

							$('#remindTable_old tbody').append("<tr><td>"+ follow_up_date + "</td><td>" + remindReason+ "</td><td>"+follow_up_userid+
																"<td><input type='button' value='Undo' class='undo_old_follow_up' id='"+resp[i].reminderIndex+"'></td>"+
																"<td><input type='button' value='Delete' class='clear_old_follow_up' id='"+resp[i].reminderIndex+"'></td></tr>"); 
							
						}
					} else {
						$('#remindTable_old tbody').append("<tr><td colspan='5'><center><h3>There is no reminder for this student</h3></center></td></tr>");
					}

					
				}


		});

	}

	function prevSchoolLoad(student_id) {
		$('#prevSchoolList tbody').empty();

		var input = {"student_id": student_id};
		$.ajax({
				type:"GET",
				url:"bin/get_prev_schools.php",
				dataType: "json",
				cache: false,
				data:input, 				
				success:function(resp) { 					
					if (resp.length > 0)
					{
						for (i=0; i!=resp.length ;i++ )
						{
							var school_name = resp[i].prev_school_name;
							var school_program = resp[i].prev_school_program;
							var school_start = resp[i].prev_school_strt_dt;
							var school_end = resp[i].prev_school_end_dt;
							var prev_school_id = resp[i].prevSchoolIndex;

							$('#prevSchoolList tbody').append("<tr><td>"+school_name+"</td><td>"+school_program+"</td><td>"+school_start+"</td><td>"+school_end+"</td><td><a class='btn btn-primary btn-small' href='editPrevSchool.html?id="+prev_school_id+"'>Edit / Delete </a></td> </tr>");
						}
					} else {
						$('#prevSchoolList tbody').append("<tr><td colspan='5'><h3 style='text-align:center'> No previous school found for this student</h3></td></tr>");
					}
				}
			});
				


	}

	function prevVisaLoad(student_id) {
		$('#prevVisaList tbody').empty();

		var input = {"student_id": student_id, "criteria": "all"};
		$.ajax({
				type:"GET",
				url:"bin/get_prev_visa.php",
				dataType: "json",
				cache: false,
				data:input, 				
				success:function(resp) {
					if (resp.length > 0)
					{
						for (i=0; i!=resp.length ;i++ )
						{
							var visa_type = resp[i].prev_visa_type;
							var visa_issue_date = resp[i].prev_visa_issue_date;
							var visa_expire_date = resp[i].prev_visa_expire_date;
							var prev_visa_id = resp[i].prevVisaIndex;

							$('#prevVisaList tbody').append("<tr><td>"+visa_type+"</td><td>"+visa_issue_date+"</td><td>"+visa_expire_date+"</td><td><a class='btn btn-primary btn-small' href='editPrevVisa.html?id="+prev_visa_id+"'>Edit / Delete </a></td> </tr>");
						}
					} else {
						$('#prevVisaList tbody').append("<tr><td colspan='4'><h3 style='text-align:center'> No previous visa found for this student</h3></td></tr>");
					}
				}
			});
				
		return false;

	}

	function initializeDateSelector(id_day, id_month) {
			var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

			$(id_month).append('<option value=00>-----------------</option>');
			$(id_day).append('<option value=00>-----------</option>');

			for (i=0; i!= months.length ; i++ )
			{
				var actualmonth = i+1;
				if (actualmonth < 10)
				{
					$(id_month).append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				} else {
					$(id_month).append('<option value='+actualmonth+'>'+months[i]+'</option>');
				}
			}

			for (i=1; i!= 32  ; i++ )
			{
				if (i < 10)
				{
					$(id_day).append('<option>0'+i+'</option>');
				} else {
					$(id_day).append('<option>'+i+'</option>');
				}
			}
			
			return false;
		};