/**
* addStudent.js - add a new student record
*
*/
	$(function() {
		
		var current_userid = $.session.get('session_userid');
		var visitRows = 0;
		var prevSchoolRows = 0;
		var prevVisaRows = 0;

		//hide error message fields for 'required' fields
		$('.error').hide();
		
		var newId = 0;
		
		$('#phoneNo').mask("999-999-9999");		

		initializeDateSelector('#doaDay', '#doaMonth');
		initializeDateSelector('#dobDay', '#dobMonth');
		initializeDateSelector('#vedDay', '#vedMonth');
		initializeDateSelector('#schoolStartDay', '#schoolStartMonth');
		initializeDateSelector('#schoolEndDay', '#schoolEndMonth');
		initializeDateSelector('#visaIssueDay', '#visaIssueMonth');


		initializeDateSelector('#prevStartDay1', '#prevStartMonth1');
		initializeDateSelector('#prevEndDay1','#prevEndMonth1');
		
		initializeDateSelector('#prevStartDay2', '#prevStartMonth2');
		initializeDateSelector('#prevEndDay2','#prevEndMonth2');
		
		initializeDateSelector('#prevStartDay3', '#prevStartMonth3');
		initializeDateSelector('#prevEndDay3','#prevEndMonth3');
		
		initializeDateSelector('#prevStartDay4', '#prevStartMonth4');
		initializeDateSelector('#prevEndDay4','#prevEndMonth4');
		
		initializeDateSelector('#prevStartDay5', '#prevStartMonth5');
		initializeDateSelector('#prevEndDay5','#prevEndMonth5');
		
		
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
			var engFName = $('#nameEngFName').val().toUpperCase();
			var engLName = $('#nameEngLName').val().toUpperCase();

			if (engFName == '' && engLName == '')
			{
				var engName = '';
			} else {
				var engName = engLName+", "+engFName;
			}

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

			var programName = $('#pgmName').val();

			var korAgencyName = $('#korAgencyName').val();
			
			var sourceToFSS = $('#sourceToFSS').val();

			if (sourceToFSS == 0)
			{
				sourceToFSS = '';
			}

			var referrerName = $('#refferNameText').val();

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
							"current_school" : schoolName, "current_program" : programName, 
							"current_school_strt_dt" : schoolStartDT, 
							"source_to_FSS" : sourceToFSS, "referrer_name" : referrerName,
							"user_id" : current_userid,
							"current_school_end_dt" : schoolEndDT,
							"initial_visits": [], "prev_schools": [], "prev_visa":[]};
		

			if (visitRows > 0)
			{		
				for (i=0;i!=visitRows ;i++ )
				{
					var idnum = i + 1;
					var visitDayId = '#visitDay'+idnum;
					var visitMonthId = '#visitMonth'+idnum;
					var visitYearId = '#visitYear'+ idnum;
				
					var visitPurposeId = '#visitPurpose'+idnum;
					var visitNoteId = '#visitNote'+idnum;

					var visitYearVal = $(visitYearId).val();
					var visitMonthVal = $(visitMonthId).val();
					var visitDayVal = $(visitDayId).val();

					var visitPurposeVal = $(visitPurposeId).val();
					var visitNoteVal = $(visitNoteId).val();

					if (visitYearVal == '')
					{
						var visitDateString = '';
					} else {
						var visitDateString = visitYearVal+"-"+visitMonthVal+"-"+visitDayVal;
					}


					var list = {"visitDate": visitDateString, "visitPurpose": visitPurposeVal, "visitNote" : visitNoteVal};

					dataInsert.initial_visits.push(list);
			
				}

			}

			if (prevSchoolRows > 0)
			{
				for (i=0;i != 5 ; i++ )
				{
					var idnum = i+1;
					var prevSchoolNameId = '#prevSchoolName'+idnum;
					var prevProgramId = '#prevPrgmName'+idnum;
					var prevSchoolStartYearId = '#prevStartYear'+idnum;
					var prevSchoolStartMonthId = '#prevStartMonth'+idnum;
					var prevSchoolStartDayId = '#prevStartDay'+idnum;

					var prevSchoolEndYearId = '#prevEndYear'+idnum;
					var prevSchoolEndMonthId = '#prevEndMonth'+idnum;
					var prevSchoolEndDayId = '#prevEndDay'+idnum;

					var prevSchoolName = $(prevSchoolNameId).val();
					var prevSchoolPgm = $(prevProgramId).val();

					var prevSchoolStartYear = $(prevSchoolStartYearId).val();
					var prevSchoolStartMonth = $(prevSchoolStartMonthId).val();
					var prevSchoolStartDay = $(prevSchoolStartDayId).val();
					
					var prevSchoolEndYear = $(prevSchoolEndYearId).val();
					var prevSchoolEndMonth = $(prevSchoolEndMonthId).val();
					var prevSchoolEndDay = $(prevSchoolEndDayId).val();

					if (prevSchoolStartYear == '')
					{
						var prevSchoolStartDate = '';
					} else {
						var prevSchoolStartDate = prevSchoolStartYear+"-"+prevSchoolStartMonth+"-"+prevSchoolStartDay;

						if (prevSchoolStartDate.length != 10)
						{
							prevSchoolStartDate = '';
						}
					}

					if (prevSchoolEndYear == '')
					{
						var prevSchoolEndDate = '';
					} else {
						var prevSchoolEndDate = prevSchoolEndYear+"-"+prevSchoolEndMonth+"-"+prevSchoolEndDay;

						if (prevSchoolEndDate.length != 10)
						{
							prevSchoolEndDate = '';
						}
					}
					

					var list = {"prev_school_name" : prevSchoolName, "prev_school_prgm" : prevSchoolPgm, "prev_school_strt_dt": prevSchoolStartDate, "prev_school_end_dt" : prevSchoolEndDate};

					dataInsert.prev_schools.push(list);
				}
			}


			if (prevVisaRows > 0)
			{
				for (i=0;i!=5 ;i++ )
				{
					var idnum = i+1;
					var visaTypeID = '#prevVisaType'+idnum;
					var issueDateMonth = '#prevVisaIssueMonth'+idnum;
					var issueDateDay = '#prevVisaIssueDay'+idnum;
					var issueDateYear = '#prevVisaIssueYear'+idnum;

					var expireDateMonth = '#prevVisaExpireMonth'+idnum;
					var expireDateDay = '#prevVisaExpireDay'+idnum;
					var expireDateYear = '#prevVisaExpireYear'+idnum;

					var visaType_val = $(visaTypeID).val();
					var issueDateMonth_val = $(issueDateMonth).val();
					var issueDateDay_val = $(issueDateDay).val();
					var issueDateYear_val = $(issueDateYear).val();

					var expireDateMonth_val = $(expireDateMonth).val();
					var expireDateDay_val = $(expireDateDay).val();
					var expireDateYear_val = $(expireDateYear).val();

					if (issueDateYear_val == '')
					{
						var prevIssueDate = '';
					} else {
						var prevIssueDate = issueDateYear_val +"-"+ issueDateMonth_val+"-"+issueDateDay_val;

						if (prevIssueDate.length != 10)
						{
							prevIssueDate = '';
						}
					}

					if (expireDateYear_val == '')
					{
						var prevExpireDate = '';
					} else {
						var prevExpireDate = expireDateYear_val+"-"+expireDateMonth_val+"-"+expireDateDay_val;
						
						if (prevExpireDate.length != 10)
						{
							prevExpireDate = '';
						}
					}

					var list = {"prev_visa_type" : visaType_val, "prev_issue_date" : prevIssueDate, "prev_expire_date": prevExpireDate};

					dataInsert.prev_visa.push(list);
				}
			}
		
			$.ajax({
				type: "POST",
				url: "bin/add_user.php",
				data:dataInsert,
				cache: false,	
				success: function(resp) {
					if (isNaN(resp))
					{
						alert(resp);
					} else {
						newId = resp;
						$('#addSuccess').modal('toggle');
					}
				}
			});

			return false;

			
		});


		$('#prevSchoolName2').keydown(function() {
			$('#prevPrgmName2').prop('disabled', false);
			$('#prevStartMonth2').prop('disabled',false);
			$('#prevStartDay2').prop('disabled',false);
			$('#prevStartYear2').prop('disabled',false);

			$('#prevEndMonth2').prop('disabled',false);
			$('#prevEndDay2').prop('disabled',false);
			$('#prevEndYear2').prop('disabled',false);
			$('#prevSchoolName3').prop('disabled', false);

		});

		$('#prevSchoolName3').keydown(function() {
			$('#prevPrgmName3').prop('disabled', false);
			$('#prevStartMonth3').prop('disabled',false);
			$('#prevStartDay3').prop('disabled',false);
			$('#prevStartYear3').prop('disabled',false);

			$('#prevEndMonth3').prop('disabled',false);
			$('#prevEndDay3').prop('disabled',false);
			$('#prevEndYear3').prop('disabled',false);
			$('#prevSchoolName4').prop('disabled', false);

		});

		$('#prevSchoolName4').keydown(function() {
			$('#prevPrgmName4').prop('disabled', false);
			$('#prevStartMonth4').prop('disabled',false);
			$('#prevStartDay4').prop('disabled',false);
			$('#prevStartYear4').prop('disabled',false);

			$('#prevEndMonth4').prop('disabled',false);
			$('#prevEndDay4').prop('disabled',false);
			$('#prevEndYear4').prop('disabled',false);
			$('#prevSchoolName5').prop('disabled', false);

		});

		$('#prevSchoolName5').keydown(function() {
			$('#prevPrgmName5').prop('disabled', false);
			$('#prevStartMonth5').prop('disabled',false);
			$('#prevStartDay5').prop('disabled',false);
			$('#prevStartYear5').prop('disabled',false);

			$('#prevEndMonth5').prop('disabled',false);
			$('#prevEndDay5').prop('disabled',false);
			$('#prevEndYear5').prop('disabled',false);

		});

		$('#viewStudent').click(function() {
			var url = "viewStudent.html?id="+newId+"&hidden=N";
			window.location = url;
		});

		$('#sourceToFSS').change(function() {
			if ($('#sourceToFSS').val() == 'Referral')
			{
				$('#referrerName').show();
			} else {
				$('#referrerName').hide();
				$('#refferNameText').val("");
			}


		});

		$('#addMoreVisitRow').click(function() {

			visitRows++;

			$('#initialVisitRecords tbody').append('<tr><td rowspan="4" style="width:5%">'+visitRows+'<td style="width:25%"> Visit Date *<td><select class="span2" id="visitMonth'+visitRows+'" name="visitMonth"></select>'
						+'<select class="span2" id="visitDay'+visitRows+'" name="visitDay"></select>'
						+'<input class="span2" id="visitYear'+visitRows+'" placeholder="year (yyyy)" name="visitYear">'
			+'</tr><tr><td> Visit Purpose<td> <input class="span3" type="text" id="visitPurpose'+visitRows+'"></tr><tr><td> Note<td> <textarea rows="3" id="visitNote'+visitRows+'" class="span5"></textarea></tr><tr><td colspan=3 style="text-align:right"><button class="deleteVisitRow" id="deleteVisitButton'+visitRows+'">Delete the last row</button></tr>');

			var day_selector_id = "#visitDay"+visitRows;
			var month_selector_id = "#visitMonth"+visitRows;

			initializeDateSelector(day_selector_id, month_selector_id);
			
			var oneBeforeRow = visitRows - 1;

			if (oneBeforeRow > 0)
			{
				var prevDeleteButtonId = "#deleteVisitButton"+oneBeforeRow;
			
				$(prevDeleteButtonId).hide();
			}

			
			return false;
			
		});




		$('#addMorePrevSchoolRow').click(function() {

			if (prevSchoolRows < 5) {

				prevSchoolRows++;

				
				$('#previousSchoolRows tbody').append("<tr><td rowspan='5' style='width:5%'>"+prevSchoolRows+"</td>"
					+"<td style='width:25%'> Previous School Name</td>"
					+"<td> <input class='nameField' type='text' id='prevSchoolName"+prevSchoolRows+"' name='prevSchoolName"+prevSchoolRows+"'></td></tr>"
					+"<tr><td> Previous School Program</td><td> <input type='text' id='prevPrgmName"+prevSchoolRows+"' name='prevPrgmName"+prevSchoolRows+"'></td></tr>"
					+"<tr><td> Previous School Start Date</td><td><select class='span2' id='prevStartMonth"+prevSchoolRows+"' name='prevStartMonth"+prevSchoolRows+"'></select>"
					+"<select class='span2' id='prevStartDay"+prevSchoolRows+"' name='prevStartDay"+prevSchoolRows+"'></select>"
					+"<input class='span2' id='prevStartYear"+prevSchoolRows+"' name='prevStartYear"+prevSchoolRows+"' placeholder='year (yyyy)'></td></tr>"
					+"<tr><td> Previous School End Date</td><td><select class='span2' id='prevEndMonth"+prevSchoolRows+"' name='prevEndMonth1"+prevSchoolRows+"'></select>"
					+"<select class='span2' id='prevEndDay"+prevSchoolRows+"' name='prevEndDay"+prevSchoolRows+"'></select>"
					+"<input class='span2' id='prevEndYear"+prevSchoolRows+"' name='prevEndYear1"+prevSchoolRows+"' placeholder='year (yyyy)'></td></tr>"
					+"<tr><td colspan='3' style='text-align:right'><button class='deletePrevSchoolRow' id='deletePrevSchool"+prevSchoolRows+"'>Delete the last row</button></tr>");

				var start_day_selector_id = "#prevStartDay"+prevSchoolRows;
				var start_month_selector_id = "#prevStartMonth"+prevSchoolRows;

				initializeDateSelector(start_day_selector_id, start_month_selector_id);

				var end_day_selector_id = "#prevEndDay"+prevSchoolRows;
				var end_month_selector_id = "#prevEndMonth"+prevSchoolRows;

				initializeDateSelector(end_day_selector_id, end_month_selector_id);
				
				var oneBeforeRow = prevSchoolRows - 1;

				if (oneBeforeRow > 0)
				{
					var prevDeleteButtonId = "#deletePrevSchool"+oneBeforeRow;

					$(prevDeleteButtonId).hide();
				}

				

			}
			return false;
		});

		$('#addMorePrevVisaRow').click(function() {
			if (prevVisaRows < 5)
			{
				prevVisaRows ++;
				$('#previousVisaRows tbody').append("<tr><td rowspan='4' style='width:5%'>"+prevVisaRows+"</td>"
				+"<td style='width:25%'>Previous visa type *</td> <td><select class='span2' id='prevVisaType"+prevVisaRows+"' name='prevVisaType"+prevVisaRows+"'></select></td></tr>"
				+"<tr><td>Previous visa issued date</td><td><select class='span2' id='prevVisaIssueMonth"+prevVisaRows+"' name='prevVisaIssueMonth"+prevVisaRows+"'></select>"
				+"<select class='span2' id='prevVisaIssueDay"+prevVisaRows+"' name='prevVisaIssueDay"+prevVisaRows+"'></select>"
				+"<input class='span2' id='prevVisaIssueYear"+prevVisaRows+"' name='prevVisaIssueYear"+prevVisaRows+"' placeholder='year (yyyy)'></td></tr>"
				+"<tr><td>Previous visa expiry date</td><td><select class='span2' id='prevVisaExpireMonth"+prevVisaRows+"' name='prevVisaExpireMonth"+prevVisaRows+"'></select>"
				+"<select class='span2' id='prevVisaExpireDay"+prevVisaRows+"' name='prevVisaExpireDay"+prevVisaRows+"'></select>"
				+"<input class='span2' id='prevVisaExpireYear"+prevVisaRows+"' name='prevVisaExpireYear"+prevVisaRows+"' placeholder='year (yyyy)'></td></tr>"
				+"<tr><td colspan='3' style='text-align:right'><button class='deletePrevVisaRow' id ='deletePrevVisaRow"+prevVisaRows+"'>Delete the last row</button></tr>");

				var visaTypeSelector = '#prevVisaType'+prevVisaRows;

				$(visaTypeSelector).append('<option>Unknown</option>');
				$(visaTypeSelector).append('<option>Study</option><option>Working Holiday</option><option>Visitor</option><option>Co-op</option>');
				
				var issue_day_selector_id = "#prevVisaIssueDay"+prevVisaRows;
				var issue_month_selector_id = "#prevVisaIssueMonth"+prevVisaRows;

				initializeDateSelector(issue_day_selector_id, issue_month_selector_id);

				var expire_day_selector_id = "#prevVisaExpireDay"+prevVisaRows;
				var expire_month_selector_id = "#prevVisaExpireMonth"+prevVisaRows;

				initializeDateSelector(expire_day_selector_id, expire_month_selector_id);

				var oneBeforeRow = prevVisaRows - 1;

				if (oneBeforeRow > 0)
				{
					var prevDeleteButtonId = "#deletePrevVisaRow"+oneBeforeRow;

					$(prevDeleteButtonId).hide();
				}
			}
			return false;
		});

		$('#previousSchoolRows').on("click",".deletePrevSchoolRow",function() {
			$('#previousSchoolRows tbody tr').slice(-5).remove();
			prevSchoolRows--;

			var prevDeleteButtonId = '#deletePrevSchool'+prevSchoolRows;
			$(prevDeleteButtonId).show();

			return false;

		});

		$('#initialVisitRecords').on("click",".deleteVisitRow",function() {
			$('#initialVisitRecords tbody tr').slice(-4).remove();
			visitRows --;
		
			var prevDeleteButtonId = "#deleteVisitButton"+visitRows;

			$(prevDeleteButtonId).show();

			return false;
		});

		$('#previousVisaRows').on("click",".deletePrevVisaRow",function() {
			$('#previousVisaRows tbody tr').slice(-4).remove();

			prevVisaRows --;

			var prevDeleteButtonId = "#deletePrevVisaRow"+prevVisaRows;

			$(prevDeleteButtonId).show();

			return false;

		});

		$('#reset').click(function() {
			var rowsToDelete = visitRows * -4;
			$('#initialVisitRecords tbody tr').slice(rowsToDelete).remove();

			visitRows = 0;

			return false;

		});

		$('#resetVisa').click(function() {
			var rowsToDelete = prevVisaRows * -4;

			$('#previousVisaRows tbody tr').slice(rowsToDelete).remove();

			prevVisaRows = 0;

			return false;
		});

		$('#resetSchool').click(function() {
			var rowsToDelete = prevSchoolRows * -5;
			$('#previousSchoolRows tbody tr').slice(rowsToDelete).remove();

			prevSchoolRows = 0;
			return false;

		});


	});


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