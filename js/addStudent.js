/**
* addStudent.js - add a new student record
*
*/
	$(function() {
		
		var current_userid = $.session.get('session_userid');
		var visitRows = 0;
		var prevSchoolRows = 0;

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
		initializeDateSelector('#prevEndDay1', '#prevEndMonth1');

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
							"current_school" : schoolName, "current_school_strt_dt" : schoolStartDT, 
							"source_to_FSS" : sourceToFSS, "referrer_name" : referrerName,
							"user_id" : current_userid,
							"current_school_end_dt" : schoolEndDT,
							"initial_visits": []};
		

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

					var visitDateString = visitYearVal+"-"+visitMonthVal+"-"+visitDayVal;



					var list = {"visitDate": visitDateString, "visitPurpose": visitPurposeVal, "visitNote" : visitNoteVal};

					dataInsert.initial_visits.push(list);
			
				}

			}
		
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

			$('#initialVisitRecords tbody').append('<tr><td rowspan="4" style="width:5%">'+visitRows+'<td style="width:25%"> Visit Date<td><select class="span2" id="visitMonth'+visitRows+'" name="visitMonth"></select>'
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

			
		});

		$('#addMorePrevSchoolRow').click(function() {

			if (prevSchoolRows < 5) {

				prevSchoolRows++;

				$('#previousSchoolRows tbody').append('<tr><td rowspan="5" style="width:5%">'+prevSchoolRows+'</td>'
						+'<td style="width:25%"> Previous School Name</td>'
						+'<td> <input type="text" id="prevSchoolName'+prevSchoolRows+'" name="prevSchoolName'+prevSchoolRows+'"></td></tr>'
						+'<tr><td> Previous School Program</td><td> <input type="text" id="prevSchoolName'+prevSchoolRows+'" name="prevSchoolName'+prevSchoolRows+'"></td></tr>'
						+'<tr><td> Previous School Start Date</td><td><select class="span2" id="prevStartMonth'+prevSchoolRows+'" name="prevStartMonth'+prevSchoolRows+'"></select>'
						+'<select class="span2" id="prevStartDay'+prevSchoolRows+'" name="prevStartDay'+prevSchoolRows+'"></select>'
						+'<input class="span2" id="prevStartYear'+prevSchoolRows+'" name="prevStartYear'+prevSchoolRows+'" placeholder="year (yyyy)"></td></tr>'
						+'<tr><td> Previous School End Date</td><td><select class="span2" id="prevEndMonth'+prevSchoolRows+'" name="prevEndMonth'+prevSchoolRows+'"></select>'
						+'<select class="span2" id="prevEndDay'+prevSchoolRows+'" name="prevEndDay'+prevSchoolRows+'"></select>'
						+'<input class="span2" id="prevEndYear'+prevSchoolRows+'" name="prevEndYear'+prevSchoolRows+'" placeholder="year (yyyy)"></td></tr>'
						+'<tr><td  style="text-align:right" colspan="2"><button class="deletePrevSchool" id="deletePrevSchool'+prevSchoolRows+'">Delete the last row</button></td></tr>');
				
				var start_day_selector_id = "#prevStartDay"+prevSchoolRows;
				var start_month_selector = "#prevStartMonth"+prevSchoolRows;

				initializeDateSelector(start_day_selector_id, start_month_selector);

				var end_day_selector_id = "#prevEndDay"+prevSchoolRows;
				var end_month_selector = "#prevEndMonth"+prevSchoolRows;

				initializeDateSelector(end_day_selector_id, end_month_selector);
				
				var oneBeforeRow = prevSchoolRows - 1;

				if (oneBeforeRow > 0)
				{
					var prevDeleteButtonId = "#deletePrevSchool"+oneBeforeRow;

					$(prevDeleteButtonId).hide();
				}

				

			}
		});

		$('#previousSchoolRows').on("click",".deletePrevSchool",function() {

			$('#previousSchoolRows tbody tr').slice(-5).remove();
							
			prevSchoolRows --;

			var prevDeleteButtonId = "#deletePrevSchool"+prevSchoolRows;

			$(prevDeleteButtonId).show();

		});


		$('#initialVisitRecords').on("click",".deleteVisitRow",function() {
			$('#initialVisitRecords tbody tr').slice(-4).remove();
			visitRows --;
		
			var prevDeleteButtonId = "#deleteVisitButton"+visitRows;

			$(prevDeleteButtonId).show();
			});

		$('#reset').click(function() {
				var rowsToDelete = visitRows * -4;
				$('#initialVisitRecords tbody tr').slice(rowsToDelete).remove();

				visitRows = 0;

		});

		$('#resetPrevSchool').click(function() {
				var rowsToDelete = prevSchoolRows * -5;
				$('#previousSchoolRows tbody tr').slice(rowsToDelete).remove();

				prevSchoolRows = 0;



		});

	});


	function initializeDateSelector(id_day, id_month) {
		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");

		$(id_month).append('<option value=0>-----------------</option>');
		$(id_day).append('<option value=0>-----------</option>');

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
		

	};