/**
* searchStudent.js - search students in the database - user can choose to show all (if no search criteria was given), search by name (both korean / english name), email and by school
*
*/


$(function() {

	$('#phone').mask("999-999-9999",{placeholder:"9"});	

	$('#searchButton').click(function(){
		$('#result').empty();
		var nameEntered = new Boolean();
		var schoolEntered = new Boolean();
		var emailEntered = new Boolean();

		var nameText = $('#name').val();
		var nameLang = $('#namelang').val();
		var schoolText  = $('#school').val();
		var emailText  = $('#email').val();
		var phoneText  = $('#phone').val();

		var searchKeys = {"name": nameText, "language_name": nameLang, "school_name" : schoolText, "email": emailText, "phone": phoneText};

		//gets the list of students from the database and display 
		$.ajax({
				type:"GET",
				url: "bin/search_user.php",
				dataType: "json",
				data:searchKeys,
				success: function(resp) {

					if (resp.length == 1)
						{
							$('#result').append(resp.length + " student found<br><br>");
						} else {
							if (resp.length > 0) {
							$('#result').append(resp.length + " students found<br><br>");
							}
					}
					
					$('#result').append("<table class='table' id='resultTable'><thead><tr><td> Name (English)</td><td> Name (Korean)</td><td> E-mail address</td><td>Phone</td><td>Actions</td></tr></thead><tbody>");
						
					if (resp.length > 0)
					{
						
						for(i=0;i!=resp.length;i++){
							
							$('#resultTable tbody').append("<tr><td>"+resp[i].name_eng+"</a></td><td>"+resp[i].name_kor+"</td><td>"+resp[i].email+"</td><td>"+resp[i].phone_no+"</td><td><a href=viewStudent.html?id="+resp[i].student_id+">[view]</a><a href=updateStudent.html?id="+resp[i].student_id+">[modify]</a>[delete]</td></tr>");
						}
						$('#result').append("</tbody></table>");
					} else {
						$('#result').append("</tbody></table><h3><center>No students found</center></h3>");
					}
				}
		
		});


	});

});