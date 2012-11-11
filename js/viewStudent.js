/**
* viewStudent.js - for viewStudent.html - which shows detailed information about the student and user can choose actions to take - e.g. update, delete, add new visit / reminder
*
*/
	var today_date = new Date();
		
	var status = '';

	var pointValList = new Array();

	var visitList = new Array();


	$(function() {

		$('#menuarea').load('menu.html');

		var visitDateOpt = '';
		var pointDateOpt = '';	
		var fssPTopt = '';



		$('.error').hide();
		$('#chooseDate').hide();
		$('#chooseDatePoint').hide();
		$('#saveVisitSuccess').hide();

		$('#addPTcat').hide();
		$('#redeemPTcat').hide();
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
		$('#pointTodayDate').append("&nbsp;&nbsp;&nbsp;"+today_str);

		var student_id = $.urlParam('id');

		var is_hidden = $.urlParam('hidden');

		var visit_id = 0;

		var version_latest = 0;

		var reminder_count = 0;

		var point_id = 0;

		
		var data_studentID = {"action": "latest", "studentId": student_id, "is_hidden": is_hidden};
		var new_reminder_date ='';

		initializeDateSelector("#visitDay","#visitMonth");
		initializeDateSelector("#prevSchoolStartDay", "#prevSchoolStartMonth");
		initializeDateSelector("#prevSchoolEndDay", "#prevSchoolEndMonth");
		initializeDateSelector("#transDay", "#transMonth");
		initializeDateSelector("#redDay", "#redMonth");
		initializeDateSelector("#new_transDay", "#new_transMonth");
		initializeDateSelector("#new_visitDay", "#new_visitMonth");
		
		if (is_hidden == 'Y')
		{
			$('.nonActive').show();
			$('.activeOnly').hide();
			status = 'Inactive';
		} else {
			$('.nonActive').hide();
			$('.activeOnly').show();
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
		visitLoad(data_studentID);

		reminderLoad(student_id);
		reminder_old_Load(student_id);

		pointValList = 	pointList_load();

		fillPointList(pointValList);

		point_load(student_id); 

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
			var data_studentID = {"action":prev, "studentId": student_id,
								  "version": select_ver
								};
			$.ajax({
				type:"GET",
				url: "bin/view_user.php",
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
				$('#transMonth').prop('selectedIndex', 0);
				$('#transDay').prop('selectedIndex', 0);
				$('#transYear').val('');
				$('#chooseDate').show();
			} else {
				$('#chooseDate').hide();
			}

		});

		$('.datePointRadio').change(function() {
			pointDateOpt = $('input:radio[name=pointDate]:checked').val();
			if (pointDateOpt == 'chooseDate')
			{
				$('#chooseDatePoint').show();
			} else {
				$('#chooseDatePoint').hide();
			}

		});

		$('.fssPT').change(function() {
			fssPTopt = $('input:radio[name=FSSpoint]:checked').val();
			$('#pointValField').val('');
			var selected = 0;
			if (fssPTopt == 'addPT')
			{
				$('#addPTcat').show();
				$('#redeemPTcat').hide();
				$('#pointList').prop('selectedIndex',0);
				var selected = $('#pointList').val()


			} else {
				$('#redeemList').prop('selectedIndex',0);
				$('#addPTcat').hide();
				$('#redeemPTcat').show();
				var selected = $('#redeemList').val();
			}
			var i = 0;
			while (i != pointValList.length) {
				if (selected == pointValList[i].pointList_index) {
					$('#pointValField').val(pointValList[i].point_value);
					break;
				}
				i++;
			}

		});


		$('.pointCategoryList').change(function() {
			var selected = $(this).val();
			var i = 0;
			while (i != pointValList.length) {
				if (selected == pointValList[i].pointList_index) {
					$('#pointValField').val(pointValList[i].point_value);
					break;
				}
				i++;
			}

		})

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
			visitDateOpt = $('input:radio[name=visitDate]:checked').val();

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

					if (visit_date_year.length != 4 || isNaN(visit_date_year)) {
						$('label#visitYear_error2').show();
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


		$('#addMorePrevSchool').click(function() {
			$('#addPrevSchool').modal('toggle');

		});

		$('#savePrevSchool').click(function() {
			var schoolName = $('#newPrevSchoolName').val();
			var schoolProgram = $('#newPrevSchoolProgram').val();
			var schoolStartYear = $('#prevSchoolStartYear').val();
			var schoolStartMonth = $('#prevSchoolStartMonth').val();
			var schoolStartDay = $('#prevSchoolStartDay').val();

			var schoolEndYear = $('#prevSchoolEndYear').val();
			var schoolEndMonth = $('#prevSchoolEndMonth').val();
			var schoolEndDay = $('#prevSchoolEndDay').val();

			var schoolStartDate = '';
			var schoolEndDate = '';

			if (schoolName == "") {
				$('label#namePrevSchool_error').show();
				$('input#newPrevSchoolNamee').focus();
				return false;				
			}


			if (schoolStartYear != '') {

				if (schoolStartYear.length != 4 || isNaN(schoolStartYear)) {
					$('label#prevSchoolStartYear_error').show();
					$('input#prevSchoolStartYear').focus();
					return false;				
				} else {
					schoolStartDate = schoolStartYear+"-"+schoolStartMonth+"-"+schoolStartDay;

					if (schoolStartDate.length != 10) {
						$('label#prevSchoolStartYear_error2').show();
						$('#prevSchoolStartMonth').focus();
						return false;
					}
				}

			}

			
			if (schoolEndYear != '') {

				if (schoolEndYear.length != 4 || isNaN(schoolEndYear)) {
					$('label#prevSchoolEndYear_error').show();
					$('input#prevSchoolEndYear').focus();
					return false;
				} else {
					schoolEndDate = schoolEndYear+"-"+schoolEndMonth+"-"+schoolEndDay;

					if (schoolEndDate.length != 10) {
						$('label#prevSchoolEndYear_error2').show();
						$('#prevSchoolEndMonth').focus();
						return false;
					}
				}
			}


			var prevSchoolData = {"action": "add", "student_id": student_id, "prev_school_name": schoolName, "prev_school_program": schoolProgram, "prev_school_strt_dt" : schoolStartDate, "prev_school_end_dt" : schoolEndDate, "user_id": current_userid};

			$.ajax({
				type:"POST",
				url:"bin/prev_school.php",
				data:prevSchoolData,
				cache:false,
				success:function(resp) {
					if (resp == 'insert success') {
						var url = "viewStudent.html?id="+student_id+"&hidden=N";
						window.location = url;						
					} else {
						alert(resp);
					}
				}				

			});


		});


		$('#point').click(function() {
			$('.fssPT').attr("checked",false);
			$('#transMonth').prop('selectedIndex', 0);
			$('#transDay').prop('selectedIndex', 0);
			$('#transYear').val('');
			$('#redMonth').prop('selectedIndex', 0);
			$('#redDay').prop('selectedIndex', 0);
			$('#redYear').val('');
			$('#pointList').prop('selectedIndex',0);
			$('#redeemList').prop('selectedIndex',0);
			$('#addPTcat').hide();
			$('#redeemPTcat').hide();
			$('#fssPT').modal('toggle');


		});

		$('#savePointTrans').click(function() {
			var trans_date = '';

			pointDateOpt = $('input:radio[name=pointDate]:checked').val();

			if (pointDateOpt == 'today') {
				trans_date = today_str;
			} else {
				var trans_date_month = $('#transMonth').val();
				var trans_date_day = $('#transDay').val();
				var trans_date_year = $('#transYear').val();
				if (trans_date_year == '')
				{
					$('label#transYear_error').show();
					$('input#transYear').focus();
					return false;
				} else {

					if (trans_date_year.length != 4 || isNaN(trans_date_year)) {
						$('label#transDT_error').show();
						$('input#transYear').focus();
						return false;						
					} else {

						trans_date = trans_date_year+"-"+trans_date_month+"-"+trans_date_day;


						if (trans_date.length != 10)
						{
							$('label#transDate_error').show();
							return false;
						} 
					
					}
					
				}
			}	
			var trans_val = '';
			fssPTopt= $('input:radio[name=FSSpoint]:checked').val();

			if (fssPTopt == 'addPT') {

				trans_val = $('#pointList').val();
			} 

			if (fssPTopt == 'redeemPT') {
				trans_val = $('#redeemList').val();

			}


			var point_val = $('#pointValField').val();

			var point_trans = {"action" : "add_new_pt", "student_id": student_id, "trans_date": trans_date, "trans_val": trans_val, "point_val": point_val, "user_id": current_userid};
			
			$.ajax({
				type:"POST",
				url:"bin/point_history.php",
				cache:false,
				data:point_trans,
				success:function(resp) {
					$('#fssPT').modal('hide');
					point_load(student_id);

				}
			});

		});

		$('#updPointTrans').click(function() {
			var trans_date_month = $('#new_transMonth').val();
			var trans_date_day = $('#new_transDay').val();
			var trans_date_year = $('#new_transYear').val();

			var new_trans_val = $('#new_pointList').val();


			if (trans_date_year == '')
			{
				$('label#new_transYear_error').show();
				$('input#new_transYear').focus();
				return false;
			} else {

				if (trans_date_year.length != 4 || isNaN(trans_date_year)) {
					$('label#new_transDT_error2').show();
					$('input#new_transYear').focus();
					return false;						
				} else {

					var new_trans_date = trans_date_year+"-"+trans_date_month+"-"+trans_date_day;


					if (new_trans_date.length != 10)
					{
						$('label#new_transDate_error').show();
						return false;
					} 
				
				}
				

			}

			var new_point_trans = {"action" : "update_pt", "index": point_id, "trans_date": new_trans_date, "trans_val": new_trans_val, "user_id": current_userid};
			
			$.ajax({
				type:"POST",
				url:"bin/point_history.php",
				cache:false,
				data:new_point_trans,
				success:function(resp) {
					if (resp == 'update success') {
						$('#editFssPT').modal('hide');
						point_load(student_id);
					} else {
						alert(resp);
					} 

				}
			});

		});

		$('#delPointTrans').click(function() {
			$.ajax({
				type:"POST",
				url:"bin/point_history.php",
				cache:false,
				data:{"action": "delete_pt", "index": point_id},
				success:function(resp) {
					if (resp == 'delete success') {
						$('#delFssPT').modal('hide');
						point_load(student_id);
					} else {
						alert(resp);
					} 

				}
			});
		});

		$('#pointHistory tbody').on('click', '.delPointHistory', function() {
			point_id = this.id;

			$('#delFssPT').modal('toggle');

		});

		$('#visitRecordTable tbody').on('click','.editVisitBtn', function() {
			visit_id = this.id;

			var index = 0;
			while  (index != visitList.length) {
				if (visit_id == visitList[index].visit_index) {
					break;
				}
				index++;
			}

			var visit_date = visitList[index].visit_date;

			var visit_year = visit_date.substring(0,4);

			var visit_month = visit_date.substring(5,7);

			var visit_day = visit_date.substring(8);

			$('#new_visitYear').val(visit_year);
			$('#new_visitMonth').prop('selectedIndex',visit_month);
			$('#new_visitDay').prop('selectedIndex',visit_day);

			$('#newVisitPurpose').val(visitList[index].visit_purpose);

			var visit_note_format = visitList[index].visit_note.replace(/<br\s*[\/]?>/gi, "\n");
			$('#newVisitNote').val(visit_note_format);

			$('#editVisit').modal('toggle');
		});

		$('#visitRecordTable tbody').on('click','.delVisitBtn', function() {
			visit_id = this.id;

			$('#delVisit').modal('toggle');
		});

		$('#updVisit').click(function() {
			$('.error').hide();
			var visit_year = $('#new_visitYear').val();
			var visit_month = $('#new_visitMonth').val();
			var visit_day = $('#new_visitDay').val();
			var new_visit_date = '';

			if (visit_year == '') {
				$('label#new_visitYear_error').show();
				$('#new_visitYear').focus();
				return false;
			} else {
				if (isNaN(visit_year) || visit_year.length != 4) {
					$('label#new_visitYear_error2').show();
					$('#new_visitYear').focus();
					return false;
				} 

				new_visit_date = visit_year+"-"+visit_month+"-"+visit_day;

				if (new_visit_date.length != 10) {
					$('label#new_visitYear_error3').show();
					$('#new_visitDay').focus();
					return false;	
				}
			}

			var new_purpose = $('#newVisitPurpose').val();

			if ($.trim(new_purpose).length == 0) {
				$('label#new_visitPurpose_error').show();
				$('#new_visitPurpose').focus();
				return false;
			}

			var new_note = $('#newVisitNote').val().replace(/\r\n|\r|\n/g,"<br />");

			var dataVisitUpd = {"action": "edit", "visit_index": visit_id, "visit_date": new_visit_date, "visit_purpose": new_purpose, "visit_note": new_note, "user_id": current_userid};
			
			$.ajax({
				type: "POST",
				url: "bin/edit_visit.php",
				cache: false,
				data:dataVisitUpd,
				success: function(resp) {
					if (resp == 'update success') {
						$('#editVisit').modal('hide');
						visitLoad(data_studentID);
					} else {
						alert(resp);
					}
				}
			});

		});

		$('#delVisitConfirm').click(function() {

			var dataVisitDel = {"action" : "del", "visit_index": visit_id};

			$.ajax({
				type: "POST",
				url: "bin/edit_visit.php",
				cache: false,
				data:dataVisitDel,
				success: function(resp) {
					if (resp == 'delete success') {
						$('#delVisit').modal('hide');
						visitLoad(data_studentID);
					} else {
						alert(resp);
					}
				}
			});
		});
	
		$('#pointHistory tbody').on('click','.editPointHistory', function () {
			var trans_date = $(this).parent().parent().find("td").eq(0).html();

			var trans_year = trans_date.substring(0,4);

			var trans_month = parseInt(trans_date.substring(5,7),10);

			var trans_day = parseInt(trans_date.substring(8),10);

			point_id = this.id;

			$('#new_transMonth').prop('selectedIndex', trans_month);
			$('#new_transDay').prop('selectedIndex', trans_day);
			$('#new_transYear').val(trans_year);


			var trans_name = $(this).parent().parent().find("td").eq(2).attr('id');

			var trans_name = parseInt(trans_name,10) - 1;


			$('#new_pointList').prop('selectedIndex', trans_name);	


			$('#editFssPT').modal('toggle');

		});



	});




	function fillInfoTable(resp) {
		var formatted_address = resp[0].address.replace(/\r\n|\r|\n/g,"<br />");
		var formatted_note = resp[0].note.replace(/\r\n|\r|\n/g,"<br />");

		$('#viewTable_FSS_ID').append(resp[0].unique_id);
		$('#viewTable_korname').append(resp[0].name_kor);
		$('#viewTable_engname').append(resp[0].name_eng);
		$('#viewTable_gender').append(resp[0].gender);
		$('#viewTable_email').append("<a href='send_email.html?email="+resp[0].email+"'>"+resp[0].email+"</a>");
		$('#viewTable_birthdate').append(resp[0].birthdate);
		$('#viewTable_phone').append(resp[0].phone);
		$('#viewTable_address').append(formatted_address);
		$('#viewTable_arrival').append(resp[0].arrival_dt);
		$('#viewTable_visa').append(resp[0].visa_type);
		$('#viewTable_visa_issue').append(resp[0].visa_issue_date);
		$('#viewTable_visa_exp').append(resp[0].visa_exp_date);
		
		if (resp[0].how_hear_us != 0) {
			$('#viewTable_how_hear_us').append(resp[0].how_hear_us);
		}
		
		$('#viewTable_referred_by').append(resp[0].referred_by);
		$('#viewTable_korea_agency').append(resp[0].korea_agency);
		if (resp[0].school_index == '0') {
			$('#viewTable_current_school').append(resp[0].current_school);
		} else {
			$('#viewTable_current_school').append(resp[0].school_name);
		}
		$('#viewTable_current_program').append(resp[0].current_program);
		$('#viewTable_school_strt_dt').append(resp[0].current_school_strt_dt);
		$('#viewTable_school_end_dt').append(resp[0].current_school_end_dt);
		$('#viewTable_act_status').append(status);
		$('#viewTable_note').append(formatted_note);
		$('#viewTable_updt_reason').append(resp[0].updt_reason);
		$('#viewTable_user_id').append(resp[0].user_id.toUpperCase());

	};

	function visitLoad(data_studentID) {
		$('#visitRecordTable tbody').empty();
		$.ajax({
			type:"GET",
			url:"bin/get_visit_record.php",
			dataType:"json",
			cache: false,
			async: false,
			data:data_studentID,
			success: function(resp) {
				visitList = resp;
			}
		});

		if (visitList.length > 0 ) {

			for (var i = 0; i != visitList.length; i++) {

				var visitNum = i+1;
				$('#visitRecordTable tbody').append('<tr><td rowspan="5" width="10%">'+visitNum+ '</td><td width="20%"> Visit Date </td><td>' + visitList[i].visit_date+ '</td></tr>'
				+'<tr><td> Visit Purpose</td><td>'+ visitList[i].visit_purpose+ '</tr><tr><td> Notes<td>' + visitList[i].visit_note + '</td></tr>'
				+'<tr><td> Added by </td><td>'+ visitList[i].user_id.toUpperCase()+ '</td></tr>' 
				+'<tr><td colspan="2"><button class="editVisitBtn btn btn-primary" id="'+visitList[i].visit_index+'">Edit</button> <button class="delVisitBtn btn btn-danger" id="'+visitList[i].visit_index+'">Delete</button></td></tr>');		
			}
		} else {
			$('#visitRecordTable tbody').append('<tr><td colspan="3"><center><h3>No visit record found for this student</h3></center></td></tr>');
		}
	}


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
							var remindReason = $.evalJSON(encode_row).remindReason.replace(/\r\n|\r|\n/g,"<br />");
							var remindDate = $.evalJSON(encode_row).remindDate;
							var user_id = $.evalJSON(encode_row).user_id.toUpperCase();
							var follow_up_date =  $.evalJSON(encode_row).follow_up_date;

								

								var remind_year = remindDate_str.substring(0,4);

								var remind_month = parseInt(remindDate_str.substring(5,7),10) - 1;
								var remind_day = parseInt(remindDate_str.substring(8),10);
														
								var remind_date_obj=new Date(remind_year, remind_month, remind_day);
							
								var diff_days = Math.ceil((remind_date_obj - today_date) / (1000*60*60*24));

								if (diff_days < 0)
								{
									$('#remindTable tbody').append("<tr><td><p style='color:red'>"+ (-1* diff_days) + " days passed</p></td><td>" + remindReason+ "</td><td>"+ user_id+"</td><td>" +remindDate+ "</td><td><input type='button' value='followed up' class='follow_up' id='"+resp[i].reminderIndex+"'></td><td><a class='btn btn-small' href='editReminder.html?id="+resp[i].reminderIndex+"'>Edit/Delete</a></td></tr>"); 
								} else {
									$('#remindTable tbody').append("<tr'><td>"+ diff_days + "</td><td>" + remindReason+ "</td><td>"+user_id+"</td><td>" +remindDate+ "</td><td><input type='button' value='followed up' class='follow_up' id='"+resp[i].reminderIndex+"'></td><td><a class='btn btn-primary btn-small' href='editReminder.html?id="+resp[i].reminderIndex+"'>Edit/Delete</td></tr>"); 
								}
								
							
						}
					} else {
						$('#remindTable tbody').append("<tr><td colspan='6'><center><h3>There is no reminder for this student</h3></center></td></tr>");
					}

					
				}


		});
	}

	function pointList_load() {
		var pointList = null;
		$.ajax({
			type:"GET",
			url:"bin/point_history.php",
			dataType:"json",
			cache:false,
			async:false,
			data:{"action": "getPointLists"},
			success:function(resp) {
				pointList = resp;

			}
		});
		return pointList;
	}

	function point_load(student_id) {
		$('#pointHistory tbody').empty();
		$('#pointVal').empty();
		$('#currentPT_modal').empty();

		var input = {"student_id" : student_id, "action" : "getHistory"};

		$.ajax({
			type:"GET",
			url:"bin/point_history.php",
			dataType: "json",
			cache:false,
			data: input,
			success:function(resp) {
				var point = 0


				var point_history = resp[0].point_history_list;


				if (point_history.length > 0) {
					for (var i =0; i!= point_history.length; i++) {
						if (point_history[i].point_type == 'accumulate') {
							point += parseInt(point_history[i].point_value,10);
							var cat = 'Credit';
						} 
						if (point_history[i].point_type == 'deduct') {
							var cat = 'Redemption';
							point -= parseInt(point_history[i].point_value,10);
						}
						$('#pointHistory tbody').append("<tr><td>"+point_history[i].trans_date+"</td><td>"+cat+"</td><td class='transName' id='"+point_history[i].point_index+"'>"+point_history[i].name+"</td><td>"+point_history[i].point_value+"</td><td><input type='button' class='editPointHistory' id='"+point_history[i].index+"' value='Edit'><input type='button' class='delPointHistory' id='"+point_history[i].index+"' value='Delete'></tr>");

					}
				} else {
					$('#pointHistory tbody').append("<tr><td colspan='5' style='text-align:center'><h3>No point record found for this student</h3></td></tr>");
				}
				$('#pointVal').append(point);
				$('#currentPT_modal').append(point);
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
							var remindReason = $.evalJSON(encode_row).remindReason.replace(/\r\n|\r|\n/g,"<br />");
							var remindDate = $.evalJSON(encode_row).remindDate;
							var follow_up_date =  $.evalJSON(encode_row).follow_up_date;
							var follow_up_userid = $.evalJSON(encode_row).user_id.toUpperCase();

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

	function fillPointList(pointValList) {
		for (var i =0; i!= pointValList.length; i++) {

			var point_type = pointValList[i].point_type;

			if (point_type == 'accumulate') {
				$('#pointList').append('<option value='+pointValList[i].pointList_index+'>'+pointValList[i].name+' : '+pointValList[i].point_value+'</option>');	
			} 				

			if (point_type == 'deduct') {
				$('#redeemList').append('<option value='+pointValList[i].pointList_index+'>'+pointValList[i].name+' : '+pointValList[i].point_value+'</option>');	
			}	
			
			$('#new_pointList').append('<option value='+pointValList[i].pointList_index+'>'+pointValList[i].name+' : '+pointValList[i].point_value+'</option>');
					
		}
	}

