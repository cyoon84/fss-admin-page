/**
* addStudent.js - add a new student record
*
*/
	$(function() {


		//hide error message fields for 'required' fields
		$('.error').hide();
		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
		
		var newId = 0;
		
		$('#phoneNo').mask("999-999-9999",{placeholder:"9"});		

		$('#doaMonth').append('<option value=0>-----------------</option>');
		$('#dobMonth').append('<option value=0>-----------------</option>');
		$('#vedMonth').append('<option value=0>-----------------</option>');
		$('#schoolStartMonth').append('<option value=0>-----------------</option>');
		$('#schoolEndMonth').append('<option value=0>-----------------</option>');
		$('#visaIssueMonth').append('<option value=0>-----------------</option>');
		
		$('#doaDay').append('<option value=0>-----------</option>');
		$('#dobDay').append('<option value=0>-----------</option>');
		$('#vedDay').append('<option value=0>-----------</option>');
		$('#schoolStartDay').append('<option value=0>-----------</option>');
		$('#schoolEndDay').append('<option value=0>-----------</option>');
		$('#visaIssueDay').append('<option value=0>-----------</option>');
		
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
			var address = $('#address').val();

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
			
			var sourceToFSS = $('#sourceToFSS').val();

			//do field validation
			if (korName == "") {
				$('label#nameKor_error').show();
				$('input#nameKor').focus();
 				 return false;
 			}
			

			if (dobYear != "")
			{
				dob = dobYear +"-"+dobMonth+"-"+dobDay; 
			}

			if (doaYear != "")
			{
				doa = doaYear +"-"+doaMonth+"-"+doaDay;
			}

			if (visaIssueYear != "")
			{
				visaIssueDate = visaIssueYear +"-"+visaIssueMonth+"-"+visaIssueDay;
			}

			if (vedYear != "")
			{
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
							"source_to_FSS" : sourceToFSS,
							"current_school_end_dt" : schoolEndDT};
		
		
			$.ajax({
				type: "POST",
				url: "bin/add_user.php",
				data:dataInsert,
				cache: false,	
				success: function(resp) {
					newId = resp;
					$('#addSuccess').modal('toggle');
				}
			});

			return false;

			
		});

		$('#viewStudent').click(function() {
			var url = "viewStudent.html?id="+newId+"&hidden=N";
			window.location = url;
		});

	

	});
