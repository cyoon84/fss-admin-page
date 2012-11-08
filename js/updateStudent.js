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

		var genderList = new Array("Male", "Female");

		var visaList = new Array("Unknown","Study","Working Holiday","Visitor","Co-op","Work Permit");

		var howHearUsList = new Array("캐스모","한국 협력업체","Walk in","Referral");

		var genderChange = false;
		var existingGender = '';

		var existingDOB = '';

		var visaTypeChange = false;
		var existingVisaType = '';

		var howHearUsChange = false;
		var existingHowHearUs = '';

		$('#newPhoneText').mask("999-999-9999");		

		initializeDateSelector('#new_doaDay','#new_doaMonth');
		initializeDateSelector('#new_dobDay','#new_dobMonth');
		initializeDateSelector('#new_vedDay','#new_vedMonth');
		initializeDateSelector('#new_schoolStartDay','#new_schoolStartMonth');
		initializeDateSelector('#new_schoolEndDay','#new_schoolEndMonth');
		initializeDateSelector('#new_visaIssueDay','#new_visaIssueMonth');


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
					existingGender = resp[0].gender;
					var genderIndex = selectBoxIndexFind(existingGender,genderList);

					$('#genderSelect').prop('selectedIndex',genderIndex);


					existingDOB = resp[0].birthdate;

					if (existingDOB != '') {
						var dob_year = existingDOB.substring(0,4);

						var dob_month = parseInt(existingDOB.substring(5,7),10);

						var dob_day = parseInt(existingDOB.substring(8),10);

						$('#new_dobYear').val(dob_year);
						$('#new_dobMonth').prop('selectedIndex',dob_month);
						$('#new_dobDay').prop('selectedIndex',dob_day);
					}

					$('#newEmailText').val(resp[0].email);
					latestversion = parseInt(resp[0].version,10) +1;
					
					$('#newPhoneText').val(resp[0].phone);

					var existing_address = resp[0].address;
					existing_address = existing_address.replace(/<br\s*[\/]?>/gi, "\n");

					var existing_note = resp[0].note;
					existing_note  = existing_note.replace(/<br\s*[\/]?>/gi, "\n");

					$('#newAddressText').val(existing_address);
					$('#new_note').val(existing_note);

					var existingDOA = resp[0].arrival_dt;

					if (existingDOA != '') {
						var doa_year = existingDOA.substring(0,4);

						var doa_month = parseInt(existingDOA.substring(5,7),10);

						var doa_day = parseInt(existingDOA.substring(8),10);

						$('#new_doaYear').val(doa_year);
						$('#new_doaMonth').prop('selectedIndex',doa_month);
						$('#new_doaDay').prop('selectedIndex',doa_day);
					}					

					existingVisaType = resp[0].visa_type;
					var visaTypeIndex = selectBoxIndexFind(existingVisaType,visaList);

					$('#newVisaTypeVal').prop('selectedIndex',visaTypeIndex);

					var existingVisaIssue =resp[0].visa_issue_date;

					if (existingVisaIssue != '') {
						var visa_issue_year = existingVisaIssue.substring(0,4);

						var visa_issue_month = parseInt(existingVisaIssue.substring(5,7),10);

						var visa_issue_day = parseInt(existingVisaIssue.substring(8),10);

						$('#new_visaIssueYear').val(visa_issue_year);
						$('#new_visaIssueMonth').prop('selectedIndex',visa_issue_month);
						$('#new_visaIssueDay').prop('selectedIndex',visa_issue_day);
					}	

					var existingVisaExpiry = resp[0].visa_exp_date;

					if (existingVisaExpiry != '') {
						var visa_exp_year = existingVisaExpiry.substring(0,4);

						var visa_exp_month = parseInt(existingVisaExpiry.substring(5,7),10);

						var visa_exp_day = parseInt(existingVisaExpiry.substring(8),10);

						$('#new_vedYear').val(visa_exp_year);
						$('#new_vedMonth').prop('selectedIndex',visa_exp_month);
						$('#new_vedDay').prop('selectedIndex',visa_exp_day);
					}	
					
					existingHowHearUs = resp[0].how_hear_us;

					if (existingHowHearUs != '') {

						var howHearUsIndex = parseInt(selectBoxIndexFind(existingHowHearUs,howHearUsList),10)+1;

						$('#newHowHearUsVal').prop('selectedIndex',howHearUsIndex);

						$('#referrerNameText_new').val(resp[0].referred_by);
							

						if (existingHowHearUs == 'Referral') {
							$('#referrerName_new').show();
						}
					}
					$('#newKoreaAgencyText').val(resp[0].korea_agency);

					$('#newSchoolText').val(resp[0].current_school);

					$('#newPgmName').val(resp[0].current_program);

					
					var existingSchoolStart = resp[0].current_school_strt_dt;

					if ( existingSchoolStart != '')
					{
						var school_start_year = existingSchoolStart.substring(0,4);

						var school_start_month = parseInt(existingSchoolStart.substring(5,7),10);

						var school_start_day = parseInt(existingSchoolStart.substring(8),10);	

						$('#new_schoolStartYear').val(school_start_year);
						$('#new_schoolStartMonth').prop('selectedIndex',school_start_month);
						$('#new_schoolStartDay').prop('selectedIndex',school_start_day);					
					} 

					var existingSchoolEnd = resp[0].current_school_end_dt;

					if (existingSchoolEnd != '')
					{
						var school_end_year = existingSchoolEnd.substring(0,4);

						var school_end_month = parseInt(existingSchoolEnd.substring(5,7),10);

						var school_end_day = parseInt(existingSchoolEnd.substring(8),10);	

						$('#new_schoolEndYear').val(school_end_year);
						$('#new_schoolEndMonth').prop('selectedIndex',school_end_month);
						$('#new_schoolEndDay').prop('selectedIndex',school_end_day);
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
					if (resp == 'Record updated successfully') { 

						$('#updSuccess').modal('toggle');
					}
				}
			});
			return false;
				
		});

		$('#closeWindow').click(function() {
			$('#updSuccess').modal('hide');
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;
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

function selectBoxIndexFind(key,list) {
	var index = 0;

	while (index != list.length) {
		if (key == list[index]) {
			break;
		}
		index++;
	}	
	return index;
}
