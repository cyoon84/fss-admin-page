/**
* viewStudent.js - for viewStudent.html - which shows detailed information about the student and user can choose actions to take - e.g. update, delete, add new visit / reminder
*
*/
	var today_date = new Date();
		
	var status = '';

	var pointValList = new Array();

	var visitList = new Array();

	var prevSchoolList = null;

	var schoolListSelected = null;
	var schoolCatList = null;

	var remindCategoryList = null;

	$(function() {

		$('#menuarea').load('menu.html');

		var visitDateOpt = '';
		var pointDateOpt = '';	
		var fssPTopt = '';

		var previousSchoolClickedId = 0;

		$('.error').hide();
		$('#chooseDate').hide();
		$('#chooseDatePoint').hide();
		$('#saveVisitSuccess').hide();
		$('#otherSchoolArea').hide();

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

		var reminder_id = 0;

		
		var data_studentID = {"action": "latest", "studentId": student_id, "is_hidden": is_hidden};
		var new_reminder_date ='';

		initializeDateSelector("#visitDay","#visitMonth");
		initializeDateSelector("#prevSchoolStartDay", "#prevSchoolStartMonth");
		initializeDateSelector("#prevSchoolEndDay", "#prevSchoolEndMonth");
		initializeDateSelector("#transDay", "#transMonth");
		initializeDateSelector("#redDay", "#redMonth");
		initializeDateSelector("#new_transDay", "#new_transMonth");
		initializeDateSelector("#new_visitDay", "#new_visitMonth");

		schoolCatLoad('#schoolCategory');
		schoolCatLoad('#editSchoolCategory');
		createRemindCategoryList();
		remindCategoryLoad('.remindCategory');
		initializeDateSelector("#edit_prevSchoolStartDay", "#edit_prevSchoolStartMonth");
		initializeDateSelector("#edit_prevSchoolEndDay", "#edit_prevSchoolEndMonth");
		initializeDateSelector("#edit_remindDay", "#edit_remindMonth");
		
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

		reminderLoad(student_id, 'all', 0);
		reminder_old_Load(student_id, 'all', 0);

		pointValList = 	pointList_load();

		fillPointList(pointValList);

		point_load(student_id); 

		prevSchoolLoad(student_id);

		prevVisaLoad(student_id);

		remindCategoryLoad('#remindCategory');
		
		$('.follow_up').live('click',function() {
			var remindId = this.id;
							
			$.ajax({
				type:"POST",
				url:"bin/update_reminder_record.php",
				cache: false,
				data:{"reminderIndex": remindId, "follow_up_date": today_str,"updated_by": current_userid},
				success:function(resp) {												
						
						reminderLoad(student_id,'all',0);

						reminder_old_Load(student_id, 'all',0);
						
						
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
					
						reminder_old_Load(student_id, 'all');
						

						
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
					
						reminder_old_Load(student_id, 'all',0);
						reminderLoad(student_id, 'all',0);
						

						
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

				var remind_category = $('#remindCategory').val();

			}


			var data_reminder = {"studentId": student_id, "reminder_date": new_reminder_date, "rem_list_index": remind_category, "reason": reason_replaced,"added_by": current_userid};

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
			var data_studentID = {"action":'prev', "studentId": student_id,
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
			$('#newPrevSchoolProgram').val('');	
			$('#schoolCategory').prop('selectedIndex',0);
			$('#schoolList').empty();				
			$('#newPrevSchoolProgram').val();
			$('#prevSchoolStartYear').val('');
			$('#prevSchoolStartMonth').prop('selectedIndex',0);
			$('#prevSchoolStartDay').prop('selectedIndex',0);
			$('#prevSchoolEndYear').val('');
			$('#prevSchoolEndMonth').prop('selectedIndex',0);
			$('#prevSchoolEndDay').prop('selectedIndex',0);
			$('#addPrevSchool').modal('toggle');

		});

		$('#savePrevSchool').click(function() {
			var school_index = $('#schoolList').val();

			var other_school_name = $('#otherSchoolText').val();

			var school_type = $('#schoolCategory').val();


			var schoolProgram = $('#newPrevSchoolProgram').val();
			var schoolStartYear = $('#prevSchoolStartYear').val();
			var schoolStartMonth = $('#prevSchoolStartMonth').val();
			var schoolStartDay = $('#prevSchoolStartDay').val();

			var schoolEndYear = $('#prevSchoolEndYear').val();
			var schoolEndMonth = $('#prevSchoolEndMonth').val();
			var schoolEndDay = $('#prevSchoolEndDay').val();

			var schoolStartDate = '';
			var schoolEndDate = '';

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


			var prevSchoolData = {"action": "add", "student_id": student_id, "school_index": school_index, "school_type": school_type, "other_school_name": other_school_name, "prev_school_program": schoolProgram, "prev_school_strt_dt" : schoolStartDate, "prev_school_end_dt" : schoolEndDate, "user_id": current_userid};

			$.ajax({
				type:"POST",
				url:"bin/prev_school.php",
				data:prevSchoolData,
				cache:false,
				success:function(resp) {
					if (resp == 'insert success') {
						$('#addPrevSchool').modal('hide');
						prevSchoolLoad(student_id);	
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
					if (!isNaN(resp)) {
						$('#fssPT').modal('hide');
						point_load(student_id);
					} else {
						alert(resp);
					}
				}
			});

		});

		$('#updPointTrans').click(function() {
			var trans_date_month = $('#new_transMonth').val();
			var trans_date_day = $('#new_transDay').val();
			var trans_date_year = $('#new_transYear').val();

			var new_point_val = $('#edit_pointValField').val();

			var new_pointList_index = $('#new_pointList').val();

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


			var new_point_trans = {"action" : "update_pt", "student_id": student_id, "pointList_index": new_pointList_index, "index": point_id, "trans_date": new_trans_date, "trans_val": new_point_val, "user_id": current_userid};
			
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
				data:{"action": "delete_pt", "index": point_id, "student_id": student_id},
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

			var point_value = $(this).parent().parent().find("td").eq(3).html(); 

			var pointList_pos = 0;


			while (pointList_pos != pointValList.length) {
				if (trans_name == pointValList[pointList_pos].pointList_index) {
					break;
				} 
				pointList_pos++;
			}

			$('#new_pointList').prop('selectedIndex', pointList_pos);	

			$('#edit_pointValField').val(point_value);


			$('#editFssPT').modal('toggle');

		});

		$('#new_pointList').change(function() {
			var selected_id = $('#new_pointList').val();

			var index = 0;

			while (index != pointValList.length) {
				if (selected_id == pointValList[index].pointList_index) {
					break;
				}
				index++;
			}

			var point_value = pointValList[index].point_value;

			$('#edit_pointValField').val(point_value);
		});

		$('#schoolCategory').change(function() {
			var type = $(this).val();
			otherSchoolType = $(this).val();
			if (type != 0) {
				schoolListLoad("#schoolList",type);
			} else {
				$('#schoolList').empty();
			}
			$('#otherSchoolArea').hide();
		});


		$('#schoolList').change(function () {
			var schoolname = $(this).val();
			$('#otherSchoolText').val('');
			if (schoolname == 'Other') {
				$('#otherSchoolArea').show();
			} else {
				$('#otherSchoolArea').hide();
			}
		});

		$('#editSchoolCategory').change(function() {
			var type = $(this).val();
			otherSchoolType = $(this).val();
			if (type != 0) {
				schoolListLoad("#editSchoolList",type);
			} else {
				$('#editSchoolList').empty();
			}
			$('#edit_otherSchoolArea').hide();
		});


		$('#editSchoolList').change(function () {
			var schoolname = $(this).val();
			$('#edit_otherSchoolText').val('');
			if (schoolname == 'Other') {
				$('#edit_otherSchoolArea').show();
			} else {
				$('#edit_otherSchoolArea').hide();
			}
		});

		$('#prevSchoolList tbody').on('click','.editPrevSchool', function () {
			previousSchoolClickedId = this.id;
			
			$('.error').hide();
			$('.schoolNameNotList').css('display','none');

			var data_getPrev_school_Parm = {"prevSchoolIndex":previousSchoolClickedId, "action": "get_one"};

			var index = 0;

			while  (index != prevSchoolList.length) {
				if (previousSchoolClickedId == prevSchoolList[index].prevSchoolIndex) {
					break;
				}
				index++;
			}


			var start_date = prevSchoolList[index].prev_school_strt_dt;
			var end_date = prevSchoolList[index].prev_school_end_dt;
			var program = prevSchoolList[index].prev_school_program;
			var school_index = prevSchoolList[index].school_index;

			var school_name_not_list = prevSchoolList[index].prev_school_name;


			if (school_index == 0) {
				$('.schoolNameNotList').empty();
				$('.schoolNameNotList').append(school_name_not_list+" (not in the school list) ");
				$('.schoolNameNotList').show();
			}

			$('#editPrevSchoolProgram').val(program);

			var start_year = start_date.substring(0,4);

			var start_month = start_date.substring(5,7);

			var start_day = start_date.substring(8);

			$('#edit_prevSchoolStartYear').val(start_year);
			$('#edit_prevSchoolStartMonth').prop('selectedIndex',start_month);
			$('#edit_prevSchoolStartDay').prop('selectedIndex',start_day);

			var end_year = end_date.substring(0,4);

			var end_month = end_date.substring(5,7);

			var end_day = end_date.substring(8);

			var existing_school_type = prevSchoolList[index].school_type;

			$('#edit_prevSchoolEndYear').val(end_year);
			$('#edit_prevSchoolEndMonth').prop('selectedIndex',end_month);
			$('#edit_prevSchoolEndDay').prop('selectedIndex',end_day);

			var catIndex = 0;

			while (catIndex != schoolCatList.length) {


				if (existing_school_type == schoolCatList[catIndex].school_type) {
					break;
				}					
				catIndex++;
			}

			$('#editSchoolCategory').prop('selectedIndex', catIndex);

			schoolListLoad('#editSchoolList', existing_school_type);

			var schoolNameIndex = 0;

			var existing_school_name = prevSchoolList[index].school_name;

			while (schoolNameIndex != schoolListSelected.length) {
				if (existing_school_name == schoolListSelected[schoolNameIndex].school_name) {
					break;
				}
				schoolNameIndex ++;
			}

			$('#editSchoolList').prop('selectedIndex', (schoolNameIndex));

			$('#editPrevSchoolModal').modal('toggle');
		});


		$('#prevSchoolList tbody').on('click','.delPrevSchool', function () {
			previousSchoolClickedId = this.id;
			
			$('#delPrevSchoolModal').modal('toggle');
		});

		$('#editPrevSchoolConfirm').click(function() {
			var school_type = $('#editSchoolCategory').val();
			var school_name = $('#editSchoolList').val();

			var start_month = $('#edit_prevSchoolStartMonth').val();
			var start_year = $('#edit_prevSchoolStartYear').val();
			var start_day = $('#edit_prevSchoolStartDay').val();

			var end_month = $('#edit_prevSchoolEndMonth').val();
			var end_year = $('#edit_prevSchoolEndYear').val();
			var end_day = $('#edit_prevSchoolEndDay').val();

			var start_date = '';
			var end_date = '';

			if (start_year != '') {
				if (isNaN(start_year) || start_year.length != 4) {
					$('label#edit_prevSchoolStartYear_error').show();
					$('#edit_prevSchoolStartYear').focus();
					return false;
				} 

				start_date = start_year+"-"+start_month+"-"+start_day;

				if (start_date.length != 10) {
					$('label#edit_prevSchoolStartYear_error2').show();
					$('#edit_prevSchoolStartMonth').focus();
					return false;	
				}
			}

			if (end_year != '') {
				if (isNaN(end_year) || end_year.length != 4) {
					$('label#edit_prevSchoolEndYear_error').show();
					$('#edit_prevSchoolEndYear').focus();
					return false;
				} 

				end_date = end_year+"-"+end_month+"-"+end_day;

				if (end_date.length != 10) {
					$('label#edit_prevSchoolEndYear_error2').show();
					$('#edit_prevSchoolEndMonth').focus();
					return false;	
				}
			}
			var school_type = $('#editSchoolCategory').val();
			var school_name = $('#editSchoolList').val();
			var other_school_name = $('#edit_otherSchoolText').val();
			var newPrevPrgmName = $('#editPrevSchoolProgram').val();


			var prev_school_updt = {"action": "update", "prevSchoolIndex":previousSchoolClickedId, "studentId": student_id, 
							"student_info_ver": version_latest, "school_index": school_name, 
							"school_type" : school_type, "other_school_name" : other_school_name,
							"prev_school_program": newPrevPrgmName, "prev_school_strt_dt":start_date,
							"prev_school_end_dt": end_date, "user_id":current_userid};
			$.ajax({
				type: "POST",
				url: "bin/prev_school.php",
				cache: false,
				data:prev_school_updt,
				success: function(resp) {
					if (resp == 'Update success') {
						$('#editPrevSchoolModal').modal('hide');
						prevSchoolLoad(student_id);						
					}
					
				}
			});
		});

		$('#delPrevSchoolConfirm').click(function() {
			var dataPrevSchoolDel = {"action" : "del", "studentId": student_id, "prev_school_index": previousSchoolClickedId, "student_info_ver": version_latest, "user_id": current_userid};

			$.ajax({
				type: "POST",
				url: "bin/prev_school.php",
				cache: false,
				data:dataPrevSchoolDel,
				success: function(resp) {
					if (resp == "Record deleted successfully") {
						$('#delPrevSchoolModal').modal('hide');
						prevSchoolLoad(student_id);	
					} else {
						alert(resp);
					}
				}
			});
		});

		$('.remindCategory').change(function() {
			var id = this.id;
			if (id == 'outstandingReminderCategory') {
				var selected = $('#outstandingReminderCategory').val();
				reminderLoad(student_id, 'all', selected);
			} else {
				if (id == 'previousReminderCategory') {
					var selected = $('#previousReminderCategory').val();
					reminderLoad(student_id, 'all', selected)
				}
			}
		});

		$('#remindTable tbody').on('click','.delReminder', function() {
			reminder_id = this.id;

			$('#delReminderModal').modal('toggle');
		});

		$('#delReminderConfirm').click(function() {
			var reminder_del = {"reminderIndex": reminder_id, "action":"delete"};
			$.ajax( {
				type: "POST",
				url: "bin/edit_reminder.php",
				cache: false,
				data: reminder_del,
				success: function(resp) {
					if (resp == 'Delete success') {
						$('#delReminderModal').modal('hide');
						var selected = $('#outstandingReminderCategory').val();
						reminderLoad(student_id, 'all', selected);					
					} else {
						alert(resp);
					}			
				}
			});
		});

		$('#remindTable tbody').on('click','.editReminder', function() {
			$('.error').hide();
			reminder_id = this.id;

			var reason = $(this).parent().parent().find("td").eq(1).html().replace(/<br\s*[\/]?>/gi, "\n");
			var rem_list_index = $(this).parent().parent().find("td").eq(4).html();

			var index = 0;

			while (index != remindCategoryList.length) {
				if (rem_list_index == remindCategoryList[index].rem_list_index) {
					break;
				}
				index++;
			}

			var reminder_date = $(this).parent().parent().find("td").eq(3).html();

			var reminder_year = reminder_date.substring(0,4);

			var reminder_month = parseInt(reminder_date.substring(5,7),10);

			var reminder_day = parseInt(reminder_date.substring(8),10);

			$('#edit_remindYear').val(reminder_year);
			$('#edit_remindMonth').prop('selectedIndex',reminder_month);
			$('#edit_remindDay').prop('selectedIndex',reminder_day);

			$('#edit_remindCategory').prop('selectedIndex',index);

			$('#edit_remindreason').val(reason);
			$('#editReminderModal').modal('toggle');
		});

		$('#editReminderConfirm').click(function() {
			var remind_reason = $('#edit_remindreason').val();
			var remind_category = $('#edit_remindCategory').val();

			var remind_year = $('#edit_remindYear').val();
			var remind_month = $('#edit_remindMonth').val();
			var remind_day = $('#edit_remindDay').val();

			var remind_date = '';

			if (remind_year.trim() == '') {
				$('label#edit_remindYear_error').show();
				$('#edit_remindYear').focus();
				return false;
			} else {
				if (remind_year.length != 4) {
					$('label#edit_remindYear_error2').show();
					$('#edit_remindYear').focus();
					return false;				
				}
				remind_date = remind_year+"-"+remind_month+"-"+remind_day;

				if (remind_date.length != 10) {
					$('label#edit_remind_error').show();
					if (remind_month == 0) {
						$('#edit_remindMonth').focus();
					}
					if (remind_day == 0) {
						$('#edit_remindDay').focus();
					}
					return false;					
				}
			}

			var reminder_updt = {"reminderIndex": reminder_id, "remindDate": remind_date, "remindReason": remind_reason, "rem_list_index": remind_category, "user_id":current_userid, "action":"update"};
		
			$.ajax({
				type: "POST",
				url: "bin/edit_reminder.php",
				cache: false,
				data:reminder_updt,
				success: function(resp) {
					if (resp == 'Update success') {
						$('#editReminderModal').modal('hide');
						var selected = $('#outstandingReminderCategory').val();
						reminderLoad(student_id, 'all', selected);					
					} else {
						alert(resp);
					}
				}
			});

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


	function reminderLoad(student_id, action, reminder_index) {

		$('#remindTable tbody').empty();

		var data_follow_up = {"student_id": student_id, "follow_up": 'N', "action": action, "rem_list_index": reminder_index};
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

							var remind_list_index = $.evalJSON(encode_row).rem_list_index;

							var remind_year = remindDate_str.substring(0,4);

							var remind_month = parseInt(remindDate_str.substring(5,7),10) - 1;
							var remind_day = parseInt(remindDate_str.substring(8),10);
													
							var remind_date_obj=new Date(remind_year, remind_month, remind_day);
						
							var diff_days = Math.ceil((remind_date_obj - today_date) / (1000*60*60*24));

							if (diff_days < 0)
							{
								$('#remindTable tbody').append("<tr><td><p style='color:red'>"+ (-1* diff_days) + " days passed</p></td><td>" + remindReason+ "</td><td>"+ user_id+"</td><td>" +remindDate+ "</td><td style='display:none'>"+remind_list_index+"</td><td><input type='button' value='followed up' class='follow_up' id='"+resp[i].reminderIndex+"'></td><td><input type='button' class='editReminder btn-primary btn btn-small' id='"+resp[i].reminderIndex+"' value='Edit'>&nbsp;<input type='button' class='delReminder btn-danger btn btn-small' id='"+resp[i].reminderIndex+"' value='Delete'></td></tr>"); 
							} else {
								$('#remindTable tbody').append("<tr'><td>"+ diff_days + "</td><td>" + remindReason+ "</td><td>"+user_id+"</td><td>" +remindDate+ "</td><td style='display:none'>"+remind_list_index+"</td><td><input type='button' value='followed up' class='follow_up' id='"+resp[i].reminderIndex+"'></td><td><input type='button' class='editReminder btn-primary btn btn-small' id='"+resp[i].reminderIndex+"' value='Edit'>&nbsp;<input type='button' class='delReminder btn-danger btn btn-small' id='"+resp[i].reminderIndex+"' value='Delete'></td></tr>"); 
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

	function reminder_old_Load(student_id, action,reminder_index) {

		$('#remindTable_old tbody').empty();

		var data_follow_up = {"student_id": student_id, "follow_up": 'Y', "action": action, "rem_list_index": reminder_index};
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
				async: false,
				data:input, 				
				success:function(resp) { 
					prevSchoolList = resp;					
				}
			});
				
		if (prevSchoolList.length > 0)
		{
			for (i=0; i!=prevSchoolList.length ;i++ )
			{
				var school_name = '';
				if (prevSchoolList[i].school_index != 0) {
					school_name = prevSchoolList[i].school_name;
				} else {
					school_name = prevSchoolList[i].prev_school_name;
				}
				var school_program = prevSchoolList[i].prev_school_program;
				var school_start = prevSchoolList[i].prev_school_strt_dt;
				var school_end = prevSchoolList[i].prev_school_end_dt;
				var prev_school_id = prevSchoolList[i].prevSchoolIndex;

				$('#prevSchoolList tbody').append("<tr><td>"+school_name+"</td><td>"+school_program+"</td><td>"+school_start+"</td><td>"+school_end+"</td><td><button class='editPrevSchool btn btn-primary btn-small' id='"+prev_school_id+"'>Edit</button>&nbsp;<button class='delPrevSchool btn btn-primary btn-small btn-danger' id='"+prev_school_id+"'>Delete</button></td> </tr>");
			}
		} else {
			$('#prevSchoolList tbody').append("<tr><td colspan='5'><h3 style='text-align:center'> No previous school found for this student</h3></td></tr>");
		}

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

	function schoolCatLoad(id) {
		var dataAction = {"action" : "get_type"};
		$(id).append('<option value = 0>-----------------------------</option>');
		$.ajax({
			type: "POST",
			url: "bin/school_list.php",
			data:dataAction,
			dataType:"json",
			cache: false,	
			async: false,
			success: function(resp) {
				schoolCatList = resp;
			}
		});	

		for (var i = 1; i!= schoolCatList.length; i++) {
			$(id).append('<option>'+schoolCatList[i].school_type+'</option>');
		}
	}

	function schoolListLoad(id, type) {
		var dataAction = {"action": "get_list", "cond": type};

		$(id).empty();
		$.ajax({
			type: "GET",
			url: "bin/school_list.php",
			data:dataAction,
			dataType:"json",
			cache: false,
			async: false,	
			success: function(resp) {
				schoolListSelected = resp;

			}
		});	

		for (var i = 0; i!= schoolListSelected.length; i++) {
			$(id).append("<option value='"+schoolListSelected[i].school_index+"'>"+schoolListSelected[i].school_name+'</option>');
		}
		$(id).append("<option value='Other'>Other (please specify)</option>");
	}

	function PrintElem(elem)
    {
        Popup($(elem).html());
    }

    function Popup(data) 
    {
        var mywindow = window.open('', 'my div', 'height=800,width=1000');
        mywindow.document.write('<!DOCTYPE html><html><head><title>Print personal information</title>');
        mywindow.document.write('<link rel="stylesheet" href="css/page-style.css">');
        mywindow.document.write('<link href="css/bootstrap.css" rel="stylesheet">');
        mywindow.document.write('<link href="css/page-style.css" rel="stylesheet">');
		mywindow.document.write('<link href="css/bootstrap-responsive.css" rel="stylesheet">');
		mywindow.document.write('<script src="js/bootstrap.js"></script>');
        mywindow.document.write('</head><body >');
        mywindow.document.write('<h3>Personal Information</h3>');
        mywindow.document.write('<br>');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');

        mywindow.print();
        mywindow.close();

        return true;
    }

    function createRemindCategoryList() {
		var dataAction = {"action" : "get_category"};
		$.ajax({
			type: "GET",
			url: "bin/reminder_list.php",
			data:dataAction,
			dataType:"json",
			cache: false,
			async: false,	
			success: function(resp) {
				remindCategoryList = resp;
			}
		});	    	
    }

    function remindCategoryLoad(id) {
		for (var i = 0; i!= remindCategoryList.length; i++) {
			$(id).append('<option value="'+remindCategoryList[i].rem_list_index+'">'+remindCategoryList[i].rem_list_name+'</option>');
		}    	
    }