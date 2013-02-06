/**
* searchStudent.js - search students in the database - user can choose to show all (if no search criteria was given), search by name (both korean / english name), email and by school
*
*/


$(function() {

	schoolCatLoad('#schoolCategory');

	$('#menuarea').load('menu.html');

	$('#phone').mask("999-999-9999");	

	$('#schoolCategory').change(function() {
		var type = $(this).val();
		if (type == 0) {
			$('#schoolList').empty();
		} else {
			schoolListLoad("#schoolList",type);
		}
	});	

	$('#searchButton').click(function(){
		$('#resultTable tbody').empty();

		var nameText = $('#name').val();
		var nameLang = $('#namelang').val();
		var emailText  = $('#email').val();
		var phoneText  = $('#phone').val();

		var noteText = $('#note').val();

		var fssID = $('#fssID').val();

		var schoolType = $('#schoolCategory').val();

		var schoolNameIndex = $('#schoolList').val();

		var searchWithin = $('input:radio[name=searchOpt]:checked').val();

		var searchKeys = {"status":searchWithin, "name": nameText,  "language_name": nameLang, "unique_id": fssID, "school_index" : schoolNameIndex, "school_type" : schoolType, "email": emailText, "phone": phoneText, "note": noteText};

		if (nameText == '' && fssID == '' && emailText == '' && phoneText == '' && noteText == '' && schoolType == 0)
		{
			alert('Please enter one of search keyword');
			return false;
		}
		



		//gets the list of students from the database and display 
		$.ajax({
				type:"GET",
				url: "bin/search_user.php",
				dataType: "json",
				cache: false,
				data:searchKeys,
				success: function(resp) {

					$('#resultcount').empty();

					if (resp.length == 1)
						{
							$('#resultcount').append(resp.length + " student found<br><br>");
						} else {
							if (resp.length > 0) {
							$('#resultcount').append(resp.length + " students found<br><br>");
							}
					}
					
							
					if (resp.length > 0)
					{
						
						for(i=0;i!=resp.length;i++){
							if (searchWithin == 'active') {
								$('#resultTable tbody').append("<tr><td>"+resp[i].name_kor+"</td><td>"+resp[i].name_eng+"</a></td><td>"+resp[i].unique_id+"</td><td><a href='send_email.html?email="+resp[i].email+"'>"+resp[i].email+"</a></td><td>"+resp[i].phone_no+"</td><td><a href=viewStudent.html?id="+resp[i].student_id+"&hidden=N>[view]</a></td></tr>");
							} 
							if (searchWithin == 'inactive') {
								$('#resultTable tbody').append("<tr><td>"+resp[i].name_kor+"</td><td>"+resp[i].name_eng+"</a></td><td>"+resp[i].unique_id+"</td><td><a href='send_email.html?email="+resp[i].email+"'>"+resp[i].email+"</a></td><td>"+resp[i].phone_no+"</td><td><a href=viewStudent.html?id="+resp[i].student_id+"&hidden=Y>[view]</a></td></tr>");
	
							}
						}
					} else {
						$('#resultTable tbody').append("<tr><td colspan='5'><h3><center>No students found</center></h3></td></tr>");
					}
				}
		
		});
		
		return false;

	});


});


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