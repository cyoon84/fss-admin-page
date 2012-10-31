/**
* searchStudent.js - search students in the database - user can choose to show all (if no search criteria was given), search by name (both korean / english name), email and by school
*
*/


$(function() {

	$('#menuarea').load('menu.html');

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

		var fssID = $('#fssID').val();

		var searchWithin = $('input:radio[name=searchOpt]:checked').val();

		var searchKeys = {"status":searchWithin, "name": nameText,  "language_name": nameLang, "unique_id": fssID, "school_name" : schoolText, "email": emailText, "phone": phoneText};

		if (nameText == '' && schoolText == '' && fssID == '' && emailText == '' && phoneText == '')
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