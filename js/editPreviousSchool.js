/**
* editReminder.js - edit / delete visit record for each students
*
*/
	
	$(function() {

		$('#menuarea').load('menu.html');

		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}
		$('.error').hide();
		$('#afterDelete').hide();

		var current_userid = $.session.get('session_userid');

		var existing_start_date = '';
		var new_start_date = '';
		var version = 0;

		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
		$('#new_SchoolStartMonth').append('<option value=0>-----------------</option>');
		$('#new_SchoolStartDay').append('<option value=0>-----------</option>');
		$('#new_SchoolEndMonth').append('<option value=0>-----------------</option>');
		$('#new_SchoolEndDay').append('<option value=0>-----------</option>');

		for (i=0; i!= months.length ; i++ )
		{
			var actualmonth = i+1;
			if (actualmonth < 10)
			{
				$('#new_SchoolStartMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#new_SchoolEndMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			} else {
				$('#new_SchoolStartMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#new_SchoolEndMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			}
		}

		for (i=1; i!= 32  ; i++ )
		{
			if (i < 10)
			{
				$('#new_SchoolStartDay').append('<option>0'+i+'</option>');
				$('#new_SchoolEndDay').append('<option>0'+i+'</option>');
			} else {
				$('#new_SchoolStartDay').append('<option>'+i+'</option>');
				$('#new_SchoolEndDay').append('<option>'+i+'</option>');
			}
		}

		var student_id = 0;
		var id = $.urlParam('id'); 		
		
		var data_getPrev_school_Parm = {"prevSchoolIndex":id};

		$.ajax({
				type:"GET",
				url: "bin/get_prev_school_record_one.php",
				cache: false,
				dataType: "json",
				data:data_getPrev_school_Parm,
				success: function(resp) {
					student_id = resp[0].studentId;
					$('#newSchool').val(resp[0].prev_school_name);
					$('#newPrgm').val(resp[0].prev_school_program);
					existing_start_date = resp[0].prev_school_strt_dt;
					existing_end_date = resp[0].prev_school_end_dt;
					version = resp[0].student_info_ver;
					$('#existing_start_date').append(resp[0].prev_school_strt_dt);
					$('#existing_end_date').append(resp[0].prev_school_end_dt);

				}		
		});

		$('#backButton').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;
		});

		$('#delPrevSchoolTrigger').click(function() {
			$('#prevSchoolModal').modal('toggle');
		});

		//when user wants to update visit date

		$('#savePrevSchoolEdit').click(function() {
			var newSchoolStartDay  = $('#new_SchoolStartDay').val();
			var newSchoolStartMonth= $('#new_SchoolStartMonth').val();
			var newSchoolStartYear = $('#new_SchoolStartYear').val();

			var newSchoolEndDay  = $('#new_SchoolEndDay').val();
			var newSchoolEndMonth= $('#new_SchoolEndMonth').val();
			var newSchoolEndYear = $('#new_SchoolEndYear').val();
			
			var visit_date = '';

			var new_school_start_date = newSchoolStartYear+"-"+newSchoolStartMonth+"-"+newSchoolStartDay;

			var new_school_end_date = newSchoolEndYear+"-"+newSchoolEndMonth+"-"+newSchoolEndDay;

			//check user selected all date values (date, month, year)
			//if user selected all date values, new_school_start_date string will look like YYYY-MM-DD

			//if new_school_start_date.length is not 10, that means the user did not give full date detail, then don't update start date

			if (new_school_start_date.length != 10)
			{
				$('label#new_SchoolStartYear_error').show();
				new_school_start_date = existing_start_date ;
				
			}

			if (new_school_end_date.length != 10)
			{
				$('label#new_SchoolEndYear_error').show();
				new_school_end_date = existing_end_date;
				
			}

			var newPrevSchoolName = $('#newSchool').val();
			var newPrevPrgmName = $('#newPrgm').val();

			var prev_school_updt = {"prevSchoolIndex":id, "studentId": student_id, 
										"student_info_ver": version, "prev_school_name" : newPrevSchoolName, 
										"prev_school_program": newPrevPrgmName, "prev_school_strt_dt": new_school_start_date,
										"prev_school_end_dt": new_school_end_date, "user_id":current_userid};

			$.ajax({
				type: "POST",
				url: "bin/edit_prev_school.php",
				cache: false,
				data:prev_school_updt,
				success: function(resp) {
					$('#myModalLabel').empty();
					$('#myModalLabel').append("Update previous school record");
					$('#modal-body-msg').empty();
					$('#modal-body-msg').append(resp);
					$('#prevSchoolModal').modal('toggle');
					$('#preConfirm').hide();
					$('#afterDelete').show();
					
				}
			});

				return false;

		});


		//delete this visit record (for sure) 

		$('#delProceed').click(function() {

			var prev_school_del_info = {"prevSchoolIndex":id, "studentId": student_id, 
									"student_info_ver": version, "user_id":current_userid};
			$.ajax( {
				type: "POST",
				url: "bin/del_prev_school.php",
				cache: false,
				data: prev_school_del_info,
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
