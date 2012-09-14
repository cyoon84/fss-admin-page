/**
* studentVisit.js - add new visit record for the student
*
*/
	
	$(function() {
		$.urlParam = function(name){
			var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			return results[1] || 0;
		}

		var student_id = $.urlParam('id');
		
		var data_studentID = {"studentId": student_id};
		$('#visit_date').mask("9999-99-99",{placeholder:"9"});		

		$('.error').hide();
		var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");


		for (i=0; i!= months.length ; i++ )
		{
			var actualmonth = i+1;
			if (actualmonth < 10)
			{
				$('#visitMonth').append('<option value=0'+actualmonth+'>'+months[i]+'</option>');
			} else {
				$('#visitMonth').append('<option value='+actualmonth+'>'+months[i]+'</option>');
			}
		}

		for (i=1; i!= 32  ; i++ )
		{
			if (i < 10)
			{
				$('#visitDay').append('<option>0'+i+'</option>');
			} else {
				$('#visitDay').append('<option>'+i+'</option>');
			}
		}


		$.ajax({
				type:"GET",
				url: "bin/view_user.php",
				dataType: "json",
				data:data_studentID,
				success: function(resp) {
					var nameText = resp[0].name_eng+ " ( " + resp[0].name_kor + " ) ";
					$('#studentName').append(nameText);
				}
		
		});

		$('#backButton').click(function() {
			var url = "viewStudent.html?id="+student_id;
			window.location = url;
		});

		$('#saveButton').click(function() {
			
			var visit_purpose = $('#visit_purpose').val();
			var visit_note = $('#note').val();

			var visit_Day = $('#visitDay').val();
			var visit_Month = $('#visitMonth').val();
			var visit_Year = $('#visitYear').val();

			var visit_date = '';

			if (visit_Year == "")
			{
				$('label#visit_year_error').show();
				$('input#visitYear').focus();
				return false;
			} else {
				visit_date = visit_Year +"-"+visit_Month +"-"+visit_Day; 
			}


			var data_visit = {"studentId": student_id, "date": visit_date, "purpose": visit_purpose, "note" : visit_note};

			$.ajax({
				type: "POST",
				url: "bin/add_new_visit.php",
				data:data_visit,
				success: function(resp) {
					alert(resp);
					var url = "viewStudent.html?id="+student_id;
					window.location = url;
				}
			});
				


		});

	});
