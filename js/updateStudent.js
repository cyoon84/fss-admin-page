/**
* updateStudent.js - update existing student record
*
*/
	
	$(function() {
		//function to get parameter (id #) from the url

		var current_userid = $.session.get('session_userid');

		$('#menuarea').load('menu.html');


		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		};

		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

		var genderChange = false;
		var existingGender = '';

		var existingDOB = '';

		var visaTypeChange = false;
		var existingVisaType = '';

		var howHearUsChange = false;
		var existingHowHearUs = '';

		$('#newPhoneText').mask("999-999-9999");		


		$('#new_doaMonth').append('<option value=0>-----------------</option>');
		$('#new_dobMonth').append('<option value=0>-----------------</option>');
		$('#new_vedMonth').append('<option value=0>-----------------</option>');
		$('#new_schoolStartMonth').append('<option value=0>-----------------</option>');
		$('#new_schoolEndMonth').append('<option value=0>-----------------</option>');
		$('#new_visaIssueMonth').append('<option value=0>-----------------</option>');
		
		$('#new_doaDay').append('<option value=0>-----------</option>');
		$('#new_dobDay').append('<option value=0>-----------</option>');
		$('#new_vedDay').append('<option value=0>-----------</option>');
		$('#new_schoolStartDay').append('<option value=0>-----------</option>');
		$('#new_schoolEndDay').append('<option value=0>-----------</option>');
		$('#new_visaIssueDay').append('<option value=0>-----------</option>');

		//initialize month / day selector fields
		for (i=0; i!= months.length ; i++ )
		{
			var actualmonth = i+1;
			if (actualmonth < 10)
			{
				$('#new_doaMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#new_dobMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#new_vedMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#new_schoolStartMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#new_schoolEndMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#new_visaIssueMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			} else {
				$('#new_doaMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#new_dobMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#new_vedMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#new_schoolStartMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#new_schoolEndMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#new_visaIssueMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
			}
		}

		for (i=1; i!= 32  ; i++ )
		{
			if (i < 10)
			{
				$('#new_doaDay').append('<option>0'+i+'</option>');
				$('#new_dobDay').append('<option>0'+i+'</option>');
				$('#new_vedDay').append('<option>0'+i+'</option>');
				$('#new_schoolStartDay').append('<option>0'+i+'</option>');
				$('#new_schoolEndDay').append('<option>0'+i+'</option>');
				$('#new_visaIssueDay').append('<option>0'+i+'</option>');
			} else {
				$('#new_doaDay').append('<option>'+i+'</option>');
				$('#new_dobDay').append('<option>'+i+'</option>');
				$('#new_vedDay').append('<option>'+i+'</option>');
				$('#new_schoolStartDay').append('<option>'+i+'</option>');
				$('#new_schoolEndDay').append('<option>'+i+'</option>');
				$('#new_visaIssueDay').append('<option>'+i+'</option>');
			}
		}
	



		var student_id = $.urlParam('id');
		

		var data_studentID = {"studentId": student_id};
		
		var latestversion = 0;

		//get existing record (the latest) for the student and show it on the page
		$.ajax({
				type:"GET",
				url: "bin/view_user.php",
				dataType: "json",
				cache: false,
				data:data_studentID,
				success: function(resp) {

					var existing_eng_name = resp[0].name_eng;
					var indexComma_eng_name = existing_eng_name.indexOf(",");
					var existing_eng_last_name = existing_eng_name.substring(0,indexComma_eng_name).toUpperCase();
					var existing_eng_first_name = existing_eng_name.substring(indexComma_eng_name+2).toUpperCase();

					$('#fssStudentID').append(resp[0].unique_id);

					$('#newFNameEngText').val(existing_eng_first_name);
					$('#newLNameEngText').val(existing_eng_last_name);
					$('#newNameKorText').val(resp[0].name_kor);
					$('#existingGender').append(resp[0].gender);
					existingGender = resp[0].gender;
					existingDOB = resp[0].birthdate;
					$('#existingDOB').append(existingDOB);
					$('#newEmailText').val(resp[0].email);
					latestversion = parseInt(resp[0].version,10) +1;
					
					$('#newPhoneText').val(resp[0].phone);

					var existing_address = resp[0].address;
					existing_address = existing_address.replace(/<br\s*[\/]?>/gi, "\n");

					var existing_note = resp[0].note;
					existing_note  = existing_note.replace(/<br\s*[\/]?>/gi, "\n");

					$('#newAddressText').val(existing_address);
					$('#new_note').val(existing_note);
					$('#existingDOA').append(resp[0].arrival_dt);
					$('#existingVisaType').append(resp[0].visa_type);
					existingVisaType = resp[0].visa_type;
					$('#existingVisaIssue').append(resp[0].visa_issue_date);

					$('#existingVisaExpiry').append(resp[0].visa_exp_date);

					$('#existingHowHearUs').append(resp[0].how_hear_us);
					existingHowHearUs = resp[0].how_hear_us;

					$('#newKoreaAgencyText').val(resp[0].korea_agency);

					$('#newSchoolText').val(resp[0].current_school);

					$('#newPgmName').val(resp[0].current_program);

					$('#referrerNameText_new').val(resp[0].referred_by);

					if (resp[0].current_school_strt_dt == '')
					{
						$('#existingSchoolStart').append('N/A');
					} else {
						$('#existingSchoolStart').append(resp[0].current_school_strt_dt);
					}

					if (resp[0].current_school_end_dt == '')
					{
						$('#existingSchoolEnd').append('N/A');
					} else {
						$('#existingSchoolEnd').append(resp[0].current_school_end_dt);
					}
				}
		
		});

		$('#genderSelect').change(function() {
			genderChange = true;
		});

		$('#newVisaTypeVal').change(function() {
			visaTypeChange = true;
		});

		$('#newHowHearUsVal').change(function() {
			howHearUsChange = true;
		});

		//when 'back' button is pressed, go back to 'view student' page for that student
		$('#backButton').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;
		});


		//when 'update' button is clicked
		$('#updButton').click(function() {
			var new_korean_name = $('#newNameKorText').val();
			var new_eng_first_name = $('#newFNameEngText').val().toUpperCase();
			var new_eng_last_name = $('#newLNameEngText').val().toUpperCase();

			if (new_eng_first_name == '' && new_eng_last_name == '')
			{
				new_eng_name = '';
			} else {
				var new_eng_name = new_eng_last_name +", "+new_eng_first_name;
			}

			var new_email = $('#newEmailText').val();
			var new_phone = $('#newPhoneText').val();
			var new_address = $('#newAddressText').val();

			var new_referrer_name = $('#referrerNameText_new').val();

			if (visaTypeChange)
			{
				var new_visa_type = $('#newVisaTypeVal').val();
			} else {
				var new_visa_type = existingVisaType;
			
			}
			
			if (genderChange)
			{
				var new_gender = $('#genderSelect').val();
			} else {
				var new_gender = existingGender;
			}

			if (howHearUsChange || existingHowHearUs == '')
			{
				var new_how_hear_us = $('#newHowHearUsVal').val();

				if (new_how_hear_us == 0)
				{
					var new_how_hear_us = existingHowHearUs;
				}
			} else {
				var new_how_hear_us = existingHowHearUs;


			}

			if (existingHowHearUs == 'Referral' && new_how_hear_us != 'Referral')
			{
				new_referrer_name = '';
			}
			
			var new_visa_exp_date = '';
			var new_date_of_birth = '';
			var new_school_name = $('#newSchoolText').val();
			var new_program_name = $('#newPgmName').val();
			var new_school_start_date = '';
			var new_school_end_date = '';
			var new_date_of_arrival = '';
			var update_reason = $('#update_comment').val().replace(/\r\n|\r|\n/g,"<br />");
			
			var visaIssueDay = $('#new_visaIssueDay').val();
			var visaIssueMonth = $('#new_visaIssueMonth').val();
			var visaIssueYear = $('#new_visaIssueYear').val();

			var vedDay  = $('#new_vedDay').val();
			var vedMonth= $('#new_vedMonth').val();
			var vedYear = $('#new_vedYear').val();

			var dobDay  = $('#new_dobDay').val();
			var dobMonth= $('#new_dobMonth').val();
			var dobYear = $('#new_dobYear').val();

			var doaDay  = $('#new_doaDay').val();
			var doaMonth= $('#new_doaMonth').val();
			var doaYear = $('#new_doaYear').val();
			
			var sStDay  = $('#new_schoolStartDay').val();
			var sStMonth= $('#new_schoolStartMonth').val();
			var sStYear = $('#new_schoolStartYear').val();

			var sEnDay  = $('#new_schoolEndDay').val();
			var sEnMonth= $('#new_schoolEndMonth').val();
			var sEnYear = $('#new_schoolEndYear').val();

			var note = $('#new_note').val();
			
			var new_visa_issue_date = '';
			var new_korea_agency = $('#newKoreaAgencyText').val();

			//concatenate year / month / day to create date string (YYYY-MM-DD)
			if (dobYear != '')
			{
				new_date_of_birth = dobYear +"-"+dobMonth+"-"+dobDay;
			}

			
			if (doaYear != '')
			{
				new_date_of_arrival = doaYear +"-"+doaMonth+"-"+doaDay;
			}

			if (vedYear != '')
			{
				new_visa_exp_date = vedYear +"-"+vedMonth+"-"+vedDay;	
			}

			if (visaIssueYear != '')
			{
				new_visa_issue_date = visaIssueYear +"-"+visaIssueMonth+"-"+visaIssueDay;
			}

			if (sStYear != '')
			{
				new_school_start_date = sStYear +"-"+sStMonth+"-"+sStDay;
			}

			if (sEnYear != '')
			{
				new_school_end_date = sEnYear +"-"+sEnMonth+"-"+sEnDay;
			}


			if (new_date_of_birth.length == 10 || existingDOB.length == 10) {
				if (new_date_of_birth.length == 10) {
					var studentUniqueId = dobMonth+dobDay+(dobYear.substring(2))+new_eng_first_name.replace(' ','')+new_eng_last_name.charAt(0);	
				} else {
					if (existingDOB.length == 10 ) {
						var studentUniqueId = (existingDOB.substring(5,7))+(existingDOB.substring(8))+(existingDOB.substring(2,4))+new_eng_first_name.replace(' ','')+new_eng_last_name.charAt(0);
					}
				}
			} else {
				var studentUniqueId = "FSS"+new_eng_first_name.replace(' ','')+new_eng_last_name.charAt(0);
			}
			
			var updateRecord = { "id" : student_id ,
								 "unique_id" : studentUniqueId,
								 "name_eng" : new_eng_name,
								 "name_kor" : new_korean_name,
								 "dob" : new_date_of_birth,
								 "gender" : new_gender,
								 "email" : new_email,
								 "phone" : new_phone,
								 "address" : new_address,
								 "arrival_date" : new_date_of_arrival,
								 "visa_type" : new_visa_type,
								 "visa_issue_date" : new_visa_issue_date,
								 "visa_exp_date" : new_visa_exp_date,
								 "how_hear_us" : new_how_hear_us,
								 "referred_by" : new_referrer_name,
								 "korea_agency" : new_korea_agency,
								 "school_name": new_school_name,
								 "current_program": new_program_name,
								 "school_start_dt": new_school_start_date,
								 "school_end_dt" : new_school_end_date,
								 "note": note,
								 "update_reason" : update_reason,
								 "updated_by": current_userid
								};

			$.ajax({
				type: "POST",
				url: "bin/update_user.php",
				data: updateRecord,
				cache: false,
				success: function(resp) {
					alert(resp);
					var url = "viewStudent.html?id="+student_id+"&hidden=N";
					window.location = url;
				}
			});
			return false;
				
		});


		$('#newHowHearUsVal').change(function() {
			if ($('#newHowHearUsVal').val() == 'Referral')
			{
				$('#referrerName_new').show();
			} else {
				$('#referrerName_new').hide();
				$('#refferNameText').val("");
			}


		});

		


	});
