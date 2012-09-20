/**
* updateStudent.js - update existing student record
*
*/
	
	$(function() {
		//function to get parameter (id #) from the url

		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		};

		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

		$('#newPhoneText').mask("999-999-9999",{placeholder:"9"});		

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
				data:data_studentID,
				success: function(resp) {
					$('#existingNameEng').append(resp[0].name_eng);
					$('#existingNameKor').append(resp[0].name_kor);
					$('#existingGender').append(resp[0].gender);
					$('#existingDOB').append(resp[0].birthdate);
					$('#existingEmail').append(resp[0].email);
					latestversion = parseInt(resp[0].version,10) +1;
					if (resp[0].phone == '')
					{
						$('#existingPhone').append('N/A');
					} else {
						$('#existingPhone').append(resp[0].phone);
					}

					if (resp[0].address == '')
					{
						$('#existingAddress').append('N/A');
					} else {
						$('#existingAddress').append(resp[0].address);
					}
					$('#existingDOA').append(resp[0].arrival_dt);
					$('#existingVisaType').append(resp[0].visa_type);
					$('#existingVisaIssue').append(resp[0].visa_issue_date);
					$('#existingVisaExpiry').append(resp[0].visa_exp_date);
					$('#existingKoreaAgency').append(resp[0].korea_agency);

					if (resp[0].current_school == '')
					{
						$('#existingSchoolName').append('N/A');
					} else {
						$('#existingSchoolName').append(resp[0].current_school);
					}

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


		//when 'back' button is pressed, go back to 'view student' page for that student
		$('#backButton').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;
		});


		//when 'update' button is clicked
		$('#updButton').click(function() {
			var new_korean_name = $('#newNameKorText').val();
			var new_eng_name = $('#newNameEngText').val();
			var new_email = $('#newEmailText').val();
			var new_phone = $('#newPhoneText').val();
			var new_address = $('#newAddressText').val().replace(/\r\n|\r|\n/g,"<br />");
			var new_visa_type = $('#newVisaTypeVal').val();
			var new_gender = $('#genderSelect').val();
			
			var new_visa_exp_date = '';
			var new_date_of_birth = '';
			var new_school_name = $('#newSchoolText').val();
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

			
			var updateRecord = { "id" : student_id ,
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
								 "korea_agency" : new_korea_agency,
								 "school_name": new_school_name,
								 "school_start_dt": new_school_start_date,
								 "school_end_dt" : new_school_end_date,
								 "update_reason" : update_reason
								};

			$.ajax({
				type: "POST",
				url: "bin/update_user.php",
				data: updateRecord,
				success: function(resp) {
					alert(resp);
					var url = "viewStudent.html?id="+student_id+"&hidden=N";
					window.location = url;
				}
			});
			return false;
				
		});



		


	});
