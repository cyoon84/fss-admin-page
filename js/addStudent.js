/**
* addStudent.js - add a new student record
*
*/

	var countRec = 0;

	$(function() {

		$('#menuarea').load('menu.html');
		
		var current_userid = $.session.get('session_userid');
		var visitRows = 0;
		var prevSchoolRows = 0;
		var prevVisaRows = 0;
		var otherSchoolName = '';
		var otherSchoolType = '';

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
		
		schoolCatLoad('#schoolCategory');
		
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

			var school_index = $('#schoolList').val();

			var programName = $('#pgmName').val();

			var korAgencyName = $('#korAgencyName').val();
			
			var sourceToFSS = $('#sourceToFSS').val();

			var note = $('#note').val();

			var other_school_name = '';
		
			if (school_index == 'Other') {
				other_school_name = $('#otherSchoolText').val();
			}	

			if (sourceToFSS == 0)
			{
				sourceToFSS = '';
			}

			var referrerName = $('#refferNameText').val();


			if (engLName == '')
			{
				$('label#nameEng_error').show();
				$('input#nameEngLName').focus();
 				 return false;
			} 


			if (engFName == '' ) 
			{
				$('label#nameEng_error').show();
				$('input#nameEngFName').focus();
 				 return false;				
			}

			var engName = engLName+", "+engFName;
			

			//do field validation
			if (korName == "") {
				$('label#nameKor_error').show();
				$('input#nameKor').focus();
 				 return false;
 			} 
			

			if (dobYear != "")
			{
				if (dobYear.length != 4 || isNaN(dobYear)) {
					$('label#dobYear_error').show();
					$('input#dobYear').focus();
					return false;						
				} else {
					dob = dobYear +"-"+dobMonth+"-"+dobDay; 

					if (dob.length != 10) {
						$('label#dobDate_error').show();
						$('#dobMonth').focus();
						return false;
					}
				}
			} else {
				if (((dobMonth == 0 && dobDay != 0) || (dobMonth != 0 && dobDay == 0))) {
					$('label#dobDate_error2').show();
					$('#dobMonth').focus();
					return false;
				} else {
					if (dobMonth != 0 && dobDay != 0) {
						dob = dobMonth+"-"+dobDay;
					}
				}
			}

			if (doaYear != "")
			{
				if (doaYear.length != 4 || isNaN(doaYear)) {
					$('label#doaYear_error').show();
					$('input#doaYear').focus();
					return false;						
				} else {				
					doa = doaYear +"-"+doaMonth+"-"+doaDay;

					if (doa.length != 10) {
						$('label#doaDate_error').show();
						$('#doaMonth').focus();
						return false;						
					}
				}
			}

			if (visaIssueYear != "")
			{
				if (visaIssueYear.length != 4 || isNaN(visaIssueYear)) {
					$('label#visaIssueYear_error').show();
					$('input#visaIssueYear').focus();
					return false;						
				} else {				
					visaIssueDate = visaIssueYear +"-"+visaIssueMonth+"-"+visaIssueDay;

					if (visaIssueDate.length != 10) {
						$('label#visaIssueDate_error').show();
						$('#visaIssueMonth').focus();
						return false;						
					}
				}
			}

			if (vedYear != "")
			{
				if (vedYear.length != 4 || isNaN(vedYear)) {
					$('label#vedYear_error').show();
					$('input#vedYear').focus();
					return false;						
				} else {
					visaExpiryDate = vedYear +"-"+vedMonth+"-"+vedDay;

					if (visaExpiryDate.length != 10) {
						$('label#vedYear_error').show();
						$('#vedMonth').focus();
						return false;						
					}
				}
			}

			if (sStYear != "")
			{
				if (sStYear.length != 4 || isNaN(sStYear)) {
					$('label#schoolStartYear_error').show();
					$('input#schoolStartYear').focus();
					return false;						
				} else {
					schoolStartDT = sStYear +"-"+sStMonth+"-"+sStDay;

					if (schoolStartDT.length != 10) {
						$('label#schoolStartDate_error').show();
						$('#schoolStartMonth').focus();
						return false;						
					}
				}
			}

			if (sEnYear != "")
			{
				if (sEnYear.length != 4 || isNaN(sEnYear)) {
					$('label#schoolEndYear_error').show();
					$('input#schoolEndYear').focus();
					return false;						
				} else {
					schoolEndDT = sEnYear +"-"+sEnMonth+"-"+sEnDay;

					if (schoolEndDT.length != 10) {
						$('label#schoolEndDate_error').show();
						$('#schoolEndMonth').focus();
						return false;							
					}
				}
			}

			if (dobMonth != 0 && dobDay != 0) {
				var studentUniqueId = dobMonth+dobDay+engFName.replace(' ','')+engLName.charAt(0);	
			} else {
				var studentUniqueId = "FSS"+engFName.replace(' ','')+engLName.charAt(0);
			}


			var dataInsert = {"uniqueId": studentUniqueId, "name_eng" : engName, "name_kor" : korName, 
							"gender" : gender, "date_birth" : dob, 
							"email": email, "phone_no" : phoneNo, 
							"address" : address, "arrival_date" : doa, 
							"visa_type" : visaType, "visa_issue_date" : visaIssueDate, 
							"visa_exp_date" : visaExpiryDate, "korean_agency" : korAgencyName,
							"school_index" : school_index, "other_school_type": otherSchoolType, "other_school_name": other_school_name ,"current_program" : programName, 
							"current_school_strt_dt" : schoolStartDT, 
							"source_to_FSS" : sourceToFSS, "referrer_name" : referrerName,
							"user_id" : current_userid,
							"current_school_end_dt" : schoolEndDT, "note" : note,
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
				var i = 0;
				while (i != prevSchoolRows) {
					var idnum = i+1;
					var prevSchool_id = '#prevSchoolName'+idnum;

					var prevProgramId = '#prevPrgmName'+idnum;
					var prevSchoolStartYearId = '#prevStartYear'+idnum;
					var prevSchoolStartMonthId = '#prevStartMonth'+idnum;
					var prevSchoolStartDayId = '#prevStartDay'+idnum;

					var prevSchoolEndYearId = '#prevEndYear'+idnum;
					var prevSchoolEndMonthId = '#prevEndMonth'+idnum;
					var prevSchoolEndDayId = '#prevEndDay'+idnum;

					var prevSchoolNameId = "#prevSchoolName"+idnum;

					var prevSchoolName = $(prevSchoolNameId).val();

					var prevSchoolPgm = $(prevProgramId).val();

					var prevSchoolStartYear = $(prevSchoolStartYearId).val();
					var prevSchoolStartMonth = $(prevSchoolStartMonthId).val();
					var prevSchoolStartDay = $(prevSchoolStartDayId).val();
					
					var prevSchoolEndYear = $(prevSchoolEndYearId).val();
					var prevSchoolEndMonth = $(prevSchoolEndMonthId).val();
					var prevSchoolEndDay = $(prevSchoolEndDayId).val();

					var prevSchool_index = $(prevSchool_id).val();

					var prevSchool_other_name = '';
					var prevSchool_other_type = '';

					if (prevSchool_index == 'Other') {
						var prevSchoolOtherId = "#prevSchoolOther"+idnum;
						var prevSchoolOtherTypeId = "#prevSchoolCat"+idnum;
						prevSchool_other_name = $(prevSchoolOtherId).val();
						prevSchool_other_type = $(prevSchoolOtherTypeId).val();

					}

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
					

					var list = {"school_index" : prevSchool_index,"prev_other_school_name": prevSchool_other_name, "prev_other_school_type": prevSchool_other_type, "prev_school_prgm" : prevSchoolPgm, "prev_school_strt_dt": prevSchoolStartDate, "prev_school_end_dt" : prevSchoolEndDate};

					dataInsert.prev_schools.push(list);
					i++;
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
				type:"GET",
				url: "bin/getAllUser.php",
				data: {"name_kor": korName, "action" : "check_duplicate_init"},
				dataType: "json",
				cache: false,
				success:function(resp) {
					if (resp[0].count != 0) {
						$('#alreadyExistingName').empty();
						$('#alreadyExistingBDay').empty();
						$('#alreadyExistingName').append(resp[0].name_kor);
						$('#alreadyExistingBDay').append(resp[0].date_birth);
						$('#warningAdd').modal('toggle');
						return false;
					} else {
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
					}
				}
			})

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




		$('#addMorePrevSchool').click(function() {

			if (prevSchoolRows < 5) {

				prevSchoolRows++;

				
				$('#previousSchoolRows tbody').append("<tr><td rowspan='5' style='width:5%'>"+prevSchoolRows+"</td>"
					+"<td style='width:25%'> Previous School Name</td>"
					+"<td> <select class='categoryPrevSchool span3' id='prevSchoolCat"+prevSchoolRows+"'></select>"
					+"<select class='listPrevSchool span4' id='prevSchoolName"+prevSchoolRows+"'></select><input class='prevSchoolOther' type ='text' id ='prevSchoolOther"+prevSchoolRows+"' style='display:none'></td></tr>"
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

				var school_cat_id = '#prevSchoolCat'+prevSchoolRows;

				schoolCatLoad(school_cat_id);


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

		$('#previousSchoolRows').on('change','.categoryPrevSchool', function() {
			var schoolType = $(this).val();
			var id = "#prevSchoolName"+this.id.substring(13);

			var otherSchoolNameID = "#prevSchoolOther"+this.id.substring(13);

			$(otherSchoolNameID).hide();
			schoolListLoad(id, schoolType);
		});

		$('#previousSchoolRows').on('change','.listPrevSchool', function() {
			var schoolName = $(this).val();
			var id = "#prevSchoolOther"+this.id.substring(14);

			$(id).val('');
			if (schoolName == 'Other') {
				$(id).show();

			} else {
				$(id).hide();
			}
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
				$(visaTypeSelector).append('<option value=0>-------------</option>');
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


	});

	function schoolCatLoad(id) {
		var dataAction = {"action" : "get_type"};
		$(id).append('<option value = 0>-----------------------------</option>');
		$.ajax({
			type: "POST",
			url: "bin/school_list.php",
			data:dataAction,
			dataType:"json",
			cache: false,	
			success: function(resp) {
				for (var i = 1; i!= resp.length; i++) {
					$(id).append('<option>'+resp[i].school_type+'</option>');
				}
			}
		});	
	}

	function schoolListLoad(id, type) {
		var dataAction = {"action": "get_list", "cond": type};

		$(id).empty();
		$(id).append('<option value = 0>-----------------------------</option>');
		$.ajax({
			type: "GET",
			url: "bin/school_list.php",
			data:dataAction,
			dataType:"json",
			cache: false,	
			success: function(resp) {
				for (var i = 0; i!= resp.length; i++) {
					$(id).append("<option value='"+resp[i].school_index+"'>"+resp[i].school_name+'</option>');
				}
				$(id).append("<option value='Other'>Other (please specify)</option>");
			}
		});	
	}