/**
* searchStudent.js - search students in the database - user can choose to show all (if no search criteria was given), search by name (both korean / english name), email and by school
*
*/


$(function() {

	$('#phone').mask("999-999-9999");	

	$('#searchButton').click(function(){
		$('#resultTable tbody').empty();
		var nameEntered = new Boolean();
		var schoolEntered = new Boolean();
		var emailEntered = new Boolean();

		var nameText = $('#name').val();
		var nameLang = $('#namelang').val();
		var schoolText  = $('#school').val();
		var emailText  = $('#email').val();
		var phoneText  = $('#phone').val();

		var searchWithin = $('input:radio[name=searchOpt]:checked').val();

		var searchKeys = {"name": nameText, "language_name": nameLang, "school_name" : schoolText, "email": emailText, "phone": phoneText};

		if (nameText == '' && schoolText == '' && emailText == '' && phoneText == '')
		{
			alert('Please enter one of search keyword');
			return false;
		}
		
		
		
		if (searchWithin == 'active')
		{
		
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
								$('#resultTable tbody').append("<tr><td>"+resp[i].name_kor+"</td><td>"+resp[i].name_eng+"</a></td><td><a href='send_email.html?email="+resp[i].email+"'>"+resp[i].email+"</a></td><td>"+resp[i].phone_no+"</td><td><a href=viewStudent.html?id="+resp[i].student_id+"&hidden=N>[view]</a></td></tr>");
							}
						} else {
							$('#resultTable tbody').append("<tr><td colspan='5'><h3><center>No students found</center></h3></td></tr>");
						}
					}
			
			});
		}

		if (searchWithin == 'inactive')
		{			
			//gets the list of students from the database and display 
			$.ajax({
					type:"GET",
					url: "bin/search_inactive_user.php",
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
								
								$('#resultTable tbody').append("<tr><td>"+resp[i].name_kor+"</td><td>"+resp[i].name_eng+"</a></td><td>"+resp[i].email+"</td><td>"+resp[i].phone_no+"</td><td><a href=viewStudent.html?id="+resp[i].student_id+"&hidden=Y>[view]</a></td></tr>");
							}
						} else {
							$('#resultTable tbody').append("<tr><td colspan='5'><h3><center>No students found</center></h3></td></tr>");
						}
					}
			
			});
		}
		return false;

	});


});