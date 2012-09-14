/**
* addStudent.js - add a new student record
*
*/
	$(function() {
		//hide error message fields for 'required' fields
		$('.error').hide();
		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

		//initialize month / day selector boxes
		for (i=0; i!= months.length ; i++ )
		{
			var actualmonth = i+1;
			if (actualmonth < 10)
			{
				$('#doaMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#dobMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#vedMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#schoolStartMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#schoolEndMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
				$('#visaIssueMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			} else {
				$('#doaMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#dobMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#vedMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#schoolStartMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#schoolEndMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
				$('#visaIssueMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
			}
		}

		for (i=1; i!= 32  ; i++ )
		{
			if (i < 10)
			{
				$('#doaDay').append('<option>0'+i+'</option>');
				$('#dobDay').append('<option>0'+i+'</option>');
				$('#vedDay').append('<option>0'+i+'</option>');
				$('#schoolStartDay').append('<option>0'+i+'</option>');
				$('#schoolEndDay').append('<option>0'+i+'</option>');
				$('#visaIssueDay').append('<option>0'+i+'</option>');
			} else {
				$('#doaDay').append('<option>'+i+'</option>');
				$('#dobDay').append('<option>'+i+'</option>');
				$('#vedDay').append('<option>'+i+'</option>');
				$('#schoolStartDay').append('<option>'+i+'</option>');
				$('#schoolEndDay').append('<option>'+i+'</option>');
				$('#visaIssueDay').append('<option>'+i+'</option>');
			}
		}

		//when 'add' button is clicked
		$('#addButton').click(function() {
			$('.error').hide();

			var dob = "";
			var doa = "";

			var visaIssueDate = "";
			var visaExpiryDate = "";

			var schoolStartDT = "";
			var schoolEndDT = "";

			//fields to be validated
			var engName = $('#nameEng').val();
			var korName = $('#nameKor').val();
			var address = $('#address').val().replace(/\r\n|\r|\n/g,"<br />");

			var email = $('#email').val();

			var dobDay  = $('#dobDay').val();
			var dobMonth= $('#dobMonth').val();
			var dobYear = $('#dobYear').val();

			var doaDay  = $('#doaDay').val();
			var doaMonth= $('#doaMonth').val();
			var doaYear = $('#doaYear').val();

			var visaIssueDay = $('#visaIssueDay').val();
			var visaIssueMonth = $('#visaIssueMonth').val();
			var visaIssueYear = $('#visaIssueYear').val();

			var vedDay  = $('#vedDay').val();
			var vedMonth= $('#vedMonth').val();
			var vedYear = $('#vedYear').val();

			var sStDay  = $('#schoolStartDay').val();
			var sStMonth= $('#schoolStartMonth').val();
			var sStYear = $('#schoolStartYear').val();

			var sEnDay  = $('#schoolEndDay').val();
			var sEnMonth= $('#schoolEndMonth').val();
			var sEnYear = $('#schoolEndYear').val();

			var gender  = $('#gender').val();

			var phoneNo = $('#phoneNo').val();

			var visaType = $('#visaType').val();

			var schoolName = $('#schoolName').val();

			var korAgencyName = $('#korAgencyName').val();
			
			//do field validation
			
			if (engName == "")
			{
				$('label#nameEng_error').show();
				$('input#nameEng').focus();
				return false;
			}

			if (korName == "")
			{
				$('label#nameKor_error').show();
				$('input#nameKor').focus();
				return false;
			}

			if (dobYear == "")
			{
				$('label#dobYear_error').show();
				$('input#dobYear').focus();
				return false;
			} else {
				dob = dobYear +"-"+dobMonth+"-"+dobDay; 
			}

			if (email == "")
			{
				$('label#email_error').show();
				$('input#email').focus();
				return false;
			}

			if (korAgencyName == "")
			{
				$('label#korAgencyName_error').show();
				$('input#korAgencyName').focus();
				return false;
			}

			if (doaYear == "")
			{
				$('label#doaYear_error').show();
				$('input#doaYear').focus();
				return false;
			} else {
				doa = doaYear +"-"+doaMonth+"-"+doaDay;
			}

			if (visaIssueYear == "")
			{
				$('label#visaIssueYear_error').show();
				$('input#visaIssueYear').focus();
				return false;
			} else {
				visaIssueDate = visaIssueYear +"-"+visaIssueMonth+"-"+visaIssueDay;
			}

			if (vedYear == "")
			{
				$('label#vedYear_error').show();
				$('input#vedYear').focus();
				return false;
			} else {
				visaExpiryDate = vedYear +"-"+vedMonth+"-"+vedDay;
			}

			if (sStYear != "")
			{
				schoolStartDT = sStYear +"-"+sStMonth+"-"+sStDay;
			}

			if (sEnYear != "")
			{
				schoolEndDT = sEnYear +"-"+sEnMonth+"-"+sEnDay;
			}

			var dataInsert = {"name_eng" : engName, "name_kor" : korName, 
							"gender" : gender, "date_birth" : dob, 
							"email": email, "phone_no" : phoneNo, 
							"address" : address, "arrival_date" : doa, 
							"visa_type" : visaType, "visa_issue_date" : visaIssueDate, 
							"visa_exp_date" : visaExpiryDate, "korean_agency" : korAgencyName, 
							"current_school" : schoolName, "current_school_strt_dt" : schoolStartDT, 
							"current_school_end_dt" : schoolEndDT};
		
		
			$.ajax({
				type: "POST",
				url: "bin/add_user.php",
				data:dataInsert,
				success: function(resp) {
					alert(resp);
				}
			});

			return false;

			
		});

	});
