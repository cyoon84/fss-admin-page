/**
* editVisitRecord.js - edit / delete visit record for each students
*
*/
	
	$(function() {
		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}
		$('.error').hide();

		var current_userid = $.session.get('session_userid');



		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
		$('#new_visitMonth').append('<option value=0>-----------------</option>');
		$('#new_visitDay').append('<option value=0>-----------</option>');

		for (i=0; i!= months.length ; i++ )
		{
			var actualmonth = i+1;
			if (actualmonth < 10)
			{
				$('#new_visitMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			} else {
				$('#new_visitMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
			}
		}

		for (i=1; i!= 32  ; i++ )
		{
			if (i < 10)
			{
				$('#new_visitDay').append('<option>0'+i+'</option>');
			} else {
				$('#new_visitDay').append('<option>'+i+'</option>');
			}
		}

		var visit_record_id = $.urlParam('visit_id');
		var student_id = $.urlParam('student_id'); 		
		
		var data_getVisit_Parm = {"studentId": student_id, "visit_recordId": visit_record_id};

		$.ajax({
				type:"GET",
				url: "bin/get_visit_record_one.php",
				cache: false,
				dataType: "json",
				data:data_getVisit_Parm,
				success: function(resp) {
					$('#existing_visit_date').append(resp[0].visit_date);
					$('#visit_purpose').val(resp[0].visit_purpose);
					var existing_note = resp[0].visit_note;
					existing_note = existing_note.replace(/<br\s*[\/]?>/gi, "\n");
				 	$('#newNote').val(existing_note);
				}		
		});

		$('#backButton').click(function() {
			var url = "viewStudent.html?id="+student_id+"&hidden=N";
			window.location = url;
		});

		$('#deleteButton').click(function() {
			$('#delVisitConfirm').modal('toggle');
		});

		//when user wants to update visit date

		$('#saveDate').click(function() {
			var visitDay  = $('#new_visitDay').val();
			var visitMonth= $('#new_visitMonth').val();
			var visitYear = $('#new_visitYear').val();
			
			var visit_date = '';

			if (visitYear == '')
			{
				$('label#new_visitYear_error').show();
				$('input#new_visitYear').focus();
				return false;
			} else {
				visit_date = visitYear + "-"+visitMonth+"-"+visitDay;

				var data_visit = {"visit_record_id": visit_record_id, "studentId": student_id, "date": visit_date, "updated_by": current_userid};
				
				$.ajax({
					type: "POST",
					url: "bin/edit_visit_date.php",
					cache: false,
					data:data_visit,
					success: function(resp) {
						alert(resp);
						$('#existing_visit_date').empty();
						$('#existing_visit_date').append(visit_date);
						$('#visit_date').val('');
					}
				});

				return false;
			}

		});

		//when user wants to update visit purpose
		$('#savePurpose').click(function() {
			

			var visit_purpose = $('#visit_purpose').val();

			var data_visit = {"visit_record_id": visit_record_id, "studentId": student_id, "visit_purpose": visit_purpose, "updated_by": current_userid};
			
			$.ajax({
				type: "POST",
				url: "bin/edit_visit_purpose.php",
				cache: false,
				data:data_visit,
				success: function(resp) {
					alert(resp);
					$('#existing_visit_purpose').empty();
					$('#existing_visit_purpose').append(visit_purpose);
					$('#visit_purpose').val(visit_purpose);
				}
			});

			return false;

		});

		//when user wants to update visit note

		$('#saveNote').click(function() {
			
			var visit_note = $('#newNote').val();
			
			if ($.trim(visit_note) == "")
			{
				alert ('please enter text for Note');
				return false;
			} else {

				visit_note = visit_note.replace(/\r\n|\r|\n/g,"<br />");
				var data_visit = {"visit_record_id": visit_record_id, "studentId": student_id, "visit_note": visit_note,"updated_by": current_userid};
				
				$.ajax({
					type: "POST",
					url: "bin/edit_visit_note.php",
					cache: false,
					data:data_visit,
					success: function(resp) {
						alert(resp);
						$('#existing_visit_note').empty();
						$('#existing_visit_note').append(visit_note);
						$('#newNote').val('');
					}
				});

				return false;
			}

		});


		//delete this visit record (for sure) 

		$('#delProceed').click(function() {
			$.ajax( {
				type: "POST",
				url: "bin/del_visit.php",
				cache: false,
				data: data_getVisit_Parm,
				success: function(resp) {
					$('#delVisitConfirm').modal('hide');
					var url = "viewStudent.html?id="+student_id+"&hidden=N";
					window.location = url;
				}
			});
	
		});
	});
